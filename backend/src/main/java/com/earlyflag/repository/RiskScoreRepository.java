package com.earlyflag.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.earlyflag.entity.RiskScore;

@Repository
public interface RiskScoreRepository extends JpaRepository<RiskScore, Long> {
    Optional<RiskScore> findTopByStudent_IdOrderByComputedAtDesc(Long studentId);
}