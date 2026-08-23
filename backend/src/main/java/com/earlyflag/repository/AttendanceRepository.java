package com.earlyflag.repository;

import com.earlyflag.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent_Id(String studentId);
    List<Attendance> findByStudent_IdOrderByAttendanceDateDesc(String studentId);
}
