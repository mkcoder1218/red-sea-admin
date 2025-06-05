
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Search, Filter, MoreHorizontal, Eye, Truck, DollarSign, Calendar } from "lucide-react";

const orders = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    email: "john.doe@email.com",
    product: "iPhone 15 Pro Max",
    quantity: 1,
    amount: 1199,
    status: "Delivered",
    paymentStatus: "Paid",
    orderDate: "2024-06-01",
    deliveryDate: "2024-06-03",
    shippingAddress: "123 Main St, New York, NY 10001"
  },
  {
    id: "ORD-2024-002",
    customer: "Jane Smith",
    email: "jane.smith@email.com",
    product: "MacBook Air M3",
    quantity: 1,
    amount: 1299,
    status: "Shipped",
    paymentStatus: "Paid",
    orderDate: "2024-06-02",
    deliveryDate: "2024-06-05",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210"
  },
  {
    id: "ORD-2024-003",
    customer: "Bob Johnson",
    email: "bob.johnson@email.com",
    product: "Samsung Galaxy S24",
    quantity: 2,
    amount: 1598,
    status: "Processing",
    paymentStatus: "Paid",
    orderDate: "2024-06-03",
    deliveryDate: "2024-06-07",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601"
  },
  {
    id: "ORD-2024-004",
    customer: "Alice Brown",
    email: "alice.brown@email.com",
    product: "iPad Pro 12.9",
    quantity: 1,
    amount: 1099,
    status: "Pending",
    paymentStatus: "Pending",
    orderDate: "2024-06-04",
    deliveryDate: "2024-06-08",
    shippingAddress: "321 Elm St, Houston, TX 77001"
  },
  {
    id: "ORD-2024-005",
    customer: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    product: "AirPods Pro 2",
    quantity: 3,
    amount: 747,
    status: "Cancelled",
    paymentStatus: "Refunded",
    orderDate: "2024-06-05",
    deliveryDate: "N/A",
    shippingAddress: "654 Maple Dr, Miami, FL 33101"
  },
];

const orderStats = [
  { label: "Total Orders", value: "2,345", change: "+12.3%", icon: Package },
  { label: "Pending Orders", value: "89", change: "-5.2%", icon: Calendar },
  { label: "Total Revenue", value: "$45,231", change: "+18.7%", icon: DollarSign },
  { label: "Shipped Today", value: "34", change: "+8.1%", icon: Truck },
];

const Orders = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Refunded': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Order Management</h2>
          <p className="text-muted-foreground">Track and manage all marketplace orders</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Package className="w-4 h-4 mr-2" />
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
              <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
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
              <CardDescription>Monitor and manage customer orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-10 w-64 bg-background/50"
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
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-6 rounded-lg glass-effect border border-border/30 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{order.id}</h4>
                      <p className="text-sm text-muted-foreground">{order.customer} • {order.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-xl text-green-400">${order.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{order.orderDate}</p>
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
                    <p className="text-sm font-medium text-muted-foreground mb-1">Product</p>
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Date</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
                    <p className="text-sm">{order.shippingAddress}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
