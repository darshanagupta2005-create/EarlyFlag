package com.earlyflag.dto;

public class InterventionRequestDTO {
    private String actionTaken;
    private String outcome;

    public InterventionRequestDTO() {
    }

    public InterventionRequestDTO(String actionTaken, String outcome) {
        this.actionTaken = actionTaken;
        this.outcome = outcome;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}