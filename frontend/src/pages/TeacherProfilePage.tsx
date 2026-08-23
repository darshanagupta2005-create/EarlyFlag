import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Building, 
  Calendar, 
  Save, 
  Clock
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface TeacherProfilePageProps {
  onNavigate: (page: string) => void;
}

export const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({ onNavigate }) => {
  const { teacher, updateProfile } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(teacher?.name || 'Dr. Priya Sharma');
  const [email, setEmail] = useState(teacher?.email || 'priya.sharma@earlyflag.edu');
  const [department, setDepartment] = useState(teacher?.department || 'Computer Engineering & Sciences');
  const [designation, setDesignation] = useState(teacher?.designation || 'Associate Professor & Class Mentor');
  const [officeHours, setOfficeHours] = useState(teacher?.officeHours || 'Mon & Thu: 2:00 PM – 4:30 PM (Room 304)');
  const [phone, setPhone] = useState(teacher?.phone || '+91 98765 43210');
  const [subjects, setSubjects] = useState(teacher?.subjects.join(', ') || 'Data Science & Analytics, Database Management, Applied Mathematics');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        email,
        department,
        designation,
        officeHours,
        phone,
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean)
      });
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your teacher information has been saved successfully.'
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not save profile.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Teacher Profile', active: true }
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Teacher & Mentor Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Manage your faculty credentials, contact hours, and assigned academic subjects.
        </p>
      </div>

      {/* Profile Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Summary Card */}
        <div className="ef-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={teacher?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt={teacher?.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--brand-primary-light)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '1rem'
            }}
          />

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {name}
          </h2>
          <div style={{ fontSize: '0.84rem', color: 'var(--brand-primary-light)', fontWeight: 600, marginTop: '0.2rem' }}>
            {designation}
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)', marginTop: '0.4rem' }}>
            ID: {teacher?.id || 'TCH1024'}
          </span>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Building size={16} color="var(--brand-primary-light)" />
                <span>{department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Calendar size={16} color="var(--brand-primary-light)" />
                <span>{teacher?.academicYear} • {teacher?.semester}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={16} color="var(--brand-primary-light)" />
                <span>{officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable Form */}
        <div className="ef-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Edit Profile Information
          </h3>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation & Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Office & Counseling Hours</label>
                <input
                  type="text"
                  className="form-input"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subjects Handled (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving} style={{ gap: '0.4rem' }}>
                <Save size={14} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
