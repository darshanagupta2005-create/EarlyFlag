package com.earlyflag.controller;

import com.earlyflag.dto.InterventionDTO;
import com.earlyflag.dto.InterventionRequestDTO;
import com.earlyflag.dto.RiskScoreDTO;
import com.earlyflag.dto.RiskScoreRequestDTO;
import com.earlyflag.dto.StudentDetailDTO;
import com.earlyflag.dto.StudentSummaryDTO;
import com.earlyflag.entity.Intervention;
import com.earlyflag.entity.RiskScore;
import com.earlyflag.service.InterventionService;
import com.earlyflag.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final InterventionService interventionService;

    public StudentController(StudentService studentService, InterventionService interventionService) {
        this.studentService = studentService;
        this.interventionService = interventionService;
    }

    @GetMapping
    public ResponseEntity<List<StudentSummaryDTO>> getAllStudents() {
        List<StudentSummaryDTO> students = studentService.getAllStudentSummaries();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDetailDTO> getStudentById(@PathVariable("id") String id) {
        StudentDetailDTO studentDetail = studentService.getStudentDetail(id);
        return ResponseEntity.ok(studentDetail);
    }

    @PostMapping("/{id}/risk-score")
    public ResponseEntity<RiskScoreDTO> saveRiskScore(
            @PathVariable("id") String id,
            @RequestBody RiskScoreRequestDTO dto) {
        RiskScore saved = studentService.saveRiskScore(id, dto);
        RiskScoreDTO responseDto = new RiskScoreDTO(
                saved.getId(),
                saved.getScore(),
                saved.getLevel(),
                saved.getReasonCodes(),
                saved.getComputedAt()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping("/{id}/interventions")
    public ResponseEntity<InterventionDTO> logIntervention(
            @PathVariable("id") String id,
            @RequestBody InterventionRequestDTO dto) {
        Intervention saved = interventionService.saveIntervention(id, dto);
        InterventionDTO responseDto = new InterventionDTO(
                saved.getId(),
                saved.getStudent().getId(),
                saved.getActionTaken(),
                saved.getActionDate(),
                saved.getOutcome()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{id}/interventions")
    public ResponseEntity<List<InterventionDTO>> getInterventions(@PathVariable("id") String id) {
        List<InterventionDTO> interventions = interventionService.getInterventionsByStudentId(id);
        return ResponseEntity.ok(interventions);
    }
}
