import { apiMethods, handleApiError, setAuthToken, clearAuthToken } from '@/lib/api'
import { clearPersistedAuth } from '@/store/persistUtils'
import type { User } from '@/store/slices/authSlice'

export interface UserProfile {
  id: string;
  social_login: string | null;
  social_login_id: string | null;
  email: string;
  password: string;
  last_used_key: string;
  verification_code: string | null;
  verification_time: string | null;
  recovery_request_time: string | null;
  recovery_time: string | null;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  status: string;
  type: string;
  pref_language: string;
  pref_currency: string;
  pref_unit: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role_id: string;
  cart?: {
    id: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  role: {
    access_rules: string[];
    id: string;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface UserProfileResponse {
  status: number;
  message: string;
  data: UserProfile;
}

// Auth API types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  status: number
  message: string
  data: {
    token: string
    user: User
  }
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  role_id: string
}

export interface RegisterResponse {
  user: User
  token: string
  message: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
}

// Auth service class
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiMethods.post<LoginResponse>('/auth/login', credentials)

      // Set auth token in axios instance and localStorage
      if (response.data?.token) {
        setAuthToken(response.data.token)
      }

      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiMethods.post<RegisterResponse>('/auth/register', userData)

      // Don't set auth token when creating users as admin
      // The admin remains logged in with their own token

      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiMethods.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
      // Don't throw error for logout - we want to clear local state regardless
    } finally {
      // Always clear token locally and persisted auth state
      clearAuthToken()
      await clearPersistedAuth()
    }
  }

  // Refresh auth token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiMethods.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      })
      
      // Update auth token
      if (response.token) {
        setAuthToken(response.token)
      }
      
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get current user profile from /auth endpoint
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await apiMethods.get<UserProfileResponse>('/auth');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update user profile
  static async updateProfile(userData: UpdateProfileRequest): Promise<User> {
    try {
      return await apiMethods.put<User>('/auth/profile', userData)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      return await apiMethods.post('/auth/change-password', passwordData)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      return await apiMethods.post('/auth/forgot-password', { email })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Reset password
  static async resetPassword(resetData: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiMethods.post('/auth/reset-password', resetData)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      return await apiMethods.post('/auth/verify-email', { token })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Resend verification email
  static async resendVerification(): Promise<{ message: string }> {
    try {
      return await apiMethods.post('/auth/resend-verification')
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export default AuthService
