import React, { useState } from 'react';
import { predictPlacement, getCompanies, registerForDrive, uploadResume } from '../services/api';

const SKILLS_OPTIONS = ['React', 'Python', 'Java', 'JavaScript', 'Node.js', 'SQL', 'MongoDB', 'DSA', 'C++', 'Angular', 'Django', 'Machine Learning', 'Docker', 'AWS', 'Git'];

export default function PredictPage() {
  const user = JSON.parse(localStorage.getItem('pspa_user'));
  const [form, setForm] = useState({
    name: user?.name || '', cgpa: '', internships: 0, projects: 1, communicationLevel: 5,
    tenthPercentage: 80, twelfthPercentage: 80
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const r = await getCompanies();
      setCompanies(r.data.companies);
    } catch (err) { console.error(err); }
  };

  const handleRegister = async (companyId) => {
    const user = JSON.parse(localStorage.getItem('pspa_user'));
    if (!user) return setError('Please login to register');
    try {
       await registerForDrive(companyId, user.id);
       fetchCompanies(); // Refresh counts
    } catch (err) {
       setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setResumeLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('studentName', form.name);
      const res = await uploadResume(fd, (p) => setResumeProgress(p));
      setResumeScore(res.data.score);
    } catch (err) {
      setError(err.response?.data?.message || 'Resume analysis failed');
    } finally {
      setResumeLoading(false);
      setResumeProgress(0);
    }
  };

  const addSkill = (s) => {
    const val = (s || skillInput).trim();
    if (val && !skills.includes(val)) setSkills(prev => [...prev, val]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const handleSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  const handlePredict = async () => {
    if (form.cgpa === '' || form.cgpa === null || form.cgpa === undefined) return setError('CGPA is required');
    if (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10) return setError('CGPA must be between 0 and 10');
    setError('');
    setLoading(true);
    try {
      const r = await predictPlacement({ ...form, skills, cgpa: parseFloat(form.cgpa) });
      setResult(r.data);
    } catch {
      setError('Prediction failed. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const prob = result?.probability || 0;
  const resultClass = prob >= 70 ? 'high' : prob >= 50 ? 'mid' : 'low';
  const resultColor = prob >= 70 ? 'var(--success)' : prob >= 50 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">🔮 Predict Student Placement</div>
        <div className="topbar-right"><div className="avatar">AD</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-title">Student Details</div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input className="form-control" placeholder="Amit Kumar" value={form.name}
              disabled={user?.role === 'student'}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CGPA (out of 10)</label>
              <input className="form-control" type="number" min="0" max="10" step="0.1"
                placeholder="8.5" value={form.cgpa}
                onChange={e => setForm({ ...form, cgpa: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">12th Percentage (%)</label>
              <input className="form-control" type="number" min="0" max="100"
                placeholder="85" value={form.twelfthPercentage}
                onChange={e => setForm({ ...form, twelfthPercentage: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(type and press Enter)</span></label>
            <div className="tags-input" onClick={() => document.getElementById('skill-input').focus()}>
              {skills.map(s => (
                <span key={s} className="tag">
                  {s} <button onClick={() => removeSkill(s)}>×</button>
                </span>
              ))}
              <input id="skill-input" placeholder={skills.length === 0 ? "React, Python..." : ''}
                value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {SKILLS_OPTIONS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
                <span key={s} onClick={() => addSkill(s)}
                  style={{ padding: '3px 10px', background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  + {s}
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Internships: <strong>{form.internships}</strong></label>
            <div className="slider-row">
              <span>0</span>
              <input type="range" min="0" max="5" value={form.internships}
                onChange={e => setForm({ ...form, internships: Number(e.target.value) })} />
              <span>5</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Projects: <strong>{form.projects}</strong></label>
            <div className="slider-row">
              <span>0</span>
              <input type="range" min="0" max="10" value={form.projects}
                onChange={e => setForm({ ...form, projects: Number(e.target.value) })} />
              <span>10</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Communication Level: <strong>{form.communicationLevel}/10</strong></label>
            <div className="slider-row">
              <span>Low</span>
              <input type="range" min="0" max="10" value={form.communicationLevel}
                onChange={e => setForm({ ...form, communicationLevel: Number(e.target.value) })} />
              <span>High</span>
            </div>
          </div>

          <div className="form-group" style={{ padding: '12px', background: 'var(--bg-card-2)', borderRadius: 8, border: '1px dashed var(--border)', marginTop: 16 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📄 Upload Resume (PDF/DOCX)</span>
              {resumeScore !== null && <span style={{ color: 'var(--success)', fontWeight: 700 }}>Score: {resumeScore}%</span>}
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
              <input type="file" onChange={handleResumeUpload} style={{ display: 'none' }} id="resume-upload" />
              <label htmlFor="resume-upload" className="btn btn-outline" style={{ margin: 0, padding: '8px 16px', fontSize: 13, cursor: 'pointer', flex: 1, textAlign: 'center' }}>
                {resumeFile ? `✅ ${resumeFile.name.substring(0, 15)}...` : '📁 Select File'}
              </label>
              {resumeLoading && <div className="spinner" style={{ width: 14, height: 14 }}></div>}
            </div>
            {resumeProgress > 0 && <div className="progress" style={{ height: 4, marginTop: 10 }}><div className="progress-bar" style={{ width: `${resumeProgress}%` }}></div></div>}
          </div>

          <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={handlePredict} disabled={loading}>
            {loading ? <><span className="spinner"></span> Predicting...</> : '🔮 Predict Placement'}
          </button>
        </div>

        <div>
          {result ? (
            <div className="fade-in">
              <div className={`prediction-result ${resultClass}`}>
                <div className="prediction-pct" style={{ color: resultColor }}>{prob}%</div>
                <div className="prediction-label" style={{ color: resultColor }}>
                  Placement Probability — {result.status}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {result.eligible ? '✅ Eligible for placement drives' : '❌ Needs improvement before placement'}
                </div>
              </div>

              {result.skillGaps?.length > 0 && (
                <div className="card" style={{ marginTop: 16 }}>
                  <div className="card-title">🎯 Skill Gap Analysis</div>
                  {result.skillGaps.map((g, i) => (
                    <div key={i} className="gap-item">
                      <span className="gap-icon">
                        {g.type === 'success' ? '✅' : g.type === 'warning' ? '⚠️' : '❌'}
                      </span>
                      <div>
                        <div className="gap-item-title">{g.item}</div>
                        <div className="gap-item-desc">{g.detail}</div>
                      </div>
                    </div>
                  ))}
                  {result.suggestions?.length > 0 && (
                    <div className="gap-suggestions">
                      <h4>Suggestions for improvement</h4>
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="suggestion-item">✅ {s}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-icon">🔮</div>
                <div className="empty-text">Fill in the student details and click Predict</div>
                <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>
                  The system analyzes CGPA, skills, internships, and projects to predict placement probability
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">🏢 Upcoming Placement Drives (Real-time from Admin)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {companies.map(c => {
            const user = JSON.parse(localStorage.getItem('pspa_user'));
            const isRegistered = c.registrations?.includes(user?.id);
            return (
              <div key={c._id} style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 8, background: 'var(--bg-card-2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                   <div style={{ color: 'var(--success)', fontWeight: 700 }}>{c.package}</div>
                </div>
                <div style={{ color: 'var(--primary)', fontSize: 13, margin: '4px 0 12px' }}>{c.role}</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 15 }}>
                   <div className="tag" style={{ fontSize: 11, background: 'white' }}>🎓 Min CGPA: {c.criteria?.minCGPA || 0}+</div>
                   <div className="tag" style={{ fontSize: 11, background: 'white' }}>🎯 {c.registrations?.length || 0} Reg.</div>
                </div>
                
                <button 
                  className={`btn ${isRegistered ? 'btn-outline' : 'btn-primary'}`}
                  style={{ marginTop: 'auto', padding: '8px', fontSize: 12 }}
                  disabled={!result?.eligible && !isRegistered}
                  onClick={() => handleRegister(c._id)}
                >
                  {isRegistered ? '❌ Unregister' : result?.eligible ? '✍️ Register Now' : '🔒 Not Eligible'}
                </button>
              </div>
            );
          })}
          {companies.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No upcoming drives at the moment.</div>}
        </div>
      </div>
    </div>
  );
}
