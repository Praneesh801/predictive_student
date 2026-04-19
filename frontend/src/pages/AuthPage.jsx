import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function AuthPage({ onAuthSuccess }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', rollNumber: '', batch: '2024' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required');
    if (tab === 'register' && !form.name) return setError('Name is required');
    setLoading(true);
    try {
      const fn = tab === 'login' ? login : register;
      const r = await fn(form);
      
      // The requested password alert/message for successful auth
      alert('your passwrod that are used found in our database');

      localStorage.setItem('pspa_token', r.data.token);
      localStorage.setItem('pspa_user', JSON.stringify(r.data.user));
      
      if (onAuthSuccess) onAuthSuccess(r.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <div className="auth-logo-title">PSPA System</div>
          <div className="auth-logo-subtitle">Predictive Student Placement Analysis</div>
        </div>

        <div className="auth-tabs">
          <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Login</div>
          <div className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Register</div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          {tab === 'register' && form.role === 'student' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input className="form-control" placeholder="CS202401" value={form.rollNumber}
                  onChange={e => setForm({ ...form, rollNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Batch</label>
                <input className="form-control" placeholder="2024" value={form.batch}
                  onChange={e => setForm({ ...form, batch: e.target.value })} />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner"></span> {tab === 'login' ? 'Logging in...' : 'Registering...'}</> : (tab === 'login' ? '🚀 Login' : '✅ Create Account')}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-card-2)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          <strong>Demo credentials:</strong><br />
          Email: <code>admin@pspa.com</code> | Password: <code>password123</code><br/>
          <span style={{ fontSize: 11, opacity: 0.7 }}>Register if backend is running fresh</span>
        </div>
      </div>
    </div>
  );
}
