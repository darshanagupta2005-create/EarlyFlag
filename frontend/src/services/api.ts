import type { 
  Student, 
  TeacherProfile, 
  RiskAlert, 
  DashboardSummary, 
  CsvUploadResult, 
  Intervention 
} from '../types';
import { 
  initialStudents, 
  mockTeacherProfile, 
  initialAlerts 
} from './mockData';

// API Configuration
const STORAGE_KEYS = {
  USE_MOCK: 'earlyflag_use_mock',
  API_BASE_URL: 'earlyflag_api_url',
  STUDENTS_DATA: 'earlyflag_students_data',
  ALERTS_DATA: 'earlyflag_alerts_data',
  NOTIFICATIONS_DATA: 'earlyflag_notifications_data',
  TEACHER_DATA: 'earlyflag_teacher_data',
};

export const getApiConfig = () => {
  const useMockStored = localStorage.getItem(STORAGE_KEYS.USE_MOCK);
  const baseUrlStored = localStorage.getItem(STORAGE_KEYS.API_BASE_URL);
  
  return {
    useMock: useMockStored !== null ? useMockStored === 'true' : true,
    baseUrl: baseUrlStored || 'http://localhost:8000/api'
  };
};

export const setApiConfig = (useMock: boolean, baseUrl: string) => {
  localStorage.setItem(STORAGE_KEYS.USE_MOCK, String(useMock));
  localStorage.setItem(STORAGE_KEYS.API_BASE_URL, baseUrl);
};

// Local storage persistent helper for demo mock data
const loadStoredData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading stored data for', key, e);
    return fallback;
  }
};

const saveStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data for', key, e);
  }
};

