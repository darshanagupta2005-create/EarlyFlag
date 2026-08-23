import type {
  Student,
  TeacherProfile,
  RiskAlert,
  DashboardSummary,
  CsvUploadResult,
  Intervention,
  RiskLevel
} from '../types';
import { mockTeacherProfile } from './mockData';

// ---- API Configuration ----
const STORAGE_KEYS = {
  USE_MOCK: 'earlyflag_use_mock',
  API_BASE_URL: 'earlyflag_api_url',
  ACKNOWLEDGED_ALERTS: 'earlyflag_acknowledged_alerts',
};

export const getApiConfig = () => {
  const useMockStored = localStorage.getItem(STORAGE_KEYS.USE_MOCK);
  const baseUrlStored = localStorage.getItem(STORAGE_KEYS.API_BASE_URL);

  return {
    // Live backend by default now — flip to 'true' in localStorage for offline demo mode.
    useMock: useMockStored === 'true',
    baseUrl: baseUrlStored || 'http://localhost:8080/api'
  };
};

export const setApiConfig = (useMock: boolean, baseUrl: string) => {
  localStorage.setItem(STORAGE_KEYS.USE_MOCK, String(useMock));
  localStorage.setItem(STORAGE_KEYS.API_BASE_URL, baseUrl);
};

// ---- Wire shapes exactly as returned by the real backend (Integration Contract) ----
interface ApiLatestRisk {
  score: number;
  level: RiskLevel;
  computedAt: string;
}

interface ApiStudentSummary {
  id: number;
  name: string;
  class: string;
  section: string;
  latestRisk: ApiLatestRisk | null;
}

interface ApiDetailedRisk {
  score: number;
  level: RiskLevel;
  reasonCodes: string[];
  subScores: { attendance: number; academic: number; fees: number; engagement: number };
}

interface ApiStudentDetail {
  id: number;
  name: string;
  class: string;
  section: string;
  attendanceTrend: { date: string; status: 'present' | 'absent' }[];
  marksTrend: { subject: string; term: string; score: number; maxScore: number }[];
  fees: { dueDate: string; amount: number; paidStatus: 'paid' | 'unpaid' }[];
  engagement: { date: string; flagType: string; notes: string }[];
  latestRisk: ApiDetailedRisk | null;
}

interface ApiIntervention {
  id: number;
  studentId: number;
  actionTaken: string;
  date: string;
  outcome: string;
}

// ---- Mappers: real backend shape -> existing internal Student shape ----
// The contract doesn't provide every field the UI historically expected
// (email, avatar, guardian info, etc.) — those are filled with safe
// placeholders below rather than invented data.
function averageAttendance(trend: { status: string }[]): number {
  if (trend.length === 0) return 0;
  const present = trend.filter(t => t.status === 'present').length;
  return Math.round((present / trend.length) * 100);
}

function averageGradePercent(trend: { score: number; maxScore: number }[]): number {
  const valid = trend.filter(t => t.maxScore > 0);
  if (valid.length === 0) return 0;
  const total = valid.reduce((acc, t) => acc + (t.score / t.maxScore) * 100, 0);
  return Math.round((total / valid.length) * 10) / 10;
}

function mapMarksHistory(trend: ApiStudentDetail['marksTrend']) {
  const bySubject = new Map<string, { term: string; percentage: number }[]>();
  for (const mark of trend) {
    if (mark.maxScore <= 0) continue;
    const percentage = Math.round((mark.score / mark.maxScore) * 1000) / 10;
    const entries = bySubject.get(mark.subject) ?? [];
    entries.push({ term: mark.term, percentage });
    bySubject.set(mark.subject, entries);
  }

  const termOrder = (term: string) => Number(term.match(/\d+/)?.[0] ?? 0);
  return [...bySubject.entries()].map(([subject, entries]) => {
    const ordered = [...entries].sort((a, b) => termOrder(a.term) - termOrder(b.term) || a.term.localeCompare(b.term));
    const first = ordered[0];
    const latest = ordered[ordered.length - 1];
    return {
      subject,
      term1: first.percentage,
      term2: latest.percentage,
      maxScore: 100
    };
  });
}

type AcknowledgedAlert = { reviewedAt: string; reviewedBy: string };

function getAcknowledgedAlerts(): Record<string, AcknowledgedAlert> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACKNOWLEDGED_ALERTS) || '{}');
  } catch {
    return {};
  }
}

