import React, { useState } from 'react';
import { predictPlacement, scoreResumeText, uploadResume } from '../services/api';

/* ─── Tutorial database: weak area → weekly plan ─── */
const TUTORIALS = {
  dsa: {
    title: 'Data Structures & Algorithms',
    icon: '🧩',
    weeks: [
      { week: 1, topic: 'Arrays, Strings & Time Complexity', resources: [
        { label: 'Arrays & Strings – Striver (YouTube)', url: 'https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz' },
        { label: 'Big-O Notation – CS Dojo', url: 'https://youtu.be/D6xkbGLQesk' },
        { label: 'LeetCode Easy Problems (Arrays)', url: 'https://leetcode.com/tag/array/' },
      ]},
      { week: 2, topic: 'Linked Lists, Stacks & Queues', resources: [
        { label: 'Linked Lists – Abdul Bari', url: 'https://youtu.be/Ast5sKQXZDU' },
        { label: 'Stack & Queue – CodeWithHarry', url: 'https://youtu.be/2Y7dk9pNVcc' },
        { label: 'LeetCode Linked List Problems', url: 'https://leetcode.com/tag/linked-list/' },
      ]},
      { week: 3, topic: 'Trees, Graphs & Recursion', resources: [
        { label: 'Binary Trees – Take U Forward', url: 'https://youtu.be/fAAZixBzIAI' },
        { label: 'Graph Algorithms – Striver', url: 'https://youtu.be/0TgrkSNjVGg' },
        { label: 'Recursion & Backtracking', url: 'https://youtu.be/M2uO2nMT0Bk' },
      ]},
      { week: 4, topic: 'Dynamic Programming & Mock Tests', resources: [
        { label: 'DP Playlist – Aditya Verma', url: 'https://youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go' },
        { label: 'GeeksForGeeks DSA Practice', url: 'https://practice.geeksforgeeks.org/' },
        { label: 'HackerRank Interview Prep Kit', url: 'https://www.hackerrank.com/interview/interview-preparation-kit' },
      ]},
    ],
  },
  skills: {
    title: 'Technical Skills (Programming)',
    icon: '💻',
    weeks: [
      { week: 1, topic: 'Python Fundamentals', resources: [
        { label: 'Python for Beginners – Programming with Mosh', url: 'https://youtu.be/_uQrJ0TkZlc' },
        { label: 'Python Tutorial – CS50P (Harvard)', url: 'https://youtu.be/nLRL_NcnK-4' },
        { label: 'HackerRank Python Practice', url: 'https://www.hackerrank.com/domains/python' },
      ]},
      { week: 2, topic: 'Web Development (HTML/CSS/JS)', resources: [
        { label: 'Full Web Dev Bootcamp – Traversy Media', url: 'https://youtu.be/UB1O30fR-EE' },
        { label: 'JavaScript Crash Course', url: 'https://youtu.be/hdI2bqOjy3c' },
        { label: 'The Odin Project (Free)', url: 'https://www.theodinproject.com/' },
      ]},
      { week: 3, topic: 'SQL & Databases', resources: [
        { label: 'SQL Tutorial – freeCodeCamp', url: 'https://youtu.be/HXV3zeQKqGY' },
        { label: 'MySQL Crash Course – Traversy', url: 'https://youtu.be/9ylj9NR0Lcg' },
        { label: 'SQLZOO Practice', url: 'https://sqlzoo.net/' },
      ]},
      { week: 4, topic: 'React / Node.js Basics', resources: [
        { label: 'React.js Tutorial – Codevolution', url: 'https://youtu.be/QFaFIcGhPoM' },
        { label: 'Node.js Crash Course – Traversy', url: 'https://youtu.be/fBNz5xF-Kx4' },
        { label: 'Full Stack Open (Free University Course)', url: 'https://fullstackopen.com/' },
      ]},
    ],
  },
  internship: {
    title: 'Internship & Work Experience',
    icon: '💼',
    weeks: [
      { week: 1, topic: 'Build a Strong Portfolio Project', resources: [
        { label: 'How to Build Portfolio Projects – Fireship', url: 'https://youtu.be/oC483DTjRXU' },
        { label: '10 Project Ideas for Beginners', url: 'https://youtu.be/G0jO8kUrg-I' },
        { label: 'GitHub Portfolio Setup Guide', url: 'https://youtu.be/G-EGDH50hGE' },
      ]},
      { week: 2, topic: 'Find & Apply for Internships', resources: [
        { label: 'Internship Search – Internshala', url: 'https://internshala.com/' },
        { label: 'LinkedIn Internship Search Tips', url: 'https://youtu.be/rGqc2VZYB78' },
        { label: 'Naukri Campus – Fresher Jobs', url: 'https://campus.naukri.com/' },
      ]},
      { week: 3, topic: 'Cold Emailing & Networking', resources: [
        { label: 'How to Cold Email for Internships', url: 'https://youtu.be/K6bBkpSoqNk' },
        { label: 'LinkedIn Networking Guide', url: 'https://youtu.be/SG5ROEZzt1Y' },
        { label: 'Email Templates for Internship', url: 'https://resources.workable.com/internship-acceptance-email-templates' },
      ]},
      { week: 4, topic: 'Open Source Contribution', resources: [
        { label: 'First Open Source Contribution – GitHub', url: 'https://youtu.be/c6b6B9oN4Vg' },
        { label: 'Good First Issues – goodfirstissue.dev', url: 'https://goodfirstissue.dev/' },
        { label: 'Google Summer of Code Guide', url: 'https://summerofcode.withgoogle.com/' },
      ]},
    ],
  },
  communication: {
    title: 'Communication & Soft Skills',
    icon: '🗣️',
    weeks: [
      { week: 1, topic: 'English Communication Basics', resources: [
        { label: 'Spoken English Course – Learnex', url: 'https://youtube.com/playlist?list=PLmwr9polMHwsR35rD9Q22ip85tgzZdl2n' },
        { label: 'Business Communication – Coursera', url: 'https://www.coursera.org/learn/wharton-communication-skills' },
        { label: 'Daily English Practice App – Duolingo', url: 'https://www.duolingo.com/' },
      ]},
      { week: 2, topic: 'Presentation & Public Speaking', resources: [
        { label: 'TED Talk: Art of Public Speaking', url: 'https://youtu.be/tShavGuo0_E' },
        { label: 'How to Present with Confidence', url: 'https://youtu.be/AykYRO5d_lI' },
        { label: 'Toastmasters International', url: 'https://www.toastmasters.org/' },
      ]},
      { week: 3, topic: 'Interview Communication Skills', resources: [
        { label: 'HR Interview Preparation – Indiabix', url: 'https://www.indiabix.com/hr-interview/questions-and-answers/' },
        { label: 'Tell Me About Yourself – Answer Guide', url: 'https://youtu.be/kayOhGRcNt4' },
        { label: 'Mock Interview Practice – Pramp', url: 'https://www.pramp.com/' },
      ]},
      { week: 4, topic: 'Group Discussion & Leadership', resources: [
        { label: 'GD Tips & Topics – MB', url: 'https://youtu.be/a_1MvVMeUQI' },
        { label: 'Leadership Skills – MindTools', url: 'https://www.mindtools.com/leadership-skills' },
        { label: 'Personality Development Course', url: 'https://youtu.be/0lLllXH9X5Y' },
      ]},
    ],
  },
  projects: {
    title: 'Projects & Portfolio',
    icon: '🛠️',
    weeks: [
      { week: 1, topic: 'Plan & Scope a Real Project', resources: [
        { label: '10 Project Ideas for CS Students', url: 'https://youtu.be/TNzMGex7nMo' },
        { label: 'How to Document Projects Well', url: 'https://youtu.be/a_1MvVMeUQI' },
        { label: 'Project Ideas That Impress Recruiters', url: 'https://youtu.be/G0jO8kUrg-I' },
      ]},
      { week: 2, topic: 'Build & Deploy a Web Project', resources: [
        { label: 'Deploy React App – Vercel', url: 'https://vercel.com/docs' },
        { label: 'Free Hosting – Netlify Guide', url: 'https://docs.netlify.com/' },
        { label: 'Full Stack Project Tutorial', url: 'https://youtu.be/mrHNSanmqQ4' },
      ]},
      { week: 3, topic: 'GitHub & Open Source', resources: [
        { label: 'Git & GitHub Crash Course', url: 'https://youtu.be/RGOj5yH7evk' },
        { label: 'How to Write a Good README', url: 'https://youtu.be/E6NO0rgFub4' },
        { label: 'GitHub Profile Setup for Recruiters', url: 'https://youtu.be/G-EGDH50hGE' },
      ]},
      { week: 4, topic: 'Machine Learning / Data Project', resources: [
        { label: 'ML Project for Beginners – Krish Naik', url: 'https://youtu.be/bPrmA1SEN2k' },
        { label: 'Kaggle for Beginners', url: 'https://www.kaggle.com/learn' },
        { label: 'End-to-End ML Project Tutorial', url: 'https://youtu.be/XNY5BOg2SN8' },
      ]},
    ],
  },
  cgpa: {
    title: 'Academic Performance (CGPA Boost)',
    icon: '📚',
    weeks: [
      { week: 1, topic: 'Study Techniques & Time Management', resources: [
        { label: 'How to Study Effectively – Thomas Frank', url: 'https://youtu.be/IlU-zDU6aQ0' },
        { label: 'Pomodoro Study Technique', url: 'https://youtu.be/mNBmG24djoY' },
        { label: 'Free Study Timer – Focusmate', url: 'https://www.focusmate.com/' },
      ]},
      { week: 2, topic: 'Core CS Subjects Revision', resources: [
        { label: 'OS – Gate Smashers', url: 'https://youtube.com/playlist?list=PLxCzCOWd3aiGz9donHRxN4Zi0qLnzdZrt' },
        { label: 'DBMS – Gate Smashers', url: 'https://youtube.com/playlist?list=PLxCzCOWd3aiHxd_dGImFc7vN2TXJuQobM' },
        { label: 'CN – Gate Smashers', url: 'https://youtube.com/playlist?list=PLxCzCOWd3aiGFZKhOvS9-5PhHytW6o5vv' },
      ]},
      { week: 3, topic: 'Previous Year Papers & Mock Exams', resources: [
        { label: 'GeeksForGeeks Asked Questions', url: 'https://www.geeksforgeeks.org/last-minute-notes/' },
        { label: 'NPTEL Online Exams', url: 'https://onlinecourses.nptel.ac.in/' },
        { label: 'Unacademy GATE Prep', url: 'https://unacademy.com/goal/gate-cs-it/HSSC' },
      ]},
      { week: 4, topic: 'Certifications to Boost Profile', resources: [
        { label: 'Google IT Support Certificate', url: 'https://www.coursera.org/professional-certificates/google-it-support' },
        { label: 'AWS Cloud Practitioner (Free)', url: 'https://explore.skillbuilder.aws/' },
        { label: 'NPTEL Certifications (With Certificate)', url: 'https://nptel.ac.in/' },
      ]},
    ],
  },
};

