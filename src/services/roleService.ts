import { apiMethods, handleApiError } from '@/lib/api';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  type: string;
  access_rules: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoleListResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Role[];
  };
}

export class RoleService {
  // Get all roles
  static async getRoles(): Promise<Role[]> {
    try {
      const response = await apiMethods.get<RoleListResponse>('/roles');
      return response.data.rows;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get role by ID
  static async getRoleById(id: string): Promise<Role> {
    try {
      const response = await apiMethods.get<{ status: number; message: string; data: Role }>(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
