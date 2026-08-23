package com.earlyflag.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DetailedRiskDTO {
    private BigDecimal score;
    private String level;
    private List<String> reasonCodes;
    private Map<String, Integer> subScores;

    public DetailedRiskDTO() {
    }

    public DetailedRiskDTO(BigDecimal score, String level, List<String> reasonCodes, Map<String, Integer> subScores) {
        this.score = score;
        this.level = level;
        this.reasonCodes = reasonCodes;
        this.subScores = subScores;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public List<String> getReasonCodes() {
        return reasonCodes;
    }

    public void setReasonCodes(List<String> reasonCodes) {
        this.reasonCodes = reasonCodes;
    }

    public Map<String, Integer> getSubScores() {
        return subScores;
    }

    public void setSubScores(Map<String, Integer> subScores) {
        this.subScores = subScores;
    }
}