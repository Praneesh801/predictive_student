import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { studentService } from '../services/api.js';
import '../styles/ProfileSetup.css';

// Calculate placement probability (mirroring backend logic)
const calculatePlacementProbability = (formData) => {
  // Academic Performance (35%)
  const cgpa = parseFloat(formData.cgpa) || 0;
  const tenth = parseFloat(formData.tenthPercentage) || 0;
  const twelfth = parseFloat(formData.twelfthPercentage) || 0;
  const avgAcademic = (cgpa / 10 + tenth / 100 + twelfth / 100) / 3;
  const academicScore = Math.min(1, avgAcademic) * 0.35;

  // Technical Skills (25%)
  const skillCount = formData.technicalSkills.split(',').filter(s => s.trim()).length;
  const coreKnowledge = { 'Poor': 0.2, 'Average': 0.5, 'Good': 0.8, 'Excellent': 1 }[formData.coreSubjectKnowledge] || 0.5;
  const skillScore = Math.min(1, (skillCount * 0.08 + coreKnowledge * 0.5)) * 0.25;

  // Experience (20%)
  const internships = Math.min(3, parseInt(formData.internships) || 0);
  const projects = formData.projects.split(',').filter(s => s.trim()).length;
  const expScore = Math.min(1, ((internships * 0.3 + projects * 0.25) / 2)) * 0.20;

  // Certifications (10%)
  const certs = formData.certifications.split(',').filter(s => s.trim()).length;
  const certScore = Math.min(1, certs * 0.3) * 0.10;

  // Soft Skills (15%)
  const skillMap = { 'Poor': 0.2, 'Average': 0.5, 'Good': 0.8, 'Excellent': 1 };
  const aptitude = skillMap[formData.aptitudeSkillLevel] || 0.5;
  const communication = skillMap[formData.communicationSkillLevel] || 0.5;
  const softSkills = skillMap[formData.softSkillsRating] || 0.5;
  const softSkillScore = ((aptitude + communication + softSkills) / 3) * 0.15;

  // Placement Preparation (10%)
  const mockScore = Math.min(1, (parseFloat(formData.mockInterviewPerformance) || 0) / 100);
  const resume = skillMap[formData.resumeQualityRating] || 0.5;
  const coding = skillMap[formData.codingSkillLevel] || 0.5;
  const prepScore = ((mockScore * 0.4 + resume * 0.3 + coding * 0.3) / 1) * 0.10;

  // Extra-Curricular (5%)
  const workshops = Math.min(5, parseInt(formData.workshopsHackathonsParticipation) || 0);
  const leadership = formData.leadershipExperience === 'yes' ? 0.5 : 0;
  const extraScore = Math.min(1, (workshops * 0.15 + leadership)) * 0.05;

  // Total Probability
  const totalProbability = Math.min(1, academicScore + skillScore + expScore + certScore + softSkillScore + prepScore + extraScore);

  // Eligibility Band
  let band = 'Low';
  if (totalProbability >= 0.75) band = 'High';
  else if (totalProbability >= 0.50) band = 'Medium';

  return { probability: totalProbability, band };
};

