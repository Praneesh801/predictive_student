import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

import PredictPage from './pages/PredictPage';
import SkillGapPage from './pages/SkillGapPage';
import ResumePage from './pages/ResumePage';
import StudentAnalysisPage from './pages/StudentAnalysisPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';
import StudentCompaniesPage from './pages/StudentCompaniesPage';

function ProtectedLayout({ user, onLogout }) {
  const defaultRoute = user?.role === 'student' ? '/student/drives' : '/dashboard';
  
  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Routes>
          {user?.role !== 'student' && <Route path="/dashboard"         element={<Dashboard />} />}
          {user?.role === 'admin'   && <Route path="/admin/students"   element={<AdminStudentsPage />} />}
          {user?.role === 'admin'   && <Route path="/admin/companies"  element={<AdminCompaniesPage />} />}

          {user?.role === 'admin'   && <Route path="/analyze"           element={<StudentAnalysisPage />} />}
          <Route path="/student/drives"    element={<StudentCompaniesPage />} />
          <Route path="/predict"           element={<PredictPage />} />

          {user?.role === 'admin'   && <Route path="/skill-gap"         element={<SkillGapPage />} />}
          {user?.role === 'admin'   && <Route path="/resume"            icon="📄" element={<ResumePage />} />}
          <Route path="*"                  element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('pspa_token');
    localStorage.removeItem('pspa_user');
    setUser(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem('pspa_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user 
            ? <Navigate to={user.role === 'student' ? '/student/drives' : '/dashboard'} replace /> 
            : <AuthPage onAuthSuccess={setUser} />
        } />
        <Route path="/*" element={
          user
            ? <ProtectedLayout user={user} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}
