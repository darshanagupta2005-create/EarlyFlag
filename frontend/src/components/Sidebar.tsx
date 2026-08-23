import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  UserCheck, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';

interface SidebarProps {
  currentPage: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onNavigate: (page: string) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogoutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  isCollapsed,
  isMobileOpen,
  onNavigate,
  onToggleCollapse,
  onCloseMobile,
  onLogoutClick
}) => {
  const { alerts } = useStudents();
  const unreviewedAlertsCount = alerts.filter(a => !a.reviewed).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'upload', label: 'Upload Data', icon: UploadCloud },
    { id: 'alerts', label: 'Risk Alerts', icon: AlertTriangle, badge: unreviewedAlertsCount > 0 ? unreviewedAlertsCount : undefined },
    { id: 'overview', label: 'Class Overview', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Teacher Profile', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Guide', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 49
          }}
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width var(--transition-smooth), transform var(--transition-smooth)',
          zIndex: 50,
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxShadow: 'var(--shadow-sm)'
        }}
        className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Top Section: System Header */}
        <div>
          <div
            style={{
              height: 'var(--header-height)',
              padding: isCollapsed ? '0 1rem' : '0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    Teacher Portal
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Early Warning Hub
                  </div>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ShieldCheck size={18} />
              </div>
            )}

            {/* Desktop Collapse Toggle */}
            <button
              className="btn-icon collapse-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'students' && currentPage === 'student-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    width: '100%',
                    padding: isCollapsed ? '0.7rem 0' : '0.65rem 0.9rem',
                    background: isActive ? 'var(--brand-primary-soft)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={19} color={isActive ? 'var(--brand-primary-light)' : 'currentColor'} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge !== undefined && (
                    <span
                      style={{
                        background: 'var(--risk-high)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && item.badge !== undefined && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--risk-high)'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Teacher Status & Logout */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onLogoutClick}
            title={isCollapsed ? 'Sign Out' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '0.75rem',
              width: '100%',
              padding: isCollapsed ? '0.7rem 0' : '0.65rem 0.9rem',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--risk-high)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--risk-high-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .collapse-btn { display: none !important; }
          .academic-pill { display: none !important; }
          .teacher-info-pill { display: none !important; }
          .app-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            width: 260px !important;
          }
          .app-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
        }
        @media (min-width: 901px) {
          .academic-pill { display: flex !important; }
          .teacher-info-pill { display: block !important; }
        }
      `}</style>
    </>
  );
};
