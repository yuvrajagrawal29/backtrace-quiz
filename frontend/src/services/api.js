import axios from 'axios';

/**
 * API Service
 * Centralized API calls to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const quizAPI = {
  
  /**
   * Start a new quiz session
   */
  startQuiz: async (name) => {
    const response = await api.post('/start-quiz', { name });
    return response.data;
  },

  /**
   * Fetch all questions
   */
  getQuestions: async (sessionId) => {
    const response = await api.get('/questions', {
      params: { sessionId }
    });
    return response.data;
  },

  /**
   * Save answers (auto-save)
   */
  saveAnswers: async (sessionId, answers) => {
    const response = await api.post('/save-answers', {
      sessionId,
      answers
    });
    return response.data;
  },

  /**
   * Select bonus time
   */
  selectBonus: async (sessionId, bonusMinutes) => {
    const response = await api.post('/select-bonus', {
      sessionId,
      bonusMinutes
    });
    return response.data;
  },

  /**
   * Submit quiz
   */
  submitQuiz: async (sessionId) => {
    const response = await api.post('/submit-quiz', {
      sessionId
    });
    return response.data;
  },

  /**
   * Get session status
   */
  getSessionStatus: async (sessionId) => {
    const response = await api.get('/session-status', {
      params: { sessionId }
    });
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  /**
   * Admin authentication
   */
  adminAuthenticate: async (name) => {
    const response = await api.post('/admin/authenticate', { name });
    return response.data;
  },

  /**
   * Get all participants (Admin only)
   */
  getAdminParticipants: async (adminToken, sortBy = 'score') => {
    const response = await api.get('/admin/participants', {
      params: { adminToken, sortBy }
    });
    return response.data;
  }
};

export default api;
