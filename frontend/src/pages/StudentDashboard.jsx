import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { studentService } from '../services/api.js';
import '../styles/Dashboard.css';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getMyProfile();
      setStudentData(data);
    } catch (err) {
      setError(err.message || 'Failed to load student profile');
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEligibilityColor = (band) => {
    switch (band) {
      case 'High':
        return '#27ae60';
      case 'Medium':
        return '#f39c12';
      case 'Low':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getEligibilityEmoji = (band) => {
    switch (band) {
      case 'High':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getPlacementStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return '#27ae60';
      case 'rejected':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) return <div className="loading">Loading your profile...</div>;
  if (error) return <div className="loading" style={{ color: '#e74c3c' }}>Error: {error}</div>;
  if (!studentData) return <div className="loading">Create your student profile first</div>;

  return (
    <div className="student-dashboard">
      <h1>📚 Your Placement Dashboard</h1>

      {/* Welcome Section */}
      <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h2>Welcome, {user?.name}! 👋</h2>
        <p>Track your placement journey and improve your profile</p>
      </div>

      {/* Eligibility Band Card - Prominent */}
      <div className="eligibility-card" style={{ borderLeftColor: getEligibilityColor(studentData.eligibilityBand) }}>
        <div className="eligibility-header">
          <span className="eligibility-emoji">{getEligibilityEmoji(studentData.eligibilityBand)}</span>
          <div className="eligibility-info">
            <h3>Placement Eligibility</h3>
            <p className="eligibility-band" style={{ color: getEligibilityColor(studentData.eligibilityBand) }}>
              {studentData.eligibilityBand} Band
            </p>
          </div>
          <div className="probability-meter">
            <div className="probability-label">Placement Probability</div>
            <div className="probability-bar">
              <div 
                className="probability-fill" 
                style={{ 
                  width: `${(studentData.predictedPlacementProbability || 0) * 100}%`,
                  backgroundColor: getEligibilityColor(studentData.eligibilityBand)
                }}
              />
            </div>
            <div className="probability-value">{(studentData.predictedPlacementProbability * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>📋 Status</h4>
          <p style={{ color: getPlacementStatusColor(studentData.placementStatus) }} className="stat-value">
            {studentData.placementStatus === 'placed' ? '✓ Placed' : 
             studentData.placementStatus === 'rejected' ? '✗ Rejected' : 
             'Pending'}
          </p>
        </div>

        <div className="stat-card">
          <h4>🎓 CGPA</h4>
          <p className="stat-value">{studentData.cgpa || 'N/A'}</p>
        </div>

        <div className="stat-card">
          <h4>💼 Offers</h4>
          <p className="stat-value">{studentData.companyOffers?.length || 0}</p>
        </div>

        <div className="stat-card">
          <h4>💻 Skills</h4>
          <p className="stat-value">{studentData.technicalSkills?.length || 0}</p>
        </div>
      </div>

      {/* Academic Profile */}
      <div className="dashboard-section">
        <h3>📚 Academic Profile</h3>
        <div className="profile-grid">
          <div className="profile-item">
            <label>Roll Number</label>
            <p>{studentData.rollNumber}</p>
          </div>
          <div className="profile-item">
            <label>Department</label>
            <p>{studentData.department}</p>
          </div>
          <div className="profile-item">
            <label>Current Year/Semester</label>
            <p>{studentData.currentYear || 'N/A'} / Sem {studentData.currentSemester || 'N/A'}</p>
          </div>
          <div className="profile-item">
            <label>Arrears</label>
            <p>{studentData.arrearCount || 0}</p>
          </div>
          <div className="profile-item">
            <label>10th Percentage</label>
            <p>{studentData.tenthPercentage || 'N/A'}%</p>
          </div>
          <div className="profile-item">
            <label>12th Percentage</label>
            <p>{studentData.twelfthPercentage || 'N/A'}%</p>
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="dashboard-section">
        <h3>💻 Skills & Experience</h3>
        <div className="skills-grid">
          <div className="skill-box">
            <h4>Technical Skills</h4>
            {studentData.technicalSkills?.length > 0 ? (
              <div className="skill-tags">
                {studentData.technicalSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="no-data">No skills added yet</p>
            )}
          </div>

          <div className="skill-box">
            <h4>Certifications</h4>
            {studentData.certifications?.length > 0 ? (
              <div className="skill-tags">
                {studentData.certifications.map((cert, idx) => (
                  <span key={idx} className="skill-tag cert">{cert}</span>
                ))}
              </div>
            ) : (
              <p className="no-data">No certifications yet</p>
            )}
          </div>

          <div className="skill-box">
            <h4>Experience</h4>
            <p><strong>Internships:</strong> {studentData.internships || 0}</p>
            <p><strong>Projects:</strong> {studentData.projects?.length || 0}</p>
          </div>

          <div className="skill-box">
            <h4>Skill Levels</h4>
            <p><strong>Coding:</strong> {studentData.codingSkillLevel || 'Average'}</p>
            <p><strong>Communication:</strong> {studentData.communicationSkillLevel || 'Average'}</p>
            <p><strong>Aptitude:</strong> {studentData.aptitudeSkillLevel || 'Average'}</p>
          </div>
        </div>
      </div>

      {/* Company Offers */}
      {studentData.companyOffers?.length > 0 && (
        <div className="dashboard-section">
          <h3>💼 Company Offers</h3>
          <div className="offers-table">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Salary (LPA)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {studentData.companyOffers.map((offer, idx) => (
                  <tr key={idx}>
                    <td><strong>{offer.company}</strong></td>
                    <td>{offer.position}</td>
                    <td>{offer.lpa ? `${offer.lpa} LPA` : (offer.salary ? `₹${offer.salary?.toLocaleString()}` : 'N/A')}</td>
                    <td>
                      <span className={`status-badge ${offer.status}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td>{new Date(offer.offerDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Placement Status */}
      {studentData.placementStatus === 'placed' && (
        <div className="dashboard-section placed-section">
          <h3>✅ Placed Successfully!</h3>
          <div className="placed-info">
            <div className="placed-item">
              <label>Company</label>
              <p className="placed-value">{studentData.placedCompany}</p>
            </div>
            <div className="placed-item">
              <label>Position</label>
              <p className="placed-value">{studentData.placedPosition}</p>
            </div>
            <div className="placed-item">
              <label>Salary (LPA)</label>
              <p className="placed-value">₹{studentData.placedSalary?.toLocaleString()}</p>
            </div>
            <div className="placed-item">
              <label>Date</label>
              <p className="placed-value">{new Date(studentData.placedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations for Improvement */}
      {studentData.eligibilityBand !== 'High' && (
        <div className="dashboard-section recommendations">
          <h3>📈 Recommendations for Improvement</h3>
          <ul className="recommendations-list">
            {studentData.eligibilityBand === 'Low' && (
              <>
                <li>🎯 Focus on improving your CGPA to at least 7.0</li>
                <li>💻 Learn at least 3-4 in-demand programming languages</li>
                <li>🔧 Build 2-3 real-world projects and showcase them</li>
              </>
            )}
            {(!studentData.technicalSkills || studentData.technicalSkills.length < 3) && (
              <li>💡 Develop more technical skills in JavaScript, Python, or Java</li>
            )}
            {(!studentData.certifications || studentData.certifications.length === 0) && (
              <li>📜 Complete relevant industry certifications (AWS, Azure, etc.)</li>
            )}
            {(!studentData.internships || studentData.internships === 0) && (
              <li>🏢 Get hands-on experience through internships</li>
            )}
            {studentData.communicationSkillLevel === 'Poor' || studentData.communicationSkillLevel === 'Average' && (
              <li>🗣️ Improve communication skills through group discussions</li>
            )}
            {studentData.mockInterviewPerformance < 60 && (
              <li>🎤 Practice mock interviews to improve interview skills</li>
            )}
          </ul>
        </div>
      )}

      {studentData.eligibilityBand === 'High' && (
        <div className="dashboard-section success">
          <h3>🌟 Great Profile!</h3>
          <p>Your profile is strong. Keep applying for placements and maintain your current performance!</p>
        </div>
      )}
    </div>
  );
};
