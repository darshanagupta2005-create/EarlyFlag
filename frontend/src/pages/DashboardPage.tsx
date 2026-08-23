import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { RiskBadge } from '../components/Badge';
import { RiskDonutChart } from '../components/charts/RiskDonutChart';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TableSkeleton } from '../components/StateViews';

interface DashboardPageProps {
  onNavigate: (page: string, studentId?: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { teacher } = useAuth();
  const { students, summary, loading, updateFilter } = useStudents();

  if (loading || !summary) {
    return (
      <div className="page-content">
        <TableSkeleton rows={4} columns={4} />
      </div>
    );
  }

  // Filter highest risk students for the "Students Requiring Attention" section
  const highPriorityStudents = [...students]
    .filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  const handleFilterByRisk = (level: 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL') => {
    updateFilter('riskLevel', level);
    onNavigate('students');
  };

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs items={[{ label: 'Teacher Dashboard', active: true }]} />

      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Good Morning, {teacher?.name || 'Dr. Priya Sharma'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Here is your real-time student risk overview for <strong>{teacher?.academicYear || 'AY 2026–27'}</strong> ({teacher?.semester || 'Term 2'}).
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('upload')} style={{ gap: '0.4rem' }}>
            <UploadCloud size={15} />
            <span>Upload New CSV</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleFilterByRisk('HIGH')} style={{ gap: '0.4rem' }}>
            <AlertTriangle size={15} />
            <span>View High Risk ({summary.highRiskCount})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Total Students */}
        <div
          className="ef-card ef-card-interactive"
          onClick={() => handleFilterByRisk('ALL')}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Students
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.3rem', lineHeight: 1 }}>
                {summary.totalStudents}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
                color: 'var(--brand-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Across 4 class sections</span>
          </div>
        </div>

        {/* Low Risk Students (Green) */}
        <div
          className="ef-card ef-card-interactive"
          onClick={() => handleFilterByRisk('LOW')}
          style={{ position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--risk-low)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--risk-low-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                LOW RISK
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--risk-low-text)', marginTop: '0.3rem', lineHeight: 1 }}>
                {summary.lowRiskCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-low-bg)',
                color: 'var(--risk-low)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>{Math.round((summary.lowRiskCount / summary.totalStudents) * 100)}% of class performing stably</span>
          </div>
        </div>

        {/* Medium Risk Students (Amber) */}
        <div
          className="ef-card ef-card-interactive"
          onClick={() => handleFilterByRisk('MEDIUM')}
          style={{ position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--risk-med)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--risk-med-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                MEDIUM RISK
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--risk-med-text)', marginTop: '0.3rem', lineHeight: 1 }}>
                {summary.mediumRiskCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-med-bg)',
                color: 'var(--risk-med)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Moderate signals • Monitor closely</span>
          </div>
        </div>

        {/* High Risk Students (Crimson) */}
        <div
          className="ef-card ef-card-interactive"
          onClick={() => handleFilterByRisk('HIGH')}
          style={{ position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--risk-high)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--risk-high-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HIGH RISK
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--risk-high-text)', marginTop: '0.3rem', lineHeight: 1 }}>
                {summary.highRiskCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-high-bg)',
                color: 'var(--risk-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'var(--risk-high)', fontWeight: 600 }}>Action Required</span>
            <span>• Multi-signal decline</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Charts (Left) & High Priority Alerts (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Left Column: Visual Class Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Risk Distribution Donut */}
          <div className="ef-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Class Risk Distribution
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Multi-signal weighted score segmentation
                </p>
              </div>
              <button
                className="btn-icon"
                onClick={() => onNavigate('overview')}
                title="View Full Class Analytics"
              >
                <ExternalLink size={16} />
              </button>
            </div>

            <RiskDonutChart
              low={summary.lowRiskCount}
              medium={summary.mediumRiskCount}
              high={summary.highRiskCount}
            />
          </div>

          {/* Class Attendance Trend */}
          <div className="ef-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Attendance Trends
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Trailing 4-week class average attendance ({summary.averageAttendance}%)
                </p>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                75% Threshold
              </span>
            </div>

            <AttendanceTrendChart aggregatedData={summary.attendanceTrend} height={170} />
          </div>
        </div>

        {/* Right Column: High Priority Alerts ("Students Requiring Attention") */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="ef-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Students Requiring Attention
                  </h3>
                  <span className="badge badge-high" style={{ padding: '1px 6px' }}>
                    {summary.flaggedCount} Flagged
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Highest priority students identified by the early risk engine
                </p>
              </div>

              <button
                onClick={() => onNavigate('alerts')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-primary-light)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>View All Alerts</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* List of Flagged Students */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1 }}>
              {highPriorityStudents.map(student => (
                <div
                  key={student.id}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: `1px solid ${student.riskLevel === 'HIGH' ? 'var(--risk-high-border)' : 'var(--risk-med-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {student.studentId} • Class {student.class}-{student.section}
                        </div>
                      </div>
                    </div>
                    <RiskBadge level={student.riskLevel} size="sm" />
                  </div>

                  {/* Metrics Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem',
                      background: 'var(--bg-surface)',
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.75rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Risk Score</div>
                      <div style={{ fontWeight: 800, color: student.riskLevel === 'HIGH' ? 'var(--risk-high)' : 'var(--risk-med)' }}>
                        {student.riskScore} / 100
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Attendance</div>
                      <div style={{ fontWeight: 700, color: student.attendanceRate < 75 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                        {student.attendanceRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Term 2 Avg</div>
                      <div style={{ fontWeight: 700, color: student.averageGrade < 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                        {student.averageGrade}%
                      </div>
                    </div>
                  </div>

                  {/* Reasons Preview */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <strong>Detected Reasons:</strong>{' '}
                    {student.reasonCodes.slice(0, 2).join(' • ')}
                  </div>

                  {/* View Student CTA */}
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                    onClick={() => onNavigate('student-detail', student.id)}
                  >
                    <span>View Explainability & Support</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
