import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ConfirmModal } from './components/ConfirmModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentListPage } from './pages/StudentListPage';
import { StudentDetailPage } from './pages/StudentDetailPage';
import { UploadCsvPage } from './pages/UploadCsvPage';
import { RiskAlertsPage } from './pages/RiskAlertsPage';
import { ClassOverviewPage } from './pages/ClassOverviewPage';
import { ReportsPage } from './pages/ReportsPage';
import { TeacherProfilePage } from './pages/TeacherProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpGuidePage } from './pages/HelpGuidePage';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1); // Default to Aarav Sharma for demo
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Router handler
  const handleNavigate = (page: string, studentId?: number) => {
    setCurrentPage(page);
    if (studentId !== undefined) {
      setSelectedStudentId(studentId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
    setShowLogoutModal(false);
  };

  // 1. Landing View (Public)
  if (!isAuthenticated && currentPage === 'landing') {
    return (
      <LandingPage
        onGoToLogin={() => setCurrentPage('login')}
        onExploreDemo={() => {
          // Quick enter demo
          setCurrentPage('login');
        }}
      />
    );
  }

  // 2. Login View (Auth)
  if (!isAuthenticated || currentPage === 'login') {
    return (
      <LoginPage
        onBackToLanding={() => setCurrentPage('landing')}
        onLoginSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  // 3. Authenticated Teacher Portal Layout
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        onNavigate={handleNavigate}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Navbar
          onToggleSidebar={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onNavigate={handleNavigate}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        <main style={{ flex: 1 }}>
          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'students' && (
            <StudentListPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'student-detail' && selectedStudentId && (
            <StudentDetailPage
              studentId={selectedStudentId}
              onBack={() => setCurrentPage('students')}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'upload' && (
            <UploadCsvPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'alerts' && (
            <RiskAlertsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'overview' && (
            <ClassOverviewPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'reports' && (
            <ReportsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'profile' && (
            <TeacherProfilePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'help' && (
            <HelpGuidePage onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out of EarlyFlag?"
        message="Are you sure you want to end your teacher session? Any unsaved intervention notes will be preserved."
        confirmLabel="Sign Out"
        cancelLabel="Stay Logged In"
        isDestructive={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <StudentProvider>
            <MainAppContent />
          </StudentProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
