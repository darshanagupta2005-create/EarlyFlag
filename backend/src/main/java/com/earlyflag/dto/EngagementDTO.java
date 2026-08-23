package com.earlyflag.dto;

import java.time.LocalDate;

public class EngagementDTO {
    private Long id;
    private LocalDate logDate;
    private String notes;

    public EngagementDTO() {
    }

    public EngagementDTO(Long id, LocalDate logDate, String notes) {
        this.id = id;
        this.logDate = logDate;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
