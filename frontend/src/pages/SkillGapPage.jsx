import React, { useState } from 'react';
import { predictPlacement } from '../services/api';

const DEFAULT_GAPS = [
  { item: 'No DSA!',               detail: 'Algorithms need attention',       type: 'error' },
  { item: 'No Internship!',        detail: 'Gain real-world experience',       type: 'error' },
  { item: 'Good Communication!',   detail: 'Maintain strong interaction',      type: 'success' },
  { item: 'Average Coding Skills!',detail: 'Refine coding knowledge',          type: 'warning' },
  { item: 'Projects!',             detail: 'Hands on experience is essential', type: 'success' },
];

export default function SkillGapPage() {
  const [form, setForm] = useState({ cgpa: '', skills: [], internships: 0, projects: 2, communicationLevel: 7 });
  const [skillInput, setSkillInput] = useState('');
  const [gaps, setGaps] = useState(DEFAULT_GAPS);
  const [suggestions, setSuggestions] = useState(['Improve DSA skills', 'Pursue an internship', 'Work on coding skills']);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !form.skills.includes(val)) setForm(f => ({ ...f, skills: [...f.skills, val] }));
    setSkillInput('');
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const r = await predictPlacement({ ...form, cgpa: parseFloat(form.cgpa) || 7 });
      if (r.data.skillGaps?.length) {
        setGaps(r.data.skillGaps);
        setSuggestions(r.data.suggestions || []);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
      setAnalyzed(true);
    }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">📊 Skill Gap Analyzer</div>
        <div className="topbar-right"><div className="avatar">AD</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        <div className="card">
          <div className="card-title">🔍 Analyze Profile</div>
          <div className="form-group">
            <label className="form-label">CGPA</label>
            <input className="form-control" type="number" min="0" max="10" step="0.1" placeholder="7.5"
              value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills</label>
            <div className="tags-input">
              {form.skills.map(s => (
                <span key={s} className="tag">{s}<button onClick={() => removeSkill(s)}>×</button></span>
              ))}
              <input placeholder="Add skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Internships: <strong>{form.internships}</strong></label>
            <input type="range" min="0" max="5" value={form.internships}
              onChange={e => setForm({ ...form, internships: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Projects: <strong>{form.projects}</strong></label>
            <input type="range" min="0" max="10" value={form.projects}
              onChange={e => setForm({ ...form, projects: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Communication: <strong>{form.communicationLevel}/10</strong></label>
            <input type="range" min="0" max="10" value={form.communicationLevel}
              onChange={e => setForm({ ...form, communicationLevel: Number(e.target.value) })} />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleAnalyze} disabled={loading}>
            {loading ? <><span className="spinner"></span> Analyzing...</> : '🔍 Analyze Skill Gaps'}
          </button>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>📊 Skill Gap Analyzer</div>
              <button onClick={() => setGaps(DEFAULT_GAPS)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            {gaps.map((g, i) => (
              <div key={i} className="gap-item" style={{
                background: g.type === 'success' ? 'var(--success-bg)' : g.type === 'warning' ? 'var(--warning-bg)' : 'var(--error-bg)',
                borderRadius: 'var(--radius-sm)', marginBottom: 8
              }}>
                <span className="gap-icon">
                  {g.type === 'success' ? '✅' : g.type === 'warning' ? '⚠️' : '❌'}
                </span>
                <div>
                  <div className="gap-item-title">{g.item}</div>
                  <div className="gap-item-desc">{g.detail}</div>
                </div>
              </div>
            ))}

            {suggestions.length > 0 && (
              <div className="gap-suggestions">
                <h4>Suggestions for improvement</h4>
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">✅ {s}</div>
                ))}
              </div>
            )}
          </div>

          <div className="future-additions" style={{ marginTop: 20 }}>
            <div className="card-title">🚀 Recommended Learning Path</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '🧩', title: 'DSA Mastery', desc: 'LeetCode + HackerRank - 30 days', tag: 'Priority' },
                { icon: '💼', title: 'Internship Hunt', desc: 'LinkedIn, Internshala, Naukri', tag: 'Now' },
                { icon: '☁️', title: 'Cloud Basics', desc: 'AWS Free Tier - 2 weeks', tag: 'Next' },
                { icon: '🤝', title: 'Communication', desc: 'Public speaking & interviews', tag: 'Ongoing' },
              ].map((r, i) => (
                <div key={i} style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '3px 0' }}>{r.desc}</div>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{r.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
