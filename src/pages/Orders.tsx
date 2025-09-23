import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Search, Filter, MoreHorizontal, Eye, Truck, DollarSign, Calendar, Loader2 } from "lucide-react";
import { OrderService, Order, DashboardService } from "@/services";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderStats, setOrderStats] = useState([
    { label: "Total Orders", value: "...", change: "+0.0%", icon: Package },
    { label: "Pending Orders", value: "...", change: "0.0%", icon: Calendar },
    { label: "Total Revenue", value: "...", change: "+0.0%", icon: DollarSign },
    { label: "Shipped Today", value: "...", change: "0.0%", icon: Truck },
  ]);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  
  // Fetch orders on component mount and when page changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // Fetch order analytics on component mount
  useEffect(() => {
    fetchOrderAnalytics();
  }, []);
  
  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OrderService.getOrders({
        page: currentPage,
        limit: 10
      });
      
      if (response?.data) {
        setOrders(response.data.rows);
        setTotalOrders(response.data.count);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch order analytics
  const fetchOrderAnalytics = async () => {
    try {
      setStatsLoading(true);
      const response = await DashboardService.getOrderAnalytics();
      
      if (response?.data) {
        const { totalOrders, pendingOrders, totalRevenue, shippedToday } = response.data;
        
        // Format currency
        const formattedRevenue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(totalRevenue);
        
        setOrderStats([
          { label: "Total Orders", value: totalOrders.toString(), change: "+12.3%", icon: Package },
          { label: "Pending Orders", value: pendingOrders.toString(), change: "-5.2%", icon: Calendar },
          { label: "Total Revenue", value: formattedRevenue, change: "+18.7%", icon: DollarSign },
          { label: "Shipped Today", value: shippedToday.toString(), change: "+8.1%", icon: Truck },
        ]);
      }
    } catch (err) {
      console.error('Error fetching order analytics:', err);
      // Keep the placeholder stats if there's an error
    } finally {
      setStatsLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  // Format date string to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Order Management</h2>
          <p className="text-muted-foreground">Track and manage all Red sea  orders</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <img src="/public/logo.png" alt="Orders" className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
          <Card key={index} className="glass-effect border-border/50 hover:border-purple-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {statsLoading ? '...' : stat.value}
              </div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Monitor and manage customer orders ({totalOrders} total)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-10 w-64 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-6">
              <p>{error}</p>
              <Button 
                variant="outline" 
                onClick={fetchOrders}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-6 rounded-lg glass-effect border border-border/30 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <img src="/public/logo.png" alt="Package" className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{order.order_number}</h4>
                        <p className="text-sm text-muted-foreground">{order.user_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-400">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
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
                            <Truck className="w-4 h-4 mr-2" />
                            Track Package
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Subtotal</p>
                      <p className="font-medium">{formatCurrency(order.subtotal || '0.00')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(order.estimated_delivery)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Order Date</p>
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="glass-effect">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="glass-effect">
                        <Truck className="w-4 h-4 mr-2" />
                        Track
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalOrders > 0 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-muted-foreground">
                      Page {currentPage} of {Math.ceil(totalOrders / 10)}
                    </span>
                    <Button 
                      variant="outline" 
                      disabled={currentPage >= Math.ceil(totalOrders / 10)}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
