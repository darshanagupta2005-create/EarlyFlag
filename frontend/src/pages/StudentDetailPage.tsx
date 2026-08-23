import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import type { Student, Intervention } from '../types';
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Plus, 
  Sparkles,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { RiskBadge } from '../components/Badge';
import { RiskMeter } from '../components/RiskMeter';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { AcademicComparisonChart } from '../components/charts/AcademicComparisonChart';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TableSkeleton } from '../components/StateViews';
import { InitialsAvatar } from '../components/InitialsAvatar';

interface StudentDetailPageProps {
  studentId: number;
  onBack: () => void;
  onNavigate: (page: string, studentId?: number) => void;
}

export const StudentDetailPage: React.FC<StudentDetailPageProps> = ({
  studentId,
  onBack,
  onNavigate
}) => {
  const { students, selectStudentById, addInterventionToStudent } = useStudents();
  const { teacher } = useAuth();
  const { showToast } = useNotification();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Intervention modal / form state
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [actionCategory, setActionCategory] = useState<Intervention['category']>('Counselling');
  const [actionTaken, setActionTaken] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await selectStudentById(studentId);
      setStudent(res);
      setLoading(false);
    };
    load();
  }, [studentId, students]);

  if (loading || !student) {
    return (
      <div className="page-content">
        <TableSkeleton rows={4} columns={4} />
      </div>
    );
  }

  const handleSaveIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTaken.trim()) {
      showToast({ type: 'error', message: 'Please describe the action taken or planned.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await addInterventionToStudent(student.id, {
        date: new Date().toISOString().split('T')[0],
        actionTaken: actionTaken.trim(),
        category: actionCategory,
        notes: actionNotes.trim(),
        outcome: 'In Progress',
        teacherName: teacher?.name || 'Dr. Priya Sharma'
      });
      setShowInterventionModal(false);
      setActionTaken('');
      setActionNotes('');
    } catch (err) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHigh = student.riskLevel === 'HIGH';
  const isMed = student.riskLevel === 'MEDIUM';

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Students', onClick: () => onNavigate('students') },
          { label: student.name, active: true }
        ]}
      />

      {/* Back button & Title Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ gap: '0.4rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Students List</span>
        </button>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowInterventionModal(true)}
            style={{ gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>Record Teacher Intervention</span>
          </button>
        </div>
      </div>

      {/* Student Profile Header Card */}
      <div
        className="ef-card"
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <InitialsAvatar
            name={student.name}
            size={74}
            radius="var(--radius-lg)"
            style={{
              border: '2px solid var(--border-strong)',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {student.name}
              </h1>
              <RiskBadge level={student.riskLevel} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span>ID: <strong style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{student.studentId}</strong></span>
              <span>•</span>
              <span>Class: <strong style={{ color: 'var(--text-primary)' }}>{student.class} - Section {student.section}</strong></span>
              <span>•</span>
              <span>Academic Year: <strong style={{ color: 'var(--text-primary)' }}>{student.academicYear}</strong></span>
              <span>•</span>
              <span>Term: <strong style={{ color: 'var(--text-primary)' }}>{student.semester}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={13} color="var(--brand-primary-light)" />
                {student.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={13} color="var(--brand-primary-light)" />
                Guardian: {student.guardianName} ({student.guardianContact})
              </span>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'right', borderRight: '1px solid var(--border-subtle)', paddingRight: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Attendance
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: student.attendanceRate < 75 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
              {student.attendanceRate}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {student.previousAttendanceRate ? `was ${student.previousAttendanceRate}%` : 'Stable'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Term 2 Avg
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: student.averageGrade < 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
              {student.averageGrade}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {student.previousAverageGrade ? `was ${student.previousAverageGrade}% in T1` : 'Term 1'}
            </div>
          </div>
        </div>
      </div>

      {/* Top Main Section: Risk Score Gauge + Explainable Alert Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Risk Score & 4 Sub-Scores Card */}
        <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  EarlyFlag Composite Risk Score
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Computed on 4 weighted signals (Attendance 35%, Academic 30%, Fees 15%, Engagement 20%)
                </p>
              </div>
            </div>

            {/* Circular Gauge + Breakdown */}
            <RiskMeter
              score={student.riskScore}
              level={student.riskLevel}
              subScores={student.subScores}
              size="lg"
              showBreakdown={true}
            />
          </div>
        </div>

        {/* ⭐ Explainable Alert Card & Suggested Action Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Explainable Alert Card ("Why is this student flagged?") */}
          <div
            className="ef-card"
            style={{
              background: isHigh ? 'var(--risk-high-bg)' : isMed ? 'var(--risk-med-bg)' : 'var(--bg-surface)',
              borderColor: isHigh ? 'var(--risk-high-border)' : isMed ? 'var(--risk-med-border)' : 'var(--border-subtle)',
              borderWidth: '1.5px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isHigh ? 'var(--risk-high)' : isMed ? 'var(--risk-med)' : 'var(--risk-low)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isHigh ? 'var(--risk-high-text)' : isMed ? 'var(--risk-med-text)' : 'var(--text-primary)' }}>
                Why is this student flagged?
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
              The explainable risk engine evaluated the shared student indicators and identified the following primary contributing factors:
            </p>

            {student.reasonCodes.length > 0 ? (
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                {student.reasonCodes.map((reason, idx) => (
                  <li key={idx} style={{ fontWeight: 600 }}>
                    {reason}
                    {reason === 'Attendance declining' && ` (Dropped to ${student.attendanceRate}% in the 14-day window)`}
                    {reason === 'Grades dropping' && ` (Term 2 average fell to ${student.averageGrade}%)`}
                    {reason === 'Fees overdue' && ` (${student.feeStatus.overdueDays} days overdue on Term fee)`}
                    {reason === 'Engagement concerns' && ` (${student.engagementLogs.length} non-positive flags in trailing 30 days)`}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--risk-low-text)', fontWeight: 600 }}>
                ✓ No critical risk triggers detected. Performance and attendance remain within positive parameters.
              </div>
            )}
          </div>

          {/* Suggested Teacher Actions Card */}
          <div className="ef-card" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <FileCheck size={18} color="var(--brand-primary-light)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Suggested Teacher Interventions
              </h3>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Support recommendations based on detected signals. Not an automated diagnosis or disciplinary decision.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {student.suggestedActions.map((action, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.55rem',
                    background: 'var(--bg-subtle)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <CheckCircle2 size={15} color="var(--brand-primary-light)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Attendance Timeline Chart */}
        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                28-Day Attendance Trajectory
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Trailing 4-week window (2026-07-24 to 2026-08-20)
              </p>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              75% Risk Line
            </span>
          </div>

          <AttendanceTrendChart records={student.attendanceHistory} height={190} />
        </div>

        {/* Academic Marks Term Comparison Chart */}
        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Subject Performance (Term 1 vs Term 2)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Subject marks drop comparison
              </p>
            </div>
          </div>

          <AcademicComparisonChart marks={student.marksHistory} height={190} />
        </div>
      </div>

      {/* Supporting Data Tabs: Fees, Engagement Logs & Teacher Interventions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Fees & Engagement Details */}
        <div className="ef-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Fee & Engagement History
          </h3>

          {/* Fee Status Card */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              border: `1px solid ${student.feeStatus.paidStatus === 'unpaid' ? 'var(--risk-med-border)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                <CreditCard size={16} color="var(--brand-primary-light)" />
                <span>Term Tuition Fee</span>
              </div>
              <span className={`badge ${student.feeStatus.paidStatus === 'paid' ? 'badge-low' : 'badge-medium'}`}>
                {student.feeStatus.paidStatus.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount: ₹{student.feeStatus.amount}</span>
              <span style={{ color: student.feeStatus.overdueDays > 0 ? 'var(--risk-med)' : 'var(--text-secondary)', fontWeight: 600 }}>
                {student.feeStatus.overdueDays > 0 ? `${student.feeStatus.overdueDays} Days Overdue (Due: ${student.feeStatus.dueDate})` : `Paid on ${student.feeStatus.paidDate}`}
              </span>
            </div>
          </div>

          {/* Engagement Flags */}
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Engagement Observations (Last 30 Days)
          </div>
          {student.engagementLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {student.engagementLogs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${log.flagType === 'disciplinary' ? 'var(--risk-high)' : log.flagType === 'praise' ? 'var(--risk-low)' : 'var(--risk-med)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{log.flagType} Flag</span>
                    <span>{log.date}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {log.notes}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
              No negative engagement flags on file.
            </div>
          )}
        </div>

        {/* Logged Teacher Interventions & Action Timeline */}
        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Teacher Intervention Timeline
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowInterventionModal(true)}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              <Plus size={13} />
              <span>Log Note</span>
            </button>
          </div>

          {student.interventions && student.interventions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {student.interventions.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px', marginRight: '0.4rem' }}>
                        {item.category}
                      </span>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{item.actionTaken}</strong>
                    </div>
                    <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>
                      {item.outcome || 'Logged'}
                    </span>
                  </div>

                  {item.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.35rem 0', lineHeight: 1.4 }}>
                      {item.notes}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                    <span>By: {item.teacherName}</span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No teacher actions recorded yet</div>
              <p style={{ fontSize: '0.78rem', maxWidth: '280px', margin: '0.25rem auto 0.75rem auto' }}>
                Use the button above to log counseling notes, parent check-ins, or remedial sessions.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowInterventionModal(true)}>
                Record First Action
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Record Intervention Modal */}
      {showInterventionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
          onClick={() => setShowInterventionModal(false)}
        >
          <div
            className="ef-card animate-fade"
            style={{ width: '100%', maxWidth: '460px', background: 'var(--bg-surface)', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              Record Teacher Intervention
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Document support actions for <strong>{student.name}</strong> ({student.studentId}).
            </p>

            <form onSubmit={handleSaveIntervention}>
              {/* Category */}
              <div className="form-group">
                <label className="form-label">Support Category</label>
                <select
                  className="form-select"
                  value={actionCategory}
                  onChange={(e) => setActionCategory(e.target.value as any)}
                >
                  <option value="Counselling">1-on-1 Academic Counseling</option>
                  <option value="Parent Check-in">Parent / Guardian Check-in</option>
                  <option value="Academic Support">Remedial Bridge / Tutoring</option>
                  <option value="Fee Assistance">Fee Welfare Support Desk</option>
                  <option value="Mentorship">Peer Mentorship Assignment</option>
                </select>
              </div>

              {/* Action Taken */}
              <div className="form-group">
                <label className="form-label">Action Description / Summary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Discussed Term 2 drop with student; scheduled remedial math"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  required
                />
              </div>

              {/* Detailed Notes */}
              <div className="form-group">
                <label className="form-label">Additional Teacher Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Notes on student response, agreed milestones, follow-up dates..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowInterventionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving Action...' : 'Save Intervention'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
