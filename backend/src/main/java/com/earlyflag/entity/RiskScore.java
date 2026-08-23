package com.earlyflag.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "risk_scores")
public class RiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "level", nullable = false)
    private String level;

    @Column(name = "reason_codes", columnDefinition = "TEXT")
    private String reasonCodes;

    @Column(name = "computed_at", nullable = false)
    private LocalDateTime computedAt;

    public RiskScore() {
    }

    public RiskScore(Long id, Student student, Integer score, String level, String reasonCodes, LocalDateTime computedAt) {
        this.id = id;
        this.student = student;
        this.score = score;
        this.level = level;
        this.reasonCodes = reasonCodes;
        this.computedAt = computedAt;
    }

    public RiskScore(Student student, Integer score, String level, String reasonCodes, LocalDateTime computedAt) {
        this.student = student;
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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

    @Override
    public String toString() {
        return "RiskScore{" +
                "id=" + id +
                ", score=" + score +
                ", level='" + level + '\'' +
                ", reasonCodes='" + reasonCodes + '\'' +
                ", computedAt=" + computedAt +
                '}';
    }
}
