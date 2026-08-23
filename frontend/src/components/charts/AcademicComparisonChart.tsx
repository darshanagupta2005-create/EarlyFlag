import React, { useState } from 'react';
import type { MarkRecord } from '../../types';

interface AcademicComparisonChartProps {
  marks: MarkRecord[];
  height?: number;
}

export const AcademicComparisonChart: React.FC<AcademicComparisonChartProps> = ({
  marks,
  height = 200
}) => {
  const [hoveredSubject, setHoveredSubject] = useState<MarkRecord | null>(null);

  if (!marks || marks.length === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No academic marks history</div>;
  }

  const chartWidth = 520;
  const chartHeight = height;
  const padding = { top: 25, right: 20, bottom: 40, left: 40 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const barGroupWidth = graphWidth / marks.length;
  const barWidth = Math.min(22, barGroupWidth * 0.32);

  const getY = (val: number) => padding.top + graphHeight - (val / 100) * graphHeight;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="var(--text-muted)"
                fontSize="10"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Bars for each subject */}
        {marks.map((m, i) => {
          const groupCenterX = padding.left + i * barGroupWidth + barGroupWidth / 2;
          const t1X = groupCenterX - barWidth - 2;
          const t2X = groupCenterX + 2;

          const t1Height = (m.term1 / 100) * graphHeight;
          const t2Height = (m.term2 / 100) * graphHeight;

          const isDropSignificant = m.term1 - m.term2 >= 20;

          return (
            <g
              key={m.subject}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredSubject(m)}
              onMouseLeave={() => setHoveredSubject(null)}
            >
              {/* Term 1 Bar (Light Navy/Blue) */}
              <rect
                x={t1X}
                y={getY(m.term1)}
                width={barWidth}
                height={t1Height}
                rx="3"
                fill="var(--brand-primary)"
                opacity="0.75"
              />

              {/* Term 2 Bar (Red if dropped, green/blue if stable) */}
              <rect
                x={t2X}
                y={getY(m.term2)}
                width={barWidth}
                height={t2Height}
                rx="3"
                fill={isDropSignificant ? 'var(--risk-high)' : m.term2 < 60 ? 'var(--risk-med)' : 'var(--brand-primary-light)'}
              />

              {/* Subject Label */}
              <text
                x={groupCenterX}
                y={chartHeight - 12}
                fill="var(--text-secondary)"
                fontSize="11"
                textAnchor="middle"
                fontWeight="600"
              >
                {m.subject.length > 10 ? m.subject.substring(0, 8) + '..' : m.subject}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--brand-primary)', opacity: 0.8 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Term 1</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--risk-high)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Term 2 (Decline Alert)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--brand-primary-light)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Term 2 (Stable)</span>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredSubject && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.8rem',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8rem',
            zIndex: 10
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hoveredSubject.subject}</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
            <span>Term 1: <strong>{hoveredSubject.term1}%</strong></span>
            <span>Term 2: <strong>{hoveredSubject.term2}%</strong></span>
            <span style={{ color: hoveredSubject.term1 > hoveredSubject.term2 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
              ({hoveredSubject.term2 - hoveredSubject.term1 > 0 ? '+' : ''}{hoveredSubject.term2 - hoveredSubject.term1}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
