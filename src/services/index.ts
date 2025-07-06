// Export all services
export { AuthService } from './authService'
export { UserService } from './userService'
export { ProductService } from './productService'
export { FileService } from './fileService'
export { OrderService } from './orderService'
export { BannerService } from './bannerService'
export { DashboardService } from './dashboardService'

// Export types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from './authService'

export type {
  UserListResponse,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
  UserStats,
} from './userService'

export type {
  Product,
  ProductListResponse,
  ProductListParams,
  CreateProductRequest,
  UpdateProductRequest,
  ProductRegistrationRequest,
  ProductRegistrationResponse,
  ProductStats,
  Category,
  Brand,
} from './productService'

export type {
  FileUploadResponse,
  UploadProgress,
} from './fileService'

export type {
  Order,
  OrderListResponse,
  OrderListParams,
  OrderStats,
} from './orderService'

export type {
  BannerData,
  BannerListResponse,
  BannerResponse
} from './bannerService'

export type {
  DashboardStats,
  DashboardStatsResponse,
  OrderAnalytics,
  OrderAnalyticsResponse
} from './dashboardService'
