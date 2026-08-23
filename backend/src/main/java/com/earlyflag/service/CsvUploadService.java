package com.earlyflag.service;

import com.earlyflag.dto.CsvUploadResponseDTO;
import com.earlyflag.entity.Attendance;
import com.earlyflag.entity.Fee;
import com.earlyflag.entity.Mark;
import com.earlyflag.entity.Student;
import com.earlyflag.repository.AttendanceRepository;
import com.earlyflag.repository.FeeRepository;
import com.earlyflag.repository.MarkRepository;
import com.earlyflag.repository.StudentRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CsvUploadService {

    private static final Logger log = LoggerFactory.getLogger(CsvUploadService.class);

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarkRepository markRepository;
    private final FeeRepository feeRepository;

    private static final DateTimeFormatter[] DATE_FORMATTERS = new DateTimeFormatter[]{
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ofPattern("d/M/yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("M/d/yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd")
    };

    public CsvUploadService(StudentRepository studentRepository,
                            AttendanceRepository attendanceRepository,
                            MarkRepository markRepository,
                            FeeRepository feeRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
        this.feeRepository = feeRepository;
    }

    @Transactional
    public CsvUploadResponseDTO uploadAttendanceCsv(MultipartFile file) {
        validateFile(file);
        List<String> errors = new ArrayList<>();
        List<Attendance> attendancesToSave = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = csvReader.readNext();
            if (header == null) {
                return new CsvUploadResponseDTO(false, "CSV file is empty", 0, errors);
            }

            Map<String, Integer> colMap = buildColumnIndexMap(header);
            int studentIdCol = findColumnIndex(colMap, "student_id", "studentid", "student", "id");
            int dateCol = findColumnIndex(colMap, "attendance_date", "attendancedate", "date");
            int statusCol = findColumnIndex(colMap, "status", "attendance_status", "attendance");

            if (studentIdCol == -1 || dateCol == -1 || statusCol == -1) {
                return new CsvUploadResponseDTO(false,
                        "Missing required columns. Expected: student_id, attendance_date, status", 0, errors);
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) {
                    continue;
                }

                try {
                    String studentId = line[studentIdCol].trim();
                    String dateStr = line[dateCol].trim();
                    String status = line[statusCol].trim();

                    if (studentId.isEmpty() || dateStr.isEmpty() || status.isEmpty()) {
                        errors.add("Row " + rowNumber + ": Empty required value");
                        continue;
                    }

                    Student student = getOrCreateStudent(studentId);
                    LocalDate attendanceDate = parseDate(dateStr);

                    attendancesToSave.add(new Attendance(student, attendanceDate, status));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }

            if (!attendancesToSave.isEmpty()) {
                attendanceRepository.saveAll(attendancesToSave);
            }

            return new CsvUploadResponseDTO(true, "Attendance CSV processed successfully", attendancesToSave.size(), errors);

        } catch (Exception e) {
            log.error("Error processing attendance CSV", e);
            return new CsvUploadResponseDTO(false, "Failed to process attendance CSV: " + e.getMessage(), 0, errors);
        }
    }

    @Transactional
    public CsvUploadResponseDTO uploadMarksCsv(MultipartFile file) {
        validateFile(file);
        List<String> errors = new ArrayList<>();
        List<Mark> marksToSave = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = csvReader.readNext();
            if (header == null) {
                return new CsvUploadResponseDTO(false, "CSV file is empty", 0, errors);
            }

            Map<String, Integer> colMap = buildColumnIndexMap(header);
            int studentIdCol = findColumnIndex(colMap, "student_id", "studentid", "student", "id");
            int subjectCol = findColumnIndex(colMap, "subject", "course");
            int termCol = findColumnIndex(colMap, "term", "semester", "exam");
            int scoreCol = findColumnIndex(colMap, "score", "marks", "mark", "grade");

            if (studentIdCol == -1 || subjectCol == -1 || termCol == -1 || scoreCol == -1) {
                return new CsvUploadResponseDTO(false,
                        "Missing required columns. Expected: student_id, subject, term, score", 0, errors);
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) {
                    continue;
                }

                try {
                    String studentId = line[studentIdCol].trim();
                    String subject = line[subjectCol].trim();
                    String term = line[termCol].trim();
                    String scoreStr = line[scoreCol].trim();

                    if (studentId.isEmpty() || subject.isEmpty() || term.isEmpty() || scoreStr.isEmpty()) {
                        errors.add("Row " + rowNumber + ": Empty required value");
                        continue;
                    }

                    Student student = getOrCreateStudent(studentId);
                    BigDecimal score = new BigDecimal(scoreStr);

                    marksToSave.add(new Mark(student, subject, term, score));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }

            if (!marksToSave.isEmpty()) {
                markRepository.saveAll(marksToSave);
            }

            return new CsvUploadResponseDTO(true, "Marks CSV processed successfully", marksToSave.size(), errors);

        } catch (Exception e) {
            log.error("Error processing marks CSV", e);
            return new CsvUploadResponseDTO(false, "Failed to process marks CSV: " + e.getMessage(), 0, errors);
        }
    }

    @Transactional
    public CsvUploadResponseDTO uploadFeesCsv(MultipartFile file) {
        validateFile(file);
        List<String> errors = new ArrayList<>();
        List<Fee> feesToSave = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = csvReader.readNext();
            if (header == null) {
                return new CsvUploadResponseDTO(false, "CSV file is empty", 0, errors);
            }

            Map<String, Integer> colMap = buildColumnIndexMap(header);
            int studentIdCol = findColumnIndex(colMap, "student_id", "studentid", "student", "id");
            int dueDateCol = findColumnIndex(colMap, "due_date", "duedate", "date");
            int amountCol = findColumnIndex(colMap, "amount", "fee_amount", "fee");
            int paidStatusCol = findColumnIndex(colMap, "paid_status", "paidstatus", "status", "payment_status");

            if (studentIdCol == -1 || dueDateCol == -1 || amountCol == -1 || paidStatusCol == -1) {
                return new CsvUploadResponseDTO(false,
                        "Missing required columns. Expected: student_id, due_date, amount, paid_status", 0, errors);
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) {
                    continue;
                }

                try {
                    String studentId = line[studentIdCol].trim();
                    String dueDateStr = line[dueDateCol].trim();
                    String amountStr = line[amountCol].trim();
                    String paidStatus = line[paidStatusCol].trim();

                    if (studentId.isEmpty() || dueDateStr.isEmpty() || amountStr.isEmpty() || paidStatus.isEmpty()) {
                        errors.add("Row " + rowNumber + ": Empty required value");
                        continue;
                    }

                    Student student = getOrCreateStudent(studentId);
                    LocalDate dueDate = parseDate(dueDateStr);
                    BigDecimal amount = new BigDecimal(amountStr);

                    feesToSave.add(new Fee(student, dueDate, amount, paidStatus.toUpperCase()));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }

            if (!feesToSave.isEmpty()) {
                feeRepository.saveAll(feesToSave);
            }

            return new CsvUploadResponseDTO(true, "Fees CSV processed successfully", feesToSave.size(), errors);

        } catch (Exception e) {
            log.error("Error processing fees CSV", e);
            return new CsvUploadResponseDTO(false, "Failed to process fees CSV: " + e.getMessage(), 0, errors);
        }
    }

    private Student getOrCreateStudent(String studentId) {
        return studentRepository.findById(studentId).orElseGet(() -> {
            Student newStudent = new Student(studentId, "Student " + studentId, "Default Class", "A");
            return studentRepository.save(newStudent);
        });
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be empty");
        }
    }

    private boolean isRowEmpty(String[] row) {
        if (row == null || row.length == 0) return true;
        for (String cell : row) {
            if (cell != null && !cell.trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private Map<String, Integer> buildColumnIndexMap(String[] header) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            if (header[i] != null) {
                String cleanHeader = header[i].trim().toLowerCase().replaceAll("[\\s_-]+", "");
                map.put(cleanHeader, i);
                map.put(header[i].trim().toLowerCase(), i);
            }
        }
        return map;
    }

    private int findColumnIndex(Map<String, Integer> colMap, String... candidateNames) {
        for (String name : candidateNames) {
            String cleanName = name.toLowerCase().replaceAll("[\\s_-]+", "");
            if (colMap.containsKey(cleanName)) {
                return colMap.get(cleanName);
            }
            if (colMap.containsKey(name.toLowerCase())) {
                return colMap.get(name.toLowerCase());
            }
        }
        return -1;
    }

    private LocalDate parseDate(String dateStr) {
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException ignored) {
            }
        }
        throw new IllegalArgumentException("Unable to parse date: " + dateStr);
    }
}
