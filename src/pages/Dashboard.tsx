
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ChartBar, Users, Package, TrendingUp, DollarSign, Truck, LogOut, Info } from "lucide-react";
import ReduxExample from "@/components/ReduxExample";
import ApiExample from "@/components/ApiExample";
import PersistenceExample from "@/components/PersistenceExample";
import UnauthorizedTest from "@/components/UnauthorizedTest";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AuthService } from "@/services";

const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 300 },
  { name: 'Apr', sales: 4500, orders: 278 },
  { name: 'May', sales: 6000, orders: 380 },
  { name: 'Jun', sales: 5500, orders: 345 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#8884d8' },
  { name: 'Clothing', value: 25, color: '#82ca9d' },
  { name: 'Home & Garden', value: 20, color: '#ffc658' },
  { name: 'Sports', value: 12, color: '#ff7300' },
  { name: 'Books', value: 8, color: '#00ff88' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', product: 'iPhone 15 Pro', amount: '$999', status: 'Delivered' },
  { id: 'ORD-002', customer: 'Jane Smith', product: 'Nike Air Max', amount: '$129', status: 'Shipped' },
  { id: 'ORD-003', customer: 'Bob Johnson', product: 'MacBook Air', amount: '$1299', status: 'Processing' },
  { id: 'ORD-004', customer: 'Alice Brown', product: 'Samsung TV', amount: '$699', status: 'Pending' },
];

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

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
      {/* Instructions for Testing Login Form */}
      <Alert className="border-blue-500/30 bg-blue-500/10">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>To test the updated login form:</strong> Click the "Logout" button below, then go to the login page.
          You'll see empty form fields that you can fill with any credentials, plus a demo account helper.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name} {user?.last_name}! Overview of your Red sea  performance
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
            Logout to Test Login Form
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-border/50 hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">$45,231.89</div>
            <p className="text-xs text-green-400">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2,350</div>
            <p className="text-xs text-green-400">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">12,234</div>
            <p className="text-xs text-green-400">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-orange-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">89</div>
            <p className="text-xs text-yellow-400">-5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Sales Trend
            </CardTitle>
            <CardDescription>Monthly sales and order statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="w-5 h-5 text-purple-500" />
              Category Distribution
            </CardTitle>
            <CardDescription>Sales distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your Red sea </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer} • {order.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-400">{order.amount}</span>
                  <Badge 
                    variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                    className={
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redux Example */}
      <ReduxExample />

      {/* API Example */}
      <ApiExample />

      {/* Persistence Example */}
      <PersistenceExample />

      {/* Unauthorized Handling Test */}
      <UnauthorizedTest />
    </div>
  );
};

export default Dashboard;
