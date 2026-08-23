import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '380px',
        width: 'calc(100% - 40px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} color="var(--risk-low)" />;
            case 'error':
              return <AlertCircle size={18} color="var(--risk-high)" />;
            case 'warning':
              return <AlertTriangle size={18} color="var(--risk-med)" />;
            default:
              return <Info size={18} color="var(--brand-primary-light)" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'var(--risk-low-border)';
            case 'error':
              return 'var(--risk-high-border)';
            case 'warning':
              return 'var(--risk-med-border)';
            default:
              return 'var(--border-strong)';
          }
        };

        return (
          <div
            key={toast.id}
            className="animate-fade"
            style={{
              background: 'var(--bg-surface-elevated)',
              border: `1px solid ${getBorderColor()}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1.1rem',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              pointerEvents: 'auto',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
