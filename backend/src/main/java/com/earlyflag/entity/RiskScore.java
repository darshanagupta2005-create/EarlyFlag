package com.earlyflag.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "risk_scores")
public class RiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "level", nullable = false)
    private String level;

    // Schema column is JSONB — Hibernate 6 maps List<String> straight to it.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reason_codes", nullable = false)
    private List<String> reasonCodes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "sub_scores", nullable = false)
    private Map<String, Integer> subScores;

    @Column(name = "computed_at", nullable = false)
    private LocalDateTime computedAt;

    public RiskScore() {
    }

    public RiskScore(Student student, BigDecimal score, String level,
                      List<String> reasonCodes, Map<String, Integer> subScores, LocalDateTime computedAt) {
        this.student = student;
        this.score = score;
        this.level = level;
        this.reasonCodes = reasonCodes;
        this.subScores = subScores;
        this.computedAt = computedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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

    public LocalDateTime getComputedAt() {
        return computedAt;
    }

    public void setComputedAt(LocalDateTime computedAt) {
        this.computedAt = computedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RiskScore riskScore = (RiskScore) o;
        return Objects.equals(id, riskScore.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}