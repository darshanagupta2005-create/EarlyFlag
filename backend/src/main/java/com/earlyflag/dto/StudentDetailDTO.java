package com.earlyflag.dto;

import java.util.List;

public class StudentDetailDTO {
    private StudentProfileDTO profile;
    private List<AttendanceDTO> attendanceHistory;
    private List<MarkDTO> marksHistory;
    private List<FeeDTO> feesHistory;
    private RiskScoreDTO latestRiskScore;
    private List<InterventionDTO> interventions;

    public StudentDetailDTO() {
    }

    public StudentDetailDTO(StudentProfileDTO profile,
                            List<AttendanceDTO> attendanceHistory,
                            List<MarkDTO> marksHistory,
                            List<FeeDTO> feesHistory,
                            RiskScoreDTO latestRiskScore,
                            List<InterventionDTO> interventions) {
        this.profile = profile;
        this.attendanceHistory = attendanceHistory;
        this.marksHistory = marksHistory;
        this.feesHistory = feesHistory;
        this.latestRiskScore = latestRiskScore;
        this.interventions = interventions;
    }

    public StudentProfileDTO getProfile() {
        return profile;
    }

    public void setProfile(StudentProfileDTO profile) {
        this.profile = profile;
    }

    public List<AttendanceDTO> getAttendanceHistory() {
        return attendanceHistory;
    }

    public void setAttendanceHistory(List<AttendanceDTO> attendanceHistory) {
        this.attendanceHistory = attendanceHistory;
    }

    public List<MarkDTO> getMarksHistory() {
        return marksHistory;
    }

    public void setMarksHistory(List<MarkDTO> marksHistory) {
        this.marksHistory = marksHistory;
    }

    public List<FeeDTO> getFeesHistory() {
        return feesHistory;
    }

    public void setFeesHistory(List<FeeDTO> feesHistory) {
        this.feesHistory = feesHistory;
    }

    public RiskScoreDTO getLatestRiskScore() {
        return latestRiskScore;
    }

    public void setLatestRiskScore(RiskScoreDTO latestRiskScore) {
        this.latestRiskScore = latestRiskScore;
    }

    public List<InterventionDTO> getInterventions() {
        return interventions;
    }

    public void setInterventions(List<InterventionDTO> interventions) {
        this.interventions = interventions;
    }
}
