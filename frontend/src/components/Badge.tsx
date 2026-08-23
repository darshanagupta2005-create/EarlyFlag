import React from 'react';
import type { RiskLevel } from '../types';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface BadgeProps {
  level?: RiskLevel;
  type?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  children?: React.ReactNode;
  icon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<{ level: RiskLevel; showIcon?: boolean; size?: 'sm' | 'md' }> = ({
  level,
  showIcon = true,
  size = 'md'
}) => {
  const getBadgeClass = () => {
    switch (level) {
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
        return 'badge-low';
      default:
        return 'badge-neutral';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'HIGH':
        return <AlertCircle size={size === 'sm' ? 12 : 14} />;
      case 'MEDIUM':
        return <AlertTriangle size={size === 'sm' ? 12 : 14} />;
      case 'LOW':
        return <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
      default:
        return <ShieldCheck size={size === 'sm' ? 12 : 14} />;
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${size === 'sm' ? 'text-xs py-0.5 px-2' : ''}`}>
      {showIcon && getIcon()}
      <span>{level} RISK</span>
    </span>
  );
};

export const StatusBadge: React.FC<BadgeProps> = ({
  type = 'neutral',
  children,
  icon = false,
  className = '',
  size = 'md'
}) => {
  const typeClasses = {
    neutral: 'badge-neutral',
    success: 'badge-low',
    warning: 'badge-medium',
    danger: 'badge-high',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
  };

  return (
    <span className={`badge ${typeClasses[type]} ${className} ${size === 'sm' ? 'text-xs py-0.5 px-2' : ''}`}>
      {icon && <Info size={13} />}
      {children}
    </span>
  );
};
