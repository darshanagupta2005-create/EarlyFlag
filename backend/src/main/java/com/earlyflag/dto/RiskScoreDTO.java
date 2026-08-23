package com.earlyflag.dto;

import java.time.LocalDateTime;

public class RiskScoreDTO {
    private Long id;
    private Integer score;
    private String level;
    private String reasonCodes;
    private LocalDateTime computedAt;

    public RiskScoreDTO() {
    }

    public RiskScoreDTO(Long id, Integer score, String level, String reasonCodes, LocalDateTime computedAt) {
        this.id = id;
        this.score = score;
        this.level = level;
        this.reasonCodes = reasonCodes;
        this.computedAt = computedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getComputedAt() {
        return computedAt;
    }

    public void setComputedAt(LocalDateTime computedAt) {
        this.computedAt = computedAt;
    }
}
