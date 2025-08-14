import axios from 'axios';
import { DocumentDTO } from '@/types/api';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8079';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message || 
                   'An unexpected error occurred';
    
    const apiError = {
      message,
      status: error.response?.status,
      code: error.response?.data?.code || error.code,
    };
    
    return Promise.reject(apiError);
  }
);

// API endpoints
export const documentsApi = {
  // List all documents
  list: () => api.get<DocumentDTO[]>('/docs'),
  
  // Get document by ID
  getById: (id: string) => api.get<DocumentDTO>(`/docs/${id}`),
  
  // Update document
  update: (id: string, document: DocumentDTO) => 
    api.put<DocumentDTO>(`/docs/${id}`, document),
  
  // Upload file
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<DocumentDTO>('/docs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
};