import React, { useState } from 'react';

interface RiskDonutChartProps {
  low: number;
  medium: number;
  high: number;
  size?: number;
}

export const RiskDonutChart: React.FC<RiskDonutChartProps> = ({
  low,
  medium,
  high,
  size = 200
}) => {
  const total = low + medium + high;
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  if (total === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No student risk data</div>;
  }

  const radius = size * 0.38;
  const strokeWidth = size * 0.16;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages and arc offsets
  const highRatio = high / total;
  const medRatio = medium / total;
  const lowRatio = low / total;

  const highDash = highRatio * circumference;
  const medDash = medRatio * circumference;
  const lowDash = lowRatio * circumference;

  const highOffset = 0;
  const medOffset = -highDash;
  const lowOffset = -(highDash + medDash);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        >
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--bg-subtle)"
            strokeWidth={strokeWidth}
          />

          {/* High Risk Segment (Crimson) */}
          {high > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--risk-high)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${highDash} ${circumference}`}
              strokeDashoffset={highOffset}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: hoveredSegment && hoveredSegment !== 'HIGH' ? 0.4 : 1,
                strokeWidth: hoveredSegment === 'HIGH' ? strokeWidth + 4 : strokeWidth
              }}
              onMouseEnter={() => setHoveredSegment('HIGH')}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          )}

          {/* Medium Risk Segment (Amber) */}
          {medium > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--risk-med)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${medDash} ${circumference}`}
              strokeDashoffset={medOffset}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: hoveredSegment && hoveredSegment !== 'MEDIUM' ? 0.4 : 1,
                strokeWidth: hoveredSegment === 'MEDIUM' ? strokeWidth + 4 : strokeWidth
              }}
              onMouseEnter={() => setHoveredSegment('MEDIUM')}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          )}

          {/* Low Risk Segment (Emerald) */}
          {low > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--risk-low)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${lowDash} ${circumference}`}
              strokeDashoffset={lowOffset}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: hoveredSegment && hoveredSegment !== 'LOW' ? 0.4 : 1,
                strokeWidth: hoveredSegment === 'LOW' ? strokeWidth + 4 : strokeWidth
              }}
              onMouseEnter={() => setHoveredSegment('LOW')}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          )}
        </svg>

        {/* Center Summary */}
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
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {hoveredSegment === 'HIGH' ? high : hoveredSegment === 'MEDIUM' ? medium : hoveredSegment === 'LOW' ? low : total}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase' }}>
            {hoveredSegment ? `${hoveredSegment} Risk` : 'Total Students'}
          </span>
        </div>
      </div>

      {/* Interactive Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            opacity: hoveredSegment && hoveredSegment !== 'HIGH' ? 0.5 : 1
          }}
          onMouseEnter={() => setHoveredSegment('HIGH')}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--risk-high)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            High ({high})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            opacity: hoveredSegment && hoveredSegment !== 'MEDIUM' ? 0.5 : 1
          }}
          onMouseEnter={() => setHoveredSegment('MEDIUM')}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--risk-med)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Medium ({medium})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            opacity: hoveredSegment && hoveredSegment !== 'LOW' ? 0.5 : 1
          }}
          onMouseEnter={() => setHoveredSegment('LOW')}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--risk-low)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Low ({low})
          </span>
        </div>
      </div>
    </div>
  );
};
