import React from 'react';

export default function ReportsPage() {
  const reports = [
    { icon: '📊', title: 'Placement Summary Report', desc: 'Overall placement statistics for all batches', date: 'Mar 2026', status: 'Ready' },
    { icon: '📈', title: 'Trend Analysis Report',    desc: 'Year-over-year placement trends',             date: 'Mar 2026', status: 'Ready' },
    { icon: '🎯', title: 'Prediction Accuracy',      desc: 'Comparison of predictions vs actual outcomes', date: 'Mar 2026', status: 'Ready' },
    { icon: '🏢', title: 'Company-wise Report',      desc: 'Detailed breakdown by hiring company',         date: 'Feb 2026', status: 'Ready' },
    { icon: '🔍', title: 'Skill Gap Report',         desc: 'Skills most needed by placed students',        date: 'Feb 2026', status: 'Ready' },
    { icon: '📄', title: 'Resume Quality Report',    desc: 'Average resume scores and top keywords',       date: 'Mar 2026', status: 'New' },
  ];

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">📈 Reports & Analytics</div>
        <div className="topbar-right"><div className="avatar">AD</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {reports.map((r, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{r.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</span>
              <span className={`badge ${r.status === 'New' ? 'badge-purple' : 'badge-green'}`}>{r.status}</span>
            </div>
            <button className="btn btn-outline" style={{ marginTop: 14, width: '100%', fontSize: 13, padding: '8px' }}>
              📥 Download
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">📊 Key Metrics Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Reports Generated', value: '24', icon: '📄', color: '#3b82f6' },
            { label: 'Avg Placement Rate',        value: '72%', icon: '🎯', color: '#22c55e' },
            { label: 'Avg Resume Score',           value: '58/100', icon: '📊', color: '#a855f7' },
            { label: 'Students Predicted',         value: '850+', icon: '🔮', color: '#f59e0b' }
          ].map((m, i) => (
            <div key={i} style={{ padding: 16, background: 'var(--bg-card-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
