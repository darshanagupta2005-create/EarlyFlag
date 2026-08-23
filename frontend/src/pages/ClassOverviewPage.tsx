import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskDonutChart } from '../components/charts/RiskDonutChart';

interface ClassOverviewPageProps {
  onNavigate: (page: string, studentId?: number) => void;
}

export const ClassOverviewPage: React.FC<ClassOverviewPageProps> = ({ onNavigate }) => {
  const { students, updateFilter } = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const filteredStudents = students.filter(s => {
    if (selectedClass === 'ALL') return true;
    const [cls, sec] = selectedClass.split('-');
    return s.class === cls && s.section === sec;
  });

  const total = filteredStudents.length;
  const lowCount = filteredStudents.filter(s => s.riskLevel === 'LOW').length;
  const medCount = filteredStudents.filter(s => s.riskLevel === 'MEDIUM').length;
  const highCount = filteredStudents.filter(s => s.riskLevel === 'HIGH').length;

  const avgAttendance = total > 0 ? Math.round(filteredStudents.reduce((a, s) => a + s.attendanceRate, 0) / total) : 0;
  const avgGrade = total > 0 ? Math.round((filteredStudents.reduce((a, s) => a + s.averageGrade, 0) / total) * 10) / 10 : 0;

  const handleJumpToStudents = () => {
    if (selectedClass !== 'ALL') {
      updateFilter('classSection', selectedClass as any);
    }
    onNavigate('students');
  };

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Class Analytics & Overview', active: true }
        ]}
      />

      {/* Header & Class Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Class-Level Risk Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Cohort analytics, section vulnerability ratios, and comparative performance indicators.
          </p>
        </div>

        {/* Section Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Select Cohort:
          </label>
          <select
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ width: 'auto', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <option value="ALL">All Cohorts (15 Students)</option>
            <option value="10-A">Class 10 - Section A (High Priority)</option>
            <option value="10-B">Class 10 - Section B</option>
            <option value="9-A">Class 9 - Section A</option>
            <option value="9-B">Class 9 - Section B</option>
          </select>
        </div>
      </div>

      {/* Cohort Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Enrolled Students
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {total}
              </div>
            </div>
            <Users size={20} color="var(--brand-primary-light)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {selectedClass === 'ALL' ? 'Across 4 sections' : `Cohort ${selectedClass}`}
          </div>
        </div>

        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Avg Attendance
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: avgAttendance < 75 ? 'var(--risk-high)' : 'var(--text-primary)', marginTop: '0.25rem' }}>
                {avgAttendance}%
              </div>
            </div>
            <Calendar size={20} color="var(--brand-primary-light)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Trailing 28-day window
          </div>
        </div>

        <div className="ef-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Term 2 Academic Avg
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {avgGrade}%
              </div>
            </div>
            <GraduationCap size={20} color="var(--brand-primary-light)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Subject evaluation average
          </div>
        </div>

        <div className="ef-card" style={{ borderLeft: '4px solid var(--risk-high)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--risk-high-text)', textTransform: 'uppercase' }}>
                Flagged for Review
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--risk-high-text)', marginTop: '0.25rem' }}>
                {highCount + medCount}
              </div>
            </div>
            <AlertTriangle size={20} color="var(--risk-high)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--risk-high)', fontWeight: 600, marginTop: '0.5rem' }}>
            {highCount} High • {medCount} Medium
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Risk Donut Chart */}
        <div className="ef-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Cohort Risk Distribution ({selectedClass})
          </h3>
          <RiskDonutChart low={lowCount} medium={medCount} high={highCount} />
        </div>

        {/* Cohort Vulnerability Breakdown */}
        <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Cohort Academic Summary
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Summary observations generated by EarlyFlag signal engine
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  Class 10-A (Vulnerability Hotspot)
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Contains 2 students with acute attendance drops (Aarav Sharma & Diya Patel) and Term 2 science drops.
                </p>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  Class 10-B (Engagement Flag)
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Kabir Singh flagged MEDIUM risk due to 3 non-positive engagement logs and fee delay.
                </p>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  Grade 9 Sections (A & B)
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Strong overall stability. Meera Iyer (9-A) has moderate attendance slip requiring observation.
                </p>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleJumpToStudents}
            style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
          >
            <span>Inspect Students in Cohort</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
