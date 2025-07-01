import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/uiSlice";
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

// Mock data removed - now using real API data

const productStats = [
  { label: "Total Products", value: "1,234", change: "+12.3%", trend: "up", icon: Package2 },
  { label: "Active Products", value: "987", change: "+8.7%", trend: "up", icon: TrendingUp },
  { label: "Out of Stock", value: "23", change: "-15.2%", trend: "down", icon: TrendingDown },
  { label: "Total Revenue", value: "$234,567", change: "+22.1%", trend: "up", icon: DollarSign },
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

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
    
    // If it's already a complete URL, return it as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // If it doesn't already include the processpath
    if (!path.includes('/processpath/')) {
      // Replace backslashes with forward slashes
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
alert('file id'+fileIds)
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

      // Refresh products list
      refetchProducts();

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Product Management</h2>
          <p className="text-muted-foreground">Manage your Red sea  product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-effect">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold gradient-text">Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product for your Red sea . Fill in all the required information.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Product name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="199.99" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                          className="bg-background/50 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    rules={{ required: "Stock quantity is required", min: { value: 0, message: "Stock cannot be negative" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Add category options here */}
                            {categoriesLoading ? (
                              <SelectItem value="loading" disabled>
                                <span className="flex items-center">
                                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                  Loading categories...
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
                </div>

                <div className="space-y-4">
                  <FormLabel>Product Images</FormLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop images
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
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="glass-effect"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </>
                      )}
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      <div className="space-y-2">
                        {uploadedFiles.map((fileState, index) => (
                          <div key={index} className="p-3 bg-background/50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate max-w-[200px]">
                                  {fileState.file.name}
                                </span>
                                {fileState.status === 'completed' && (
                                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                    ✓ Uploaded
                                  </Badge>
                                )}
                                {fileState.status === 'uploading' && (
                                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Uploading
                                  </Badge>
                                )}
                                {fileState.status === 'error' && (
                                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                                    ✗ Failed
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {fileState.status === 'error' && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => retryFileUpload(index)}
                                    className="h-6 px-2"
                                  >
                                    Retry
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            {(fileState.status === 'uploading' || fileState.status === 'completed') && (
                              <Progress value={fileState.progress} className="h-1.5" />
                            )}

                            {/* Error message */}
                            {fileState.status === 'error' && fileState.error && (
                              <p className="text-xs text-red-400 mt-1">{fileState.error}</p>
                            )}

                            {/* File info */}
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>{(fileState.file.size / 1024 / 1024).toFixed(2)} MB</span>
                              {fileState.id && (
                                <span>ID: {fileState.id.substring(0, 8)}...</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 glass-effect">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Product</FormLabel>
                          <FormDescription>
                            Display this product in featured sections
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 glass-effect">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Trending Product</FormLabel>
                          <FormDescription>
                            Mark this product as trending
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

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      form.reset();
                      setUploadedFiles([]);
                    }}
                    className="glass-effect"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isSubmitting || isUploading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Product...
                      </>
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productStats.map((stat, index) => (
          <Card key={index} className="glass-effect border-border/50 hover:border-blue-500/30 transition-all duration-300">
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-effect border-border/50">
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
              <Button variant="outline" className="glass-effect">
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
                  className="glass-effect"
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
                  <Package2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No products found</p>
                  {filters.search && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchInput('');
                        clearFilters();
                      }}
                      className="mt-2 glass-effect"
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

                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-lg glass-effect border border-border/30 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package2 className="w-8 h-8 text-white" />
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
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-effect border border-border/50 bg-background/80 backdrop-blur-sm">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package2 className="w-4 h-4 mr-2" />
                              Manage Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">
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
    </div>
  );
};

export default Products;
