import React, { useState } from 'react';
import type { AttendanceRecord } from '../../types';

interface AttendanceTrendChartProps {
  records?: AttendanceRecord[];
  aggregatedData?: { week: string; rate: number }[];
  height?: number;
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({
  records,
  aggregatedData,
  height = 190
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: string; x: number; y: number } | null>(null);

  // If daily attendance records provided (e.g. for student detail 28-day window)
  let points: { label: string; value: number; status?: string }[] = [];

  if (records && records.length > 0) {
    // Group into 4 weekly blocks or display daily trend rolling average
    const windowSize = 4;
    for (let i = 0; i < records.length; i += windowSize) {
      const chunk = records.slice(i, i + windowSize);
      const presentCount = chunk.filter(r => r.status === 'present').length;
      const rate = Math.round((presentCount / chunk.length) * 100);
      const firstDate = chunk[0].date.split('-').slice(1).join('/');
      points.push({ label: firstDate, value: rate });
    }
  } else if (aggregatedData && aggregatedData.length > 0) {
    points = aggregatedData.map(d => ({ label: d.week, value: d.rate }));
  } else {
    points = [
      { label: 'Wk 1', value: 96 },
      { label: 'Wk 2', value: 92 },
      { label: 'Wk 3', value: 84 },
      { label: 'Wk 4', value: 72 }
    ];
  }

  const padding = { top: 25, right: 25, bottom: 35, left: 40 };
  const chartWidth = 500;
  const chartHeight = height;
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const minVal = 0;
  const maxVal = 100;

  const getX = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;

  // Build SVG path string
  const pathData = points.reduce((acc, point, index) => {
    const x = getX(index);
    const y = getY(point.value);
    return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill area gradient path
  const areaPath = points.length > 0
    ? `${pathData} L ${getX(points.length - 1)} ${padding.top + graphHeight} L ${getX(0)} ${padding.top + graphHeight} Z`
    : '';

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-primary-light)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--brand-primary-light)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

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
                strokeDasharray={val === 75 ? '4 4' : 'none'}
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

        {/* 75% Risk Baseline Indicator */}
        <line
          x1={padding.left}
          y1={getY(75)}
          x2={chartWidth - padding.right}
          y2={getY(75)}
          stroke="var(--risk-med)"
          strokeDasharray="3 3"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Area Gradient Fill */}
        {areaPath && <path d={areaPath} fill="url(#attGrad)" />}

        {/* Line Path */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="var(--brand-primary-light)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {points.map((pt, i) => {
          const x = getX(i);
          const y = getY(pt.value);
          const isAtRisk = pt.value < 75;

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={isAtRisk ? 'var(--risk-high)' : 'var(--brand-primary-light)'}
                stroke="var(--bg-surface)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                onMouseEnter={() => setHoveredPoint({ label: pt.label, value: `${pt.value}%`, x, y })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={x}
                y={chartHeight - 10}
                fill="var(--text-secondary)"
                fontSize="11"
                textAnchor="middle"
                fontWeight="500"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
            top: `${(hoveredPoint.y / chartHeight) * 100}%`,
            transform: 'translate(-50%, -130%)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.3rem 0.6rem',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          {hoveredPoint.label}: <span style={{ color: 'var(--brand-primary-light)' }}>{hoveredPoint.value}</span>
        </div>
      )}
    </div>
  );
};
