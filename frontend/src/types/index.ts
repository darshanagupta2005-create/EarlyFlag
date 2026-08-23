export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SubScores {
  attendance: number;
  academic: number;
  fees: number;
  engagement: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export interface MarkRecord {
  subject: string;
  term1: number;
  term2: number;
  maxScore: number;
}

export interface FeeRecord {
  amount: number;
  dueDate: string;
  paidStatus: 'paid' | 'unpaid';
  overdueDays: number;
  paidDate?: string;
}

export interface EngagementRecord {
  date: string;
  flagType: 'disciplinary' | 'disengaged' | 'praise' | 'achievement' | 'neutral';
  notes: string;
}

export interface Intervention {
  id: number;
  date: string;
  actionTaken: string;
  category: 'Counselling' | 'Academic Support' | 'Parent Check-in' | 'Fee Assistance' | 'Mentorship';
  notes?: string;
  outcome?: 'Pending Review' | 'In Progress' | 'Resolved' | 'Requires Escalation';
  teacherName: string;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  class: string;
  section: string;
  semester: string;
  academicYear: string;
  email: string;
  avatar: string;
  guardianName: string;
  guardianContact: string;
  attendanceRate: number;
  previousAttendanceRate?: number;
  averageGrade: number;
  previousAverageGrade?: number;
  riskScore: number;
  riskLevel: RiskLevel;
  subScores: SubScores;
  reasonCodes: string[];
  suggestedActions: string[];
  attendanceHistory: AttendanceRecord[];
  marksHistory: MarkRecord[];
  feeStatus: FeeRecord;
  engagementLogs: EngagementRecord[];
  interventions: Intervention[];
  lastUpdated: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  classes: string[];
  academicYear: string;
  semester: string;
  subjects: string[];
  avatar: string;
  officeHours: string;
  phone: string;
}

export interface RiskAlert {
  id: string;
  studentId: number;
  studentName: string;
  studentCode: string;
  classSection: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
  date: string;
  reviewed: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
  studentId?: number;
}

export interface DashboardSummary {
  totalStudents: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  averageAttendance: number;
  averageGrade: number;
  flaggedCount: number;
  riskTrend: { date: string; high: number; medium: number; low: number }[];
  attendanceTrend: { week: string; rate: number }[];
  academicTrend: { term: string; average: number }[];
}

export interface CsvUploadResult {
  success: boolean;
  message: string;
  totalProcessed: number;
  lowRiskFound: number;
  mediumRiskFound: number;
  highRiskFound: number;
  processedAt: string;
  warnings?: string[];
  errors?: string[];
}
