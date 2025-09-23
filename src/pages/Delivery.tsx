
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Truck, Package, MapPin, Clock, CheckCircle, Search, Navigation } from "lucide-react";

const deliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: "John Doe",
    product: "iPhone 15 Pro Max",
    driver: "Mike Johnson",
    vehicle: "VAN-001",
    status: "Delivered",
    progress: 100,
    estimatedTime: "Delivered",
    currentLocation: "123 Main St, New York, NY",
    route: [
      { location: "Warehouse", time: "09:00 AM", status: "completed" },
      { location: "Distribution Center", time: "10:30 AM", status: "completed" },
      { location: "Local Hub", time: "12:00 PM", status: "completed" },
      { location: "Out for Delivery", time: "02:00 PM", status: "completed" },
      { location: "Delivered", time: "03:45 PM", status: "completed" },
    ]
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-002",
    customer: "Jane Smith",
    product: "MacBook Air M3",
    driver: "Sarah Wilson",
    vehicle: "VAN-002",
    status: "Out for Delivery",
    progress: 80,
    estimatedTime: "4:30 PM",
    currentLocation: "Downtown Los Angeles",
    route: [
      { location: "Warehouse", time: "08:00 AM", status: "completed" },
      { location: "Distribution Center", time: "09:30 AM", status: "completed" },
      { location: "Local Hub", time: "11:00 AM", status: "completed" },
      { location: "Out for Delivery", time: "01:00 PM", status: "current" },
      { location: "Delivered", time: "4:30 PM", status: "pending" },
    ]
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-003",
    customer: "Bob Johnson",
    product: "Samsung Galaxy S24 (x2)",
    driver: "Tom Davis",
    vehicle: "VAN-003",
    status: "In Transit",
    progress: 45,
    estimatedTime: "Tomorrow 2:00 PM",
    currentLocation: "Chicago Distribution Center",
    route: [
      { location: "Warehouse", time: "10:00 AM", status: "completed" },
      { location: "Distribution Center", time: "12:00 PM", status: "current" },
      { location: "Local Hub", time: "6:00 PM", status: "pending" },
      { location: "Out for Delivery", time: "Tomorrow 10:00 AM", status: "pending" },
      { location: "Delivered", time: "Tomorrow 2:00 PM", status: "pending" },
    ]
  },
];

const deliveryStats = [
  { label: "Active Deliveries", value: "89", change: "+5.2%", icon: Truck },
  { label: "Delivered Today", value: "34", change: "+12.1%", icon: CheckCircle },
  { label: "On Time Rate", value: "94.2%", change: "+2.1%", icon: Clock },
  { label: "Average Time", value: "2.4h", change: "-8.5%", icon: Navigation },
];

const Delivery = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Out for Delivery': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'In Transit': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Processing': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRouteStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'current': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Delivery Tracker</h2>
          <p className="text-muted-foreground">Monitor real-time delivery status and routes</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Truck className="w-4 h-4 mr-2" />
          Track Package
        </Button>
      </div>

      {/* Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deliveryStats.map((stat, index) => (
          <Card key={index} className="glass-effect border-border/50 hover:border-orange-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle>Track Delivery</CardTitle>
          <CardDescription>Enter order ID or tracking number to track packages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Enter Order ID or Tracking Number..." 
                className="pl-10 bg-background/50"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              Track
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Deliveries */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>Real-time tracking of ongoing deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="p-6 rounded-lg glass-effect border border-border/30 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{delivery.id}</h4>
                      <p className="text-sm text-muted-foreground">{delivery.orderId} • {delivery.customer}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Product</p>
                    <p className="font-medium">{delivery.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Driver & Vehicle</p>
                    <p className="font-medium">{delivery.driver}</p>
                    <p className="text-sm text-muted-foreground">{delivery.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">ETA</p>
                    <p className="font-medium">{delivery.estimatedTime}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Delivery Progress</span>
                    <span className="text-sm text-muted-foreground">{delivery.progress}%</span>
                  </div>
                  <Progress value={delivery.progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Current Location: {delivery.currentLocation}</span>
                  </div>
                  
                  {delivery.route.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/30">
                      {getRouteStatusIcon(step.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${step.status === 'current' ? 'text-blue-400' : step.status === 'completed' ? 'text-green-400' : 'text-muted-foreground'}`}>
                            {step.location}
                          </span>
                          <span className="text-sm text-muted-foreground">{step.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="glass-effect">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                    <Button variant="outline" size="sm" className="glass-effect">
                      <img src="/public/logo.png" alt="Package" className="w-4 h-4 mr-2" />
                      Order Details
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="glass-effect">
                    Contact Driver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Delivery;
