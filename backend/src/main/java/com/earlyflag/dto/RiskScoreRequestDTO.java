package com.earlyflag.dto;

public class RiskScoreRequestDTO {
    private Integer score;
    private String level;
    private String reasonCodes;

    public RiskScoreRequestDTO() {
    }

    public RiskScoreRequestDTO(Integer score, String level, String reasonCodes) {
        this.score = score;
        this.level = level;
        this.reasonCodes = reasonCodes;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getReasonCodes() {
        return reasonCodes;
    }

    public void setReasonCodes(String reasonCodes) {
        this.reasonCodes = reasonCodes;
    }
}
