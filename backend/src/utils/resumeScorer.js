/**
 * Resume Scoring Engine
 * Analyzes extracted resume text and returns a score (0-100) with detailed feedback
 */

const TECH_SKILLS = [
  'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'node',
  'express', 'django', 'flask', 'spring', 'sql', 'mysql', 'mongodb', 'postgresql',
  'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'linux', 'c++',
  'c#', 'php', 'ruby', 'swift', 'kotlin', 'r', 'matlab', 'tensorflow', 'pytorch',
  'machine learning', 'deep learning', 'data science', 'artificial intelligence',
  'html', 'css', 'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'ci/cd',
  'jenkins', 'github', 'jira', 'selenium', 'junit', 'pandas', 'numpy', 'scikit'
];

const EDUCATION_KEYWORDS = [
  'bachelor', 'master', 'b.tech', 'b.e', 'm.tech', 'mca', 'bca', 'bsc', 'msc',
  'cgpa', 'gpa', 'percentage', 'university', 'college', 'institute', 'degree',
  'engineering', 'science', 'technology', 'graduate', 'thesis', 'dissertation'
];

const EXPERIENCE_KEYWORDS = [
  'internship', 'intern', 'experience', 'worked', 'developed', 'built', 'designed',
  'implemented', 'managed', 'led', 'created', 'maintained', 'deployed', 'collaborated',
  'training', 'apprentice', 'part-time', 'full-time', 'months', 'years'
];

const PROJECT_KEYWORDS = [
  'project', 'developed', 'built', 'created', 'implemented', 'application', 'system',
  'website', 'app', 'tool', 'platform', 'module', 'api', 'database', 'ml model',
  'github', 'repository', 'demo', 'deployment', 'capstone', 'mini project'
];

const CERTIFICATION_KEYWORDS = [
  'certification', 'certified', 'certificate', 'aws certified', 'google certified',
  'coursera', 'udemy', 'edx', 'nptel', 'microsoft', 'oracle', 'cisco', 'comptia',
  'credential', 'badge', 'course', 'training certificate', 'professional certificate'
];

const SOFT_SKILLS = [
  'communication', 'leadership', 'teamwork', 'team player', 'problem solving',
  'analytical', 'creative', 'adaptable', 'motivated', 'organized', 'detail-oriented',
  'time management', 'critical thinking', 'presentation', 'collaboration', 'initiative'
];

function countKeywordMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
}

function getFoundKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw.toLowerCase()));
}

export function scoreResume(text) {
  if (!text || text.trim().length < 50) {
    return {
      score: 0,
      grade: 'F',
      scoreBreakdown: { education: 0, technicalSkills: 0, experience: 0, projects: 0, certifications: 0, softSkills: 0 },
      feedback: ['Resume text is too short or could not be read properly.'],
      strengths: [],
      improvements: ['Upload a detailed resume with more content'],
      keywords: []
    };
  }

  const wordCount = text.split(/\s+/).length;

  // --- Category Scoring ---
  const eduMatches    = countKeywordMatches(text, EDUCATION_KEYWORDS);
  const techMatches   = countKeywordMatches(text, TECH_SKILLS);
  const expMatches    = countKeywordMatches(text, EXPERIENCE_KEYWORDS);
  const projMatches   = countKeywordMatches(text, PROJECT_KEYWORDS);
  const certMatches   = countKeywordMatches(text, CERTIFICATION_KEYWORDS);
  const softMatches   = countKeywordMatches(text, SOFT_SKILLS);

  const foundTech     = getFoundKeywords(text, TECH_SKILLS);
  const foundSoft     = getFoundKeywords(text, SOFT_SKILLS);

  // Normalize to max points per category
  const educationScore      = Math.min(20, Math.round((eduMatches  / EDUCATION_KEYWORDS.length)   * 20 * 3));
  const technicalSkillsScore= Math.min(30, Math.round((techMatches / TECH_SKILLS.length)          * 30 * 4));
  const experienceScore     = Math.min(20, Math.round((expMatches  / EXPERIENCE_KEYWORDS.length)  * 20 * 3));
  const projectsScore       = Math.min(15, Math.round((projMatches / PROJECT_KEYWORDS.length)     * 15 * 5));
  const certificationsScore = Math.min(10, Math.round((certMatches / CERTIFICATION_KEYWORDS.length) * 10 * 5));
  const softSkillsScore     = Math.min(5,  Math.round((softMatches / SOFT_SKILLS.length)          * 5  * 5));

  // Bonus for resume length (well-detailed)
  const lengthBonus = wordCount > 400 ? 3 : wordCount > 200 ? 1 : 0;

  const totalScore = Math.min(100, educationScore + technicalSkillsScore + experienceScore + projectsScore + certificationsScore + softSkillsScore + lengthBonus);

  // --- Grade ---
  let grade = 'F';
  if (totalScore >= 85) grade = 'A+';
  else if (totalScore >= 75) grade = 'A';
  else if (totalScore >= 65) grade = 'B+';
  else if (totalScore >= 55) grade = 'B';
  else if (totalScore >= 45) grade = 'C';
  else if (totalScore >= 35) grade = 'D';

  // --- Feedback ---
  const feedback = [];
  const strengths = [];
  const improvements = [];

  if (educationScore >= 12) {
    strengths.push('Good academic background mentioned');
  } else {
    feedback.push('Add more education details: degree, CGPA/GPA, university name');
    improvements.push('Include your CGPA, degree name, and institution clearly');
  }

  if (technicalSkillsScore >= 18) {
    strengths.push(`Strong technical skill set (${foundTech.slice(0, 5).join(', ')})`);
  } else {
    feedback.push(`Add more technical skills — currently detected: ${foundTech.length > 0 ? foundTech.slice(0, 3).join(', ') : 'none'}`);
    improvements.push('List specific programming languages, frameworks, and tools you know');
  }

  if (experienceScore >= 12) {
    strengths.push('Relevant work/internship experience included');
  } else {
    feedback.push('Include internship or work experience with company name, role, and duration');
    improvements.push('Pursue internships or add freelance projects to demonstrate experience');
  }

  if (projectsScore >= 9) {
    strengths.push('Multiple projects showcased');
  } else {
    feedback.push('Add more projects with descriptions, technologies used, and GitHub links');
    improvements.push('Build at least 2-3 projects and include your GitHub profile URL');
  }

  if (certificationsScore >= 6) {
    strengths.push('Certifications add credibility to your profile');
  } else {
    feedback.push('Add industry certifications (AWS, Google, Coursera, NPTEL, etc.)');
    improvements.push('Complete free certifications on Coursera, edX, or NPTEL to boost your score');
  }

  if (softSkillsScore >= 3) {
    strengths.push(`Good soft skills highlighted (${foundSoft.slice(0, 3).join(', ')})`);
  } else {
    feedback.push('Mention soft skills: leadership, communication, teamwork, problem-solving');
    improvements.push('Add a skills section listing both technical and soft skills');
  }

  if (wordCount < 200) {
    feedback.push('Resume is too brief — aim for at least 300-500 words for a comprehensive resume');
    improvements.push('Expand each section with specific, quantifiable achievements');
  }

  return {
    score: totalScore,
    grade,
    scoreBreakdown: {
      education: educationScore,
      technicalSkills: technicalSkillsScore,
      experience: experienceScore,
      projects: projectsScore,
      certifications: certificationsScore,
      softSkills: softSkillsScore
    },
    feedback,
    strengths,
    improvements,
    keywords: foundTech.slice(0, 10)
  };
}
