package com.earlyflag.controller;

import com.earlyflag.dto.InterventionDTO;
import com.earlyflag.dto.InterventionRequestDTO;
import com.earlyflag.dto.StudentDetailDTO;
import com.earlyflag.dto.StudentSummaryDTO;
import com.earlyflag.entity.Intervention;
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
        return ResponseEntity.ok(studentService.getAllStudentSummaries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDetailDTO> getStudentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudentDetail(id));
    }

    @PostMapping("/{id}/interventions")
    public ResponseEntity<InterventionDTO> logIntervention(
            @PathVariable("id") Long id,
            @RequestBody InterventionRequestDTO dto) {
        Intervention saved = interventionService.saveIntervention(id, dto);
        InterventionDTO response = new InterventionDTO(
                saved.getId(),
                saved.getStudent().getId(),
                saved.getActionTaken(),
                saved.getActionDate(),
                saved.getOutcome()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/interventions")
    public ResponseEntity<List<InterventionDTO>> getInterventions(@PathVariable("id") Long id) {
        return ResponseEntity.ok(interventionService.getInterventionsByStudentId(id));
    }
}