package com.earlyflag.dto;

import java.math.BigDecimal;

public class MarkDTO {
    private String subject;
    private String term;
    private BigDecimal score;
    private BigDecimal maxScore;

    public MarkDTO() {
    }

    public MarkDTO(String subject, String term, BigDecimal score, BigDecimal maxScore) {
        this.subject = subject;
        this.term = term;
        this.score = score;
        this.maxScore = maxScore;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public BigDecimal getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(BigDecimal maxScore) {
        this.maxScore = maxScore;
    }
}