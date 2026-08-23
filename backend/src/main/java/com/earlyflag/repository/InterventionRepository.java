package com.earlyflag.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.earlyflag.entity.Intervention;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByStudent_IdOrderByActionDateDesc(Long studentId);
}