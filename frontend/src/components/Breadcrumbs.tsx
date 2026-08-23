import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}
      aria-label="Breadcrumb"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <Home size={13} />
        <span>Portal</span>
      </div>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={13} style={{ opacity: 0.6 }} />
          {item.active || !item.onClick ? (
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--brand-primary-light)',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
                fontWeight: 500
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
