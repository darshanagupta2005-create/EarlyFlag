package com.earlyflag.repository;

import com.earlyflag.entity.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskScoreRepository extends JpaRepository<RiskScore, Long> {
    List<RiskScore> findByStudent_IdOrderByComputedAtDesc(String studentId);
    Optional<RiskScore> findTopByStudent_IdOrderByComputedAtDesc(String studentId);

    @Query("SELECT r FROM RiskScore r WHERE r.id IN " +
           "(SELECT MAX(r2.id) FROM RiskScore r2 GROUP BY r2.student.id)")
    List<RiskScore> findLatestRiskScoresForAllStudents();
}
