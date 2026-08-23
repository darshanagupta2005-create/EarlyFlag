import React from 'react';
import { AlertOctagon, FileQuestion, RefreshCw } from 'lucide-react';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 6,
  columns = 6
}) => {
  return (
    <div className="table-container" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '24px', flex: 1 }} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex', gap: '1rem' }}>
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="skeleton" style={{ height: '36px', flex: 1 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ height?: string }> = ({ height = '180px' }) => {
  return (
    <div className="ef-card skeleton" style={{ height }} />
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title,
  description,
  icon = <FileQuestion size={40} color="var(--text-muted)" />,
  actionText,
  onAction
}) => {
  return (
    <div
      className="ef-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        borderStyle: 'dashed'
      }}
    >
      <div style={{ marginBottom: '1rem', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, marginBottom: actionText ? '1.25rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message,
  onRetry
}) => {
  return (
    <div
      className="ef-card"
      style={{
        background: 'var(--risk-high-bg)',
        borderColor: 'var(--risk-high-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        margin: '1rem 0'
      }}
    >
      <div style={{ color: 'var(--risk-high)', marginBottom: '0.75rem' }}>
        <AlertOctagon size={36} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--risk-high-text)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: onRetry ? '1.25rem' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} style={{ gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
