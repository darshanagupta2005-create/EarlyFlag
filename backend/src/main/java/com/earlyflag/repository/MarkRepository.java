package com.earlyflag.repository;

import com.earlyflag.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudent_Id(String studentId);
    List<Mark> findByStudent_IdOrderByTermAscSubjectAsc(String studentId);
}
