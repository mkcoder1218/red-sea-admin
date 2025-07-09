import { apiMethods, handleApiError } from '@/lib/api';
import { config } from '@/lib/config';

export interface BannerData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Inactive' | 'Scheduled';
  priority: number;
  target_audience: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerListResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: BannerData[];
  };
}

export interface BannerResponse {
  status: number;
  message: string;
  data: BannerData;
}

export interface FileUploadResponse {
  status: number;
  message: string;
  data: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    path: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: null | string;
  }>;
}

export class BannerService {
  // Get all banners
  static async getBanners(): Promise<BannerData[]> {
    try {
      const response = await apiMethods.get<BannerListResponse>('/banners/admin');
      return response.data.rows;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get banner by ID
  static async getBannerById(id: string): Promise<BannerData> {
    try {
      const response = await apiMethods.get<BannerResponse>(`/banners/admin/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Create a new banner
  static async createBanner(bannerData: BannerData): Promise<BannerData> {
    try {
      const response = await apiMethods.post<BannerResponse>('/banners/admin', bannerData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update a banner
  static async updateBanner(id: string, bannerData: Partial<BannerData>): Promise<BannerData> {
    try {
      const response = await apiMethods.put<BannerResponse>(`/banners/admin/${id}`, bannerData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete a banner
  static async deleteBanner(id: string): Promise<{ message: string }> {
    try {
      // Send the ID as payload in the config object's data property
      const response = await apiMethods.delete(`/banners/admin`, {
        data: { id: id } // This is the correct way to send payload with DELETE
      });
      // The response might have a different structure, so handle both possibilities
      return { message: response.message || 'Banner deleted successfully' };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload files
  static async uploadFiles(files: FileList): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const response = await apiMethods.post<FileUploadResponse>(
        '/files/multiple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Helper method to get full image URL
  static getImageUrl(path: string): string {
    // Replace backslashes with forward slashes for URLs
    const formattedPath = path.replace(/\\/g, '/');
    
    // Get the API base URL from config
    const baseUrl = config.api.baseUrl;
    
    // Return the complete image URL using the process path
    return `${baseUrl}/${formattedPath}`;
  }
}

export default BannerService;