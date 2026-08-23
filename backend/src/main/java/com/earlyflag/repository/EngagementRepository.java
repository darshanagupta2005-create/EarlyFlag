package com.earlyflag.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.earlyflag.entity.Engagement;

@Repository
public interface EngagementRepository extends JpaRepository<Engagement, Long> {
    List<Engagement> findByStudent_IdOrderByLogDateDesc(Long studentId);
}