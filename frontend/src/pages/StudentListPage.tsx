import React from 'react';
import { useStudents } from '../context/StudentContext';
import type { FilterState } from '../context/StudentContext';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  RotateCcw
} from 'lucide-react';
import { RiskBadge } from '../components/Badge';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState, TableSkeleton } from '../components/StateViews';

interface StudentListPageProps {
  onNavigate: (page: string, studentId?: number) => void;
}

export const StudentListPage: React.FC<StudentListPageProps> = ({ onNavigate }) => {
  const { 
    filteredStudents, 
    students, 
    loading, 
    filters, 
    updateFilter, 
    resetFilters 
  } = useStudents();

  const handleExportCsv = () => {
    // Generate CSV string from filtered students
    const headers = ['Student ID', 'Name', 'Class', 'Section', 'Attendance Rate', 'Average Grade', 'Risk Score', 'Risk Level', 'Reasons'];
    const rows = filteredStudents.map(s => [
      s.studentId,
      `"${s.name}"`,
      s.class,
      s.section,
      `${s.attendanceRate}%`,
      `${s.averageGrade}%`,
      s.riskScore,
      s.riskLevel,
      `"${s.reasonCodes.join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `earlyflag_students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = filters.searchQuery || filters.riskLevel !== 'ALL' || filters.attendanceStatus !== 'ALL' || filters.academicStatus !== 'ALL' || filters.classSection !== 'ALL';

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs items={[{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Students Risk Analysis', active: true }]} />

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Student Risk & Performance Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Search, filter, and inspect explainable risk signals across {students.length} enrolled students.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCsv} style={{ gap: '0.4rem' }}>
            <Download size={15} />
            <span>Export Table (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div
        className="ef-card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Row 1: Search & Sorting */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name or ID (e.g. Aarav, ST1001)..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Sort By Dropdown */}
          <div style={{ flex: '0 1 230px' }}>
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
            >
              <option value="riskScoreDesc">Sort: Highest Risk First</option>
              <option value="riskScoreAsc">Sort: Lowest Risk First</option>
              <option value="nameAsc">Sort: Name (A to Z)</option>
              <option value="nameDesc">Sort: Name (Z to A)</option>
              <option value="attendanceAsc">Sort: Attendance (Lowest First)</option>
              <option value="attendanceDesc">Sort: Attendance (Highest First)</option>
              <option value="gradeAsc">Sort: Grades (Lowest First)</option>
              <option value="gradeDesc">Sort: Grades (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Filter Selectors */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          {/* Risk Level Filter */}
          <select
            className="form-select"
            value={filters.riskLevel}
            onChange={(e) => updateFilter('riskLevel', e.target.value as any)}
            style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">🔴 High Risk Only</option>
            <option value="MEDIUM">🟡 Medium Risk Only</option>
            <option value="LOW">🟢 Low Risk Only</option>
          </select>

          {/* Attendance Filter */}
          <select
            className="form-select"
            value={filters.attendanceStatus}
            onChange={(e) => updateFilter('attendanceStatus', e.target.value as any)}
            style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Attendance</option>
            <option value="GOOD">Good (&gt;85%)</option>
            <option value="ATTENTION">Needs Attention (&lt;80%)</option>
          </select>

          {/* Academic Performance Filter */}
          <select
            className="form-select"
            value={filters.academicStatus}
            onChange={(e) => updateFilter('academicStatus', e.target.value as any)}
            style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Academic Marks</option>
            <option value="GOOD">Good Marks (&gt;75%)</option>
            <option value="ATTENTION">Decline / Low Marks (&lt;70%)</option>
          </select>

          {/* Class/Section Filter */}
          <select
            className="form-select"
            value={filters.classSection}
            onChange={(e) => updateFilter('classSection', e.target.value as any)}
            style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Classes & Sections</option>
            <option value="10-A">Class 10 - Section A</option>
            <option value="10-B">Class 10 - Section B</option>
            <option value="9-A">Class 9 - Section A</option>
            <option value="9-B">Class 9 - Section B</option>
          </select>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.75rem', gap: '0.35rem', color: 'var(--risk-high)' }}
            >
              <RotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          )}

          {/* Result Count Pill */}
          <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{filteredStudents.length}</strong> of {students.length} students
          </div>
        </div>
      </div>

      {/* Main Student Data Table */}
      {loading ? (
        <TableSkeleton rows={7} columns={7} />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="No Matching Students Found"
          description="We couldn't find any student records matching your current filter or search criteria."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="table-container">
          <table className="ef-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class / Sec</th>
                <th>Attendance</th>
                <th>Term 2 Avg</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Detected Triggers</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const isHigh = student.riskLevel === 'HIGH';
                const isMed = student.riskLevel === 'MEDIUM';

                return (
                  <tr
                    key={student.id}
                    onClick={() => onNavigate('student-detail', student.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Student Name & Avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={student.avatar}
                          alt={student.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {student.studentId}
                      </span>
                    </td>

                    {/* Class & Section */}
                    <td>
                      <span style={{ fontWeight: 600 }}>Class {student.class}-{student.section}</span>
                    </td>

                    {/* Attendance */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: student.attendanceRate < 75 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                          {student.attendanceRate}%
                        </span>
                        {student.attendanceRate < 75 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--risk-high)', fontWeight: 600 }}>
                            (Low)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Average Grade */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: student.averageGrade < 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                          {student.averageGrade}%
                        </span>
                        {student.previousAverageGrade && student.averageGrade < student.previousAverageGrade && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--risk-high)' }}>
                            ↓
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '55px', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.min(100, student.riskScore)}%`,
                              background: isHigh ? 'var(--risk-high)' : isMed ? 'var(--risk-med)' : 'var(--risk-low)'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isHigh ? 'var(--risk-high)' : isMed ? 'var(--risk-med)' : 'var(--risk-low)' }}>
                          {student.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td>
                      <RiskBadge level={student.riskLevel} size="sm" />
                    </td>

                    {/* Detected Triggers */}
                    <td>
                      {student.reasonCodes.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {student.reasonCodes.slice(0, 2).map((reason, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.7rem',
                                background: 'var(--bg-subtle)',
                                color: 'var(--text-secondary)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None (Stable)</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('student-detail', student.id);
                        }}
                        style={{ padding: '0.3rem 0.65rem' }}
                      >
                        <span>View</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
