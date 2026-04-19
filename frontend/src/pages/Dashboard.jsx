import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend
} from 'chart.js';
import { getPlacementStats } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'top', labels: { font: { family: 'Inter', size: 11 } } } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.04)' } } }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacementStats()
      .then(r => setStats(r.data))
      .catch(() => setStats({
        total: 0, placed: 0, notPlaced: 0, accuracy: 0,
        trends: []
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <div className="spinner" style={{ borderTopColor: '#2e3daa', borderColor: 'rgba(46,61,170,0.2)', width: 40, height: 40 }}></div>
    </div>
  );

  const batches = stats?.trends?.map(t => t.batch) || [];
  const placedData = stats?.trends?.map(t => t.placed) || [];
  const notPlacedData = stats?.trends?.map(t => (t.total - t.placed)) || [];
  const rateData = stats?.trends?.map(t => t.rate || Math.round((t.placed / t.total) * 100)) || [];

  const barData = {
    labels: batches,
    datasets: [
      { label: 'Placed',     data: placedData,    backgroundColor: '#3b82f6', borderRadius: 6 },
      { label: 'Not Placed', data: notPlacedData, backgroundColor: '#f9a8d4', borderRadius: 6 }
    ]
  };

  const lineData = {
    labels: batches,
    datasets: [
      { label: 'Placement Rate', data: rateData,  borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', tension: 0.4, fill: true },
      { label: 'No. of Students', data: placedData, borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.05)', tension: 0.4, fill: false }
    ]
  };

  const statCards = [
    { label: 'Total Students',   value: stats?.total || 0,    icon: '👥', color: 'icon-blue',   trend: '0%', pos: true },
    { label: 'Placed Students',   value: stats?.placed || 0,   icon: '✅', color: 'icon-green',  trend: '0%',  pos: true },
    { label: 'Not Placed',        value: stats?.notPlaced || 0, icon: '❌', color: 'icon-red',    trend: '0%',  pos: false },
    { label: 'Accuracy',          value: `${stats?.accuracy || 0}%`, icon: '🎯', color: 'icon-purple', trend: '0%', pos: true }
  ];

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">🎓 Predictive Student Placement</div>
        <div className="topbar-right">
          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Search..." readOnly />
          </div>
          <div className="avatar">AD</div>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
              <span className="stat-card-label">{s.label}</span>
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-footer">
              <span style={{ color: s.pos ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{s.trend}</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last year</span>
              {s.pos ? <span>✅</span> : <span>⚠️</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-title">📊 Placement Statistics</div>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="card">
          <div className="card-title">📈 Placement Trends</div>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">🔮 Quick Insights</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: '🏆', label: 'Top Skills', value: 'Python, React, Java', color: '#3b82f6' },
            { icon: '🏢', label: 'Top Companies', value: 'TCS, Infosys, Wipro', color: '#22c55e' },
            { icon: '💰', label: 'Avg Package', value: '₹6.2 LPA', color: '#a855f7' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--bg-card-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
