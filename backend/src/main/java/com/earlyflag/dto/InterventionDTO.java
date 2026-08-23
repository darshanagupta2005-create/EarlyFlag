package com.earlyflag.dto;

import java.time.LocalDate;

public class InterventionDTO {
    private Long id;
    private Long studentId;
    private String actionTaken;
    private LocalDate date;
    private String outcome;

    public InterventionDTO() {
    }

    public InterventionDTO(Long id, Long studentId, String actionTaken, LocalDate date, String outcome) {
        this.id = id;
        this.studentId = studentId;
        this.actionTaken = actionTaken;
        this.date = date;
        this.outcome = outcome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}