function mapSummaryToStudent(s: ApiStudentSummary): Student {
  return {
    id: s.id,
    studentId: String(s.id),
    name: s.name,
    class: s.class,
    section: s.section,
    semester: '',
    academicYear: '',
    email: '',
    avatar: '',
    guardianName: '',
    guardianContact: '',
    attendanceRate: 0,
    averageGrade: 0,
    riskScore: s.latestRisk?.score ?? 0,
    riskLevel: s.latestRisk?.level ?? 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: [],
    attendanceHistory: [],
    marksHistory: [],
    feeStatus: { amount: 0, dueDate: '', paidStatus: 'paid', overdueDays: 0 },
    engagementLogs: [],
    interventions: [],
    lastUpdated: s.latestRisk?.computedAt ?? ''
  };
}

function mapDetailToStudent(d: ApiStudentDetail): Student {
  return {
    id: d.id,
    studentId: String(d.id),
    name: d.name,
    class: d.class,
    section: d.section,
    semester: '',
    academicYear: '',
    email: '',
    avatar: '',
    guardianName: '',
    guardianContact: '',
    attendanceRate: averageAttendance(d.attendanceTrend),
    averageGrade: averageGradePercent(d.marksTrend),
    riskScore: d.latestRisk?.score ?? 0,
    riskLevel: d.latestRisk?.level ?? 'LOW',
    subScores: d.latestRisk?.subScores ?? { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: d.latestRisk?.reasonCodes ?? [],
    suggestedActions: [],
    attendanceHistory: [...d.attendanceTrend]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(a => ({ date: a.date, status: a.status })),
    marksHistory: mapMarksHistory(d.marksTrend),
    feeStatus: d.fees[0]
      ? { amount: d.fees[0].amount, dueDate: d.fees[0].dueDate, paidStatus: d.fees[0].paidStatus, overdueDays: 0 }
      : { amount: 0, dueDate: '', paidStatus: 'paid', overdueDays: 0 },
    engagementLogs: d.engagement.map(e => ({
      date: e.date,
      flagType: e.flagType as any,
      notes: e.notes
    })),
    interventions: [],
    lastUpdated: d.latestRisk ? '' : ''
  };
}

async function readJsonOrThrow(res: Response, fallbackMessage: string) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || fallbackMessage);
  }
  return res.json();
}

