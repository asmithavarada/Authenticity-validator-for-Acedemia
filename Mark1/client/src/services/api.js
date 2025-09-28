import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('university');
      window.location.href = '/university/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // University registration
  registerUniversity: async (universityData) => {
    const response = await api.post('/auth/university/register', universityData);
    return response.data;
  },

  // University login
  loginUniversity: async (credentials) => {
    const response = await api.post('/auth/university/login', credentials);
    return response.data;
  },

  // Get university profile
  getUniversityProfile: async () => {
    const response = await api.get('/auth/university/profile');
    return response.data;
  },
  
  // Admin login
  adminLogin: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
};

// Certificates API
export const certificatesAPI = {
  // Upload CSV file
  uploadCertificates: async (csvFile) => {
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    
    const response = await api.post('/certificates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get university certificates
  getUniversityCertificates: async (page = 1, limit = 10) => {
    const response = await api.get(`/certificates/university?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search certificate by roll number
  searchCertificate: async (rollNumber) => {
    const response = await api.get(`/certificates/search/${rollNumber}`);
    return response.data;
  },
  // Upload multiple certificate PDFs
  uploadCertificatePdfs: async (files) => {
    const formData = new FormData();
    for (const f of files) formData.append('certificateFiles', f);
    const response = await api.post('/certificates/upload-pdfs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Verification API
export const verificationAPI = {
  // Verify certificate using OCR
  verifyWithOCR: async (certificateFile) => {
    const formData = new FormData();
    formData.append('certificateFile', certificateFile);
    
    const response = await api.post('/verify/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Manual verification
  verifyManually: async (rollNumber, studentName) => {
    const response = await api.post('/verify/manual', {
      rollNumber,
      studentName,
    });
    return response.data;
  },

  // Get verification statistics
  getVerificationStats: async () => {
    const response = await api.get('/verify/stats');
    return response.data;
  },
};

// Blockchain API
export const blockchainAPI = {
  prepareForPublish: async () => {
    const response = await api.get('/blockchain/prepare');
    return response.data;
  },
  confirmPublish: async ({ txHash, blockNumber, items }) => {
    const response = await api.post('/blockchain/confirm', { txHash, blockNumber, items });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
