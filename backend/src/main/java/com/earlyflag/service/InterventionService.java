package com.earlyflag.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.earlyflag.dto.InterventionDTO;
import com.earlyflag.dto.InterventionRequestDTO;
import com.earlyflag.entity.Intervention;
import com.earlyflag.entity.Student;
import com.earlyflag.exception.ResourceNotFoundException;
import com.earlyflag.repository.InterventionRepository;
import com.earlyflag.repository.StudentRepository;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final StudentRepository studentRepository;

    public InterventionService(InterventionRepository interventionRepository,
            StudentRepository studentRepository) {
        this.interventionRepository = interventionRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Intervention saveIntervention(Long studentId, InterventionRequestDTO request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Intervention intervention = new Intervention(
                student,
                request.getActionTaken(),
                LocalDate.now(),
                request.getOutcome());

        return interventionRepository.save(intervention);
    }

    @Transactional(readOnly = true)
    public List<InterventionDTO> getInterventionsByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found");
        }

        return interventionRepository.findByStudent_IdOrderByActionDateDesc(studentId)
                .stream()
                .map(i -> new InterventionDTO(
                        i.getId(),
                        i.getStudent().getId(),
                        i.getActionTaken(),
                        i.getActionDate(),
                        i.getOutcome()))
                .collect(Collectors.toList());
    }
}