// ---- Central API Service Interface ----
export const apiService = {
  async getStudents(): Promise<Student[]> {
    const config = getApiConfig();
    const res = await fetch(`${config.baseUrl}/students`);
    const data: ApiStudentSummary[] = await readJsonOrThrow(res, 'Failed to fetch students');
    // The list endpoint deliberately stays lightweight. Hydrate each summary
    // with its detail endpoint so attendance, marks, fees and engagement data
    // are available throughout the dashboard rather than appearing as zeros.
    const detailedStudents = await Promise.all(data.map(s => this.getStudentById(s.id)));
    return detailedStudents.map((student, index) => student ?? mapSummaryToStudent(data[index]));
  },

  async getStudentById(id: number): Promise<Student | null> {
    const config = getApiConfig();
    const res = await fetch(`${config.baseUrl}/students/${id}`);
    if (res.status === 404) return null;
    const data: ApiStudentDetail = await readJsonOrThrow(res, `Failed to load student #${id}`);

    // Fetch interventions separately — /students/{id} doesn't include them per the contract.
    const interventionsRes = await fetch(`${config.baseUrl}/students/${id}/interventions`);
    const interventions: ApiIntervention[] = interventionsRes.ok ? await interventionsRes.json() : [];

    const student = mapDetailToStudent(data);
    student.interventions = interventions.map(i => ({
      id: i.id,
      date: i.date,
      actionTaken: i.actionTaken,
      category: 'Counselling',
      outcome: (i.outcome as any) || undefined,
      teacherName: ''
    }));
    return student;
  },

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
        { date: 'Current', high: highRiskCount, medium: mediumRiskCount, low: lowRiskCount }
      ],
      attendanceTrend: [
        { week: 'Current', rate: averageAttendance }
      ],
      academicTrend: [
        { term: 'Current', average: averageGrade }
      ]
    };
  },

  // The contract has no /alerts endpoint — the risk engine writes straight to
  // Postgres, so alerts are derived client-side from students already fetched.
  async getRiskAlerts(): Promise<RiskAlert[]> {
    const students = await this.getStudents();
    const acknowledgements = getAcknowledgedAlerts();
    const atRiskStudents = students.filter(s => s.riskLevel === 'MEDIUM' || s.riskLevel === 'HIGH');
    return atRiskStudents
      .map(s => {
        const id = `alert-${s.id}`;
        const acknowledgement = acknowledgements[id];
        return {
        id,
        studentId: s.id,
        studentName: s.name,
        studentCode: s.studentId,
        classSection: `${s.class}-${s.section}`,
        riskScore: s.riskScore,
        riskLevel: s.riskLevel,
        reasons: s.reasonCodes.length > 0 ? s.reasonCodes : ['Risk score requires review'],
        date: s.lastUpdated,
        reviewed: Boolean(acknowledgement),
        reviewedAt: acknowledgement?.reviewedAt,
        reviewedBy: acknowledgement?.reviewedBy
      };
    });
  },

  // The shared backend contract has no alert-acknowledgement endpoint, so the
  // teacher's acknowledgement is persisted locally and survives refreshes.
  async markAlertReviewed(alertId: string, reviewedBy: string): Promise<RiskAlert> {
    const alerts = await this.getRiskAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');
    const acknowledgements = getAcknowledgedAlerts();
    const acknowledgement = { reviewedAt: new Date().toLocaleString(), reviewedBy };
    acknowledgements[alertId] = acknowledgement;
    localStorage.setItem(STORAGE_KEYS.ACKNOWLEDGED_ALERTS, JSON.stringify(acknowledgements));
    return { ...alert, reviewed: true, ...acknowledgement };
  },

  async addIntervention(studentId: number, intervention: Omit<Intervention, 'id'>): Promise<Student> {
    const config = getApiConfig();
    const res = await fetch(`${config.baseUrl}/students/${studentId}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionTaken: intervention.actionTaken,
        outcome: intervention.outcome ?? ''
      })
    });
    await readJsonOrThrow(res, 'Failed to log intervention');
    const refreshed = await this.getStudentById(studentId);
    if (!refreshed) throw new Error('Student not found after logging intervention');
    return refreshed;
  },

  // Contract exposes 4 separate upload endpoints (attendance/marks/fees/engagement).
  // This UI currently collects a single file, so it's routed to /upload/attendance —
  // update UploadCsvPage.tsx to collect all 4 files and call the matching methods
  // below for full CSV coverage.
  async uploadStudentCsv(file: File): Promise<CsvUploadResult> {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Invalid file format. Please upload a valid .csv file.');
    }
    const inserted = await this.uploadAttendanceCsv(file);
    const students = await this.getStudents();
    const lowCount = students.filter(s => s.riskLevel === 'LOW').length;
    const medCount = students.filter(s => s.riskLevel === 'MEDIUM').length;
    const highCount = students.filter(s => s.riskLevel === 'HIGH').length;

    return {
      success: true,
      message: `Successfully processed "${file.name}" — ${inserted} rows inserted.`,
      totalProcessed: inserted,
      lowRiskFound: lowCount,
      mediumRiskFound: medCount,
      highRiskFound: highCount,
      processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  async uploadAttendanceCsv(file: File): Promise<number> {
    return this._uploadCsvTo('attendance', file);
  },
  async uploadMarksCsv(file: File): Promise<number> {
    return this._uploadCsvTo('marks', file);
  },
  async uploadFeesCsv(file: File): Promise<number> {
    return this._uploadCsvTo('fees', file);
  },
  async uploadEngagementCsv(file: File): Promise<number> {
    return this._uploadCsvTo('engagement', file);
  },

  async _uploadCsvTo(kind: 'attendance' | 'marks' | 'fees' | 'engagement', file: File): Promise<number> {
    const config = getApiConfig();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${config.baseUrl}/upload/${kind}`, { method: 'POST', body: formData });
    const body = await readJsonOrThrow(res, `Failed to upload ${kind} CSV`);
    return body.inserted ?? 0;
  },

  // Not part of the backend contract — kept local for the profile screen.
  async getTeacherProfile(): Promise<TeacherProfile> {
    const raw = localStorage.getItem('earlyflag_teacher_data');
    return raw ? JSON.parse(raw) : mockTeacherProfile;
  },

  async updateTeacherProfile(profile: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const current = await this.getTeacherProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('earlyflag_teacher_data', JSON.stringify(updated));
    return updated;
  },

  resetToDefaultMockData(): void {
    localStorage.removeItem('earlyflag_teacher_data');
  }
};
