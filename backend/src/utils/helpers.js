import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'placement_system_secret_key_2025';
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Helper function to convert skill levels to numeric scores
const skillLevelToScore = (level) => {
  const scoreMap = {
    'Poor': 0.2,
    'Average': 0.5,
    'Good': 0.75,
    'Excellent': 1.0,
  };
  return scoreMap[level] || 0.5;
};

// Determine eligibility band based on probability
export const getEligibilityBand = (probability) => {
  if (probability >= 0.75) return 'High';
  if (probability >= 0.5) return 'Medium';
  return 'Low';
};

export const calculatePlacementProbability = (student) => {
  let score = 0;
  let weights = 0;

  // 1. Academic Performance (35%)
  if (student.cgpa) {
    score += (student.cgpa / 10) * 0.25;
    weights += 0.25;
  }

  if (student.twelfthPercentage) {
    score += (student.twelfthPercentage / 100) * 0.05;
    weights += 0.05;
  }

  if (student.tenthPercentage) {
    score += (student.tenthPercentage / 100) * 0.05;
    weights += 0.05;
  }

  // Deduct for arrears
  if (student.arrearCount && student.arrearCount > 0) {
    score -= student.arrearCount * 0.03;
  }

  // Core subject knowledge (5%)
  if (student.coreSubjectKnowledge) {
    score += skillLevelToScore(student.coreSubjectKnowledge) * 0.05;
    weights += 0.05;
  }

  // 2. Technical Skills (25%)
  if (student.technicalSkills && student.technicalSkills.length > 0) {
    score += Math.min(student.technicalSkills.length / 8, 1) * 0.15;
    weights += 0.15;
  }

  if (student.codingSkillLevel) {
    score += skillLevelToScore(student.codingSkillLevel) * 0.10;
    weights += 0.10;
  }

  // 3. Experience (20%)
  if (student.internships && student.internships > 0) {
    score += Math.min(student.internships / 2, 1) * 0.10;
    weights += 0.10;
  }

  if (student.projects && Array.isArray(student.projects) && student.projects.length > 0) {
    score += Math.min(student.projects.length / 3, 1) * 0.10;
    weights += 0.10;
  }

  // 4. Certifications (10%)
  if (student.certifications && student.certifications.length > 0) {
    score += Math.min(student.certifications.length / 5, 1) * 0.10;
    weights += 0.10;
  }

  // 5. Soft Skills (15%)
  if (student.communicationSkillLevel) {
    score += skillLevelToScore(student.communicationSkillLevel) * 0.07;
    weights += 0.07;
  }

  if (student.softSkillsRating) {
    score += skillLevelToScore(student.softSkillsRating) * 0.08;
    weights += 0.08;
  }

  // 6. Placement Readiness (10%)
  if (student.aptitudeSkillLevel) {
    score += skillLevelToScore(student.aptitudeSkillLevel) * 0.06;
    weights += 0.06;
  }

  if (student.mockInterviewPerformance) {
    score += (student.mockInterviewPerformance / 100) * 0.04;
    weights += 0.04;
  }

  if (student.resumeQualityRating) {
    score += skillLevelToScore(student.resumeQualityRating) * 0.03;
    weights += 0.03;
  }

  // 7. Extra-Curricular (5%)
  if (student.leadershipExperience) {
    score += 0.025;
    weights += 0.025;
  }

  if (student.workshopsHackathonsParticipation && student.workshopsHackathonsParticipation > 0) {
    score += Math.min(student.workshopsHackathonsParticipation / 5, 1) * 0.025;
    weights += 0.025;
  }

  // Normalize score
  if (weights > 0) {
    score = score / weights;
  }

  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));

  const probability = Math.round(score * 100) / 100;
  return {
    probability,
    band: getEligibilityBand(probability),
    eligible: probability >= 0.5
  };
};

export const getPlacementStats = (students) => {
  if (!Array.isArray(students) || students.length === 0) {
    return {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      eligible: 0,
      highPercentage: 0,
      mediumPercentage: 0,
      lowPercentage: 0,
      placedCount: 0,
      placementRate: 0
    };
  }

  const stats = {
    total: students.length,
    high: 0,
    medium: 0,
    low: 0,
    eligible: 0,
    placed: 0,
    highPercentage: 0,
    mediumPercentage: 0,
    lowPercentage: 0,
    placementRate: 0
  };

  students.forEach(student => {
    if (student.eligibilityBand === 'High') stats.high++;
    else if (student.eligibilityBand === 'Medium') stats.medium++;
    else if (student.eligibilityBand === 'Low') stats.low++;

    if (student.placementEligible) stats.eligible++;
    if (student.placementStatus === 'placed') stats.placed++;
  });

  stats.highPercentage = Math.round((stats.high / stats.total) * 100);
  stats.mediumPercentage = Math.round((stats.medium / stats.total) * 100);
  stats.lowPercentage = Math.round((stats.low / stats.total) * 100);
  stats.placementRate = Math.round((stats.placed / stats.total) * 100);

  return stats;
};
