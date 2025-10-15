import { apiMethods, handleApiError } from '@/lib/api'
import type { User } from '@/store/slices/authSlice'
import { jsonToUriParam, setupParams } from '@/helper/utils'

// User API types
export interface UserApiResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: UserData[];
  }
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  status: string;
  type: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  role_id: string;
}

export interface UserListResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: string;
  phone_number?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  type?: string;
  status?: string;
  phone_number?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByType: Record<string, number>;
}

// User service class
export class UserService {
  // Get all users with pagination and filters
  static async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    try {
      // Use setupParams from utils.ts to format the query parameters
      const queryParams = setupParams({
        keys: ['first_name', 'last_name'],
        pagination: {
          page: params.page || 1,
          pageSize: params.limit || 10
        },
        searchQuery: params.search,
      sortState: params.sortBy ? [{ key: params.sortBy, state: params.sortOrder || 'ASC' }] : undefined
      });

      const queryParamString = jsonToUriParam(queryParams);
      const url = `/users?query=${encodeURIComponent(queryParamString)}`;
      
      const response = await apiMethods.get<UserApiResponse>(url);
      
      // Transform response to match UserListResponse interface
      const { data } = response;
      const totalPages = Math.ceil(data.count / (params.limit || 10));
      
      return {
        users: data.rows,
        total: data.count,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserData> {
    try {
      const response = await apiMethods.get<{ status: number; message: string; data: UserData }>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Create new user
  static async createUser(userData: CreateUserRequest): Promise<UserData> {
    try {
      const response = await apiMethods.post<{ status: number; message: string; data: UserData }>('/users', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update user
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<UserData> {
    try {
      const response = await apiMethods.put<{ status: number; message: string; data: UserData }>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response = await apiMethods.delete<{ status: number; message: string }>(`/users/${id}`);
      return { message: response.message };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Activate/Deactivate user
  static async updateUserStatus(id: string, status: string): Promise<UserData> {
    try {
      const response = await apiMethods.put<{ status: number; message: string; data: UserData }>(`/users`, { id,status });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Calculate user statistics
  static calculateUserStats(users: UserData[]): UserStats {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    
    // Calculate new users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = users.filter(user => new Date(user.createdAt) >= startOfMonth).length;
    
    // Calculate users by type
    const usersByType: Record<string, number> = {};
    users.forEach(user => {
      if (!usersByType[user.type]) {
        usersByType[user.type] = 0;
      }
      usersByType[user.type]++;
    });
    
    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      usersByType
    };
  }

  // Get user statistics
  static async getUserStats(): Promise<UserStats> {
    try {
      return await apiMethods.get<UserStats>('/users/stats')
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Search users
  static async searchUsers(query: string): Promise<User[]> {
    try {
      return await apiMethods.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get users by role
  static async getUsersByRole(role: 'admin' | 'user'): Promise<User[]> {
    try {
      return await apiMethods.get<User[]>(`/users/role/${role}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Bulk delete users
  static async bulkDeleteUsers(userIds: string[]): Promise<{ message: string; deletedCount: number }> {
    try {
      return await apiMethods.post('/users/bulk-delete', { userIds })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Export users to CSV
  static async exportUsers(params: UserListParams = {}): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.search) queryParams.append('search', params.search)
      if (params.role) queryParams.append('role', params.role)
      
      const url = `/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiMethods.get(url, {
        responseType: 'blob',
      })
      
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Send password reset email to user
  static async sendPasswordReset(userId: string): Promise<{ message: string }> {
    try {
      return await apiMethods.post(`/users/${userId}/send-password-reset`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export default UserService
