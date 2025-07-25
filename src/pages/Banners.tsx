import React, { useState, useEffect } from "react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Banner Management</h2>
          <p className="text-muted-foreground">Create and manage promotional banners</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Banner
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted">
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
          <Card className="card-simple">
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
                    <div key={banner.id} className="p-6 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
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

        <TabsContent value="create" className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Simple Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Create Your Banner</h2>
              <p className="text-muted-foreground">Let's make something amazing together</p>
            </div>

            {/* Step-by-step Layout */}
            {/* Step 1: Upload Image */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-3">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Add Your Banner Image</h3>
                <p className="text-muted-foreground">The star of your campaign</p>
              </div>

              {!previewUrl ? (
                <div
                  className="border-2 border-dashed border-primary/40 rounded-xl p-12 bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer group text-center"
                  onClick={() => document.getElementById('banner-image')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-primary', 'bg-white/80');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-white/80');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-white/80');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const event = { target: { files } } as any;
                      handleFileChange(event);
                    }
                  }}
                >
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <UploadCloud className="w-20 h-20 text-primary mx-auto mb-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Drop your image here</h4>
                  <p className="text-muted-foreground mb-6">or click to browse from your computer</p>
                  <Button
                    type="button"
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base"
                  >
                    Choose Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Best size: 1200×400px • JPG, PNG up to 5MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Banner preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <button
                      type="button"
                      onClick={() => document.getElementById('banner-image')?.click()}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-colors"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Perfect! Your image looks great</span>
                  </div>
                </div>
              )}

              <Input
                id="banner-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required={!formData.image_url}
              />
            </div>

            {/* Step 2: Basic Details */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                  <span className="text-muted-foreground font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tell Us About Your Banner</h3>
                <p className="text-muted-foreground">Just the essentials</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">What's your banner about?</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Summer Sale - Up to 50% Off!"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">Add a description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell customers what makes this special..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[100px] text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link_url" className="text-base font-medium">Where should this link to? (optional)</Label>
                  <Input
                    id="link_url"
                    name="link_url"
                    placeholder="https://your-store.com/sale"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Schedule */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                  <span className="text-muted-foreground font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">When should it run?</h3>
                <p className="text-muted-foreground">Set your campaign dates</p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                        disabled={(date) => date < startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Final Submit Button */}

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {selectedFile && (
                      <span className="text-primary font-medium">
                        ✓ Banner image ready
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    disabled={uploading || (!selectedFile && !formData.image_url)}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Banner...
                      </>
                    ) : !selectedFile && !formData.image_url ? (
                      'Add Banner Image First'
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Banner
                      </>
                    )}
                  </Button>
                </div>
            </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Banners; 