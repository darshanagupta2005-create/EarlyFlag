import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Student, 
  RiskLevel, 
  RiskAlert, 
  DashboardSummary, 
  Intervention, 
  CsvUploadResult 
} from '../types';
import { apiService } from '../services/api';
import { useNotification } from './NotificationContext';

export interface FilterState {
  searchQuery: string;
  riskLevel: 'ALL' | RiskLevel;
  attendanceStatus: 'ALL' | 'GOOD' | 'ATTENTION';
  academicStatus: 'ALL' | 'GOOD' | 'ATTENTION';
  classSection: 'ALL' | '10-A' | '10-B' | '9-A' | '9-B';
  sortBy: 'riskScoreDesc' | 'riskScoreAsc' | 'nameAsc' | 'nameDesc' | 'attendanceAsc' | 'attendanceDesc' | 'gradeAsc' | 'gradeDesc';
}

interface StudentContextType {
  students: Student[];
  filteredStudents: Student[];
  alerts: RiskAlert[];
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  selectedStudent: Student | null;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  fetchStudents: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  selectStudentById: (id: number) => Promise<Student | null>;
  addInterventionToStudent: (studentId: number, intervention: Omit<Intervention, 'id'>) => Promise<void>;
  markAlertAsReviewed: (alertId: string) => Promise<void>;
  uploadCsvData: (file: File) => Promise<CsvUploadResult>;
  resetAllDemoData: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  riskLevel: 'ALL',
  attendanceStatus: 'ALL',
  academicStatus: 'ALL',
  classSection: 'ALL',
  sortBy: 'riskScoreDesc'
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { showToast } = useNotification();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedStudents, fetchedSummary] = await Promise.all([
        apiService.getStudents(),
        apiService.getDashboardSummary()
      ]);
      setStudents(fetchedStudents);
      setSummary(fetchedSummary);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load student data');
      showToast({
        type: 'error',
        title: 'Data Load Error',
        message: 'Could not connect to student database. Please check settings.'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchAlerts = useCallback(async () => {
    try {
      const fetchedAlerts = await apiService.getRiskAlerts();
      setAlerts(fetchedAlerts);
    } catch (err: any) {
      console.error('Error fetching alerts:', err);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchAlerts();
  }, [fetchStudents, fetchAlerts]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const selectStudentById = async (id: number): Promise<Student | null> => {
    const cached = students.find(s => s.id === id);
    // List responses intentionally omit trend history. Only reuse a cached
    // value once it is a full student-detail record; otherwise fetch the API.
    if (cached && (cached.attendanceHistory.length > 0 || cached.marksHistory.length > 0)) {
      setSelectedStudent(cached);
      return cached;
    }
    const fetched = await apiService.getStudentById(id);
    if (fetched) {
      setSelectedStudent(fetched);
    }
    return fetched;
  };

  const addInterventionToStudent = async (studentId: number, intervention: Omit<Intervention, 'id'>) => {
    try {
      const updatedStudent = await apiService.addIntervention(studentId, intervention);
      setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(updatedStudent);
      }
      showToast({
        type: 'success',
        title: 'Intervention Logged',
        message: `Action recorded for ${updatedStudent.name}`
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to Record Action',
        message: err.message || 'An error occurred.'
      });
      throw err;
    }
  };

  const markAlertAsReviewed = async (alertId: string) => {
    try {
      const updated = await apiService.markAlertReviewed(alertId, 'Dr. Priya Sharma');
      setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
      showToast({
        type: 'info',
        title: 'Alert Acknowledged',
        message: `Marked alert as reviewed for ${updated.studentName}`
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not update alert status.'
      });
    }
  };

  const uploadCsvData = async (file: File): Promise<CsvUploadResult> => {
    try {
      const result = await apiService.uploadStudentCsv(file);
      await fetchStudents();
      await fetchAlerts();
      showToast({
        type: 'success',
        title: 'Dataset Processed',
        message: `${result.totalProcessed} students analyzed with 4-signal risk scores.`
      });
      return result;
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Invalid CSV format or missing columns.'
      });
      throw err;
    }
  };

  const resetAllDemoData = async () => {
    apiService.resetToDefaultMockData();
    await fetchStudents();
    await fetchAlerts();
    showToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'Restored original 15-student dataset.'
    });
  };

  // Compute Filtered & Sorted Students dynamically
  const filteredStudents = React.useMemo(() => {
    return students.filter(student => {
      // 1. Search Query (Name or Student ID)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.studentId.toLowerCase().includes(q);
        if (!matchesName && !matchesId) return false;
      }

      // 2. Risk Level Filter
      if (filters.riskLevel !== 'ALL') {
        if (student.riskLevel !== filters.riskLevel) return false;
      }

      // 3. Attendance Filter
      if (filters.attendanceStatus === 'GOOD' && student.attendanceRate < 85) return false;
      if (filters.attendanceStatus === 'ATTENTION' && student.attendanceRate >= 80) return false;

      // 4. Academic Status Filter
      if (filters.academicStatus === 'GOOD' && student.averageGrade < 75) return false;
      if (filters.academicStatus === 'ATTENTION' && student.averageGrade >= 70) return false;

      // 5. Class / Section Filter
      if (filters.classSection !== 'ALL') {
        const [cls, sec] = filters.classSection.split('-');
        if (student.class !== cls || student.section !== sec) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'riskScoreDesc':
          return b.riskScore - a.riskScore;
        case 'riskScoreAsc':
          return a.riskScore - b.riskScore;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'attendanceAsc':
          return a.attendanceRate - b.attendanceRate;
        case 'attendanceDesc':
          return b.attendanceRate - a.attendanceRate;
        case 'gradeAsc':
          return a.averageGrade - b.averageGrade;
        case 'gradeDesc':
          return b.averageGrade - a.averageGrade;
        default:
          return b.riskScore - a.riskScore;
      }
    });
  }, [students, filters]);

  return (
    <StudentContext.Provider
      value={{
        students,
        filteredStudents,
        alerts,
        summary,
        loading,
        error,
        filters,
        selectedStudent,
        setFilters,
        updateFilter,
        resetFilters,
        fetchStudents,
        fetchAlerts,
        selectStudentById,
        addInterventionToStudent,
        markAlertAsReviewed,
        uploadCsvData,
        resetAllDemoData
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudents must be used within a StudentProvider');
  return context;
};