export const StudentProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  
  const [formData, setFormData] = useState({
    // Basic Info
    rollNumber: '',
    department: '',

    // Academic Details
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    diplomaPercentage: '',
    currentYear: '1',
    currentSemester: '1',
    arrearCount: '0',
    arrearHistory: '',

    // Skill Details
    technicalSkills: '',
    coreSubjectKnowledge: 'Average',
    certifications: '',
    internships: '0',
    projects: '',

    // Placement Preparation
    aptitudeSkillLevel: 'Average',
    communicationSkillLevel: 'Average',
    codingSkillLevel: 'Average',
    mockInterviewPerformance: '0',
    resumeQualityRating: 'Average',

    // Extra-Curricular
    leadershipExperience: 'no',
    workshopsHackathonsParticipation: '0',
    softSkillsRating: 'Average',
    areaOfInterest: '',

    // Placement History
    previousPlacementAttempts: '0',
    previousCompaniesApplied: '',
    placementDriveParticipation: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    
    // Calculate prediction without saving to DB
    const prediction = calculatePlacementProbability(formData);
    
    // Create preview student object
    const previewStudent = {
      rollNumber: formData.rollNumber,
      department: formData.department,
      cgpa: parseFloat(formData.cgpa) || 0,
      tenthPercentage: parseFloat(formData.tenthPercentage) || 0,
      twelfthPercentage: parseFloat(formData.twelfthPercentage) || 0,
      technicalSkills: formData.technicalSkills.split(',').map(s => s.trim()).filter(s => s),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
      internships: parseInt(formData.internships) || 0,
      projects: formData.projects.split(',').map(s => s.trim()).filter(s => s),
      aptitudeSkillLevel: formData.aptitudeSkillLevel,
      communicationSkillLevel: formData.communicationSkillLevel,
      codingSkillLevel: formData.codingSkillLevel,
      softSkillsRating: formData.softSkillsRating,
      workshopsHackathonsParticipation: parseInt(formData.workshopsHackathonsParticipation) || 0,
      mockInterviewPerformance: parseFloat(formData.mockInterviewPerformance) || 0,
      resumeQualityRating: formData.resumeQualityRating,
      predictedPlacementProbability: prediction.probability,
      eligibilityBand: prediction.band,
    };
    
    setPreviewData(previewStudent);
    setCurrentStep(6);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const data = {
        userId: user.id,
        rollNumber: formData.rollNumber,
        department: formData.department,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        tenthPercentage: formData.tenthPercentage ? parseFloat(formData.tenthPercentage) : undefined,
        twelfthPercentage: formData.twelfthPercentage ? parseFloat(formData.twelfthPercentage) : undefined,
        diplomaPercentage: formData.diplomaPercentage ? parseFloat(formData.diplomaPercentage) : undefined,
        currentYear: parseInt(formData.currentYear),
        currentSemester: parseInt(formData.currentSemester),
        arrearCount: parseInt(formData.arrearCount),
        arrearHistory: formData.arrearHistory.split(',').map(s => s.trim()).filter(s => s),
        technicalSkills: formData.technicalSkills.split(',').map(s => s.trim()).filter(s => s),
        coreSubjectKnowledge: formData.coreSubjectKnowledge,
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        internships: parseInt(formData.internships),
        projects: formData.projects.split(',').map(s => s.trim()).filter(s => s),
        aptitudeSkillLevel: formData.aptitudeSkillLevel,
        communicationSkillLevel: formData.communicationSkillLevel,
        codingSkillLevel: formData.codingSkillLevel,
        mockInterviewPerformance: formData.mockInterviewPerformance ? parseFloat(formData.mockInterviewPerformance) : 0,
        resumeQualityRating: formData.resumeQualityRating,
        leadershipExperience: formData.leadershipExperience === 'yes',
        workshopsHackathonsParticipation: parseInt(formData.workshopsHackathonsParticipation),
        softSkillsRating: formData.softSkillsRating,
        areaOfInterest: formData.areaOfInterest.split(',').map(s => s.trim()).filter(s => s),
        previousPlacementAttempts: parseInt(formData.previousPlacementAttempts),
        previousCompaniesApplied: formData.previousCompaniesApplied.split(',').map(s => s.trim()).filter(s => s),
        placementDriveParticipation: formData.placementDriveParticipation.split(',').map(s => s.trim()).filter(s => s),
      };

      const response = await studentService.createStudent(data);
      setAnalyzeResult({
        student: response.student,
        message: response.message,
      });
    } catch (error) {
      console.error('Error saving student profile:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    const titles = [
      '📋 Basic Information',
      '📚 Academic Details',
      '💻 Skills & Experience',
      '🎯 Placement Preparation',
      '⭐ Extra-Curricular & History',
      '💼 Company Offers (Optional)',
    ];
    return titles[currentStep - 1];
  };

  const getProgress = () => {
    if (currentStep === 7) return 100; // Preview step
    return (currentStep / 6) * 100;
  };

  // Show Full Analysis after successful save
  if (analyzeResult) {
    return <EligibilityAnalysis student={analyzeResult.student} />;
  }

  // Show Preview Analysis before saving
  if (previewData) {
    return (
      <PreviewAnalysis 
        student={previewData} 
        onSave={handleSaveProfile}
        onEdit={() => {
          setPreviewData(null);
          setCurrentStep(6);
        }}
        isSaving={loading}
      />
    );
  }

  return (
    <div className="profile-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h1>🎓 Complete Your Profile</h1>
          <p>Help us analyze your placement readiness</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
          </div>
          <p className="progress-text">Step {currentStep} of 6</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
              {step}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form className="profile-form" onSubmit={handlePreview}>
          <h2>{getStepTitle()}</h2>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <div className="form-row">
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="EEE">Electrical & Electronics</option>
                  <option value="IT">Information Technology</option>
                </select>
              </div>
              <p className="step-info">📝 This information helps us identify your profile and track your progress.</p>
            </div>
          )}

          {/* Step 2: Academic Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="form-row">
                <input
                  type="number"
                  name="cgpa"
                  placeholder="CGPA (0-10)"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="tenthPercentage"
                  placeholder="10th Percentage"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.tenthPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="twelfthPercentage"
                  placeholder="12th Percentage"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.twelfthPercentage}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="diplomaPercentage"
                  placeholder="Diploma % (if applicable)"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.diplomaPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="currentYear" value={formData.currentYear} onChange={handleInputChange}>
                  <option value="1">Final Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <select name="currentSemester" value={formData.currentSemester} onChange={handleInputChange}>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="arrearCount"
                  placeholder="Arrear Count"
                  min="0"
                  value={formData.arrearCount}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="arrearHistory"
                  placeholder="Arrear History (comma separated)"
                  value={formData.arrearHistory}
                  onChange={handleInputChange}
                />
              </div>
              <p className="step-info">📊 Your academic performance is crucial for placement prediction. Be accurate!</p>
            </div>
          )}

          {/* Step 3: Skills & Experience */}
          {currentStep === 3 && (
            <div className="form-step">
              <div className="form-row full-width">
                <input
                  type="text"
                  name="technicalSkills"
                  placeholder="Technical Skills (e.g., Java, Python, React, Node.js)"
                  value={formData.technicalSkills}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="coreSubjectKnowledge" value={formData.coreSubjectKnowledge} onChange={handleInputChange}>
                  <option value="Poor">Core Knowledge: Poor</option>
                  <option value="Average">Core Knowledge: Average</option>
                  <option value="Good">Core Knowledge: Good</option>
                  <option value="Excellent">Core Knowledge: Excellent</option>
                </select>
              </div>
              <div className="form-row full-width">
                <input
                  type="text"
                  name="certifications"
                  placeholder="Certifications (e.g., AWS, Azure, Google Cloud)"
                  value={formData.certifications}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="internships"
                  placeholder="Number of Internships"
                  min="0"
                  value={formData.internships}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row full-width">
                <input
                  type="text"
                  name="projects"
                  placeholder="Projects (comma separated, e.g., E-commerce App, Chat System)"
                  value={formData.projects}
                  onChange={handleInputChange}
                />
              </div>
              <p className="step-info">💡 Companies value practical skills and hands-on experience. List everything you've done!</p>
            </div>
          )}

          {/* Step 4: Placement Preparation */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="form-row">
                <select name="aptitudeSkillLevel" value={formData.aptitudeSkillLevel} onChange={handleInputChange}>
                  <option value="Poor">Aptitude: Poor</option>
                  <option value="Average">Aptitude: Average</option>
                  <option value="Good">Aptitude: Good</option>
                  <option value="Excellent">Aptitude: Excellent</option>
                </select>
                <select name="communicationSkillLevel" value={formData.communicationSkillLevel} onChange={handleInputChange}>
                  <option value="Poor">Communication: Poor</option>
                  <option value="Average">Communication: Average</option>
                  <option value="Good">Communication: Good</option>
                  <option value="Excellent">Communication: Excellent</option>
                </select>
              </div>
              <div className="form-row">
                <select name="codingSkillLevel" value={formData.codingSkillLevel} onChange={handleInputChange}>
                  <option value="Poor">Coding: Poor</option>
                  <option value="Average">Coding: Average</option>
                  <option value="Good">Coding: Good</option>
                  <option value="Excellent">Coding: Excellent</option>
                </select>
                <input
                  type="number"
                  name="mockInterviewPerformance"
                  placeholder="Mock Interview Score (0-100)"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.mockInterviewPerformance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="resumeQualityRating" value={formData.resumeQualityRating} onChange={handleInputChange}>
                  <option value="Poor">Resume Quality: Poor</option>
                  <option value="Average">Resume Quality: Average</option>
                  <option value="Good">Resume Quality: Good</option>
                  <option value="Excellent">Resume Quality: Excellent</option>
                </select>
              </div>
              <p className="step-info">🎤 Interview readiness is key! Be honest about your preparation level.</p>
            </div>
          )}

          {/* Step 5: Extra-Curricular & History */}
          {currentStep === 5 && (
            <div className="form-step">
              <div className="form-row">
                <label>Leadership Experience:</label>
                <select name="leadershipExperience" value={formData.leadershipExperience} onChange={handleInputChange}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="workshopsHackathonsParticipation"
                  placeholder="Workshops/Hackathons Count"
                  min="0"
                  value={formData.workshopsHackathonsParticipation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="softSkillsRating" value={formData.softSkillsRating} onChange={handleInputChange}>
                  <option value="Poor">Soft Skills: Poor</option>
                  <option value="Average">Soft Skills: Average</option>
                  <option value="Good">Soft Skills: Good</option>
                  <option value="Excellent">Soft Skills: Excellent</option>
                </select>
              </div>
              <div className="form-row full-width">
                <input
                  type="text"
                  name="areaOfInterest"
                  placeholder="Areas of Interest (comma separated, e.g., IT, Core, Management)"
                  value={formData.areaOfInterest}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row full-width">
                <input
                  type="number"
                  name="previousPlacementAttempts"
                  placeholder="Previous Placement Attempts"
                  min="0"
                  value={formData.previousPlacementAttempts}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row full-width">
                <input
                  type="text"
                  name="previousCompaniesApplied"
                  placeholder="Previously Applied Companies (comma separated)"
                  value={formData.previousCompaniesApplied}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row full-width">
                <input
                  type="text"
                  name="placementDriveParticipation"
                  placeholder="Placement Drives Participated (comma separated)"
                  value={formData.placementDriveParticipation}
                  onChange={handleInputChange}
                />
              </div>
              <p className="step-info">⭐ Extra-curricular activities showcase your personality beyond academics!</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-buttons">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            {currentStep < 6 && (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next →
              </button>
            )}
            {currentStep === 6 && (
              <button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Analyzing...' : '👁️ Preview Analysis'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Preview Analysis Component (shown before saving)
const PreviewAnalysis = ({ student, onSave, onEdit, isSaving }) => {
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

  return (
    <div className="eligibility-analysis">
      <div className="analysis-container">
        {/* Preview Header */}
        <div className="success-message">
          <div className="checkmark">👁️</div>
          <h2>Analysis Preview</h2>
          <p>Review your placement readiness analysis below</p>
        </div>

        {/* Main Analysis Card */}
        <div className="analysis-card">
          <div className="eligibility-display">
            <span className="eligibility-emoji">{getEligibilityEmoji(student.eligibilityBand)}</span>
            <h3>Eligibility Band</h3>
            <p className="band" style={{ color: getEligibilityColor(student.eligibilityBand) }}>
              {student.eligibilityBand}
            </p>
          </div>

          <div className="probability-display">
            <h3>Placement Probability</h3>
            <div className="probability-circle">
              <div className="circle-value">{(student.predictedPlacementProbability * 100).toFixed(1)}%</div>
              <svg className="circle-svg" viewBox="0 0 100 100">
                <circle className="circle-bg" cx="50" cy="50" r="45" />
                <circle
                  className="circle-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDashoffset: 282.7 - (282.7 * student.predictedPlacementProbability),
                    stroke: getEligibilityColor(student.eligibilityBand),
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="analysis-details">
            <h3>📊 Profile Summary</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>CGPA</label>
                <p>{(student.cgpa || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Skills</label>
                <p>{student.technicalSkills?.length || 0} skills</p>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <p>{(student.internships || 0) + (student.projects?.length || 0)} items</p>
              </div>
              <div className="detail-item">
                <label>Certifications</label>
                <p>{student.certifications?.length || 0} certs</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {student.eligibilityBand !== 'High' && (
            <div className="recommendations-box">
              <h3>💡 Improvement Areas</h3>
              <ul>
                {student.eligibilityBand === 'Low' && (
                  <>
                    <li>🎯 Increase CGPA to above 7.5</li>
                    <li>💻 Learn more in-demand technical skills</li>
                    <li>🔧 Complete at least 2 real projects</li>
                    <li>📜 Get at least 1 industry certification</li>
                  </>
                )}
                {student.eligibilityBand === 'Medium' && (
                  <>
                    <li>⬆️ Aim to reach CGPA 8.0+</li>
                    <li>🎤 Improve communication and soft skills</li>
                    <li>🏢 Gain hands-on internship experience</li>
                    <li>🎯 Practice mock interviews regularly</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {student.eligibilityBand === 'High' && (
            <div className="success-box">
              <h3>🌟 Excellent Profile!</h3>
              <p>You have a strong profile. Focus on keeping your current performance and apply to placements confidently!</p>
            </div>
          )}
        </div>

        {/* Action Buttons - Save or Edit */}
        <div className="preview-buttons">
          <div className="button-group">
            <button 
              className="btn-primary" 
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? '💾 Saving Profile...' : '✅ Save Profile'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={onEdit}
              disabled={isSaving}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Eligibility Analysis Component (shown after saving)
const EligibilityAnalysis = ({ student }) => {
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

  return (
    <div className="eligibility-analysis">
      <div className="analysis-container">
        {/* Success Message */}
        <div className="success-message">
          <div className="checkmark">✓</div>
          <h2>Profile Complete!</h2>
          <p>Your placement readiness has been analyzed and saved</p>
        </div>

        {/* Main Analysis Card */}
        <div className="analysis-card">
          <div className="eligibility-display">
            <span className="eligibility-emoji">{getEligibilityEmoji(student.eligibilityBand)}</span>
            <h3>Your Eligibility Band</h3>
            <p className="band" style={{ color: getEligibilityColor(student.eligibilityBand) }}>
              {student.eligibilityBand}
            </p>
          </div>

          <div className="probability-display">
            <h3>Placement Probability</h3>
            <div className="probability-circle">
              <div className="circle-value">{(student.predictedPlacementProbability * 100).toFixed(1)}%</div>
              <svg className="circle-svg" viewBox="0 0 100 100">
                <circle className="circle-bg" cx="50" cy="50" r="45" />
                <circle
                  className="circle-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDashoffset: 282.7 - (282.7 * student.predictedPlacementProbability),
                    stroke: getEligibilityColor(student.eligibilityBand),
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="analysis-details">
            <h3>📊 Profile Summary</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>CGPA</label>
                <p>{(student.cgpa || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Skills</label>
                <p>{student.technicalSkills?.length || 0} skills</p>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <p>{(student.internships || 0) + (student.projects?.length || 0)} items</p>
              </div>
              <div className="detail-item">
                <label>Certifications</label>
                <p>{student.certifications?.length || 0} certs</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {student.eligibilityBand !== 'High' && (
            <div className="recommendations-box">
              <h3>💡 Improvement Areas</h3>
              <ul>
                {student.eligibilityBand === 'Low' && (
                  <>
                    <li>🎯 Increase CGPA to above 7.5</li>
                    <li>💻 Learn more in-demand technical skills</li>
                    <li>🔧 Complete at least 2 real projects</li>
                    <li>📜 Get at least 1 industry certification</li>
                  </>
                )}
                {student.eligibilityBand === 'Medium' && (
                  <>
                    <li>⬆️ Aim to reach CGPA 8.0+</li>
                    <li>🎤 Improve communication and soft skills</li>
                    <li>🏢 Gain hands-on internship experience</li>
                    <li>🎯 Practice mock interviews regularly</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {student.eligibilityBand === 'High' && (
            <div className="success-box">
              <h3>🌟 Excellent Profile!</h3>
              <p>You have a strong profile. Keep it up and you're ready for placements!</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="analysis-buttons">
          <button className="btn-primary" onClick={() => window.location.href = '/dashboard'}>
            📚 Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileSetup;