// Central API Service Interface
export const apiService = {
  // 1. Fetch Students
  async getStudents(): Promise<Student[]> {
    const config = getApiConfig();
    if (config.useMock) {
      // Simulate light async delay
      await new Promise(r => setTimeout(r, 200));
      return loadStoredData<Student[]>(STORAGE_KEYS.STUDENTS_DATA, initialStudents);
    }
    
    // Live Backend Call
    const res = await fetch(`${config.baseUrl}/students`);
    if (!res.ok) throw new Error(`Backend error (${res.status}): Failed to fetch students`);
    return await res.json();
  },

  // 2. Fetch Student by ID
  async getStudentById(id: number): Promise<Student | null> {
    const config = getApiConfig();
    if (config.useMock) {
      await new Promise(r => setTimeout(r, 150));
      const students = loadStoredData<Student[]>(STORAGE_KEYS.STUDENTS_DATA, initialStudents);
      const student = students.find(s => s.id === Number(id));
      return student || null;
    }

    const res = await fetch(`${config.baseUrl}/students/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load student #${id}`);
    }
    return await res.json();
  },

  // 3. Dashboard Summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    const students = await this.getStudents();
    
    const totalStudents = students.length;
    const lowRiskCount = students.filter(s => s.riskLevel === 'LOW').length;
    const mediumRiskCount = students.filter(s => s.riskLevel === 'MEDIUM').length;
    const highRiskCount = students.filter(s => s.riskLevel === 'HIGH').length;
    
    const totalAtt = students.reduce((acc, s) => acc + s.attendanceRate, 0);
    const averageAttendance = totalStudents > 0 ? Math.round(totalAtt / totalStudents) : 0;
    
    const totalGrades = students.reduce((acc, s) => acc + s.averageGrade, 0);
    const averageGrade = totalStudents > 0 ? Math.round((totalGrades / totalStudents) * 10) / 10 : 0;

    return {
      totalStudents,
      lowRiskCount,
      mediumRiskCount,
      highRiskCount,
      averageAttendance,
      averageGrade,
      flaggedCount: mediumRiskCount + highRiskCount,
      riskTrend: [
        { date: 'Week 1 (Jul)', high: 1, medium: 2, low: 12 },
        { date: 'Week 2 (Aug)', high: 2, medium: 1, low: 12 },
        { date: 'Week 3 (Aug)', high: 2, medium: 3, low: 10 },
        { date: 'Current (Aug 20)', high: highRiskCount, medium: mediumRiskCount, low: lowRiskCount }
      ],
      attendanceTrend: [
        { week: 'Week 1', rate: 94 },
        { week: 'Week 2', rate: 92 },
        { week: 'Week 3', rate: 87 },
        { week: 'Week 4 (Current)', rate: averageAttendance }
      ],
      academicTrend: [
        { term: 'Term 1 Average', average: 81.4 },
        { term: 'Term 2 Average', average: averageGrade }
      ]
    };
  },

  // 4. Fetch Risk Alerts
  async getRiskAlerts(): Promise<RiskAlert[]> {
    const config = getApiConfig();
    if (config.useMock) {
      await new Promise(r => setTimeout(r, 150));
      return loadStoredData<RiskAlert[]>(STORAGE_KEYS.ALERTS_DATA, initialAlerts);
    }
    const res = await fetch(`${config.baseUrl}/alerts`);
    if (!res.ok) throw new Error('Failed to load risk alerts');
    return await res.json();
  },

  // 5. Mark Alert as Reviewed
  async markAlertReviewed(alertId: string, reviewedBy: string): Promise<RiskAlert> {
    const config = getApiConfig();
    if (config.useMock) {
      const alerts = loadStoredData<RiskAlert[]>(STORAGE_KEYS.ALERTS_DATA, initialAlerts);
      const updated = alerts.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            reviewed: true,
            reviewedAt: new Date().toLocaleString(),
            reviewedBy
          };
        }
        return a;
      });
      saveStoredData(STORAGE_KEYS.ALERTS_DATA, updated);
      return updated.find(a => a.id === alertId)!;
    }

    const res = await fetch(`${config.baseUrl}/alerts/${alertId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewedBy })
    });
    if (!res.ok) throw new Error('Failed to mark alert as reviewed');
    return await res.json();
  },

  // 6. Log Student Intervention
  async addIntervention(
    studentId: number, 
    intervention: Omit<Intervention, 'id'>
  ): Promise<Student> {
    const config = getApiConfig();
    if (config.useMock) {
      const students = loadStoredData<Student[]>(STORAGE_KEYS.STUDENTS_DATA, initialStudents);
      let updatedStudent: Student | null = null;
      
      const updated = students.map(s => {
        if (s.id === studentId) {
          const newIntervention: Intervention = {
            ...intervention,
            id: Date.now()
          };
          updatedStudent = {
            ...s,
            interventions: [newIntervention, ...(s.interventions || [])]
          };
          return updatedStudent;
        }
        return s;
      });

      saveStoredData(STORAGE_KEYS.STUDENTS_DATA, updated);
      if (!updatedStudent) throw new Error('Student not found');
      return updatedStudent;
    }

    const res = await fetch(`${config.baseUrl}/students/${studentId}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intervention)
    });
    if (!res.ok) throw new Error('Failed to log intervention');
    return await res.json();
  },

  // 7. Upload CSV Dataset
  async uploadStudentCsv(file: File): Promise<CsvUploadResult> {
    const config = getApiConfig();
    if (config.useMock) {
      // Validate file extension
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Invalid file format. Please upload a valid .csv file.');
      }
      
      // Simulate multi-signal risk processing
      await new Promise(r => setTimeout(r, 1200));

      const currentStudents = loadStoredData<Student[]>(STORAGE_KEYS.STUDENTS_DATA, initialStudents);
      const lowCount = currentStudents.filter(s => s.riskLevel === 'LOW').length;
      const medCount = currentStudents.filter(s => s.riskLevel === 'MEDIUM').length;
      const highCount = currentStudents.filter(s => s.riskLevel === 'HIGH').length;

      return {
        success: true,
        message: `Successfully processed "${file.name}". All 4 signals computed.`,
        totalProcessed: currentStudents.length,
        lowRiskFound: lowCount,
        mediumRiskFound: medCount,
        highRiskFound: highCount,
        processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${config.baseUrl}/upload-csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'CSV processing failed on server');
    }
    return await res.json();
  },

  // 8. Teacher Profile
  async getTeacherProfile(): Promise<TeacherProfile> {
    const config = getApiConfig();
    if (config.useMock) {
      return loadStoredData<TeacherProfile>(STORAGE_KEYS.TEACHER_DATA, mockTeacherProfile);
    }
    const res = await fetch(`${config.baseUrl}/teacher/profile`);
    if (!res.ok) throw new Error('Failed to load teacher profile');
    return await res.json();
  },

  async updateTeacherProfile(profile: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const config = getApiConfig();
    if (config.useMock) {
      const current = loadStoredData<TeacherProfile>(STORAGE_KEYS.TEACHER_DATA, mockTeacherProfile);
      const updated = { ...current, ...profile };
      saveStoredData(STORAGE_KEYS.TEACHER_DATA, updated);
      return updated;
    }
    const res = await fetch(`${config.baseUrl}/teacher/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to update teacher profile');
    return await res.json();
  },

  // 9. Reset Demo Data to Clean State
  resetToDefaultMockData(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS_DATA);
    localStorage.removeItem(STORAGE_KEYS.ALERTS_DATA);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS_DATA);
    localStorage.removeItem(STORAGE_KEYS.TEACHER_DATA);
  }
};
