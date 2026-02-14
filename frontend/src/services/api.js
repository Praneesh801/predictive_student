import apiClient from './apiClient.js';

export const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
};

export const studentService = {
  createStudent: async (studentData) => {
    const response = await apiClient.post('/students', studentData);
    return response.data;
  },

  getStudentData: async (studentId) => {
    const response = await apiClient.get(`/students/${studentId}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await apiClient.get('/students/me/profile');
    return response.data;
  },

  updateStudentData: async (studentId, data) => {
    const response = await apiClient.put(`/students/${studentId}`, data);
    return response.data;
  },

  getAllStudents: async () => {
    const response = await apiClient.get('/students');
    return response.data;
  },

  getEligibleStudents: async () => {
    const response = await apiClient.get('/students/eligible/list');
    return response.data;
  },
};

export const placementService = {
  createPlacementRecord: async (recordData) => {
    const response = await apiClient.post('/placements', recordData);
    return response.data;
  },

  getPlacementRecord: async (recordId) => {
    const response = await apiClient.get(`/placements/${recordId}`);
    return response.data;
  },

  updatePlacementStatus: async (recordId, data) => {
    const response = await apiClient.put(`/placements/${recordId}`, data);
    return response.data;
  },

  getStudentPlacements: async (studentId) => {
    const response = await apiClient.get(`/placements/student/${studentId}`);
    return response.data;
  },

  getAllPlacementRecords: async () => {
    const response = await apiClient.get('/placements');
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async (userId) => {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  getUnreadNotifications: async (userId) => {
    const response = await apiClient.get(`/notifications/user/${userId}/unread`);
    return response.data;
  },
};

export const analyticsService = {
  getPlacementStats: async () => {
    const response = await apiClient.get('/analytics/placement-stats');
    return response.data;
  },

  getStudentStats: async () => {
    const response = await apiClient.get('/analytics/student-stats');
    return response.data;
  },

  getPredictionAccuracy: async () => {
    const response = await apiClient.get('/analytics/prediction-accuracy');
    return response.data;
  },

  getTrendAnalysis: async () => {
    const response = await apiClient.get('/analytics/trend-analysis');
    return response.data;
  },

  getCompanyStats: async () => {
    const response = await apiClient.get('/analytics/company-stats');
    return response.data;
  },

  getPlacementAnalytics: async () => {
    const response = await apiClient.get('/analytics/placement-analytics');
    return response.data;
  },
};
