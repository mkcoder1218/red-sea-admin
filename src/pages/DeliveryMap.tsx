
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Navigation, Truck, Package, Clock, MapPin, Search, Filter } from "lucide-react";
import { useState } from "react";

const mapDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: "John Doe",
    driver: "Mike Johnson",
    vehicle: "VAN-001",
    status: "Delivered",
    location: { lat: 40.7128, lng: -74.0060, address: "123 Main St, New York, NY" },
    eta: "Delivered",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-002", 
    customer: "Jane Smith",
    driver: "Sarah Wilson",
    vehicle: "VAN-002",
    status: "Out for Delivery",
    location: { lat: 34.0522, lng: -118.2437, address: "456 Oak Ave, Los Angeles, CA" },
    eta: "4:30 PM",
    phone: "+1 (555) 987-6543"
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-003",
    customer: "Bob Johnson", 
    driver: "Tom Davis",
    vehicle: "VAN-003",
    status: "In Transit",
    location: { lat: 41.8781, lng: -87.6298, address: "789 Pine Rd, Chicago, IL" },
    eta: "Tomorrow 2:00 PM",
    phone: "+1 (555) 456-7890"
  },
  {
    id: "DEL-004",
    orderId: "ORD-2024-004",
    customer: "Alice Brown",
    driver: "Emma Davis",
    vehicle: "VAN-004", 
    status: "Out for Delivery",
    location: { lat: 29.7604, lng: -95.3698, address: "321 Elm St, Houston, TX" },
    eta: "6:00 PM",
    phone: "+1 (555) 321-0987"
  },
  {
    id: "DEL-005",
    orderId: "ORD-2024-005",
    customer: "Charlie Wilson",
    driver: "Alex Johnson",
    vehicle: "VAN-005",
    status: "In Transit", 
    location: { lat: 25.7617, lng: -80.1918, address: "654 Maple Dr, Miami, FL" },
    eta: "Tomorrow 10:00 AM",
    phone: "+1 (555) 654-3210"
  }
];

const DeliveryMap = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(mapDeliveries[0]);
  const [mapToken, setMapToken] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Out for Delivery': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'In Transit': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Delivery Map</h2>
          <p className="text-muted-foreground">Real-time map view of all active deliveries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-effect">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Navigation className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Map Token Input */}
      {!mapToken && (
        <Card className="glass-effect border-border/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <MapPin className="w-5 h-5" />
              Mapbox Token Required
            </CardTitle>
            <CardDescription>
              Please enter your Mapbox public token to display the interactive map. 
              You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">mapbox.com</a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Enter your Mapbox public token..."
                value={mapToken}
                onChange={(e) => setMapToken(e.target.value)}
                className="bg-background/50"
              />
              <Button 
                onClick={() => console.log('Token saved:', mapToken)}
                disabled={!mapToken}
              >
                Save Token
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="lg:col-span-2 glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-500" />
              Live Delivery Map
            </CardTitle>
            <CardDescription>Interactive map showing all delivery locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-border/30 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {mapToken ? 'Map will load here with Mapbox integration' : 'Enter Mapbox token to view interactive map'}
                  </p>
                  
                  {/* Simulated Map Pins */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {mapDeliveries.slice(0, 4).map((delivery, index) => (
                      <div 
                        key={delivery.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                          selectedDelivery.id === delivery.id 
                            ? 'border-blue-500/50 bg-blue-500/10' 
                            : 'border-border/30 bg-background/20 hover:border-blue-500/30'
                        }`}
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium">{delivery.vehicle}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{delivery.customer}</p>
                        <Badge variant="outline" className={`${getStatusColor(delivery.status)} text-xs mt-1`}>
                          {delivery.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details Sidebar */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" />
              Delivery Details
            </CardTitle>
            <CardDescription>Information about selected delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search deliveries..." 
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Selected Delivery Info */}
            <div className="p-4 rounded-lg glass-effect border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold">{selectedDelivery.id}</h4>
                <Badge variant="outline" className={getStatusColor(selectedDelivery.status)}>
                  {selectedDelivery.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedDelivery.customer}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Driver & Vehicle</p>
                  <p className="font-medium">{selectedDelivery.driver}</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.vehicle}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                  <p className="text-sm">{selectedDelivery.location.address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">ETA</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {selectedDelivery.eta}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p className="text-sm">{selectedDelivery.phone}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 glass-effect">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                <Button size="sm" variant="outline" className="flex-1 glass-effect">
                  Call Driver
                </Button>
              </div>
            </div>

            {/* All Deliveries List */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">All Active Deliveries</h4>
              {mapDeliveries.map((delivery) => (
                <div 
                  key={delivery.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedDelivery.id === delivery.id 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : 'border-border/30 bg-background/20 hover:border-purple-500/30'
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{delivery.id}</p>
                      <p className="text-xs text-muted-foreground">{delivery.customer}</p>
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(delivery.status)} text-xs`}>
                      {delivery.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryMap;
