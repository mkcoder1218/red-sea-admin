import { apiMethods, handleApiError } from '@/lib/api'
import { config } from '@/lib/config'

// Product types based on API response
export interface ProductImage {
  id: string
  product_id: string
  file_id: string
  is_primary: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  file: {
    id: string
    path: string
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  rating: string
  review_count: number
  featured: boolean
  trending: boolean
  category_id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  category: Category
  product_images: ProductImage[]
}

export interface ProductListResponse {
  status: number
  message: string
  data: {
    count: number
    rows: Product[]
  }
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  featured?: boolean
  trending?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  brand: string
  sku: string
  stock: number
  images?: string[]
  isActive?: boolean
}

// Product registration request (for /products/register endpoint)
export interface ProductRegistrationRequest {
  product: {
    name: string
    description: string
    price: string
    stock: number
    featured: boolean
    trending: boolean
    category_id: string
  }
  files: string[]
}

// Product registration response
export interface ProductRegistrationResponse {
  status: number
  message: string
  data: Product
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  brand?: string
  sku?: string
  stock?: number
  images?: string[]
  isActive?: boolean
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  outOfStockProducts: number
  totalValue: number
  categoriesCount: number
  brandsCount: number
}

export interface Brand {
  id: string
  name: string
  description?: string
  productCount: number
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Utility function to process image URLs
const processImageUrls = (products: Product | Product[]): Product | Product[] => {
  const processProduct = (product: Product): Product => {
    if (product.product_images && product.product_images.length > 0) {
      return {
        ...product,
        product_images: product.product_images.map(image => {
          if (!image.file || !image.file.path) return image;
          
          // Process the path
          let path = image.file.path;
          
          // Skip if already an absolute URL
          if (path.startsWith('http')) {
            return image;
          }
          
          // Replace backslashes with forward slashes
          path = path.replace(/\\/g, '/');
          
          // Ensure path starts with a slash if not already
          if (!path.startsWith('/')) {
            path = '/' + path;
          }
          
          return {
            ...image,
            file: {
              ...image.file,
              path: `${config.api.baseUrl}${path}`
            }
          };
        })
      };
    }
    return product;
  };

  if (Array.isArray(products)) {
    return products.map(processProduct);
  }
  return processProduct(products);
}

// Product service class
export class ProductService {
  // Utility function to calculate pagination information
  static getPaginationInfo(response: ProductListResponse, currentPage: number, limit: number): PaginationInfo {
    const totalItems = response.data.count;
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }

  // Get all products with pagination and filters
  static async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })

      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiMethods.get<ProductListResponse>(url)
      
      // Process image URLs
      if (response.data && response.data.rows) {
        response.data.rows = processImageUrls(response.data.rows) as Product[]
      }
      
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const product = await apiMethods.get<Product>(`/products/${id}`)
      return processImageUrls(product) as Product
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Create new product
  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      return await apiMethods.post<Product>('/products', productData)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Register new product with files (for /products/register endpoint)
  static async registerProduct(productData: ProductRegistrationRequest): Promise<ProductRegistrationResponse> {
    try {
      return await apiMethods.post<ProductRegistrationResponse>('/products/register', productData)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Update product
  static async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    try {
      const product = await apiMethods.put<Product>(`/products/${id}`, productData)
      return processImageUrls(product) as Product
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      return await apiMethods.delete(`/products/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Toggle product status
  static async toggleProductStatus(id: string, isActive: boolean): Promise<Product> {
    try {
      return await apiMethods.patch<Product>(`/products/${id}/status`, { isActive })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Update product stock
  static async updateStock(id: string, stock: number): Promise<Product> {
    try {
      return await apiMethods.patch<Product>(`/products/${id}/stock`, { stock })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get product statistics
  static async getProductStats(): Promise<ProductStats> {
    try {
      return await apiMethods.get<ProductStats>('/products/stats')
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Search products
  static async searchProducts(
    query: string,
    params: Omit<ProductListParams, 'search'> = {}
  ): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add the search query
      queryParams.append('q', encodeURIComponent(query));
      
      // Add pagination and other filter parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const url = `/products/search?${queryParams.toString()}`;
      const response = await apiMethods.get<ProductListResponse>(url);
      
      // Process image URLs if we have products
      if (response.data && response.data.rows) {
        response.data.rows = processImageUrls(response.data.rows) as Product[];
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      return await apiMethods.get<Category[]>('/categories')
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get all brands
  static async getBrands(): Promise<Brand[]> {
    try {
      return await apiMethods.get<Brand[]>('/products/brands')
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Get products by category
  static async getProductsByCategory(
    category: string,
    params: Omit<ProductListParams, 'category'> = {}
  ): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination and filter parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const url = `/category/${encodeURIComponent(category)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiMethods.get<ProductListResponse>(url);
      
      // Process image URLs if we have products
      if (response.data && response.data.rows) {
        response.data.rows = processImageUrls(response.data.rows) as Product[];
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get products by brand
  static async getProductsByBrand(
    brand: string,
    params: Omit<ProductListParams, 'brand'> = {}
  ): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination and filter parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const url = `/products/brand/${encodeURIComponent(brand)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiMethods.get<ProductListResponse>(url);
      
      // Process image URLs if we have products
      if (response.data && response.data.rows) {
        response.data.rows = processImageUrls(response.data.rows) as Product[];
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Bulk update products
  static async bulkUpdateProducts(
    productIds: string[], 
    updates: Partial<UpdateProductRequest>
  ): Promise<{ message: string; updatedCount: number }> {
    try {
      return await apiMethods.post('/products/bulk-update', { productIds, updates })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Bulk delete products
  static async bulkDeleteProducts(productIds: string[]): Promise<{ message: string; deletedCount: number }> {
    try {
      return await apiMethods.post('/products/bulk-delete', { productIds })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Upload product image
  static async uploadProductImage(productId: string, imageFile: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      return await apiMethods.post(`/products/${productId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Export products to CSV
  static async exportProducts(params: ProductListParams = {}): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
      
      const url = `/products/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiMethods.get(url, {
        responseType: 'blob',
      })
      
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

export default ProductService
