
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, CreditCard, Globe, Palette, Mail } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Settings</h2>
          <p className="text-muted-foreground">Manage your marketplace configuration and preferences</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
          All Systems Operational
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-effect border border-border/50">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
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
                Marketplace Settings
              </CardTitle>
              <CardDescription>Configure your marketplace basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketplace-name">Marketplace Name</Label>
                  <Input id="marketplace-name" defaultValue="B2C MarketPlace" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketplace-url">Website URL</Label>
                  <Input id="marketplace-url" defaultValue="https://marketplace.com" className="bg-background/50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  defaultValue="Your premier B2C marketplace for quality products" 
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
                      <p className="text-sm text-muted-foreground">Put marketplace in maintenance mode</p>
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
                Admin Profile
              </CardTitle>
              <CardDescription>Manage your admin account information</CardDescription>
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
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Admin" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="User" className="bg-background/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@marketplace.com" className="bg-background/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-background/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" className="bg-background/50" />
              </div>

              <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                Update Profile
              </Button>
            </CardContent>
          </Card>
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
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="bg-background/50" />
                  </div>
                </div>
                <Button variant="outline" className="glass-effect">
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
