import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('pspa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login    = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe    = ()     => API.get('/auth/me');

// Students
export const getStudents    = (params) => API.get('/students', { params });
export const getStudent     = (id)     => API.get(`/students/${id}`);
export const createStudent  = (data)   => API.post('/students', data);
export const updateStudent  = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent  = (id)     => API.delete(`/students/${id}`);
export const predictPlacement = (data) => API.post('/students/predict', data);

// Analytics
export const getPlacementStats = () => API.get('/analytics/placement-stats');
export const getStudentStats   = () => API.get('/analytics/student-stats');

// Resume
export const uploadResume = (formData, onProgress) =>
  API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
  });
export const scoreResumeText = (text, studentName) =>
  API.post('/resume/score-text', { text, studentName });
export const getResumes = () => API.get('/resume');

// Admin Student Management
export const bulkInsertStudents = (students) => API.post('/students/bulk', { students });
export const updatePlacementStatus = (id, status, companyPlaced) => API.put(`/students/${id}/status`, { status, companyPlaced });

// Companies
export const getCompanies = () => API.get('/companies');
export const createCompany = (data) => API.post('/companies', data);
export const registerForDrive = (companyId, studentId) => API.post('/companies/register', { companyId, studentId });
export const deleteCompany = (id) => API.delete(`/companies/${id}`);

export default API;
