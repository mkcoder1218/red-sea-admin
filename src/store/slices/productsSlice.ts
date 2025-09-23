import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ProductService, Product, ProductListParams } from '@/services/productService'

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductListParams = {}) => {
    const response = await ProductService.getProducts(params)
    return response
  }
)

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await ProductService.deleteProduct(id)
    return id
  }
)

// Products state interface
interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  deleting: string | null // ID of product being deleted
  pagination: {
    currentPage: number
    totalCount: number
    pageSize: number
    totalPages: number
  }
  filters: {
    search: string
    category: string
    featured: boolean | null
    trending: boolean | null
    minPrice: number | null
    maxPrice: number | null
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  deleting: null,
  pagination: {
    currentPage: 1,
    totalCount: 0,
    pageSize: 10,
    totalPages: 0
  },
  filters: {
    search: '',
    category: '',
    featured: null,
    trending: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Update pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload
      state.pagination.currentPage = 1 // Reset to first page when changing page size
    },
    
    // Update filters
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.pagination.currentPage = 1 // Reset to first page when filtering
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload
      state.pagination.currentPage = 1
    },
    setFeatured: (state, action: PayloadAction<boolean | null>) => {
      state.filters.featured = action.payload
      state.pagination.currentPage = 1
    },
    setTrending: (state, action: PayloadAction<boolean | null>) => {
      state.filters.trending = action.payload
      state.pagination.currentPage = 1
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.filters.minPrice = action.payload.min
      state.filters.maxPrice = action.payload.max
      state.pagination.currentPage = 1
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy
      state.filters.sortOrder = action.payload.sortOrder
      state.pagination.currentPage = 1
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.currentPage = 1
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Clear deleting state
    clearDeleting: (state) => {
      state.deleting = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.data.rows
        state.pagination.totalCount = action.payload.data.count
        state.pagination.totalPages = Math.ceil(action.payload.data.count / state.pagination.pageSize)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.deleting = action.meta.arg
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleting = null
        // Remove the deleted product from the list
        state.products = state.products.filter(product => product.id !== action.payload)
        // Update total count
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1)
        state.pagination.totalPages = Math.ceil(state.pagination.totalCount / state.pagination.pageSize)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = null
        state.error = action.error.message || 'Failed to delete product'
      })
  }
})

export const {
  setCurrentPage,
  setPageSize,
  setSearch,
  setCategory,
  setFeatured,
  setTrending,
  setPriceRange,
  setSorting,
  resetFilters,
  clearError,
  clearDeleting
} = productsSlice.actions

export default productsSlice.reducer
