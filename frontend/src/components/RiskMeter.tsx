import React from 'react';
import type { SubScores, RiskLevel } from '../types';
import { Calendar, GraduationCap, CreditCard, Activity } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  subScores?: SubScores;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  subScores,
  size = 'md',
  showBreakdown = false
}) => {
  const roundedScore = Math.round(score * 10) / 10;
  
  const getColorVar = () => {
    switch (level) {
      case 'HIGH':
        return 'var(--risk-high)';
      case 'MEDIUM':
        return 'var(--risk-med)';
      case 'LOW':
        return 'var(--risk-low)';
      default:
        return 'var(--text-muted)';
    }
  };

  // Dimensions for circular gauge
  const radius = size === 'lg' ? 62 : size === 'md' ? 44 : 26;
  const strokeWidth = size === 'lg' ? 9 : size === 'md' ? 7 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="risk-meter-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* SVG Circular Progress */}
        <div style={{ position: 'relative', width: (radius + strokeWidth) * 2, height: (radius + strokeWidth) * 2 }}>
          <svg
            width={(radius + strokeWidth) * 2}
            height={(radius + strokeWidth) * 2}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          >
            {/* Background Track */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="transparent"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
            />
            {/* Active Colored Arc */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="transparent"
              stroke={getColorVar()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>

          {/* Centered Score Label */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontSize: size === 'lg' ? '1.75rem' : size === 'md' ? '1.25rem' : '0.875rem',
                fontWeight: 800,
                color: getColorVar(),
                lineHeight: 1
              }}
            >
              {Math.round(roundedScore)}
            </span>
            {size !== 'sm' && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                / 100
              </span>
            )}
          </div>
        </div>

        {/* Level & Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: size === 'lg' ? '1.2rem' : '1rem',
                fontWeight: 700,
                color: getColorVar()
              }}
            >
              {level} RISK
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', margin: 0 }}>
            {level === 'HIGH' && 'Urgent attention recommended across multiple indicators.'}
            {level === 'MEDIUM' && 'Active monitoring advised. Specific risk factors detected.'}
            {level === 'LOW' && 'Performance and attendance are stable.'}
          </p>
        </div>
      </div>

      {/* Sub-Score Breakdown (4 Signals) */}
      {showBreakdown && subScores && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {/* Signal 1: Attendance Trend (35%) */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: subScores.attendance > 60 ? '1px solid var(--risk-high-border)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Calendar size={13} color="var(--brand-primary-light)" />
              <span>Attendance (35%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: subScores.attendance > 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                {subScores.attendance}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${subScores.attendance}%`, background: subScores.attendance > 60 ? 'var(--risk-high)' : 'var(--brand-primary-light)' }} />
            </div>
          </div>

          {/* Signal 2: Academic Trend (30%) */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: subScores.academic > 60 ? '1px solid var(--risk-high-border)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <GraduationCap size={13} color="var(--brand-primary-light)" />
              <span>Academic (30%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: subScores.academic > 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                {subScores.academic}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${subScores.academic}%`, background: subScores.academic > 60 ? 'var(--risk-high)' : 'var(--brand-primary-light)' }} />
            </div>
          </div>

          {/* Signal 3: Fee Delay (15%) */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: subScores.fees > 60 ? '1px solid var(--risk-med-border)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <CreditCard size={13} color="var(--brand-primary-light)" />
              <span>Fee Delay (15%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: subScores.fees > 60 ? 'var(--risk-med)' : 'var(--text-primary)' }}>
                {subScores.fees}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${subScores.fees}%`, background: subScores.fees > 60 ? 'var(--risk-med)' : 'var(--brand-primary-light)' }} />
            </div>
          </div>

          {/* Signal 4: Engagement (20%) */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: subScores.engagement > 60 ? '1px solid var(--risk-high-border)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Activity size={13} color="var(--brand-primary-light)" />
              <span>Engagement (20%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: subScores.engagement > 60 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                {subScores.engagement}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${subScores.engagement}%`, background: subScores.engagement > 60 ? 'var(--risk-high)' : 'var(--brand-primary-light)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
