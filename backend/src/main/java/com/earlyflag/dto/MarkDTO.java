package com.earlyflag.dto;

import java.math.BigDecimal;

public class MarkDTO {
    private Long id;
    private String subject;
    private String term;
    private BigDecimal score;

    public MarkDTO() {
    }

    public MarkDTO(Long id, String subject, String term, BigDecimal score) {
        this.id = id;
        this.subject = subject;
        this.term = term;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
