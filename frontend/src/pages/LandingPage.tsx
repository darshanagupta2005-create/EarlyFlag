import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  Lock,
  TrendingDown,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onExploreDemo }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              EarlyFlag
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onExploreDemo}>
            Explore Live Demo
          </button>
          <button className="btn btn-primary btn-sm" onClick={onGoToLogin}>
            Teacher Login
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem 1.5rem',
          textAlign: 'center',
          maxWidth: '1020px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--brand-primary-soft)',
            color: 'var(--brand-primary-light)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={14} />
          <span>Academic Early Warning & Intervention System</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}
        >
          Identify Early. Intervene Better.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary-light), #0284c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Support Every Student.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '760px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}
        >
          EarlyFlag is a teacher-centric intelligence portal that detects subtle declines in attendance, academic performance, fee status, and engagement—providing explainable risk scores so educators can intervene before it's too late.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onGoToLogin} style={{ gap: '0.6rem' }}>
            <Lock size={18} />
            <span>Open Teacher Portal</span>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onExploreDemo} style={{ gap: '0.6rem' }}>
            <Users size={18} />
            <span>View Demo Student Stories</span>
          </button>
        </div>

        {/* Hero Interactive Preview Card */}
        <div
          className="ef-card animate-fade"
          style={{
            marginTop: '3.5rem',
            textAlign: 'left',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                EarlyFlag Intelligent Risk Engine • Demo Walkthrough
              </span>
            </div>
            <span className="badge badge-high">🔴 HIGH RISK (84/100)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Aarav Sharma <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>(ST1001 • Class 10-A)</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Flagged for teacher review. Attendance fell by 38% in the last 14 days and Term 2 marks dropped from 88% to 49%.
              </p>
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary-light)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                ⭐ Explainable Reason Codes
              </div>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.5 }}>
                <li>Attendance declining (58% in recent 2-week window)</li>
                <li>Grades dropping (39% fall between Term 1 and Term 2)</li>
                <li>Fees overdue by 51 days</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Why EarlyFlag Is Not Just Another ERP
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              Standard school management systems store static records. EarlyFlag dynamically combines 4 academic signals into actionable, explainable insights.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="ef-card" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-strong)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--risk-high)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <TrendingDown size={20} />
                <span>The Traditional Problem</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Students begin disengaging weeks before final exams. Attendance slips gradually and assignment marks dip, but teachers often discover the crisis only when report cards are issued—when it is too late to intervene.
              </p>
            </div>

            <div className="ef-card" style={{ background: 'var(--brand-primary-soft)', borderColor: 'var(--brand-primary-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--brand-primary-light)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <ShieldAlert size={20} />
                <span>The EarlyFlag Solution</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                EarlyFlag continuously scores trends across attendance (35%), academics (30%), fees (15%), and engagement (20%). It flags students in real-time, displays plain-English reasons, and offers concrete next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Flow */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            How EarlyFlag Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A streamlined 4-step workflow designed specifically for busy teachers and school mentors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div className="ef-card">
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 800 }}>
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Upload Data
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Drag-and-drop your periodic attendance sheets, term marks, and engagement notes in CSV format or sync directly with the database.
            </p>
          </div>

          {/* Step 2 */}
          <div className="ef-card">
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 800 }}>
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Analyze Signals
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The engine compares 2-week rolling attendance trends, term-over-term mark drops, fee delays, and negative engagement flags.
            </p>
          </div>

          {/* Step 3 */}
          <div className="ef-card">
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 800 }}>
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Generate Score
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Computes a 0–100 risk score and categorizes students into LOW (0–39), MEDIUM (40–69), and HIGH (70–100) risk tiers.
            </p>
          </div>

          {/* Step 4 */}
          <div className="ef-card">
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 800 }}>
              4
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Explain & Support
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Presents transparent reasoning ("Attendance declining") and contextual action suggestions to guide timely teacher mentoring.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>EarlyFlag</strong> — Early Student Risk Detection & Intervention System
        </p>
        <p style={{ fontSize: '0.75rem' }}>
          Academic Year 2026–27 • Built for educators, academic mentors, and student welfare teams.
        </p>
      </footer>
    </div>
  );
};
