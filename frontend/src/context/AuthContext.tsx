import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TeacherProfile } from '../types';
import { mockTeacherProfile } from '../services/mockData';
import { apiService } from '../services/api';

interface AuthContextType {
  teacher: TeacherProfile | null;
  isAuthenticated: boolean;
  login: (teacherIdOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<TeacherProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(() => {
    const saved = localStorage.getItem('earlyflag_auth_teacher');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default logged in for interactive demo convenience, can be logged out anytime
    return mockTeacherProfile;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!teacher);

  useEffect(() => {
    if (teacher) {
      localStorage.setItem('earlyflag_auth_teacher', JSON.stringify(teacher));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('earlyflag_auth_teacher');
      setIsAuthenticated(false);
    }
  }, [teacher]);

  const login = async (teacherIdOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Basic client validation
    if (!teacherIdOrEmail.trim()) {
      return { success: false, error: 'Please enter your Teacher ID or College Email.' };
    }
    if (!pass.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }
    if (pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Simulate authenticating against teacher database
    await new Promise(r => setTimeout(r, 400));
    
    // Load active profile
    const currentProfile = await apiService.getTeacherProfile();
    setTeacher(currentProfile);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setTeacher(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<TeacherProfile>) => {
    const updated = await apiService.updateTeacherProfile(data);
    setTeacher(updated);
  };

  return (
    <AuthContext.Provider value={{ teacher, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
