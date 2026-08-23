package com.earlyflag.dto;

import java.time.LocalDate;

public class InterventionDTO {
    private Long id;
    private String studentId;
    private String actionTaken;
    private LocalDate actionDate;
    private String outcome;

    public InterventionDTO() {
    }

    public InterventionDTO(Long id, String studentId, String actionTaken, LocalDate actionDate, String outcome) {
        this.id = id;
        this.studentId = studentId;
        this.actionTaken = actionTaken;
        this.actionDate = actionDate;
        this.outcome = outcome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public LocalDate getActionDate() {
        return actionDate;
    }

    public void setActionDate(LocalDate actionDate) {
        this.actionDate = actionDate;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}
