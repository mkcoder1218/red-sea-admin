import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { config } from './config'
import { handleUnauthorized, isUnauthorizedError } from './unauthorizedHandler'

// Base URL for your backend API
const BASE_URL = config.api.baseUrl

// Create axios instance with default configuration
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (axiosConfig) => {
    // Get token from localStorage or your preferred storage
    const token = localStorage.getItem(config.storage.authToken)

    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (config.features.enableDevTools) {
      console.log(`🚀 API Request: ${axiosConfig.method?.toUpperCase()} ${axiosConfig.url}`, {
        data: axiosConfig.data,
        params: axiosConfig.params,
      })
    }

    return axiosConfig
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (config.features.enableDevTools) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    
    return response
  },
  (error: AxiosError) => {
    // Log error in development
    if (config.features.enableDevTools) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    
    // Handle specific error cases
    if (isUnauthorizedError(error)) {
      // Handle unauthorized access with proper cleanup
      handleUnauthorized()
      return Promise.reject(error)
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden')
    }
    
    if (error.response?.status >= 500) {
      // Server error - show generic error message
      console.error('Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

// Generic API response type
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  status: number
}

// Error response type
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Generic API methods
export const apiMethods = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config)
    return response.data
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config)
    return response.data
  },
}

// Utility function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    // Check for unauthorized error first
    if (isUnauthorizedError(error)) {
      handleUnauthorized()
      return {
        message: 'Session expired. Please log in again.',
        status: 401,
      }
    }

    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    }
  }

  return {
    message: 'An unexpected error occurred',
    status: 500,
  }
}

// Utility function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem(config.storage.authToken, token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Utility function to clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem(config.storage.authToken)
  delete api.defaults.headers.common['Authorization']
}

export default api
