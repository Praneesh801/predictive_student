import React, { useState, useEffect } from 'react';
import { studentService } from '../services/api.js';
import '../styles/Management.css';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('academic');
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse comma-separated fields into arrays
      const data = {
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

      await studentService.createStudent(data);
      resetForm();
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      department: '',
      cgpa: '',
      tenthPercentage: '',
      twelfthPercentage: '',
      diplomaPercentage: '',
      currentYear: '1',
      currentSemester: '1',
      arrearCount: '0',
      arrearHistory: '',
      technicalSkills: '',
      coreSubjectKnowledge: 'Average',
      certifications: '',
      internships: '0',
      projects: '',
      aptitudeSkillLevel: 'Average',
      communicationSkillLevel: 'Average',
      codingSkillLevel: 'Average',
      mockInterviewPerformance: '0',
      resumeQualityRating: 'Average',
      leadershipExperience: 'no',
      workshopsHackathonsParticipation: '0',
      softSkillsRating: 'Average',
      areaOfInterest: '',
      previousPlacementAttempts: '0',
      previousCompaniesApplied: '',
      placementDriveParticipation: '',
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-page">
      <h1>Student Management</h1>

      <button className="add-btn" onClick={() => { setShowForm(!showForm); if (!showForm) setActiveTab('academic'); }}>
        {showForm ? 'Cancel' : 'Add New Student'}
      </button>

      {showForm && (
        <form className="management-form comprehensive-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section basic-info">
            <h3>Basic Information</h3>
            <div className="form-row">
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleInputChange}
                required
              />
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
                <option value="EEE">Electrical</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="form-tabs">
            <button type="button" className={`tab ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>
              Academic
            </button>
            <button type="button" className={`tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
              Skills
            </button>
            <button type="button" className={`tab ${activeTab === 'preparation' ? 'active' : ''}`} onClick={() => setActiveTab('preparation')}>
              Prep
            </button>
            <button type="button" className={`tab ${activeTab === 'extracurr' ? 'active' : ''}`} onClick={() => setActiveTab('extracurr')}>
              Extra
            </button>
            <button type="button" className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              History
            </button>
          </div>

          {/* Academic Details Tab */}
          {activeTab === 'academic' && (
            <div className="form-section">
              <h3>Academic Details</h3>
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
                  placeholder="Diploma Percentage (if applicable)"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.diplomaPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="currentYear" value={formData.currentYear} onChange={handleInputChange}>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <select name="currentSemester" value={formData.currentSemester} onChange={handleInputChange}>
                  <option value="1">Sem 1</option>
                  <option value="2">Sem 2</option>
                  <option value="3">Sem 3</option>
                  <option value="4">Sem 4</option>
                  <option value="5">Sem 5</option>
                  <option value="6">Sem 6</option>
                  <option value="7">Sem 7</option>
                  <option value="8">Sem 8</option>
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
                  placeholder="Arrear History (comma separated, e.g., Math, Physics)"
                  value={formData.arrearHistory}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="form-section">
              <h3>Skill Details</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="technicalSkills"
                  placeholder="Technical Skills (comma separated, e.g., Java, Python, React)"
                  value={formData.technicalSkills}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <select name="coreSubjectKnowledge" value={formData.coreSubjectKnowledge} onChange={handleInputChange}>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="certifications"
                  placeholder="Certifications (comma separated)"
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
                <input
                  type="text"
                  name="projects"
                  placeholder="Projects (comma separated)"
                  value={formData.projects}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Placement Preparation Tab */}
          {activeTab === 'preparation' && (
            <div className="form-section">
              <h3>Placement Preparation</h3>
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
                  <option value="Poor">Resume: Poor</option>
                  <option value="Average">Resume: Average</option>
                  <option value="Good">Resume: Good</option>
                  <option value="Excellent">Resume: Excellent</option>
                </select>
              </div>
            </div>
          )}

          {/* Extra-Curricular Tab */}
          {activeTab === 'extracurr' && (
            <div className="form-section">
              <h3>Extra-Curricular Activities</h3>
              <div className="form-row">
                <label>
                  Leadership Experience:
                  <select name="leadershipExperience" value={formData.leadershipExperience} onChange={handleInputChange}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="workshopsHackathonsParticipation"
                  placeholder="Workshops/Hackathons Participation Count"
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
              <div className="form-row">
                <input
                  type="text"
                  name="areaOfInterest"
                  placeholder="Area of Interest (comma separated)"
                  value={formData.areaOfInterest}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Placement History Tab */}
          {activeTab === 'history' && (
            <div className="form-section">
              <h3>Placement History</h3>
              <div className="form-row">
                <input
                  type="number"
                  name="previousPlacementAttempts"
                  placeholder="Previous Placement Attempts"
                  min="0"
                  value={formData.previousPlacementAttempts}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="previousCompaniesApplied"
                  placeholder="Previous Companies Applied (comma separated)"
                  value={formData.previousCompaniesApplied}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="placementDriveParticipation"
                  placeholder="Placement Drive Participation (comma separated)"
                  value={formData.placementDriveParticipation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Create Student Record
          </button>
        </form>
      )}

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Predicted Placement %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.cgpa || 'N/A'}</td>
                <td>{(student.predictedPlacementProbability * 100).toFixed(1)}%</td>
                <td>
                  <span className={`status ${student.placementEligible ? 'eligible' : 'ineligible'}`}>
                    {student.placementEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
