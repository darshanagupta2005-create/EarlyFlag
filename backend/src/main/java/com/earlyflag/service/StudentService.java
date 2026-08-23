package com.earlyflag.service;

import com.earlyflag.dto.AttendanceDTO;
import com.earlyflag.dto.DetailedRiskDTO;
import com.earlyflag.dto.EngagementDTO;
import com.earlyflag.dto.FeeDTO;
import com.earlyflag.dto.LatestRiskDTO;
import com.earlyflag.dto.MarkDTO;
import com.earlyflag.dto.StudentDetailDTO;
import com.earlyflag.dto.StudentSummaryDTO;
import com.earlyflag.entity.RiskScore;
import com.earlyflag.entity.Student;
import com.earlyflag.exception.ResourceNotFoundException;
import com.earlyflag.repository.AttendanceRepository;
import com.earlyflag.repository.EngagementRepository;
import com.earlyflag.repository.FeeRepository;
import com.earlyflag.repository.MarkRepository;
import com.earlyflag.repository.RiskScoreRepository;
import com.earlyflag.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final EngagementRepository engagementRepository;

    public StudentService(StudentRepository studentRepository,
                           RiskScoreRepository riskScoreRepository,
                           AttendanceRepository attendanceRepository,
                           MarkRepository markRepository,
                           FeeRepository feeRepository,
                           EngagementRepository engagementRepository) {
        this.studentRepository = studentRepository;
        this.riskScoreRepository = riskScoreRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
        this.feeRepository = feeRepository;
        this.engagementRepository = engagementRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentSummaryDTO> getAllStudentSummaries() {
        List<Student> students = studentRepository.findAll();

        return students.stream().map(student -> {
            Optional<RiskScore> latest = riskScoreRepository.findTopByStudent_IdOrderByComputedAtDesc(student.getId());
            LatestRiskDTO riskDto = latest.map(r -> new LatestRiskDTO(r.getScore(), r.getLevel(), r.getComputedAt()))
                    .orElse(null);

            return new StudentSummaryDTO(
                    student.getId(),
                    student.getName(),
                    student.getClassName(),
                    student.getSection(),
                    riskDto
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDetailDTO getStudentDetail(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<AttendanceDTO> attendanceTrend = attendanceRepository
                .findByStudent_IdOrderByAttendanceDateDesc(studentId)
                .stream()
                .map(a -> new AttendanceDTO(a.getAttendanceDate(), a.getStatus()))
                .collect(Collectors.toList());

        List<MarkDTO> marksTrend = markRepository
                .findByStudent_IdOrderByTermAscSubjectAsc(studentId)
                .stream()
                .map(m -> new MarkDTO(m.getSubject(), m.getTerm(), m.getScore(), m.getMaxScore()))
                .collect(Collectors.toList());

        List<FeeDTO> fees = feeRepository
                .findByStudent_IdOrderByDueDateDesc(studentId)
                .stream()
                .map(f -> new FeeDTO(f.getDueDate(), f.getAmount(), f.getPaidStatus()))
                .collect(Collectors.toList());

        List<EngagementDTO> engagement = engagementRepository
                .findByStudent_IdOrderByLogDateDesc(studentId)
                .stream()
                .map(e -> new EngagementDTO(e.getLogDate(), e.getFlagType(), e.getNotes()))
                .collect(Collectors.toList());

        DetailedRiskDTO latestRisk = riskScoreRepository.findTopByStudent_IdOrderByComputedAtDesc(studentId)
                .map(r -> new DetailedRiskDTO(r.getScore(), r.getLevel(), r.getReasonCodes(), r.getSubScores()))
                .orElse(null);

        return new StudentDetailDTO(
                student.getId(),
                student.getName(),
                student.getClassName(),
                student.getSection(),
                attendanceTrend,
                marksTrend,
                fees,
                engagement,
                latestRisk
        );
    }
}