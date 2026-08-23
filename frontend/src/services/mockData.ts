import type { Student, TeacherProfile, RiskAlert, NotificationItem } from '../types';

export const mockTeacherProfile: TeacherProfile = {
  id: 'TCH1024',
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@earlyflag.edu',
  department: 'Computer Engineering & Sciences',
  designation: 'Associate Professor & Class Mentor',
  classes: ['Class 10 - Section A', 'Class 10 - Section B', 'Class 9 - Section A'],
  academicYear: '2026–27',
  semester: 'Semester V / Term 2',
  subjects: ['Data Science & Analytics', 'Database Management', 'Applied Mathematics'],
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  officeHours: 'Mon & Thu: 2:00 PM – 4:30 PM (Room 304, Academic Block B)',
  phone: '+91 98765 43210'
};

// Generate 28-day attendance series based on rules from seed_demo_data.sql (2026-07-24 to 2026-08-20)
function generateAttendance(studentId: number): { date: string; status: 'present' | 'absent' }[] {
  const records: { date: string; status: 'present' | 'absent' }[] = [];
  const startDate = new Date('2026-07-24');
  
  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const day = d.getDate();
    
    let status: 'present' | 'absent' = 'present';
    if (studentId === 1 && d >= new Date('2026-08-07') && day % 4 !== 0) {
      status = 'absent';
    } else if (studentId === 2 && d >= new Date('2026-08-07') && day % 3 !== 0) {
      status = 'absent';
    } else if (studentId === 4 && d >= new Date('2026-08-07') && day % 3 === 0) {
      status = 'absent';
    } else if (studentId === 3 && day % 8 === 0) {
      status = 'absent';
    }
    
    records.push({ date: dateStr, status });
  }
  return records;
}

