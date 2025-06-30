import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchProducts,
  setCurrentPage,
  setPageSize,
  setSearch,
  setCategory,
  setFeatured,
  setTrending,
  setPriceRange,
  setSorting,
  resetFilters,
  clearError
} from '@/store/slices/productsSlice'
import { ProductListParams } from '@/services/productService'

export const useProducts = () => {
  const dispatch = useAppDispatch()
  const {
    products,
    loading,
    error,
    pagination,
    filters
  } = useAppSelector((state) => state.products)

  // Build query parameters from current state
  const buildQueryParams = useCallback((): ProductListParams => {
    const params: ProductListParams = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
    }

    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category
    if (filters.featured !== null) params.featured = filters.featured
    if (filters.trending !== null) params.trending = filters.trending
    if (filters.minPrice !== null) params.minPrice = filters.minPrice
    if (filters.maxPrice !== null) params.maxPrice = filters.maxPrice
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    return params
  }, [pagination, filters])

  // Fetch products with current parameters
  const refetchProducts = useCallback(() => {
    const params = buildQueryParams()
    dispatch(fetchProducts(params))
  }, [dispatch, buildQueryParams])

  // Auto-fetch when parameters change
  useEffect(() => {
    refetchProducts()
  }, [refetchProducts])

  // Pagination actions
  const goToPage = useCallback((page: number) => {
    dispatch(setCurrentPage(page))
  }, [dispatch])

  const changePageSize = useCallback((size: number) => {
    dispatch(setPageSize(size))
  }, [dispatch])

  const goToNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(setCurrentPage(pagination.currentPage + 1))
    }
  }, [dispatch, pagination.currentPage, pagination.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      dispatch(setCurrentPage(pagination.currentPage - 1))
    }
  }, [dispatch, pagination.currentPage])

  // Filter actions
  const updateSearch = useCallback((search: string) => {
    dispatch(setSearch(search))
  }, [dispatch])

  const updateCategory = useCallback((category: string) => {
    dispatch(setCategory(category))
  }, [dispatch])

  const updateFeatured = useCallback((featured: boolean | null) => {
    dispatch(setFeatured(featured))
  }, [dispatch])

  const updateTrending = useCallback((trending: boolean | null) => {
    dispatch(setTrending(trending))
  }, [dispatch])

  const updatePriceRange = useCallback((min: number | null, max: number | null) => {
    dispatch(setPriceRange({ min, max }))
  }, [dispatch])

  const updateSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch(setSorting({ sortBy, sortOrder }))
  }, [dispatch])

  const clearFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const clearProductsError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Computed values
  const hasNextPage = pagination.currentPage < pagination.totalPages
  const hasPreviousPage = pagination.currentPage > 1
  const isFirstPage = pagination.currentPage === 1
  const isLastPage = pagination.currentPage === pagination.totalPages

  return {
    // Data
    products,
    loading,
    error,
    pagination,
    filters,
    
    // Computed values
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    
    // Actions
    refetchProducts,
    
    // Pagination
    goToPage,
    changePageSize,
    goToNextPage,
    goToPreviousPage,
    
    // Filters
    updateSearch,
    updateCategory,
    updateFeatured,
    updateTrending,
    updatePriceRange,
    updateSorting,
    clearFilters,
    
    // Error handling
    clearProductsError
  }
}
