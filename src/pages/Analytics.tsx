
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, Users } from "lucide-react";

const revenueData = [
  { month: 'Jan', revenue: 12000, profit: 4800, expenses: 7200 },
  { month: 'Feb', revenue: 15000, profit: 6000, expenses: 9000 },
  { month: 'Mar', revenue: 18000, profit: 7200, expenses: 10800 },
  { month: 'Apr', revenue: 22000, profit: 8800, expenses: 13200 },
  { month: 'May', revenue: 25000, profit: 10000, expenses: 15000 },
  { month: 'Jun', revenue: 28000, profit: 11200, expenses: 16800 },
];

const userActivityData = [
  { day: 'Mon', visitors: 2400, orders: 240, conversion: 10 },
  { day: 'Tue', visitors: 1398, orders: 210, conversion: 15 },
  { day: 'Wed', visitors: 9800, orders: 490, conversion: 5 },
  { day: 'Thu', visitors: 3908, orders: 350, conversion: 9 },
  { day: 'Fri', visitors: 4800, orders: 480, conversion: 10 },
  { day: 'Sat', visitors: 3800, orders: 380, conversion: 10 },
  { day: 'Sun', visitors: 4300, orders: 430, conversion: 10 },
];

const productPerformance = [
  { name: 'Electronics', sales: 45000, growth: 12 },
  { name: 'Clothing', sales: 35000, growth: 8 },
  { name: 'Home & Garden', sales: 28000, growth: -2 },
  { name: 'Sports', sales: 22000, growth: 15 },
  { name: 'Books', sales: 18000, growth: 5 },
];

const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into your Red sea  performance</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
          Updated 5 min ago
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-border/50 hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">12.5%</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">156,892</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">$87.42</div>
            <p className="text-xs text-red-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -1.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-orange-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">23.8%</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -3.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="glass-effect border border-border/50">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>Revenue & Profit Analysis</CardTitle>
              <CardDescription>Monthly breakdown of revenue, profit, and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="expenses" stackId="3" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>User Activity & Conversion</CardTitle>
              <CardDescription>Daily visitor traffic and order conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="visitors" stroke="#8B5CF6" strokeWidth={3} />
                    <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>Product Category Performance</CardTitle>
              <CardDescription>Sales performance and growth by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPerformance}>
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
                    <Bar dataKey="sales" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                {productPerformance.map((category) => (
                  <div key={category.name} className="p-4 rounded-lg glass-effect border border-border/30">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    <p className="text-lg font-bold text-cyan-400">${category.sales.toLocaleString()}</p>
                    <p className={`text-xs flex items-center gap-1 ${category.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {category.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(category.growth)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
