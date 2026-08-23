package com.earlyflag.service;

import com.earlyflag.dto.AttendanceDTO;
import com.earlyflag.dto.FeeDTO;
import com.earlyflag.dto.InterventionDTO;
import com.earlyflag.dto.MarkDTO;
import com.earlyflag.dto.RiskScoreDTO;
import com.earlyflag.dto.RiskScoreRequestDTO;
import com.earlyflag.dto.StudentDetailDTO;
import com.earlyflag.dto.StudentProfileDTO;
import com.earlyflag.dto.StudentSummaryDTO;
import com.earlyflag.entity.Attendance;
import com.earlyflag.entity.Fee;
import com.earlyflag.entity.Intervention;
import com.earlyflag.entity.Mark;
import com.earlyflag.entity.RiskScore;
import com.earlyflag.entity.Student;
import com.earlyflag.exception.ResourceNotFoundException;
import com.earlyflag.repository.AttendanceRepository;
import com.earlyflag.repository.FeeRepository;
import com.earlyflag.repository.InterventionRepository;
import com.earlyflag.repository.MarkRepository;
import com.earlyflag.repository.RiskScoreRepository;
import com.earlyflag.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final RiskScoreRepository riskScoreRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarkRepository markRepository;
    private final FeeRepository feeRepository;
    private final InterventionRepository interventionRepository;

    public StudentService(StudentRepository studentRepository,
                          RiskScoreRepository riskScoreRepository,
                          AttendanceRepository attendanceRepository,
                          MarkRepository markRepository,
                          FeeRepository feeRepository,
                          InterventionRepository interventionRepository) {
        this.studentRepository = studentRepository;
        this.riskScoreRepository = riskScoreRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
        this.feeRepository = feeRepository;
        this.interventionRepository = interventionRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentSummaryDTO> getAllStudentSummaries() {
        List<Student> students = studentRepository.findAll();

        return students.stream().map(student -> {
            Optional<RiskScore> latestRiskScore = riskScoreRepository.findTopByStudent_IdOrderByComputedAtDesc(student.getId());

            return new StudentSummaryDTO(
                    student.getId(),
                    student.getName(),
                    student.getClassName(),
                    student.getSection(),
                    latestRiskScore.map(RiskScore::getScore).orElse(null),
                    latestRiskScore.map(RiskScore::getLevel).orElse("UNKNOWN"),
                    latestRiskScore.map(RiskScore::getReasonCodes).orElse(null)
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDetailDTO getStudentDetail(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        StudentProfileDTO profile = new StudentProfileDTO(
                student.getId(),
                student.getName(),
                student.getClassName(),
                student.getSection()
        );

        List<AttendanceDTO> attendanceList = attendanceRepository.findByStudent_IdOrderByAttendanceDateDesc(studentId)
                .stream()
                .map(a -> new AttendanceDTO(
                        a.getId(),
                        a.getAttendanceDate(),
                        a.getStatus()))
                .collect(Collectors.toList());

        List<MarkDTO> marksList = markRepository.findByStudent_IdOrderByTermAscSubjectAsc(studentId)
                .stream()
                .map(m -> new MarkDTO(
                        m.getId(),
                        m.getSubject(),
                        m.getTerm(),
                        m.getScore()))
                .collect(Collectors.toList());

        List<FeeDTO> feesList = feeRepository.findByStudent_IdOrderByDueDateDesc(studentId)
                .stream()
                .map(f -> new FeeDTO(
                        f.getId(),
                        f.getDueDate(),
                        f.getAmount(),
                        f.getPaidStatus()))
                .collect(Collectors.toList());

        RiskScoreDTO latestRisk = riskScoreRepository.findTopByStudent_IdOrderByComputedAtDesc(studentId)
                .map(r -> new RiskScoreDTO(
                        r.getId(),
                        r.getScore(),
                        r.getLevel(),
                        r.getReasonCodes(),
                        r.getComputedAt()))
                .orElse(null);

        List<InterventionDTO> interventionList = interventionRepository.findByStudent_IdOrderByActionDateDesc(studentId)
                .stream()
                .map(i -> new InterventionDTO(
                        i.getId(),
                        student.getId(),
                        i.getActionTaken(),
                        i.getActionDate(),
                        i.getOutcome()))
                .collect(Collectors.toList());

        return new StudentDetailDTO(
                profile,
                attendanceList,
                marksList,
                feesList,
                latestRisk,
                interventionList
        );
    }

    @Transactional
    public RiskScore saveRiskScore(String studentId, RiskScoreRequestDTO dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        RiskScore riskScore = new RiskScore(
                student,
                dto.getScore(),
                dto.getLevel(),
                dto.getReasonCodes(),
                LocalDateTime.now()
        );

        return riskScoreRepository.save(riskScore);
    }
}
