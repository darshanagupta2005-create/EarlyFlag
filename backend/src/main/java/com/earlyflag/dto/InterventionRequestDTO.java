package com.earlyflag.dto;

import java.time.LocalDate;

public class InterventionRequestDTO {
    private String actionTaken;
    private LocalDate actionDate;
    private String outcome;

    public InterventionRequestDTO() {
    }

    public InterventionRequestDTO(String actionTaken, LocalDate actionDate, String outcome) {
        this.actionTaken = actionTaken;
        this.actionDate = actionDate;
        this.outcome = outcome;
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
