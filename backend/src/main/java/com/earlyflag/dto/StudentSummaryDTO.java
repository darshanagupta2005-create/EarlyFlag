package com.earlyflag.dto;

public class StudentSummaryDTO {
    private Long id;
    private String name;
    private String className;   // serialized as "class" — see @JsonProperty note below
    private String section;
    private LatestRiskDTO latestRisk;

    public StudentSummaryDTO() {
    }

    public StudentSummaryDTO(Long id, String name, String className, String section, LatestRiskDTO latestRisk) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.section = section;
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

    public LatestRiskDTO getLatestRisk() {
        return latestRisk;
    }

    public void setLatestRisk(LatestRiskDTO latestRisk) {
        this.latestRisk = latestRisk;
    }
}