package com.earlyflag.repository;

import com.earlyflag.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByStudent_Id(String studentId);
    List<Intervention> findByStudent_IdOrderByActionDateDesc(String studentId);
}
