import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { analyticsService } from '../services/api.js';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [placementStats, setPlacementStats] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analytics, placement, student] = await Promise.all([
        analyticsService.getPlacementAnalytics(),
        analyticsService.getPlacementStats(),
        analyticsService.getStudentStats(),
      ]);
      setAnalyticsData(analytics);
      setPlacementStats(placement);
      setStudentStats(student);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Analytics...</div>;
  if (!analyticsData) return <div className="loading">No data available</div>;

  // Eligibility Band Distribution Chart
  const bandChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Student Distribution',
        data: [
          analyticsData.bandDistribution?.high || 0,
          analyticsData.bandDistribution?.medium || 0,
          analyticsData.bandDistribution?.low || 0,
        ],
        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
        borderColor: ['#229954', '#d68910', '#c0392b'],
        borderWidth: 2,
      },
    ],
  };

  // Placement Status Chart
  const placementChartData = {
    labels: ['Placed', 'Not Placed', 'Rejected'],
    datasets: [
      {
        label: 'Placement Status',
        data: [
          analyticsData.placed || 0,
          analyticsData.notPlaced || 0,
          analyticsData.rejected || 0,
        ],
        backgroundColor: ['#3498db', '#95a5a6', '#e74c3c'],
        borderColor: ['#2980b9', '#7f8c8d', '#c0392b'],
        borderWidth: 2,
      },
    ],
  };

  // Top Companies Chart
  const topCompaniesData = analyticsData.topCompanies && analyticsData.topCompanies.length > 0 ? {
    labels: analyticsData.topCompanies.map(c => c.name),
    datasets: [
      {
        label: 'Offers Count',
        data: analyticsData.topCompanies.map(c => c.offerCount),
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="admin-dashboard">
      <h1>📊 Placement Analytics Dashboard</h1>

      {/* Key Statistics */}
      <div className="stats-grid">
        <div className="stat-card high-band">
          <div className="stat-header">🟢 High Eligibility</div>
          <p className="stat-value">{analyticsData.highBand || 0}</p>
          <p className="stat-label">{analyticsData.bandDistribution?.high || 0}%</p>
        </div>
        <div className="stat-card medium-band">
          <div className="stat-header">🟡 Medium Eligibility</div>
          <p className="stat-value">{analyticsData.mediumBand || 0}</p>
          <p className="stat-label">{analyticsData.bandDistribution?.medium || 0}%</p>
        </div>
        <div className="stat-card low-band">
          <div className="stat-header">🔴 Low Eligibility</div>
          <p className="stat-value">{analyticsData.lowBand || 0}</p>
          <p className="stat-label">{analyticsData.bandDistribution?.low || 0}%</p>
        </div>
        <div className="stat-card placement">
          <div className="stat-header">📈 Placement Rate</div>
          <p className="stat-value">{analyticsData.placementRate || 0}%</p>
          <p className="stat-label">{analyticsData.placed}/{analyticsData.total} Placed</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Eligibility Band Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={bandChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Placement Status Overview</h3>
          <div className="chart-wrapper">
            <Pie data={placementChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>

      {/* Top Companies */}
      {topCompaniesData && (
        <div className="chart-container full-width">
          <h3>Top Companies Hiring</h3>
          <div className="chart-wrapper">
            <Bar 
              data={topCompaniesData} 
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Placement Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>📋 Placement Summary</h3>
          <div className="summary-content">
            <div className="summary-row">
              <span>Total Students:</span>
              <strong>{analyticsData.total || 0}</strong>
            </div>
            <div className="summary-row">
              <span>Placed Students:</span>
              <strong className="green">{analyticsData.placed || 0}</strong>
            </div>
            <div className="summary-row">
              <span>Not Placed:</span>
              <strong>{analyticsData.notPlaced || 0}</strong>
            </div>
            <div className="summary-row">
              <span>Rejected:</span>
              <strong className="red">{analyticsData.rejected || 0}</strong>
            </div>
            <div className="summary-row">
              <span>Average LPA:</span>
              <strong>{analyticsData.averageLPA?.toFixed(2) || 0} LPA</strong>
            </div>
            <div className="summary-row">
              <span>Average Salary:</span>
              <strong>₹{analyticsData.averageSalary?.toLocaleString() || 0}</strong>
            </div>
          </div>
        </div>

        {/* Top Offers */}
        {analyticsData.topOffers && analyticsData.topOffers.length > 0 && (
          <div className="summary-card">
            <h3>💼 Top Offers</h3>
            <div className="offers-list">
              {analyticsData.topOffers.map((offer, idx) => (
                <div key={idx} className="offer-item">
                  <span className="company-name">{offer.company}</span>
                  <span className="position">{offer.position}</span>
                  <span className="salary">{offer.lpa ? `${offer.lpa} LPA` : `₹${offer.salary?.toLocaleString()}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Offers Table */}
      {analyticsData.topCompanies && analyticsData.topCompanies.length > 0 && (
        <div className="companies-section">
          <h3>🏢 Top Hiring Companies</h3>
          <table className="companies-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Offers</th>
                <th>Avg LPA</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topCompanies.map((company, idx) => (
                <tr key={idx}>
                  <td>{company.name}</td>
                  <td>{company.offerCount}</td>
                  <td>{company.avgLPA?.toFixed(2) || 0} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
