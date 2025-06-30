import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { BannerService, BannerData } from "@/services/bannerService";
import { Image as ImageIcon, Plus, Loader2, UploadCloud, CalendarIcon, Trash2, ExternalLink } from "lucide-react";
import { config } from "@/lib/config";

const Banners = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState<Partial<BannerData>>({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    status: "Active",
    priority: 50,
    target_audience: "ALL"
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // +30 days
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await BannerService.getBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      toast({
        title: "Error",
        description: "Failed to load banners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get the proper image URL using the process path URL
  const getProcessedImageUrl = (url: string) => {
    // Skip if already a processed URL or empty
    if (!url || url.includes('/processpath/')) {
      return url;
    }

    // Replace backslashes with forward slashes
    const formattedPath = url.replace(/\\/g, '/');
    
    // Get the API base URL
    const baseUrl = config.api.baseUrl;
    
    // Return the complete image URL using the process path
    return `${baseUrl}/processpath/${formattedPath}`;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle number fields (like priority)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch to create tab
  const handleCreateClick = () => {
    setActiveTab("create");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let imageUrl = formData.image_url || "";

      // First upload the file if selected
      if (selectedFile) {
        try {
          // Create a FileList-like object for upload
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(selectedFile);
          const fileList = dataTransfer.files;
          
          // Upload the file
          const uploadResponse = await BannerService.uploadFiles(fileList);
          
          if (uploadResponse.data && uploadResponse.data.length > 0) {
            const uploadedFile = uploadResponse.data[0];
            
            // Get complete image URL using the path
            imageUrl = BannerService.getImageUrl(uploadedFile.path);
          } else {
            throw new Error("File upload failed");
          }
        } catch (error) {
          console.error("File upload error:", error);
          toast({
            title: "Upload Error",
            description: "Failed to upload banner image. Please try again.",
            variant: "destructive"
          });
          setUploading(false);
          return;
        }
      }
      
      // Prepare banner data
      const bannerData: BannerData = {
        ...formData as BannerData,
        image_url: imageUrl,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };
      
      // Create the banner
      await BannerService.createBanner(bannerData);
      
      toast({
        title: "Success",
        description: "Banner created successfully!",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        status: "Active",
        priority: 50,
        target_audience: "ALL"
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      
      // Refresh banners list and switch to list tab
      fetchBanners();
      setActiveTab("list");
    } catch (error) {
      console.error("Failed to create banner:", error);
      toast({
        title: "Error",
        description: "Failed to create banner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete a banner
  const handleDelete = async (id: string) => {
    try {
      await BannerService.deleteBanner(id);
      toast({
        title: "Success",
        description: "Banner deleted successfully!",
      });
      // Refresh banners list
      fetchBanners();
    } catch (error) {
      console.error("Failed to delete banner:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Banner Management</h2>
          <p className="text-muted-foreground">Create and manage promotional banners</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-violet-500 to-indigo-600"
          onClick={handleCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Banner
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-effect border border-border/50">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Banner List
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Banner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Active Banners
              </CardTitle>
              <CardDescription>
                Manage your promotional banners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                  <h3 className="mt-4 text-lg font-medium">No banners found</h3>
                  <p className="text-muted-foreground mt-2">
                    Get started by creating your first promotional banner.
                  </p>
                  <Button 
                    className="mt-4"
                    variant="outline"
                    onClick={handleCreateClick}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Banner
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div key={banner.id} className="p-4 rounded-lg glass-effect border border-border/30 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="w-full md:w-36 h-36 bg-background/50 rounded overflow-hidden">
                          {banner.image_url ? (
                            <img 
                              src={banner.image_url} 
                              alt={banner.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-background/50">
                              <ImageIcon className="h-12 w-12 text-muted-foreground opacity-30" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{banner.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                banner.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                banner.status === 'Inactive' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {banner.status}
                              </span>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                                Priority: {banner.priority}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {banner.description}
                          </p>
                          
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{new Date(banner.start_date).toLocaleDateString()} - {new Date(banner.end_date).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-red-400 hover:text-red-600 hover:border-red-600"
                              onClick={() => banner.id && handleDelete(banner.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                            {banner.link_url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => window.open(banner.link_url, '_blank')}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                Visit Link
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-500" />
                  Create New Banner
                </CardTitle>
                <CardDescription>Fill in the details to create a promotional banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Banner details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Summer Sale Extravaganza"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Save up to 60% on seasonal items! Limited time offer."
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50 min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="link_url">Link URL</Label>
                        <Input
                          id="link_url"
                          name="link_url"
                          placeholder="https://example.com/summer-sale"
                          value={formData.link_url}
                          onChange={handleInputChange}
                          className="bg-background/50"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Status, priority, and audience */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status as string}
                            onValueChange={(value) => handleSelectChange("status", value)}
                          >
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority (0-100)</Label>
                          <Input
                            id="priority"
                            name="priority"
                            type="number"
                            value={formData.priority}
                            onChange={handleNumberChange}
                            className="bg-background/50"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="target_audience">Target Audience</Label>
                        <Select
                          value={formData.target_audience as string}
                          onValueChange={(value) => handleSelectChange("target_audience", value)}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">All Users</SelectItem>
                            <SelectItem value="REGISTERED">Registered Users</SelectItem>
                            <SelectItem value="GUEST">Guest Users</SelectItem>
                            <SelectItem value="PREMIUM">Premium Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Date selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-background/50"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => setStartDate(date || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-background/50"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => setEndDate(date || new Date())}
                                initialFocus
                                disabled={(date) => date < startDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Banner Image <span className="text-red-500">*</span></Label>
                      <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-48 w-full bg-background/50 rounded-md overflow-hidden">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Banner preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">
                                  Upload banner image
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="w-full">
                            <Label htmlFor="banner-image" className="cursor-pointer w-full">
                              <div className="flex items-center justify-center w-full py-2 px-4 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                                <UploadCloud className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm font-medium">
                                  {selectedFile ? "Change image" : "Select image"}
                                </span>
                              </div>
                            </Label>
                            <Input
                              id="banner-image"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              required={!formData.image_url}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200x400 pixels, JPG or PNG format
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        placeholder="https://example.com/banners/image.jpg"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="bg-background/50"
                        disabled={!!selectedFile}
                      />
                      <p className="text-xs text-muted-foreground">
                        {selectedFile ? "URL will be auto-generated after upload" : "Or provide a direct URL to an image"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-violet-500 to-indigo-600"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Banner
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Banners; 