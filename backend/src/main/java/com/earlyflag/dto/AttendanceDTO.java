package com.earlyflag.dto;

import java.time.LocalDate;

public class AttendanceDTO {
    private Long id;
    private LocalDate attendanceDate;
    private String status;

    public AttendanceDTO() {
    }

    public AttendanceDTO(Long id, LocalDate attendanceDate, String status) {
        this.id = id;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
