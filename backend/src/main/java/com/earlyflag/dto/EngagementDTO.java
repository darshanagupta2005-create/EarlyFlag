package com.earlyflag.dto;

import java.time.LocalDate;

public class EngagementDTO {
    private LocalDate date;
    private String flagType;
    private String notes;

    public EngagementDTO() {
    }

    public EngagementDTO(LocalDate date, String flagType, String notes) {
        this.date = date;
        this.flagType = flagType;
        this.notes = notes;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getFlagType() {
        return flagType;
    }

    public void setFlagType(String flagType) {
        this.flagType = flagType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}