/* ─── Determine which tutorial areas the student needs ─── */
function getWeakAreas({ cgpa, skills, internships, projects, communicationLevel }) {
  const areas = [];
  if (parseFloat(cgpa) < 6.5) areas.push('cgpa');
  if ((skills?.length || 0) < 3) areas.push('skills');
  if (!skills?.some(s => ['DSA', 'Data Structures', 'C++', 'Algorithms'].includes(s))) areas.push('dsa');
  if ((internships || 0) === 0) areas.push('internship');
  if ((projects || 0) < 2) areas.push('projects');
  if ((communicationLevel || 5) < 6) areas.push('communication');
  // top 3 only
  return areas.slice(0, 3);
}

/* ─── Score calc (same as backend) ─── */
function calcScore(data) {
  const cgpaScore    = Math.min(parseFloat(data.cgpa || 0) / 10, 1) * 30;
  const twelfthScore = Math.min((data.twelfthPct || 60) / 100, 1) * 15;
  const tenthScore   = Math.min((data.tenthPct || 60) / 100, 1) * 10;
  const skillScore   = Math.min((data.skills?.length || 0) / 10, 1) * 20;
  const internScore  = Math.min((data.internships || 0) / 3, 1) * 15;
  const projScore    = Math.min((data.projects || 0) / 5, 1) * 10;
  return Math.round(cgpaScore + twelfthScore + tenthScore + skillScore + internScore + projScore);
}

