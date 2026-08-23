package com.earlyflag.dto;

public class StudentSummaryDTO {
    private String id;
    private String name;
    private String className;
    private String section;
    private Integer latestScore;
    private String riskLevel;
    private String reasonCodes;

    public StudentSummaryDTO() {
    }

    public StudentSummaryDTO(String id, String name, String className, String section, Integer latestScore, String riskLevel, String reasonCodes) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.section = section;
        this.latestScore = latestScore;
        this.riskLevel = riskLevel;
        this.reasonCodes = reasonCodes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public Integer getLatestScore() {
        return latestScore;
    }

    public void setLatestScore(Integer latestScore) {
        this.latestScore = latestScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getReasonCodes() {
        return reasonCodes;
    }

    public void setReasonCodes(String reasonCodes) {
        this.reasonCodes = reasonCodes;
    }
}
