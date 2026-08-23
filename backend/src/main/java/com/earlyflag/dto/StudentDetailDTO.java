package com.earlyflag.dto;

import java.util.List;

public class StudentDetailDTO {
    private Long id;
    private String name;
    private String className;
    private String section;
    private List<AttendanceDTO> attendanceTrend;
    private List<MarkDTO> marksTrend;
    private List<FeeDTO> fees;
    private List<EngagementDTO> engagement;
    private DetailedRiskDTO latestRisk;

    public StudentDetailDTO() {
    }

    public StudentDetailDTO(Long id, String name, String className, String section,
            List<AttendanceDTO> attendanceTrend, List<MarkDTO> marksTrend,
            List<FeeDTO> fees, List<EngagementDTO> engagement,
            DetailedRiskDTO latestRisk) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.section = section;
        this.attendanceTrend = attendanceTrend;
        this.marksTrend = marksTrend;
        this.fees = fees;
        this.engagement = engagement;
        this.latestRisk = latestRisk;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("class")
    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public List<AttendanceDTO> getAttendanceTrend() {
        return attendanceTrend;
    }

    public void setAttendanceTrend(List<AttendanceDTO> attendanceTrend) {
        this.attendanceTrend = attendanceTrend;
    }

    public List<MarkDTO> getMarksTrend() {
        return marksTrend;
    }

    public void setMarksTrend(List<MarkDTO> marksTrend) {
        this.marksTrend = marksTrend;
    }

    public List<FeeDTO> getFees() {
        return fees;
    }

    public void setFees(List<FeeDTO> fees) {
        this.fees = fees;
    }

    public List<EngagementDTO> getEngagement() {
        return engagement;
    }

    public void setEngagement(List<EngagementDTO> engagement) {
        this.engagement = engagement;
    }

    public DetailedRiskDTO getLatestRisk() {
        return latestRisk;
    }

    public void setLatestRisk(DetailedRiskDTO latestRisk) {
        this.latestRisk = latestRisk;
    }
}