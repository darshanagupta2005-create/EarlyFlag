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

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "interventions")
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "action_taken", nullable = false, columnDefinition = "TEXT")
    private String actionTaken;

    @Column(name = "action_date", nullable = false)
    private LocalDate actionDate;

    @Column(name = "outcome", columnDefinition = "TEXT")
    private String outcome;

    public Intervention() {
    }

    public Intervention(Long id, Student student, String actionTaken, LocalDate actionDate, String outcome) {
        this.id = id;
        this.student = student;
        this.actionTaken = actionTaken;
        this.actionDate = actionDate;
        this.outcome = outcome;
    }

    public Intervention(Student student, String actionTaken, LocalDate actionDate, String outcome) {
        this.student = student;
        this.actionTaken = actionTaken;
        this.actionDate = actionDate;
        this.outcome = outcome;
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

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public LocalDate getActionDate() {
        return actionDate;
    }

    public void setActionDate(LocalDate actionDate) {
        this.actionDate = actionDate;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Intervention that = (Intervention) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Intervention{" +
                "id=" + id +
                ", actionTaken='" + actionTaken + '\'' +
                ", actionDate=" + actionDate +
                ", outcome='" + outcome + '\'' +
                '}';
    }
}