export const initialStudents: Student[] = [
  {
    id: 1,
    studentId: 'ST1001',
    name: 'Aarav Sharma',
    class: '10',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'aarav.sharma@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Ramesh Sharma (Father)',
    guardianContact: '+91 98111 22334',
    attendanceRate: 58,
    previousAttendanceRate: 96,
    averageGrade: 49,
    previousAverageGrade: 88,
    riskScore: 84.45,
    riskLevel: 'HIGH',
    subScores: {
      attendance: 84,
      academic: 93,
      fees: 100,
      engagement: 75
    },
    reasonCodes: ['Attendance declining', 'Grades dropping', 'Fees overdue', 'Engagement concerns'],
    suggestedActions: [
      'Schedule an urgent 1-on-1 counseling session with student to understand root causes.',
      'Coordinate with parent/guardian regarding recent sharp 38% attendance drop.',
      'Enroll in Mathematics & Science remedial bridge sessions for Term 2 topics.',
      'Connect guardian with student welfare desk regarding 51-day fee delay support options.'
    ],
    attendanceHistory: generateAttendance(1),
    marksHistory: [
      { subject: 'Mathematics', term1: 90, term2: 50, maxScore: 100 },
      { subject: 'Science', term1: 86, term2: 48, maxScore: 100 },
      { subject: 'English', term1: 88, term2: 54, maxScore: 100 },
      { subject: 'Social Studies', term1: 87, term2: 44, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-07-01',
      paidStatus: 'unpaid',
      overdueDays: 51
    },
    engagementLogs: [
      { date: '2026-08-10', flagType: 'disciplinary', notes: 'Repeated classroom disruption during lab session' },
      { date: '2026-08-14', flagType: 'disengaged', notes: 'Did not participate in assigned group project work' },
      { date: '2026-08-18', flagType: 'disciplinary', notes: 'Missed scheduled academic counseling check-in' }
    ],
    interventions: [
      {
        id: 101,
        date: '2026-08-19',
        actionTaken: 'Sent official attendance notification email to parent',
        category: 'Parent Check-in',
        notes: 'Awaiting parent response for in-person meeting this Friday.',
        outcome: 'In Progress',
        teacherName: 'Dr. Priya Sharma'
      }
    ],
    lastUpdated: '2026-08-20'
  },
  {
    id: 2,
    studentId: 'ST1002',
    name: 'Diya Patel',
    class: '10',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'diya.patel@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Sanjay Patel (Father)',
    guardianContact: '+91 98222 33445',
    attendanceRate: 64,
    previousAttendanceRate: 93,
    averageGrade: 56,
    previousAverageGrade: 83,
    riskScore: 76.80,
    riskLevel: 'HIGH',
    subScores: {
      attendance: 78,
      academic: 90,
      fees: 66,
      engagement: 50
    },
    reasonCodes: ['Attendance declining', 'Grades dropping', 'Fees overdue'],
    suggestedActions: [
      'Meet with student to discuss noticeable withdrawal in class participation.',
      'Check if recent health or family circumstances contributed to the Term 2 drop.',
      'Provide structured assignment catch-up plan for Science & Math.',
      'Monitor morning arrival times and send weekly attendance progress note.'
    ],
    attendanceHistory: generateAttendance(2),
    marksHistory: [
      { subject: 'Mathematics', term1: 84, term2: 57, maxScore: 100 },
      { subject: 'Science', term1: 82, term2: 55, maxScore: 100 },
      { subject: 'English', term1: 85, term2: 60, maxScore: 100 },
      { subject: 'Social Studies', term1: 81, term2: 52, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-07-18',
      paidStatus: 'unpaid',
      overdueDays: 33
    },
    engagementLogs: [
      { date: '2026-08-12', flagType: 'disengaged', notes: 'Withdrew from class group activities and discussions' },
      { date: '2026-08-19', flagType: 'disciplinary', notes: 'Late arrival to class without explanation' }
    ],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 3,
    studentId: 'ST1003',
    name: 'Kabir Singh',
    class: '10',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'kabir.singh@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Harpreet Singh (Uncle / Guardian)',
    guardianContact: '+91 98333 44556',
    attendanceRate: 86,
    previousAttendanceRate: 90,
    averageGrade: 66,
    previousAverageGrade: 81,
    riskScore: 61.50,
    riskLevel: 'MEDIUM',
    subScores: {
      attendance: 14,
      academic: 50,
      fees: 100,
      engagement: 75
    },
    reasonCodes: ['Fees overdue', 'Engagement concerns'],
    suggestedActions: [
      'Engage student in collaborative peer mentoring to boost class engagement.',
      'Check in regarding classroom departure incident recorded on Aug 20.',
      'Send polite reminder regarding term fee status.'
    ],
    attendanceHistory: generateAttendance(3),
    marksHistory: [
      { subject: 'Mathematics', term1: 82, term2: 67, maxScore: 100 },
      { subject: 'Science', term1: 80, term2: 65, maxScore: 100 },
      { subject: 'English', term1: 83, term2: 68, maxScore: 100 },
      { subject: 'Social Studies', term1: 79, term2: 64, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-07-01',
      paidStatus: 'unpaid',
      overdueDays: 51
    },
    engagementLogs: [
      { date: '2026-08-16', flagType: 'disengaged', notes: 'Low participation in afternoon class discussions' },
      { date: '2026-08-19', flagType: 'disengaged', notes: 'Did not submit team portion of social science project' },
      { date: '2026-08-20', flagType: 'disciplinary', notes: 'Left class without prior permission' }
    ],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 4,
    studentId: 'ST1004',
    name: 'Meera Iyer',
    class: '9',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'meera.iyer@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Venkatesh Iyer (Father)',
    guardianContact: '+91 98444 55667',
    attendanceRate: 75,
    previousAttendanceRate: 93,
    averageGrade: 67,
    previousAverageGrade: 79,
    riskScore: 42.10,
    riskLevel: 'MEDIUM',
    subScores: {
      attendance: 62,
      academic: 40,
      fees: 0,
      engagement: 25
    },
    reasonCodes: ['Attendance declining'],
    suggestedActions: [
      'Monitor attendance pattern for the coming two weeks.',
      'Encourage questions and active participation during class lectures.'
    ],
    attendanceHistory: generateAttendance(4),
    marksHistory: [
      { subject: 'Mathematics', term1: 80, term2: 68, maxScore: 100 },
      { subject: 'Science', term1: 78, term2: 66, maxScore: 100 },
      { subject: 'English', term1: 82, term2: 70, maxScore: 100 },
      { subject: 'Social Studies', term1: 76, term2: 64, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-04'
    },
    engagementLogs: [
      { date: '2026-08-17', flagType: 'disengaged', notes: 'Unusually quiet during interactive discussion' }
    ],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 5,
    studentId: 'ST1005',
    name: 'Arjun Nair',
    class: '9',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'arjun.nair@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Gopal Nair (Father)',
    guardianContact: '+91 98555 66778',
    attendanceRate: 96,
    previousAttendanceRate: 93,
    averageGrade: 77.5,
    previousAverageGrade: 74,
    riskScore: 6.20,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: [
      'Maintain positive momentum and encourage participation in science exhibition.'
    ],
    attendanceHistory: generateAttendance(5),
    marksHistory: [
      { subject: 'Mathematics', term1: 73, term2: 78, maxScore: 100 },
      { subject: 'Science', term1: 75, term2: 77, maxScore: 100 },
      { subject: 'English', term1: 72, term2: 76, maxScore: 100 },
      { subject: 'Social Studies', term1: 76, term2: 79, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-02'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 6,
    studentId: 'ST1006',
    name: 'Ishaan Gupta',
    class: '10',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'ishaan.gupta@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Manish Gupta (Father)',
    guardianContact: '+91 98666 77889',
    attendanceRate: 100,
    previousAttendanceRate: 100,
    averageGrade: 85,
    previousAverageGrade: 84,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Nominate for peer tutoring mentor role.'],
    attendanceHistory: generateAttendance(6),
    marksHistory: [
      { subject: 'Mathematics', term1: 85, term2: 86, maxScore: 100 },
      { subject: 'Science', term1: 83, term2: 84, maxScore: 100 },
      { subject: 'English', term1: 87, term2: 88, maxScore: 100 },
      { subject: 'Social Studies', term1: 81, term2: 82, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-03'
    },
    engagementLogs: [
      { date: '2026-08-15', flagType: 'praise', notes: 'Helped a struggling peer with science lab setup' }
    ],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 7,
    studentId: 'ST1007',
    name: 'Ananya Rao',
    class: '9',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'ananya.rao@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Sudhakar Rao (Father)',
    guardianContact: '+91 98777 88990',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 73,
    previousAverageGrade: 71,
    riskScore: 2.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Continue standard academic tracking.'],
    attendanceHistory: generateAttendance(7),
    marksHistory: [
      { subject: 'Mathematics', term1: 70, term2: 72, maxScore: 100 },
      { subject: 'Science', term1: 72, term2: 74, maxScore: 100 },
      { subject: 'English', term1: 75, term2: 76, maxScore: 100 },
      { subject: 'Social Studies', term1: 74, term2: 75, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-05'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 8,
    studentId: 'ST1008',
    name: 'Riya Das',
    class: '10',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'riya.das@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Kallol Das (Father)',
    guardianContact: '+91 98888 99001',
    attendanceRate: 100,
    previousAttendanceRate: 100,
    averageGrade: 87.5,
    previousAverageGrade: 87,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Exemplary performance across all indicators.'],
    attendanceHistory: generateAttendance(8),
    marksHistory: [
      { subject: 'Mathematics', term1: 88, term2: 87, maxScore: 100 },
      { subject: 'Science', term1: 86, term2: 88, maxScore: 100 },
      { subject: 'English', term1: 90, term2: 92, maxScore: 100 },
      { subject: 'Social Studies', term1: 89, term2: 91, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-01'
    },
    engagementLogs: [
      { date: '2026-08-18', flagType: 'achievement', notes: 'Selected for National Science Olympiad regional round' }
    ],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 9,
    studentId: 'ST1009',
    name: 'Vihaan Kapoor',
    class: '9',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'vihaan.kapoor@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Rajeev Kapoor (Father)',
    guardianContact: '+91 98999 00112',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 70,
    previousAverageGrade: 69,
    riskScore: 4.5,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Encourage regular class preparation.'],
    attendanceHistory: generateAttendance(9),
    marksHistory: [
      { subject: 'Mathematics', term1: 68, term2: 71, maxScore: 100 },
      { subject: 'Science', term1: 70, term2: 69, maxScore: 100 },
      { subject: 'English', term1: 72, term2: 73, maxScore: 100 },
      { subject: 'Social Studies', term1: 71, term2: 70, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-04'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 10,
    studentId: 'ST1010',
    name: 'Sana Khan',
    class: '10',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'sana.khan@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Farooq Khan (Father)',
    guardianContact: '+91 98112 33445',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 81,
    previousAverageGrade: 80,
    riskScore: 1.5,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Active classroom contributor.'],
    attendanceHistory: generateAttendance(10),
    marksHistory: [
      { subject: 'Mathematics', term1: 79, term2: 80, maxScore: 100 },
      { subject: 'Science', term1: 81, term2: 82, maxScore: 100 },
      { subject: 'English', term1: 84, term2: 85, maxScore: 100 },
      { subject: 'Social Studies', term1: 80, term2: 82, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-02'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 11,
    studentId: 'ST1011',
    name: 'Advait Joshi',
    class: '9',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'advait.joshi@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Prakash Joshi (Father)',
    guardianContact: '+91 98223 44556',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 78.5,
    previousAverageGrade: 76.5,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Consistent performance.'],
    attendanceHistory: generateAttendance(11),
    marksHistory: [
      { subject: 'Mathematics', term1: 76, term2: 78, maxScore: 100 },
      { subject: 'Science', term1: 77, term2: 79, maxScore: 100 },
      { subject: 'English', term1: 80, term2: 82, maxScore: 100 },
      { subject: 'Social Studies', term1: 75, term2: 77, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-03'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 12,
    studentId: 'ST1012',
    name: 'Nisha Verma',
    class: '10',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'nisha.verma@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Alok Verma (Father)',
    guardianContact: '+91 98334 55667',
    attendanceRate: 100,
    previousAttendanceRate: 100,
    averageGrade: 91,
    previousAverageGrade: 90,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Top performer in Mathematics & Science.'],
    attendanceHistory: generateAttendance(12),
    marksHistory: [
      { subject: 'Mathematics', term1: 91, term2: 92, maxScore: 100 },
      { subject: 'Science', term1: 89, term2: 90, maxScore: 100 },
      { subject: 'English', term1: 94, term2: 95, maxScore: 100 },
      { subject: 'Social Studies', term1: 90, term2: 91, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-01'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 13,
    studentId: 'ST1013',
    name: 'Dev Malhotra',
    class: '9',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'dev.malhotra@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Sameer Malhotra (Father)',
    guardianContact: '+91 98445 66778',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 75.5,
    previousAverageGrade: 73.5,
    riskScore: 1.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Good progress in second term.'],
    attendanceHistory: generateAttendance(13),
    marksHistory: [
      { subject: 'Mathematics', term1: 74, term2: 76, maxScore: 100 },
      { subject: 'Science', term1: 73, term2: 75, maxScore: 100 },
      { subject: 'English', term1: 78, term2: 79, maxScore: 100 },
      { subject: 'Social Studies', term1: 76, term2: 78, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-04'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 14,
    studentId: 'ST1014',
    name: 'Tara Menon',
    class: '10',
    section: 'B',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'tara.menon@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Ravi Menon (Father)',
    guardianContact: '+91 98556 77889',
    attendanceRate: 100,
    previousAttendanceRate: 100,
    averageGrade: 82,
    previousAverageGrade: 81,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Strong consistent grades.'],
    attendanceHistory: generateAttendance(14),
    marksHistory: [
      { subject: 'Mathematics', term1: 82, term2: 83, maxScore: 100 },
      { subject: 'Science', term1: 80, term2: 81, maxScore: 100 },
      { subject: 'English', term1: 85, term2: 86, maxScore: 100 },
      { subject: 'Social Studies', term1: 84, term2: 85, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-02'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  },
  {
    id: 15,
    studentId: 'ST1015',
    name: 'Yash Kulkarni',
    class: '9',
    section: 'A',
    semester: 'Term 2',
    academicYear: '2026–27',
    email: 'yash.kulkarni@student.earlyflag.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Anil Kulkarni (Father)',
    guardianContact: '+91 98667 88990',
    attendanceRate: 96,
    previousAttendanceRate: 96,
    averageGrade: 77.5,
    previousAverageGrade: 76.5,
    riskScore: 0.0,
    riskLevel: 'LOW',
    subScores: { attendance: 0, academic: 0, fees: 0, engagement: 0 },
    reasonCodes: [],
    suggestedActions: ['Regular attendance and steady marks.'],
    attendanceHistory: generateAttendance(15),
    marksHistory: [
      { subject: 'Mathematics', term1: 77, term2: 78, maxScore: 100 },
      { subject: 'Science', term1: 76, term2: 77, maxScore: 100 },
      { subject: 'English', term1: 80, term2: 81, maxScore: 100 },
      { subject: 'Social Studies', term1: 79, term2: 80, maxScore: 100 }
    ],
    feeStatus: {
      amount: 5000,
      dueDate: '2026-08-05',
      paidStatus: 'paid',
      overdueDays: 0,
      paidDate: '2026-08-03'
    },
    engagementLogs: [],
    interventions: [],
    lastUpdated: '2026-08-20'
  }
];

export const initialAlerts: RiskAlert[] = [
  {
    id: 'ALT-1001',
    studentId: 1,
    studentName: 'Aarav Sharma',
    studentCode: 'ST1001',
    classSection: 'Class 10-A',
    riskScore: 84.45,
    riskLevel: 'HIGH',
    reasons: ['Attendance declining (58%)', 'Grades dropping (49%)', 'Fees overdue 51 days', 'Disciplinary flag'],
    date: '2026-08-20',
    reviewed: false
  },
  {
    id: 'ALT-1002',
    studentId: 2,
    studentName: 'Diya Patel',
    studentCode: 'ST1002',
    classSection: 'Class 10-A',
    riskScore: 76.80,
    riskLevel: 'HIGH',
    reasons: ['Attendance declining (64%)', 'Grades dropping (56%)', 'Fees overdue 33 days'],
    date: '2026-08-20',
    reviewed: false
  },
  {
    id: 'ALT-1003',
    studentId: 3,
    studentName: 'Kabir Singh',
    studentCode: 'ST1003',
    classSection: 'Class 10-B',
    riskScore: 61.50,
    riskLevel: 'MEDIUM',
    reasons: ['Fees overdue 51 days', 'Engagement concerns (3 flags)'],
    date: '2026-08-20',
    reviewed: false
  },
  {
    id: 'ALT-1004',
    studentId: 4,
    studentName: 'Meera Iyer',
    studentCode: 'ST1004',
    classSection: 'Class 9-A',
    riskScore: 42.10,
    riskLevel: 'MEDIUM',
    reasons: ['Attendance declining (75%)', 'Academic drop (67%)'],
    date: '2026-08-20',
    reviewed: true,
    reviewedAt: '2026-08-21 09:15',
    reviewedBy: 'Dr. Priya Sharma'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Risk Alert: Aarav Sharma',
    message: 'Risk score reached 84/100 due to sharp attendance decline and Term 2 marks drop.',
    type: 'alert',
    timestamp: '10 mins ago',
    read: false,
    studentId: 1
  },
  {
    id: 'notif-2',
    title: 'High Risk Alert: Diya Patel',
    message: 'Risk score reached 76/100. Overdue fees and attendance drop detected.',
    type: 'alert',
    timestamp: '45 mins ago',
    read: false,
    studentId: 2
  },
  {
    id: 'notif-3',
    title: 'CSV Dataset Analyzed',
    message: 'Term 2 attendance and marks batch successfully processed for 15 students.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Class 10-B Advisory',
    message: 'Kabir Singh flagged MEDIUM risk. Review fee assistance and engagement notes.',
    type: 'warning',
    timestamp: 'Yesterday',
    read: true,
    studentId: 3
  }
];

export const sampleCsvTemplateContent = `student_id,name,class,section,date,attendance_status,subject,term,marks_score,max_score,fee_due_date,fee_amount,fee_status,engagement_date,engagement_flag,engagement_notes
1,Aarav Sharma,10,A,2026-08-10,absent,Mathematics,term2,50,100,2026-07-01,5000,unpaid,2026-08-10,disciplinary,Classroom disruption
2,Diya Patel,10,A,2026-08-12,absent,Science,term2,55,100,2026-07-18,5000,unpaid,2026-08-12,disengaged,Withdrew from class
3,Kabir Singh,10,B,2026-08-16,present,Mathematics,term2,67,100,2026-07-01,5000,unpaid,2026-08-16,disengaged,Low participation
4,Meera Iyer,9,A,2026-08-17,absent,Science,term2,66,100,2026-08-05,5000,paid,2026-08-17,disengaged,Quiet in class
5,Arjun Nair,9,B,2026-08-18,present,Mathematics,term2,78,100,2026-08-05,5000,paid,,,`;
