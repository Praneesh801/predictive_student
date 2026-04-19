import React, { useState, useRef } from 'react';
import { uploadResume, scoreResumeText } from '../services/api';

const BREAKDOWN_COLORS = {
  education: '#3b82f6', technicalSkills: '#22c55e', experience: '#a855f7',
  projects: '#f59e0b', certifications: '#06b6d4', softSkills: '#ec4899'
};

const BREAKDOWN_MAX = {
  education: 20, technicalSkills: 30, experience: 20, projects: 15, certifications: 10, softSkills: 5
};

const BREAKDOWN_LABELS = {
  education: 'Education', technicalSkills: 'Technical Skills', experience: 'Experience',
  projects: 'Projects', certifications: 'Certifications', softSkills: 'Soft Skills'
};

const FUTURE_FEATURES = [
  { icon: '🤖', title: 'AI Resume Rewriter', desc: 'Let AI rewrite your resume for specific job roles', tag: 'Coming Soon' },
  { icon: '💼', title: 'Job Match Score', desc: 'Match your resume against live job descriptions', tag: 'Coming Soon' },
  { icon: '🌐', title: 'LinkedIn Optimizer', desc: 'Suggest improvements for your LinkedIn profile', tag: 'Coming Soon' },
  { icon: '📧', title: 'Cover Letter Gen', desc: 'Auto-generate tailored cover letters', tag: 'Coming Soon' },
  { icon: '📊', title: 'Industry Benchmark', desc: 'Compare your resume against top candidates', tag: 'Coming Soon' },
  { icon: '🎯', title: 'ATS Optimizer', desc: 'Optimize resume for Applicant Tracking Systems', tag: 'Coming Soon' },
];

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'text'
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragover, setDragover] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['.pdf', '.txt', '.doc', '.docx'];
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) return setError('Only PDF, TXT, DOC, DOCX files allowed');
    if (f.size > 5 * 1024 * 1024) return setError('File must be under 5MB');
    setFile(f);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragover(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    setError(''); setResult(null); setProgress(0);

    if (mode === 'upload') {
      if (!file) return setError('Please select a resume file');
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append('resume', file);
        fd.append('studentName', studentName || 'Anonymous');
        const r = await uploadResume(fd, (p) => setProgress(p));
        setResult(r.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Upload failed. Is the backend running?');
      } finally { setLoading(false); setProgress(0); }
    } else {
      if (!textInput.trim()) return setError('Please paste your resume text');
      setLoading(true);
      try {
        const r = await scoreResumeText(textInput, studentName || 'Anonymous');
        setResult(r.data);
      } catch { setError('Scoring failed. Is the backend running?'); }
      finally { setLoading(false); }
    }
  };

  const score = result?.score || 0;
  const grade = result?.grade || '';
  const scoreClass = score >= 70 ? 'high' : score >= 45 ? 'mid' : 'low';
  const scoreColor = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">📄 Resume Analyzer & Score</div>
        <div className="topbar-right"><div className="avatar">AD</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 24, alignItems: 'start' }}>
        {/* LEFT: Upload Section */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">📤 Upload Resume</div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['upload', 'text'].map(m => (
                <button key={m} onClick={() => { setMode(m); setResult(null); setError(''); }}
                  className={`btn ${mode === m ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '8px 20px', fontSize: 13 }}>
                  {m === 'upload' ? '📁 File Upload' : '📝 Paste Text'}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Your Name (optional)</label>
              <input className="form-control" placeholder="Enter your name" value={studentName}
                onChange={e => setStudentName(e.target.value)} />
            </div>

            {mode === 'upload' ? (
              <div
                className={`upload-zone${dragover ? ' dragover' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragover(true); }}
                onDragLeave={() => setDragover(false)}
                onDrop={handleDrop}
              >
                <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" hidden
                  onChange={e => handleFile(e.target.files[0])} />
                <div className="upload-icon">{file ? '📄' : '☁️'}</div>
                <div className="upload-title">
                  {file ? file.name : 'Drop your resume here'}
                </div>
                <div className="upload-subtitle">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB — Click to change`
                    : 'PDF, TXT, DOC, DOCX • Max 5MB'}
                </div>
                {file && (
                  <div style={{ marginTop: 10 }}>
                    <span className="badge badge-green">✅ File Ready</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Paste Resume Text</label>
                <textarea className="form-control" rows={12} placeholder="Paste your full resume content here..."
                  value={textInput} onChange={e => setTextInput(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {textInput.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            )}

            {error && <div className="alert alert-error" style={{ marginTop: 12 }}>⚠️ {error}</div>}

            {loading && progress > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Uploading... {progress}%</div>
                <div className="progress"><div className="progress-bar" style={{ width: `${progress}%`, background: 'var(--primary)' }}></div></div>
              </div>
            )}

            <button className="btn btn-primary btn-full" style={{ marginTop: 16 }}
              onClick={handleAnalyze} disabled={loading}>
              {loading ? <><span className="spinner"></span> Analyzing Resume...</> : '🚀 Analyze Resume'}
            </button>
          </div>

          {/* Tips Card */}
          <div className="card">
            <div className="card-title">💡 Resume Tips</div>
            {[
              { tip: 'Use action verbs: Built, Led, Developed, Managed' },
              { tip: 'Quantify achievements: "Improved performance by 40%"' },
              { tip: 'Include GitHub links and live project demos' },
              { tip: 'Tailor your resume for each job application' },
              { tip: 'Keep it to 1-2 pages for freshers' }
            ].map((t, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                <span>💎</span>{t.tip}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Results Section */}
        <div>
          {!result ? (
            <div className="card" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <div className="empty-text">Upload a resume to see your score</div>
                <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>
                  We'll analyze it across 6 categories and give you actionable feedback
                </div>
              </div>
            </div>
          ) : (
            <div className="score-section fade-in">
              {/* Score Ring */}
              <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
                <div className="card-title">{result.studentName}'s Resume Score</div>
                <div className="score-ring-container">
                  <div className={`score-ring ${scoreClass}`}>
                    <div className="score-number" style={{ color: scoreColor }}>{score}</div>
                    <div className="score-label">out of 100</div>
                    <div className="score-grade" style={{ color: scoreColor }}>{grade}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span className={`badge ${score >= 70 ? 'badge-green' : score >= 45 ? 'badge-yellow' : 'badge-red'}`} style={{ fontSize: 13, padding: '5px 16px' }}>
                    {score >= 70 ? '🌟 Strong Resume' : score >= 45 ? '⚡ Average Resume' : '⚠️ Needs Work'}
                  </span>
                  {result.textExtracted === false && (
                    <span className="badge badge-yellow">⚠️ PDF parsed (text limited)</span>
                  )}
                </div>

                {/* Keyword Pills */}
                {result.keywords?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Detected Keywords</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {result.keywords.map((k, i) => <span key={i} className="skill-tag">{k}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Score Breakdown */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">📊 Score Breakdown</div>
                <div className="score-breakdown">
                  {result.scoreBreakdown && Object.entries(result.scoreBreakdown).map(([key, val]) => (
                    <div key={key} className="breakdown-item">
                      <div className="breakdown-label">{BREAKDOWN_LABELS[key]}</div>
                      <div className="breakdown-bar-row">
                        <div className="breakdown-bar">
                          <div className="breakdown-fill"
                            style={{ width: `${(val / BREAKDOWN_MAX[key]) * 100}%`, background: BREAKDOWN_COLORS[key] }}></div>
                        </div>
                        <div className="breakdown-val" style={{ color: BREAKDOWN_COLORS[key] }}>
                          {val}/{BREAKDOWN_MAX[key]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">🎯 Detailed Feedback</div>

                {result.strengths?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', marginBottom: 8 }}>✅ Strengths</div>
                    <div className="feedback-grid" style={{ gridTemplateColumns: '1fr' }}>
                      {result.strengths.map((s, i) => (
                        <div key={i} className="feedback-card strength">
                          <span className="feedback-icon">✅</span>
                          <div className="feedback-text">{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.feedback?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--error)', marginBottom: 8 }}>⚠️ Areas to Improve</div>
                    <div className="feedback-grid" style={{ gridTemplateColumns: '1fr' }}>
                      {result.feedback.map((f, i) => (
                        <div key={i} className="feedback-card improve">
                          <span className="feedback-icon">⚠️</span>
                          <div className="feedback-text">{f}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.improvements?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--info)', marginBottom: 8 }}>💡 Action Items</div>
                    {result.improvements.map((item, i) => (
                      <div key={i} className="suggestion-item" style={{ padding: '6px 0' }}>→ {item}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Future Additions */}
          <div className="future-additions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>🚀 Future Additions</div>
              <span className="coming-soon">In Development</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Exciting features coming soon to supercharge your placement preparation
            </div>
            <div className="future-grid">
              {FUTURE_FEATURES.map((f, i) => (
                <div key={i} className="future-item">
                  <div className="future-item-icon">{f.icon}</div>
                  <div className="future-item-title">{f.title}</div>
                  <div className="future-item-desc">{f.desc}</div>
                  <div><span className="coming-soon">{f.tag}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
