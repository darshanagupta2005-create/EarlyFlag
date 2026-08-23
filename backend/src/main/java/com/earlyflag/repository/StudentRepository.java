package com.earlyflag.repository;

import com.earlyflag.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByClassName(String className);
    List<Student> findByClassNameAndSection(String className, String section);
}
