import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package2, Search, Filter, MoreHorizontal, Plus, Eye, Edit, Trash2, Star, TrendingUp, TrendingDown, DollarSign, Upload, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductsPagination from "@/components/ProductsPagination";
import { Product, ProductService } from "@/services/productService";
import { FileService, type UploadProgress } from "@/services/fileService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/slices/uiSlice";
import { deleteProduct } from "@/store/slices/productsSlice";
import { apiMethods } from "@/lib/api";
import { config } from "@/lib/config";

// Form types
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: number;
  category_id: string;
  featured: boolean;
  trending: boolean;
}

// Define API category interface to match what's returned from the API
// without conflicting with the imported types
interface ApiCategory {
  id: string;
  name: string;
  description?: string;
}

// Interface for categories response
interface CategoryResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: ApiCategory[];
  };
}

// Interface for product analytics response
interface ProductAnalyticsResponse {
  status: number;
  message: string;
  data: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    totalRevenue: number;
  };
}

// Default product stats
const defaultProductStats = [
  { label: "Total Products", value: "0", change: "0%", trend: "up", icon: Package2 },
  { label: "Active Products", value: "0", change: "0%", trend: "up", icon: TrendingUp },
  { label: "Out of Stock", value: "0", change: "0%", trend: "down", icon: TrendingDown },
  { label: "Total Revenue", value: "$0", change: "0%", trend: "up", icon: DollarSign },
];