const SKILL_OPTIONS = ['React', 'Python', 'Java', 'JavaScript', 'Node.js', 'SQL', 'MongoDB', 'DSA', 'C++', 'Angular', 'Machine Learning', 'Docker', 'AWS', 'Git', 'Django'];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function StudentAnalysisPage() {
  const [step, setStep] = useState(1); // 1=details, 2=resume, 3=result
  const [form, setForm] = useState({
    studentName: '', cgpa: '', tenthPct: '', twelfthPct: '',
    department: 'Computer Science', batch: '2024',
    internships: 0, projects: 1, communicationLevel: 5
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [resumeMode, setResumeMode] = useState('text'); // 'file' | 'text'
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // final combined result

  /* ── Skills ── */
  const addSkill = (s) => {
    const v = (s || skillInput).trim();
    if (v && !skills.includes(v)) setSkills(p => [...p, v]);
    setSkillInput('');
  };
  const removeSkill = (s) => setSkills(p => p.filter(x => x !== s));

  /* ── Step 1 → 2 validation ── */
  const goStep2 = () => {
    if (!form.studentName) return setError('Please enter your name');
    if (!form.cgpa || isNaN(form.cgpa)) return setError('Please enter a valid CGPA');
    setError(''); setStep(2);
  };

  /* ── Final Analyze ── */
  const handleAnalyze = async () => {
    setError(''); setLoading(true);
    try {
      let resumeScore = 0, resumeFeedback = [], resumeBreakdown = {};

      // Score resume
      if (resumeMode === 'text' && resumeText.trim()) {
        const r = await scoreResumeText(resumeText, form.studentName);
        resumeScore    = r.data.score;
        resumeFeedback = r.data.feedback || [];
        resumeBreakdown = r.data.scoreBreakdown || {};
      } else if (resumeMode === 'file' && resumeFile) {
        const fd = new FormData();
        fd.append('resume', resumeFile);
        fd.append('studentName', form.studentName);
        const r = await uploadResume(fd);
        resumeScore    = r.data.score;
        resumeFeedback = r.data.feedback || [];
        resumeBreakdown = r.data.scoreBreakdown || {};
      }

      // Academic score
      const academicScore = calcScore({ ...form, skills });
      // Combined score (60% academic, 40% resume)
      const combined = resumeScore > 0
        ? Math.round(academicScore * 0.6 + resumeScore * 0.4)
        : academicScore;

      const eligible = combined >= 50;
      const weakAreas = getWeakAreas({ ...form, skills });

      setResult({ academicScore, resumeScore, combined, eligible, weakAreas, resumeFeedback, resumeBreakdown });
      setStep(3);
    } catch (err) {
      // Fallback: use only academic score
      const academicScore = calcScore({ ...form, skills });
      const eligible = academicScore >= 50;
      const weakAreas = getWeakAreas({ ...form, skills });
      setResult({ academicScore, resumeScore: 0, combined: academicScore, eligible, weakAreas, resumeFeedback: [], resumeBreakdown: {} });
      setStep(3);
    } finally { setLoading(false); }
  };

  /* ══ RENDER ══ */
  return (
    <div className="fade-in">
      {/* ── Top bar ── */}
      <div className="topbar">
        <div className="topbar-title">🎓 Student Placement Analysis</div>
        <div className="topbar-right">
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            {['My Details', 'My Resume', 'Results'].map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: 12,
                    background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--border)',
                    color: step >= i + 1 ? '#fff' : 'var(--text-muted)'
                  }}>{step > i + 1 ? '✓' : i + 1}</div>
                  <span style={{ color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                </div>
                {i < 2 && <div style={{ width: 24, height: 2, background: step > i + 1 ? 'var(--success)' : 'var(--border)', borderRadius: 2 }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

      {/* ════ STEP 1 – Student Details ════ */}
      {step === 1 && (
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="fade-in">
          <div className="card">
            <div className="card-title">📋 Step 1 — Enter Your Details</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" placeholder="Amit Kumar"
                  value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-control" value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}>
                  {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'].map(d => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">CGPA (out of 10) *</label>
                <input className="form-control" type="number" min="0" max="10" step="0.1"
                  placeholder="8.5" value={form.cgpa}
                  onChange={e => setForm({ ...form, cgpa: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Batch / Year</label>
                <select className="form-control" value={form.batch}
                  onChange={e => setForm({ ...form, batch: e.target.value })}>
                  {['2024', '2025', '2026', '2027'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">10th Percentage (%)</label>
                <input className="form-control" type="number" min="0" max="100"
                  placeholder="85" value={form.tenthPct}
                  onChange={e => setForm({ ...form, tenthPct: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">12th Percentage (%)</label>
                <input className="form-control" type="number" min="0" max="100"
                  placeholder="88" value={form.twelfthPct}
                  onChange={e => setForm({ ...form, twelfthPct: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(press Enter to add)</span></label>
              <div className="tags-input" onClick={() => document.getElementById('sa-skill').focus()}>
                {skills.map(s => <span key={s} className="tag">{s}<button onClick={() => removeSkill(s)}>×</button></span>)}
                <input id="sa-skill" placeholder={skills.length === 0 ? 'Python, React, DSA...' : ''}
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addSkill())} />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {SKILL_OPTIONS.filter(s => !skills.includes(s)).slice(0, 9).map(s => (
                  <span key={s} onClick={() => addSkill(s)}
                    style={{ padding: '2px 10px', background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    + {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Internships Completed: <strong>{form.internships}</strong></label>
                <div className="slider-row"><span>0</span>
                  <input type="range" min="0" max="5" value={form.internships}
                    onChange={e => setForm({ ...form, internships: Number(e.target.value) })} />
                <span>5</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">Projects Built: <strong>{form.projects}</strong></label>
                <div className="slider-row"><span>0</span>
                  <input type="range" min="0" max="10" value={form.projects}
                    onChange={e => setForm({ ...form, projects: Number(e.target.value) })} />
                <span>10</span></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Communication Level: <strong>{form.communicationLevel}/10</strong></label>
              <div className="slider-row"><span>Low</span>
                <input type="range" min="0" max="10" value={form.communicationLevel}
                  onChange={e => setForm({ ...form, communicationLevel: Number(e.target.value) })} />
              <span>High</span></div>
            </div>

            <button className="btn btn-primary" style={{ float: 'right', minWidth: 160 }} onClick={goStep2}>
              Next: Upload Resume →
            </button>
          </div>
        </div>
      )}

      {/* ════ STEP 2 – Resume Upload ════ */}
      {step === 2 && (
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="fade-in">
          <div className="card">
            <div className="card-title">📄 Step 2 — Upload or Paste Your Resume</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['text', 'file'].map(m => (
                <button key={m} onClick={() => { setResumeMode(m); setError(''); }}
                  className={`btn ${resumeMode === m ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '8px 20px', fontSize: 13 }}>
                  {m === 'text' ? '📝 Paste Text' : '📁 Upload File'}
                </button>
              ))}
              <button className="btn" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1.5px solid var(--warning)', fontSize: 13, padding: '8px 20px' }}
                onClick={() => { setResumeMode('skip'); setError(''); }}>
                ⏭ Skip Resume
              </button>
            </div>

            {resumeMode === 'text' && (
              <>
                <div className="form-group">
                  <label className="form-label">Paste Your Resume Content</label>
                  <textarea className="form-control" rows={14}
                    placeholder={`Paste your complete resume here...\n\nExample:\nName: Amit Kumar\nCGPA: 8.5 from ABC University\nSkills: Python, React, JavaScript, SQL, DSA\nInternship: 6 months at TCS as Software Intern\nProjects: E-commerce website, ML Sentiment Analyzer\nCertifications: AWS Cloud Practitioner, NPTEL Python\nCommunication: Good presentation and teamwork skills`}
                    value={resumeText} onChange={e => setResumeText(e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }} />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {resumeText.split(/\s+/).filter(Boolean).length} words entered
                  </div>
                </div>
              </>
            )}

            {resumeMode === 'file' && (
              <div className="upload-zone" onClick={() => document.getElementById('sa-file').click()}>
                <input id="sa-file" type="file" accept=".pdf,.txt,.doc,.docx" hidden
                  onChange={e => setResumeFile(e.target.files[0])} />
                <div className="upload-icon">{resumeFile ? '📄' : '☁️'}</div>
                <div className="upload-title">{resumeFile ? resumeFile.name : 'Click to select your resume'}</div>
                <div className="upload-subtitle">{resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'PDF, TXT, DOC, DOCX • Max 5MB'}</div>
              </div>
            )}

            {resumeMode === 'skip' && (
              <div style={{ padding: 20, background: 'var(--warning-bg)', border: '1.5px solid var(--warning)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏭️</div>
                <div style={{ fontWeight: 600 }}>Skipping Resume Analysis</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Your eligibility will be based on your academic details only.<br/>
                  Adding a resume gives a more accurate result.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-full" onClick={handleAnalyze} disabled={loading}>
                {loading ? <><span className="spinner"></span> Analyzing...</> : '🚀 Analyze My Placement Eligibility'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ STEP 3 – Results ════ */}
      {step === 3 && result && (
        <div className="fade-in">
          {/* ── Verdict Banner ── */}
          <div style={{
            padding: '32px 40px', borderRadius: 'var(--radius-lg)', marginBottom: 24, textAlign: 'center',
            background: result.eligible
              ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,101,101,0.08))',
            border: `2px solid ${result.eligible ? 'var(--success)' : 'var(--error)'}`
          }}>
            <div style={{ fontSize: 56 }}>{result.eligible ? '🏆' : '❌'}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: result.eligible ? 'var(--success)' : 'var(--error)', margin: '8px 0' }}>
              {result.eligible ? 'PLACEMENT ELIGIBLE!' : 'NOT YET ELIGIBLE'}
            </div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              {result.eligible
                ? `Congratulations ${form.studentName}! You're on the right track. Keep improving to maximize your chances.`
                : `Don't worry ${form.studentName}! Follow the personalized learning plan below to become placement-ready in 4 weeks.`}
            </div>
          </div>

          {/* ── Score Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
            {[
              { label: 'Academic Score', value: result.academicScore, max: 100, icon: '📚', color: '#3b82f6' },
              { label: 'Resume Score',   value: result.resumeScore,   max: 100, icon: '📄', color: '#a855f7', note: result.resumeScore === 0 ? 'Skipped' : '' },
              { label: 'Combined Score', value: result.combined,      max: 100, icon: '🎯', color: result.eligible ? '#22c55e' : '#ef4444' }
            ].map((c, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 38, fontWeight: 800, color: c.color }}>{c.note || `${c.value}`}</div>
                {!c.note && (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>out of 100</div>
                    <div className="progress" style={{ marginTop: 10 }}>
                      <div className="progress-bar" style={{ width: `${c.value}%`, background: c.color }}></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── Resume Feedback (if available) ── */}
          {result.resumeFeedback?.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title">📝 Resume Feedback</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {result.resumeFeedback.map((f, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, display: 'flex', gap: 8 }}>
                    <span>⚠️</span>{f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── If NOT eligible → Weekly Tutorial Plan ── */}
          {!result.eligible && result.weakAreas?.length > 0 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>📅 Your Personalized 4-Week Learning Plan</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Based on your profile, focus on these {result.weakAreas.length} area{result.weakAreas.length > 1 ? 's' : ''} to become placement-ready
                </div>
              </div>

              {result.weakAreas.map(areaKey => {
                const area = TUTORIALS[areaKey];
                if (!area) return null;
                return (
                  <div key={areaKey} className="card" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <div style={{ fontSize: 36 }}>{area.icon}</div>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{area.title}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>4-week structured learning plan</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                      {area.weeks.map(w => (
                        <div key={w.week} style={{
                          padding: '16px 18px',
                          background: 'var(--bg-card-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '4px solid var(--primary)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <div style={{
                              background: 'var(--primary)', color: '#fff',
                              borderRadius: '50%', width: 26, height: 26,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 700, flexShrink: 0
                            }}>W{w.week}</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{w.topic}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {w.resources.map((r, ri) => (
                              <a key={ri} href={r.url} target="_blank" rel="noreferrer"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8,
                                  fontSize: 12.5, color: 'var(--accent)',
                                  textDecoration: 'none', padding: '5px 8px',
                                  borderRadius: 6, background: 'rgba(59,130,246,0.06)',
                                  border: '1px solid rgba(59,130,246,0.12)',
                                  transition: 'all 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}
                              >
                                <span>🔗</span> {r.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* ── Progress Tracker ── */}
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(46,61,170,0.06), rgba(168,85,247,0.06))', border: '1.5px solid rgba(46,61,170,0.2)' }}>
                <div className="card-title">🏁 Weekly Progress Tracker</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {['Week 1\nFoundations', 'Week 2\nDeep Dive', 'Week 3\nPractice', 'Week 4\nMock Tests'].map((w, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '16px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>
                        {['🌱', '🌿', '🌳', '🏆'][i]}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, whitespace: 'pre' }}>{w.split('\n')[0]}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{w.split('\n')[1]}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  💡 <strong>Tip:</strong> Spend <strong>2–3 hours daily</strong> following this plan. After 4 weeks, re-analyze your placement eligibility here!
                </div>
              </div>
            </div>
          )}

          {/* ── If ELIGIBLE ── */}
          {result.eligible && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.05))', border: '1.5px solid rgba(34,197,94,0.3)' }}>
              <div className="card-title">🚀 Next Steps to Maximize Your Placement Chances</div>
              {[
                { icon: '✅', tip: 'Keep your resume updated with latest projects and certifications' },
                { icon: '🎯', tip: 'Practice 2-3 LeetCode problems daily (focus on Medium difficulty)' },
                { icon: '🏢', tip: 'Register on TCS NextStep, Infosys Campus, Wipro NLTH portals' },
                { icon: '🗣️', tip: 'Practice mock interviews on Pramp.com or with peers' },
                { icon: '📜', tip: 'Complete at least one industry certification (AWS, Google, Microsoft)' },
                { icon: '🌐', tip: 'Build your LinkedIn profile and connect with company recruiters' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border-light)' : 'none', fontSize: 13.5, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span>{t.tip}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-outline" onClick={() => { setStep(1); setResult(null); setSkills([]); }}>
              🔄 Start New Analysis
            </button>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              📄 Update Resume & Re-analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
