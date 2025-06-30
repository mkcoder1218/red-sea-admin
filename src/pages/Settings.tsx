import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Globe, Palette, Mail, Loader2 } from "lucide-react";
import { AuthService, UserProfile } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await AuthService.getUserProfile();
      setUserProfile(userData);
      
      // Initialize form values with user data
      setProfileForm({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      // Here we would call an API to update the profile
      // For now, just show a success toast
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast({
          title: "Error",
          description: "New password and confirmation do not match.",
          variant: "destructive"
        });
        return;
      }

      // Here we would call an API to update the password
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Settings</h2>
          <p className="text-muted-foreground">Manage your Red sea  configuration and preferences</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
          All Systems Operational
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="glass-effect border border-border/50">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Red sea  Settings
              </CardTitle>
              <CardDescription>Configure your Red sea  basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="Red sea -name">Red sea  Name</Label>
                  <Input id="Red sea -name" defaultValue="B2C Red sea " className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Red sea -url">Website URL</Label>
                  <Input id="Red sea -url" defaultValue="https://Red sea .com" className="bg-background/50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  defaultValue="Your premier B2C Red sea  for quality products" 
                  className="bg-background/50" 
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">General Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put Red sea  in maintenance mode</p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-approve">Auto-approve Products</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve new product listings</p>
                    </div>
                    <Switch id="auto-approve" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="guest-checkout">Guest Checkout</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to checkout without registration</p>
                    </div>
                    <Switch id="guest-checkout" defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                {userProfile ? `${userProfile.type} Profile` : "Admin Profile"}
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Button variant="outline" className="glass-effect">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    className="bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    className="bg-background/50" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="bg-background/50" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input 
                  id="phone_number" 
                  value={profileForm.phone_number || ""}
                  onChange={handleProfileChange}
                  className="bg-background/50" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_type">User Type</Label>
                  <Input 
                    id="user_type" 
                    value={userProfile?.type || ""}
                    disabled
                    className="bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_status">Status</Label>
                  <Input 
                    id="user_status" 
                    value={userProfile?.status || ""}
                    disabled
                    className="bg-background/50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pref_language">Preferred Language</Label>
                  <Input 
                    id="pref_language" 
                    value={userProfile?.pref_language || ""}
                    disabled
                    className="bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pref_currency">Preferred Currency</Label>
                  <Input 
                    id="pref_currency" 
                    value={userProfile?.pref_currency || ""}
                    disabled
                    className="bg-background/50" 
                  />
                </div>
              </div>

              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {userProfile?.role && (
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  Role Information
                </CardTitle>
                <CardDescription>Your role and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role_name">Role Name</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="role_name" 
                        value={userProfile.role.name || ""}
                        disabled
                        className="bg-background/50" 
                      />
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      >
                        {userProfile.role.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role_description">Role Description</Label>
                    <Input 
                      id="role_description" 
                      value={userProfile.role.description || ""}
                      disabled
                      className="bg-background/50" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Permissions</Label>
                  <div className="max-h-32 overflow-y-auto p-2 bg-background/50 rounded-md border border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {userProfile.role.access_rules.map((rule, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          {rule}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="order-notifications">New Orders</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                    </div>
                    <Switch id="order-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notifications">Payment Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive payment confirmation emails</p>
                    </div>
                    <Switch id="payment-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="delivery-notifications">Delivery Updates</Label>
                      <p className="text-sm text-muted-foreground">Track delivery status changes</p>
                    </div>
                    <Switch id="delivery-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="user-notifications">User Registrations</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new user signups</p>
                    </div>
                    <Switch id="user-notifications" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                    </div>
                    <Switch id="browser-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mobile-notifications">Mobile Push</Label>
                      <p className="text-sm text-muted-foreground">Send notifications to mobile app</p>
                    </div>
                    <Switch id="mobile-notifications" />
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                <Mail className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      className="bg-background/50" 
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      className="bg-background/50" 
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      className="bg-background/50" 
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="glass-effect"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active sessions will be shown here</p>
                  <Button variant="outline" className="glass-effect text-red-400 border-red-400/30">
                    Terminate All Sessions
                  </Button>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg glass-effect border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Current Plan</h4>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pro Plan</Badge>
                </div>
                <p className="text-sm text-muted-foreground">$99/month • Unlimited products & users</p>
                <p className="text-sm text-muted-foreground">Next billing: July 5, 2024</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <div className="p-4 rounded-lg glass-effect border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="glass-effect">
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Billing History</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg glass-effect border border-border/30">
                    <div>
                      <p className="font-medium">June 2024</p>
                      <p className="text-sm text-muted-foreground">Pro Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$99.00</p>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Paid
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg glass-effect border border-border/30">
                    <div>
                      <p className="font-medium">May 2024</p>
                      <p className="text-sm text-muted-foreground">Pro Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$99.00</p>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="glass-effect">
                  Download Invoice
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
