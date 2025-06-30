import { apiMethods, handleApiError } from '@/lib/api'
import { buildQueryParams } from '@/helper/utils'

// Order interface
export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  address_id: string
  payment_method_id: string
  subtotal: string
  shipping_fee: string
  tax: string
  total: string
  estimated_delivery: string | null
  promo_code_id: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface OrderListResponse {
  status: number
  message: string
  data: {
    count: number
    rows: Order[]
  }
}

export interface OrderListParams {
  page?: number
  limit?: number
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderStats {
  totalOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
}

export class OrderService {
  // Get all orders with pagination and filters
  static async getOrders(params: OrderListParams = {}): Promise<OrderListResponse> {
    try {
      const { page = 1, limit = 10 } = params
      const queryString = buildQueryParams(page, limit)
      
      const url = `/orders${queryString ? `?${queryString}` : ''}`
      const response = await apiMethods.get<OrderListResponse>(url)
      
      // The API response structure is already correct, so we can just return it
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await apiMethods.get<{ status: number, message: string, data: Order }>(`/orders/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Update order status
  static async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const response = await apiMethods.patch<{ status: number, message: string, data: Order }>(`/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get order statistics
  static async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await apiMethods.get<{ status: number, message: string, data: OrderStats }>('/orders/stats')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
} 