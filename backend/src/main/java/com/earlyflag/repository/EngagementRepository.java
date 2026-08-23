package com.earlyflag.repository;

import com.earlyflag.entity.Engagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EngagementRepository extends JpaRepository<Engagement, Long> {
    List<Engagement> findByStudent_Id(String studentId);
    List<Engagement> findByStudent_IdOrderByLogDateDesc(String studentId);
}
