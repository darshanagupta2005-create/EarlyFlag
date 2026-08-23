package com.earlyflag.repository;

import com.earlyflag.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudent_Id(String studentId);
    List<Fee> findByStudent_IdOrderByDueDateDesc(String studentId);
}