// File upload state interface
interface FileUploadState {
  file: File
  id?: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

const Products = () => {
  const dispatch = useAppDispatch();
  const { deleting } = useAppSelector((state) => state.products);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadState[]>([]);
  const [editUploadedFiles, setEditUploadedFiles] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [productStats, setProductStats] = useState([...defaultProductStats]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Use the products hook for API integration
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    changePageSize,
    updateSearch,
    updateCategory,
    updateFeatured,
    updateTrending,
    clearFilters,
    hasNextPage,
    hasPreviousPage,
    clearProductsError,
    refetchProducts
  } = useProducts();

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      category_id: "",
      featured: false,
      trending: false,
    },
  });

  const editForm = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      category_id: "",
      featured: false,
      trending: false,
    },
  });

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        // Use apiMethods to fetch from /categories endpoint instead of /products/categories
        const response = await apiMethods.get<CategoryResponse>('/categories');
        setCategories(response.data.rows);
      } catch (error) {
        console.error('Error fetching categories:', error);
        dispatch(addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load categories'
        }));
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  // Fetch product analytics function
  const fetchProductAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await apiMethods.get<ProductAnalyticsResponse>('/dashboard/product-analytics');
      
      if (response.status === 200 && response.data) {
        const { totalProducts, activeProducts, outOfStock, totalRevenue } = response.data;
        
        // Format the data for the stats cards
        const updatedStats = [
          { 
            label: "Total Products", 
            value: totalProducts.toLocaleString(), 
            change: "0%", // We don't have change data from the API
            trend: "up", 
            icon: Package2 
          },
          { 
            label: "Active Products", 
            value: activeProducts.toLocaleString(), 
            change: "0%", 
            trend: "up", 
            icon: TrendingUp 
          },
          { 
            label: "Out of Stock", 
            value: outOfStock.toLocaleString(), 
            change: "0%", 
            trend: "down", 
            icon: TrendingDown 
          },
          { 
            label: "Total Revenue", 
            value: `$${totalRevenue.toLocaleString()}`, 
            change: "0%", 
            trend: "up", 
            icon: DollarSign 
          },
        ];
        
        setProductStats(updatedStats);
      }
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load product analytics'
      }));
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch product analytics when component mounts
  useEffect(() => {
    fetchProductAnalytics();
  }, [dispatch]);

  // Helper functions for product display
  const getProductStatus = (product: Product) => {
    if (product.stock === 0) return 'Out of Stock';
    if (product.deletedAt) return 'Deleted';
    return 'Active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Out of Stock': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Deleted': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-400', label: 'Out of Stock' };
    if (stock < 20) return { color: 'text-yellow-400', label: 'Low Stock' };
    return { color: 'text-green-400', label: 'In Stock' };
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.product_images.find(img => img.is_primary);
    if (!primaryImage || !primaryImage.file || !primaryImage.file.path) {
      return null;
    }
    
    // Get the path
    let path = primaryImage.file.path;
    
    if (path.startsWith('http')) {
      return path;
    }
    if (!path.includes('/processpath/')) {
      path = path.replace(/\\/g, '/');
      
      // Get the API base URL from config
      const baseUrl = config.api.baseUrl;
      
      // Return the complete image URL using the process path
      return `${baseUrl}/${path}`;
    }
    
    return path;
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearch(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, updateSearch]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Step 1: Upload all files first (if any)
      let fileIds: string[] = [];

      if (uploadedFiles.length > 0) {
        // Check if all files are uploaded successfully
        const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.id);
        const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');

        if (pendingFiles.length > 0) {
          throw new Error('Please wait for all files to upload before submitting');
        }

        if (uploadedFiles.some(f => f.status === 'error')) {
          throw new Error('Some files failed to upload. Please remove failed files and try again');
        }

        fileIds = completedFiles.map(f => f.id!);
      }
      // Step 2: Register the product with file IDs
      const productData = {
        product: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          featured: data.featured,
          trending: data.trending,
          category_id: data.category_id,
        },
        files: fileIds,
      };

      console.log("Submitting product data:", productData);

      const response = await ProductService.registerProduct(productData);

      console.log("Product created successfully:", response);

      // Show success notification
      dispatch(addNotification({
        type: 'success',
        title: 'Product Created',
        message: `${data.name} has been created successfully!`
      }));

      // Reset form and close dialog
      setIsDialogOpen(false);
      form.reset();
      setUploadedFiles([]);

      // Refresh products list and analytics
      refetchProducts();
      
      // Refresh product analytics
      fetchProductAnalytics();

    } catch (error) {
      console.error("Error creating product:", error);

      // Show error notification
      dispatch(addNotification({
        type: 'error',
        title: 'Product Creation Failed',
        message: error instanceof Error ? error.message : 'Failed to create product. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: FileUploadState[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));

    // Add files to state
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Process files in batch using the new uploadFiles method
    try {
      const filesArray = Array.from(files);
      const response = await FileService.uploadFiles(
        filesArray,
        (progress: UploadProgress) => {
          // Update progress for all files
          setUploadedFiles(prev => prev.map((f, idx) => {
            const currentFileIndex = uploadedFiles.length + idx;
            if (currentFileIndex >= uploadedFiles.length && currentFileIndex < uploadedFiles.length + newFiles.length) {
              return { ...f, status: 'uploading' as const, progress: progress.percentage };
            }
            return f;
          }));
        }
      );

      // Update all uploaded files with their respective IDs from the response
      for (let i = 0; i < response.data.length; i++) {
        const fileIndex = uploadedFiles.length + i;
        const fileData = response.data[i];

        if (fileIndex < newFiles.length + uploadedFiles.length) {
          setUploadedFiles(prev => prev.map((f, idx) =>
            idx === fileIndex ? {
              ...f,
              status: 'completed' as const,
              id: fileData.id,
              progress: 100
            } : f
          ));
        }
      }

    } catch (error) {
      // Mark all new files as failed
      const newFilesStartIndex = uploadedFiles.length;
      setUploadedFiles(prev => prev.map((f, idx) => {
        if (idx >= newFilesStartIndex && idx < newFilesStartIndex + newFiles.length) {
          return {
            ...f,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Upload failed'
          };
        }
        return f;
      }));
      
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleEditFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: FileUploadState[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));

    // Add files to edit state
    setEditUploadedFiles(prev => [...prev, ...newFiles]);
    setIsEditUploading(true);

    // Process files in batch using the new uploadFiles method
    try {
      const filesArray = Array.from(files);
      const response = await FileService.uploadFiles(
        filesArray,
        (progress: UploadProgress) => {
          // Update progress for all files
          setEditUploadedFiles(prev => prev.map((f, idx) => {
            const currentFileIndex = editUploadedFiles.length + idx;
            if (currentFileIndex >= editUploadedFiles.length && currentFileIndex < editUploadedFiles.length + newFiles.length) {
              return { ...f, status: 'uploading' as const, progress: progress.percentage };
            }
            return f;
          }));
        }
      );

      // Update all uploaded files with their respective IDs from the response
      for (let i = 0; i < response.data.length; i++) {
        const fileIndex = editUploadedFiles.length + i;
        const fileData = response.data[i];

        if (fileIndex < newFiles.length + editUploadedFiles.length) {
          setEditUploadedFiles(prev => prev.map((f, idx) =>
            idx === fileIndex ? {
              ...f,
              status: 'completed' as const,
              id: fileData.id,
              progress: 100
            } : f
          ));
        }
      }

    } catch (error) {
      // Mark all new files as failed
      const newFilesStartIndex = editUploadedFiles.length;
      setEditUploadedFiles(prev => prev.map((f, idx) => {
        if (idx >= newFilesStartIndex && idx < newFilesStartIndex + newFiles.length) {
          return {
            ...f,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Upload failed'
          };
        }
        return f;
      }));
      
      console.error("Error uploading files:", error);
    } finally {
      setIsEditUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const removeEditFile = (index: number) => {
    setEditUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Handle view product details
  const handleViewProduct = (product: Product) => {
    setProductToView(product);
    setViewDetailOpen(true);
  };

  const closeViewDetail = () => {
    setViewDetailOpen(false);
    setProductToView(null);
  };

  // Handle product deletion
  const handleDeleteProduct = async (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: `${productToDelete.name} has been deleted successfully!`
      }));
      
      // Refresh product analytics
      fetchProductAnalytics();
      
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Failed to delete product'
      }));
    } finally {
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const retryFileUpload = async (index: number) => {
    const fileState = uploadedFiles[index];
    if (!fileState || fileState.status !== 'error') return;

    try {
      // Reset status to uploading
      setUploadedFiles(prev => prev.map((f, idx) =>
        idx === index ? { ...f, status: 'uploading' as const, error: undefined, progress: 0 } : f
      ));

      const response = await FileService.uploadFiles(
        [fileState.file],
        (progress: UploadProgress) => {
          setUploadedFiles(prev => prev.map((f, idx) =>
            idx === index ? { ...f, progress: progress.percentage } : f
          ));
        }
      );

      // Update with completed status
      setUploadedFiles(prev => prev.map((f, idx) =>
        idx === index ? {
          ...f,
          status: 'completed' as const,
          id: response.data[0].id,
          progress: 100
        } : f
      ));

    } catch (error) {
      console.error(`Error retrying upload for ${fileState.file.name}:`, error);

      setUploadedFiles(prev => prev.map((f, idx) =>
        idx === index ? {
          ...f,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ));
    }
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    editForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      featured: product.featured,
      trending: product.trending,
    });
    // Reset edit uploaded files
    setEditUploadedFiles([]);
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const onEditSubmit = async (data: ProductFormData) => {
    if (!productToEdit) return;

    try {
      setIsEditSubmitting(true);

      // Step 1: Upload all new files first (if any)
      let fileIds: string[] = [];

      if (editUploadedFiles.length > 0) {
        // Check if all files are uploaded successfully
        const completedFiles = editUploadedFiles.filter(f => f.status === 'completed' && f.id);
        const pendingFiles = editUploadedFiles.filter(f => f.status === 'pending');

        if (pendingFiles.length > 0) {
          throw new Error('Please wait for all files to upload before submitting');
        }

        if (editUploadedFiles.some(f => f.status === 'error')) {
          throw new Error('Some files failed to upload. Please remove failed files and try again');
        }

        fileIds = completedFiles.map(f => f.id!);
      }

      // Step 2: Update the product
      const productData = {
        id: productToEdit.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        featured: data.featured,
        trending: data.trending,
        category_id: data.category_id,
      };

      console.log("Updating product data:", productData);

      // Use PUT request to /products endpoint with flattened payload
      const response = await apiMethods.put('/products', productData);

      console.log("Product updated successfully:", response);

      // Show success notification
      dispatch(addNotification({
        type: 'success',
        title: 'Product Updated',
        message: `${data.name} has been updated successfully!`
      }));

      // Reset form and close dialog
      setIsEditDialogOpen(false);
      editForm.reset();
      setEditUploadedFiles([]);
      setProductToEdit(null);

      // Refresh products list and analytics
      refetchProducts();
      
      // Refresh product analytics
      fetchProductAnalytics();

    } catch (error) {
      console.error("Error updating product:", error);

      // Show error notification
      dispatch(addNotification({
        type: 'error',
        title: 'Product Update Failed',
        message: error instanceof Error ? error.message : 'Failed to update product. Please try again.'
      }));
    } finally {
      setIsEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Product Management</h2>
          <p className="text-muted-foreground">Manage your Red Sea Market product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Start by uploading product images, then add basic details.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Upload Section - Primary Focus */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div
                      className="border-2 border-dashed border-primary/30 rounded-xl p-6 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-primary', 'bg-primary/15');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/15');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/15');
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length > 0) {
                          const event = { target: { files } } as any;
                          handleFileUpload(event);
                        }
                      }}
                    >
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Add Product Images</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                        Drag & drop your product images here, or click to browse.
                        <br />
                        <span className="text-primary font-medium">Multiple images supported</span>
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        disabled={isUploading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Uploading Images...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mr-2" />
                            Select Images
                          </>
                        )}
                      </Button>
                      {uploadedFiles.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-4">
                          Recommended: JPG, PNG • Max 5MB each
                        </p>
                      )}
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          Uploaded Images ({uploadedFiles.length})
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={isUploading}
                          className="text-primary border-primary/30 hover:bg-primary/10"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add More
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {uploadedFiles.map((fileState, index) => (
                          <div key={index} className="relative p-3 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium truncate flex-1">
                                {fileState.file.name}
                              </span>
                              {fileState.status === 'completed' && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              )}
                            </div>
                            {fileState.status === 'uploading' && (
                              <div className="space-y-1">
                                <Progress value={fileState.progress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground">{fileState.progress}% uploaded</p>
                              </div>
                            )}
                            {fileState.status === 'completed' && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-primary font-medium">✓ Ready</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                                  }}
                                  className="w-5 h-5 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-xs hover:bg-destructive/20 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Helpful Tips */}
                {uploadedFiles.length > 0 && uploadedFiles.length < 3 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-bold">💡</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">Pro Tip</h4>
                        <p className="text-xs text-muted-foreground">
                          Products with 3+ images get <span className="text-primary font-medium">40% more views</span>.
                          Add different angles, close-ups, and lifestyle shots!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Details - Simplified */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Product name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="price"
                      rules={{ required: "Price is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input placeholder="$199.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      rules={{ required: "Stock is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category_id"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesLoading ? (
                              <SelectItem value="loading" disabled>
                                <span className="flex items-center">
                                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                  Loading...
                                </span>
                              </SelectItem>
                            ) : (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief product description..."
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Featured and Trending Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured</FormLabel>
                            <FormDescription className="text-sm">
                              Show in featured section
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trending"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Trending</FormLabel>
                            <FormDescription className="text-sm">
                              Mark as trending product
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>




                <DialogFooter>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {uploadedFiles.length > 0 && (
                        <span className="text-primary font-medium">
                          {uploadedFiles.length} image{uploadedFiles.length !== 1 ? 's' : ''} ready
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          form.reset();
                          setUploadedFiles([]);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                        disabled={isSubmitting || isUploading || uploadedFiles.length === 0}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating Product...
                          </>
                        ) : uploadedFiles.length === 0 ? (
                          'Add Images First'
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Product
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsLoading ? (
          // Show skeleton loading cards
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="card-simple">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-muted/80 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-muted/60 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center animate-pulse">
                    <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Show actual stats
          productStats.map((stat, index) => (
            <Card key={index} className="card-simple hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search and Filters */}
      <Card className="card-simple">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Browse and manage your product inventory</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64 bg-background/50"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-muted-foreground">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-red-400 mb-2">Error loading products: {error}</p>
                <Button
                  variant="outline"
                  onClick={clearProductsError}

                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Products List */}
          {!loading && !error && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <img src="/public/logo.png" alt="No products" className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                  {filters.search && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchInput('');
                        clearFilters();
                      }}
                      className="mt-2"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const productStatus = getProductStatus(product);
                  const primaryImage = getPrimaryImage(product);
console.log("Primary image URL:", primaryImage);
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.name}
                                  crossOrigin="anonymous"
              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img src="/public/logo.png" alt="No image" className="w-8 h-8" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{product.name}</h4>
                            <Badge variant="outline" className={getStatusColor(productStatus)}>
                              {productStatus}
                            </Badge>
                            {product.featured && (
                              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Featured
                              </Badge>
                            )}
                            {product.trending && (
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{product.category.name}</span>
                            <span>•</span>
                            <span>ID: {product.id.substring(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{product.rating}</span>
                              <span className="text-muted-foreground">({product.review_count} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-lg">${product.price}</p>
                          <p className={`text-sm ${stockStatus.color}`}>
                            {product.stock} in stock
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={deleting === product.id}>
                              {deleting === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <img src="/public/logo.png" alt="Manage Stock" className="w-4 h-4 mr-2" />
                              Manage Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 focus:text-red-400"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={deleting === product.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="border-t border-border/50 pt-4">
            <ProductsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </div>
        )}
      </Card>
      
      {/* View Product Details Modal */}
      <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information for {productToView?.name}
            </DialogDescription>
          </DialogHeader>
          
          {productToView && (
            <div className="space-y-6">
              {/* Product Images */}
              {productToView.product_images && productToView.product_images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productToView.product_images.map((image, index) => {
                      const imageUrl = image.file?.path ? (
                        image.file.path.startsWith('http') 
                          ? image.file.path 
                          : `${config.api.baseUrl}/${image.file.path.replace(/\\/g, '/')}`
                      ) : null;
                      
                      return (
                        <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={`${productToView.name} - Image ${index + 1}`}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <img src="/public/logo.png" alt="No image" className="w-12 h-12" />
                            </div>
                          )}
                          {image.is_primary && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                              Primary
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                      <p className="text-foreground">{productToView.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground">{productToView.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <p className="text-foreground">{productToView.category.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Product ID</label>
                      <p className="text-foreground font-mono text-sm">{productToView.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing & Stock</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Price</label>
                      <p className="text-2xl font-bold text-foreground">${productToView.price}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground">{productToView.stock} units</p>
                        <Badge variant="outline" className={getStockStatus(productToView.stock).color}>
                          {getStockStatus(productToView.stock).label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(getProductStatus(productToView))}>
                          {getProductStatus(productToView)}
                        </Badge>
                        {productToView.featured && (
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                        {productToView.trending && (
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reviews & Rating */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reviews & Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold">{productToView.rating}</span>
                    <span className="text-muted-foreground">/ 5</span>
                  </div>
                  <div className="text-muted-foreground">
                    {productToView.review_count} review{productToView.review_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-foreground">{new Date(productToView.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-foreground">{new Date(productToView.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeViewDetail}>
              Close
            </Button>
            <Button onClick={() => {
              closeViewDetail();
              if (productToView) {
                handleEditProduct(productToView);
              }
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and images for {productToEdit?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              {/* Upload Section for Additional Images */}
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className="border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => document.getElementById('edit-file-upload')?.click()}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Add New Images</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload additional product images
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditFileUpload}
                      className="hidden"
                      id="edit-file-upload"
                      disabled={isEditUploading}
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={isEditUploading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isEditUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Add Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {editUploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      New Images ({editUploadedFiles.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {editUploadedFiles.map((fileState, index) => (
                        <div key={index} className="relative p-2 bg-card rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium truncate flex-1">
                              {fileState.file.name}
                            </span>
                            {fileState.status === 'completed' && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          {fileState.status === 'uploading' && (
                            <Progress value={fileState.progress} className="h-1" />
                          )}
                          {fileState.status === 'completed' && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-primary">✓ Ready</span>
                              <button
                                type="button"
                                onClick={() => removeEditFile(index)}
                                className="w-4 h-4 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-xs hover:bg-destructive/20"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <FormField
                  control={editForm.control}
                  name="name"
                  rules={{ required: "Product name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={editForm.control}
                    name="price"
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="$199.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="stock"
                    rules={{ required: "Stock is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="category_id"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              <span className="flex items-center">
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                Loading...
                              </span>
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief product description..."
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured and Trending Options */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={editForm.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <FormDescription className="text-sm">
                            Show in featured section
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="trending"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Trending</FormLabel>
                          <FormDescription className="text-sm">
                            Mark as trending product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <div className="flex gap-3 w-full justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      editForm.reset();
                      setEditUploadedFiles([]);
                      setProductToEdit(null);
                    }}
                    disabled={isEditSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isEditSubmitting || isEditUploading}
                  >
                    {isEditSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating Product...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone and will permanently remove the product from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelDeleteProduct}
              disabled={deleting === productToDelete?.id}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              disabled={deleting === productToDelete?.id}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting === productToDelete?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
