package com.earlyflag.service;

import com.earlyflag.entity.Attendance;
import com.earlyflag.entity.Engagement;
import com.earlyflag.entity.Fee;
import com.earlyflag.entity.Mark;
import com.earlyflag.entity.Student;
import com.earlyflag.repository.AttendanceRepository;
import com.earlyflag.repository.EngagementRepository;
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

/**
 * Every CSV row must reference a student_id that already exists in the
 * students table (schema: id SERIAL). Rows referencing an unknown student_id
 * are skipped and reported as an error — we do not fabricate students from
 * arbitrary CSV values, since students.id is DB-generated.
 */
@Service
public class CsvUploadService {

    private static final Logger log = LoggerFactory.getLogger(CsvUploadService.class);

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarkRepository markRepository;
    private final FeeRepository feeRepository;
    private final EngagementRepository engagementRepository;

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
                             FeeRepository feeRepository,
                             EngagementRepository engagementRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
        this.feeRepository = feeRepository;
        this.engagementRepository = engagementRepository;
    }

    @Transactional
    public int uploadAttendanceCsv(MultipartFile file) {
        validateFile(file);
        List<Attendance> toSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = requireHeader(csvReader, "student_id, date, status");
            Map<String, Integer> col = buildColumnIndexMap(header);
            int studentIdCol = requireColumn(col, "student_id");
            int dateCol = requireColumn(col, "date");
            int statusCol = requireColumn(col, "status");

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) continue;
                try {
                    Long studentId = Long.parseLong(line[studentIdCol].trim());
                    Student student = studentRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("Unknown student_id " + studentId));
                    LocalDate date = parseDate(line[dateCol].trim());
                    String status = line[statusCol].trim();
                    toSave.add(new Attendance(student, date, status));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error processing attendance CSV", e);
            throw new IllegalArgumentException("Failed to process attendance CSV: " + e.getMessage());
        }

        if (!toSave.isEmpty()) attendanceRepository.saveAll(toSave);
        if (!errors.isEmpty()) log.warn("Attendance upload had {} skipped rows: {}", errors.size(), errors);
        return toSave.size();
    }

    @Transactional
    public int uploadMarksCsv(MultipartFile file) {
        validateFile(file);
        List<Mark> toSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = requireHeader(csvReader, "student_id, subject, term, score, max_score");
            Map<String, Integer> col = buildColumnIndexMap(header);
            int studentIdCol = requireColumn(col, "student_id");
            int subjectCol = requireColumn(col, "subject");
            int termCol = requireColumn(col, "term");
            int scoreCol = requireColumn(col, "score");
            int maxScoreCol = col.getOrDefault("maxscore", col.getOrDefault("max_score", -1));

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) continue;
                try {
                    Long studentId = Long.parseLong(line[studentIdCol].trim());
                    Student student = studentRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("Unknown student_id " + studentId));
                    String subject = line[subjectCol].trim();
                    String term = line[termCol].trim();
                    BigDecimal score = new BigDecimal(line[scoreCol].trim());
                    BigDecimal maxScore = (maxScoreCol >= 0 && maxScoreCol < line.length && !line[maxScoreCol].isBlank())
                            ? new BigDecimal(line[maxScoreCol].trim())
                            : BigDecimal.valueOf(100);
                    toSave.add(new Mark(student, subject, term, score, maxScore));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error processing marks CSV", e);
            throw new IllegalArgumentException("Failed to process marks CSV: " + e.getMessage());
        }

        if (!toSave.isEmpty()) markRepository.saveAll(toSave);
        if (!errors.isEmpty()) log.warn("Marks upload had {} skipped rows: {}", errors.size(), errors);
        return toSave.size();
    }

    @Transactional
    public int uploadFeesCsv(MultipartFile file) {
        validateFile(file);
        List<Fee> toSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = requireHeader(csvReader, "student_id, due_date, amount, paid_status, paid_date");
            Map<String, Integer> col = buildColumnIndexMap(header);
            int studentIdCol = requireColumn(col, "student_id");
            int dueDateCol = requireColumn(col, "due_date");
            int amountCol = requireColumn(col, "amount");
            int paidStatusCol = requireColumn(col, "paid_status");
            int paidDateCol = col.getOrDefault("paiddate", col.getOrDefault("paid_date", -1));

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) continue;
                try {
                    Long studentId = Long.parseLong(line[studentIdCol].trim());
                    Student student = studentRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("Unknown student_id " + studentId));
                    LocalDate dueDate = parseDate(line[dueDateCol].trim());
                    BigDecimal amount = new BigDecimal(line[amountCol].trim());
                    String paidStatus = line[paidStatusCol].trim().toLowerCase();
                    LocalDate paidDate = (paidDateCol >= 0 && paidDateCol < line.length && !line[paidDateCol].isBlank())
                            ? parseDate(line[paidDateCol].trim())
                            : null;
                    toSave.add(new Fee(student, dueDate, amount, paidStatus, paidDate));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error processing fees CSV", e);
            throw new IllegalArgumentException("Failed to process fees CSV: " + e.getMessage());
        }

        if (!toSave.isEmpty()) feeRepository.saveAll(toSave);
        if (!errors.isEmpty()) log.warn("Fees upload had {} skipped rows: {}", errors.size(), errors);
        return toSave.size();
    }

    @Transactional
    public int uploadEngagementCsv(MultipartFile file) {
        validateFile(file);
        List<Engagement> toSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowNumber = 1;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            String[] header = requireHeader(csvReader, "student_id, date, flag_type, notes");
            Map<String, Integer> col = buildColumnIndexMap(header);
            int studentIdCol = requireColumn(col, "student_id");
            int dateCol = requireColumn(col, "date");
            int flagTypeCol = requireColumn(col, "flag_type");
            int notesCol = col.getOrDefault("notes", -1);

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rowNumber++;
                if (isRowEmpty(line)) continue;
                try {
                    Long studentId = Long.parseLong(line[studentIdCol].trim());
                    Student student = studentRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("Unknown student_id " + studentId));
                    LocalDate date = parseDate(line[dateCol].trim());
                    String flagType = line[flagTypeCol].trim();
                    String notes = (notesCol >= 0 && notesCol < line.length) ? line[notesCol].trim() : null;
                    toSave.add(new Engagement(student, date, flagType, notes));
                } catch (Exception e) {
                    errors.add("Row " + rowNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error processing engagement CSV", e);
            throw new IllegalArgumentException("Failed to process engagement CSV: " + e.getMessage());
        }

        if (!toSave.isEmpty()) engagementRepository.saveAll(toSave);
        if (!errors.isEmpty()) log.warn("Engagement upload had {} skipped rows: {}", errors.size(), errors);
        return toSave.size();
    }

    private String[] requireHeader(CSVReader csvReader, String expectedCols) throws Exception {
        String[] header = csvReader.readNext();
        if (header == null) {
            throw new IllegalArgumentException("CSV file is empty. Expected columns: " + expectedCols);
        }
        return header;
    }

    private int requireColumn(Map<String, Integer> colMap, String name) {
        Integer idx = colMap.get(name.replace("_", ""));
        if (idx == null) idx = colMap.get(name);
        if (idx == null) {
            throw new IllegalArgumentException("Missing required column: " + name);
        }
        return idx;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be empty");
        }
    }

    private boolean isRowEmpty(String[] row) {
        if (row == null || row.length == 0) return true;
        for (String cell : row) {
            if (cell != null && !cell.trim().isEmpty()) return false;
        }
        return true;
    }

    private Map<String, Integer> buildColumnIndexMap(String[] header) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            if (header[i] != null) {
                String clean = header[i].trim().toLowerCase().replaceAll("[\\s_-]+", "");
                map.put(clean, i);
                map.put(header[i].trim().toLowerCase(), i);
            }
        }
        return map;
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