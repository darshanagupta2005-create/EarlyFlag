import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { RiskBadge } from '../components/Badge';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EmptyState } from '../components/StateViews';

interface RiskAlertsPageProps {
  onNavigate: (page: string, studentId?: number) => void;
}

export const RiskAlertsPage: React.FC<RiskAlertsPageProps> = ({ onNavigate }) => {
  const { alerts, markAlertAsReviewed } = useStudents();
  const [filterType, setFilterType] = useState<'ALL' | 'UNREVIEWED' | 'HIGH' | 'MEDIUM' | 'REVIEWED'>('UNREVIEWED');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = a.studentName.toLowerCase().includes(q);
      const matchCode = a.studentCode.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }

    if (filterType === 'UNREVIEWED' && a.reviewed) return false;
    if (filterType === 'REVIEWED' && !a.reviewed) return false;
    if (filterType === 'HIGH' && a.riskLevel !== 'HIGH') return false;
    if (filterType === 'MEDIUM' && a.riskLevel !== 'MEDIUM') return false;

    return true;
  });

  const unreviewedCount = alerts.filter(a => !a.reviewed).length;

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Risk Alerts & Warnings', active: true }
        ]}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Student Risk Alerts
            </h1>
            {unreviewedCount > 0 && (
              <span className="badge badge-high" style={{ fontSize: '0.75rem' }}>
                {unreviewedCount} Active Unreviewed
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Review, acknowledge, and initiate intervention workflows for flagged students.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="ef-card"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'UNREVIEWED', label: `Pending Review (${unreviewedCount})` },
            { id: 'ALL', label: `All Alerts (${alerts.length})` },
            { id: 'HIGH', label: 'High Risk' },
            { id: 'MEDIUM', label: 'Medium Risk' },
            { id: 'REVIEWED', label: 'Acknowledged' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`btn btn-sm ${filterType === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search alert..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.8125rem', padding: '0.35rem 0.65rem 0.35rem 2rem' }}
          />
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No Risk Alerts Found"
          description="There are currently no active alerts matching this filter criteria."
          icon={<CheckCircle2 size={40} color="var(--risk-low)" />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.map(alert => {
            const isHigh = alert.riskLevel === 'HIGH';

            return (
              <div
                key={alert.id}
                className="ef-card"
                style={{
                  borderLeft: `4px solid ${isHigh ? 'var(--risk-high)' : 'var(--risk-med)'}`,
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  background: alert.reviewed ? 'var(--bg-surface)' : isHigh ? 'var(--risk-high-bg)' : 'var(--risk-med-bg)'
                }}
              >
                {/* Alert Left Details */}
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {alert.studentName}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                      ({alert.studentCode} • {alert.classSection})
                    </span>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                    {alert.reviewed ? (
                      <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                        ✓ Acknowledged
                      </span>
                    ) : (
                      <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>
                        New Unreviewed
                      </span>
                    )}
                  </div>

                  {/* Reasons summary */}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <strong>Flagged Triggers:</strong> {alert.reasons.join(' • ')}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>Generated: {alert.date}</span>
                    {alert.reviewed && (
                      <span>Reviewed: {alert.reviewedAt} by {alert.reviewedBy}</span>
                    )}
                  </div>
                </div>

                {/* Score & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ textAlign: 'right', paddingRight: '0.85rem', borderRight: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Risk Score
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isHigh ? 'var(--risk-high)' : 'var(--risk-med)' }}>
                      {alert.riskScore}
                    </div>
                  </div>

                  {!alert.reviewed && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => markAlertAsReviewed(alert.id)}
                      style={{ gap: '0.35rem' }}
                    >
                      <Check size={14} />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigate('student-detail', alert.studentId)}
                    style={{ gap: '0.35rem' }}
                  >
                    <span>View Student Profile</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
