package com.earlyflag.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.earlyflag.entity.Mark;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudent_IdOrderByTermAscSubjectAsc(Long studentId);
}