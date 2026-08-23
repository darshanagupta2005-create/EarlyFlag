import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface HelpGuidePageProps {
  onNavigate: (page: string) => void;
}

export const HelpGuidePage: React.FC<HelpGuidePageProps> = ({ onNavigate }) => {
  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Help & Methodology Guide', active: true }
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          EarlyFlag Methodology & Teacher Guide
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Understanding the 4-signal risk engine, explainability formulas, and recommended intervention protocols.
        </p>
      </div>

      {/* 4-Signal Breakdown */}
      <div className="ef-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldAlert size={20} color="var(--brand-primary-light)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            How EarlyFlag Computes Risk Scores
          </h2>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          EarlyFlag uses a transparent, explainable weighted formula rather than a black-box model. The composite score is derived from four 0–100 sub-scores evaluated against the shared institutional database:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--brand-primary-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              1. Attendance Trend (35% Weight)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Compares attendance in the most recent 14-day data window with the preceding 14 days. A sharp drop of 25 percentage points produces the maximum sub-score (100).
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--brand-primary-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              2. Academic Trend (30% Weight)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Measures percentage drop from Term 1 average to Term 2 latest marks across all subjects. A 30 percentage-point fall scales to maximum risk (100).
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--brand-primary-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              3. Fee Delay (15% Weight)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Calculates overdue days on the most recent unpaid tuition fee. 50 overdue days reaches maximum sub-score (100).
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--brand-primary-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              4. Engagement Flags (20% Weight)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Counts non-positive behavioral and classroom disengagement flags recorded during the trailing 30 calendar days (25 points each).
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--brand-primary-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', color: 'var(--brand-primary-light)', fontWeight: 600 }}>
          Formula: Final Score = (Attendance × 0.35) + (Academic × 0.30) + (Fees × 0.15) + (Engagement × 0.20)
        </div>
      </div>

      {/* FAQ & Guidelines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="ef-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
            Teacher Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Q: Is the risk score an automatic disciplinary label?
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                No. EarlyFlag is strictly an early-warning aid. It alerts teachers to declining trajectories so timely academic counseling or family check-ins can occur before formal exams.
              </p>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Q: When are Reason Codes triggered?
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Whenever any individual signal sub-score exceeds 60, the system automatically surfaces plain-English reason tags such as "Attendance declining" or "Grades dropping".
              </p>
            </div>
          </div>
        </div>

        {/* Demo Walkthrough Checklist */}
        <div className="ef-card" style={{ background: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
            Evaluation Demo Flow Checklist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>1. Sign In via Teacher Portal (Dr. Priya Sharma)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>2. Review Class Overview & High Priority Alerts on Dashboard</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>3. Open Students list & filter by High Risk (Aarav Sharma & Diya Patel)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>4. Inspect Student Detail: 84/100 score, Explainability Card, & Trends</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>5. Record a teacher intervention action & note</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              <span>6. Upload or Quick-Load a sample CSV batch to observe processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
