import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStudents } from '../context/StudentContext';
import { useNotification } from '../context/NotificationContext';
import { getApiConfig, setApiConfig } from '../services/api';
import { 
  Moon, 
  Sun, 
  Bell, 
  Sliders, 
  RotateCcw, 
  Save, 
  Server
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ConfirmModal } from '../components/ConfirmModal';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const { resetAllDemoData } = useStudents();
  const { showToast } = useNotification();

  const currentConfig = getApiConfig();
  const [useMock, setUseMock] = useState(currentConfig.useMock);
  const [apiUrl, setApiUrl] = useState(currentConfig.baseUrl);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskInstant, setHighRiskInstant] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Risk Thresholds
  const [highThreshold, setHighThreshold] = useState(70);
  const [medThreshold, setMedThreshold] = useState(40);

  // Confirm Modal
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveApiSettings = () => {
    setApiConfig(useMock, apiUrl);
    showToast({
      type: 'success',
      title: 'Configuration Saved',
      message: `System set to ${useMock ? 'Interactive Mock Data' : 'Live Backend API'}.`
    });
  };

  const handleResetDemoData = async () => {
    await resetAllDemoData();
    setShowResetModal(false);
  };

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'System Settings & Preferences', active: true }
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Portal Settings & Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Customize visual theme, alert thresholds, and backend API integration endpoints.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 1. Appearance / Theme */}
        <div className="ef-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sun size={18} color="var(--brand-primary-light)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Appearance & Theme
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                background: theme === 'light' ? 'var(--brand-primary-soft)' : 'var(--bg-subtle)',
                border: `2px solid ${theme === 'light' ? 'var(--brand-primary-light)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                color: 'var(--text-primary)'
              }}
            >
              <Sun size={24} style={{ margin: '0 auto 0.4rem auto', color: '#f59e0b' }} />
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Light Mode</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Crisp academic style</div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              style={{
                background: theme === 'dark' ? 'var(--brand-primary-soft)' : 'var(--bg-subtle)',
                border: `2px solid ${theme === 'dark' ? 'var(--brand-primary-light)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                color: 'var(--text-primary)'
              }}
            >
              <Moon size={24} style={{ margin: '0 auto 0.4rem auto', color: '#38bdf8' }} />
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Dark Mode</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reduced eye strain</div>
            </button>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="ef-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Bell size={18} color="var(--brand-primary-light)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Alert Triggers & Notifications
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>High-Risk Instant Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify immediately when student score &gt;= 70</div>
              </div>
              <input
                type="checkbox"
                checked={highRiskInstant}
                onChange={(e) => setHighRiskInstant(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Email Notifications</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send summaries to priya.sharma@earlyflag.edu</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Weekly Cohort Digest</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly attendance and marks rollup report</div>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
              />
            </label>
          </div>
        </div>

        {/* 3. API & Backend Integration Configuration */}
        <div className="ef-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Server size={18} color="var(--brand-primary-light)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Backend API & Data Mode
            </h3>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="radio"
                name="dataMode"
                checked={useMock}
                onChange={() => setUseMock(true)}
                style={{ accentColor: 'var(--brand-primary)' }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Interactive Standalone Mock Mode (Recommended for Demo)
              </span>
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.4rem' }}>
              Runs fully client-side with 15 realistic student stories from PostgreSQL demo seeds.
            </p>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.65rem 0' }} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
              <input
                type="radio"
                name="dataMode"
                checked={!useMock}
                onChange={() => setUseMock(false)}
                style={{ accentColor: 'var(--brand-primary)' }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Live Backend API Server Mode
              </span>
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.4rem' }}>
              Connects directly to Person 1's live REST endpoints.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">API Base Endpoint URL</label>
            <input
              type="text"
              className="form-input"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              disabled={useMock}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handleSaveApiSettings} style={{ gap: '0.4rem' }}>
              <Save size={14} />
              <span>Save API Configuration</span>
            </button>
          </div>
        </div>

        {/* 4. Risk Engine Sensitivity Thresholds */}
        <div className="ef-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sliders size={18} color="var(--brand-primary-light)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Risk Engine Thresholds
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--risk-high-text)' }}>High Risk Boundary</span>
                <span>{highThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.35rem', accentColor: 'var(--risk-high)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--risk-med-text)' }}>Medium Risk Boundary</span>
                <span>{medThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={medThreshold}
                onChange={(e) => setMedThreshold(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.35rem', accentColor: 'var(--risk-med)' }}
              />
            </div>

            {/* Reset Demo Data Button */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowResetModal(true)}
                style={{ color: 'var(--risk-high)', gap: '0.4rem', width: '100%' }}
              >
                <RotateCcw size={14} />
                <span>Reset Demo Dataset to Initial Seed</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Data */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All Demo Data?"
        message="This will restore the original 15-student demo dataset and clear any newly logged teacher interventions or uploaded test CSV batches."
        confirmLabel="Yes, Reset Data"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleResetDemoData}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
