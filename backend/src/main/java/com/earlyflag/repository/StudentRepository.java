package com.earlyflag.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.earlyflag.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByClassName(String className);
    List<Student> findByClassNameAndSection(String className, String section);
}