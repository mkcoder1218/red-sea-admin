import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Package, DollarSign, Truck, LogOut, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AuthService, DashboardService } from "@/services";
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  // Use the useApi hook to fetch dashboard stats
  const {
    data: dashboardStats,
    loading: statsLoading,
    error: statsError,
    execute: fetchDashboardStats
  } = useApi(DashboardService.getDashboardStats, {
    loadingKey: 'fetchDashboardStats',
    showErrorNotification: true,
    executeImmediately: true
  });

  // Debug the API response
  useEffect(() => {
    console.log('Dashboard Stats API Response:', dashboardStats);
    console.log('Dashboard Stats Error:', statsError);
    if (statsError) {
      console.error('Error fetching dashboard stats:', statsError);
    }
  }, [dashboardStats, statsError]);

  // Manually fetch stats after 1 second to make sure it's called
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Manually fetching dashboard stats...');
      fetchDashboardStats();
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchDashboardStats]);

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      dispatch(logout())
    } catch (error) {
      console.error('Logout error:', error)
      dispatch(logout()) // Force logout even if API call fails
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name} {user?.last_name}! Overview of your Red sea performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            Live Data
          </Badge>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {statsLoading && (
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Loading dashboard statistics...
          </AlertDescription>
        </Alert>
      )}

      {statsError && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Error loading dashboard statistics. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-border/50 hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {statsLoading ? '...' : 
                dashboardStats?.data?.totalRevenue !== undefined ? 
                `$${dashboardStats.data.totalRevenue.toFixed(2)}` : 
                '$0.00'}
            </div>
            <p className="text-xs text-green-400">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {statsLoading ? '...' : 
                dashboardStats?.data?.totalProducts !== undefined ? 
                dashboardStats.data.totalProducts : 0}
            </div>
            <p className="text-xs text-green-400">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {statsLoading ? '...' : 
                dashboardStats?.data?.totalUsers !== undefined ? 
                dashboardStats.data.totalUsers : 0}
            </div>
            <p className="text-xs text-green-400">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-orange-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Product Value</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {statsLoading ? '...' : 
                dashboardStats?.data?.totalProductPrice !== undefined ? 
                `$${dashboardStats.data.totalProductPrice.toFixed(2)}` : 
                '$0.00'}
            </div>
            <p className="text-xs text-yellow-400">-5% from yesterday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
