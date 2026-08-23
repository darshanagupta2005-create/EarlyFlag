package com.earlyflag.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LatestRiskDTO {
    private BigDecimal score;
    private String level;
    private LocalDateTime computedAt;

    public LatestRiskDTO() {
    }

    public LatestRiskDTO(BigDecimal score, String level, LocalDateTime computedAt) {
        this.score = score;
        this.level = level;
        this.computedAt = computedAt;
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

    public LocalDateTime getComputedAt() {
        return computedAt;
    }

    public void setComputedAt(LocalDateTime computedAt) {
        this.computedAt = computedAt;
    }
}