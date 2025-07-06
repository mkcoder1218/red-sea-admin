import { apiMethods, handleApiError } from '@/lib/api'

// Dashboard statistics interface
export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalProductPrice: number
  totalRevenue: number
}

// Order analytics interface
export interface OrderAnalytics {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  shippedToday: number
}

// Dashboard statistics response
export interface DashboardStatsResponse {
  status: number
  message: string
  data: DashboardStats
}

// Order analytics response
export interface OrderAnalyticsResponse {
  status: number
  message: string
  data: OrderAnalytics
}

// Dashboard service class
export class DashboardService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      console.log('Calling dashboard stats API endpoint...');
      const response = await apiMethods.get<DashboardStatsResponse>('/dashboard/stats');
      console.log('API Response received:', response);
      
      // Make sure we properly process the response
      if (!response || !response.data) {
        console.error('Invalid API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      // Add default values if any properties are missing
      const processedResponse: DashboardStatsResponse = {
        status: response.status || 200,
        message: response.message || '',
        data: {
          totalUsers: response.data.totalUsers || 0,
          totalProducts: response.data.totalProducts || 0,
          totalProductPrice: response.data.totalProductPrice || 0,
          totalRevenue: response.data.totalRevenue || 0
        }
      };
      
      return processedResponse;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw handleApiError(error);
    }
  }

  // Get order analytics
  static async getOrderAnalytics(): Promise<OrderAnalyticsResponse> {
    try {
      console.log('Calling order analytics API endpoint...');
      const response = await apiMethods.get<OrderAnalyticsResponse>('/dashboard/order-analytics');
      console.log('Order Analytics API Response received:', response);
      
      // Make sure we properly process the response
      if (!response || !response.data) {
        console.error('Invalid API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      // Add default values if any properties are missing
      const processedResponse: OrderAnalyticsResponse = {
        status: response.status || 200,
        message: response.message || '',
        data: {
          totalOrders: response.data.totalOrders || 0,
          pendingOrders: response.data.pendingOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          shippedToday: response.data.shippedToday || 0
        }
      };
      
      return processedResponse;
    } catch (error) {
      console.error('Error in getOrderAnalytics:', error);
      throw handleApiError(error);
    }
  }
}

export default DashboardService 