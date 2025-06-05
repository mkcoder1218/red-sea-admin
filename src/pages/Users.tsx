import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users as UsersIcon, Search, Filter, MoreHorizontal, UserPlus, Mail, Phone, Calendar } from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    role: "Customer",
    orders: 15,
    totalSpent: 2450,
    joinDate: "2024-01-15",
    lastLogin: "2024-06-04",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    role: "Premium",
    orders: 28,
    totalSpent: 5670,
    joinDate: "2023-11-22",
    lastLogin: "2024-06-05",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    role: "Customer",
    orders: 3,
    totalSpent: 180,
    joinDate: "2024-03-10",
    lastLogin: "2024-05-20",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "+1 (555) 321-0987",
    status: "Active",
    role: "VIP",
    orders: 42,
    totalSpent: 12340,
    joinDate: "2023-08-05",
    lastLogin: "2024-06-05",
    avatar: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    phone: "+1 (555) 654-3210",
    status: "Pending",
    role: "Customer",
    orders: 0,
    totalSpent: 0,
    joinDate: "2024-06-01",
    lastLogin: "Never",
    avatar: "/placeholder.svg"
  },
];

const userStats = [
  { label: "Total Users", value: "12,234", change: "+8.2%", trend: "up" },
  { label: "Active Users", value: "9,876", change: "+12.1%", trend: "up" },
  { label: "New This Month", value: "432", change: "+15.3%", trend: "up" },
  { label: "Premium Users", value: "1,567", change: "+5.7%", trend: "up" },
];

const Users = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">User Management</h2>
          <p className="text-muted-foreground">Manage and monitor your marketplace users</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="glass-effect border-border/50 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <UsersIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <p className="text-xs text-green-400">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Search and manage your users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
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
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg glass-effect border border-border/30 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge 
                        variant="outline"
                        className={
                          user.role === 'VIP' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          user.role === 'Premium' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {user.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.orders} Orders</p>
                    <p className="text-sm text-green-400">${user.totalSpent.toLocaleString()}</p>
                  </div>
                  
                  <Badge 
                    variant="outline"
                    className={
                      user.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      user.status === 'Inactive' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }
                  >
                    {user.status}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-effect border border-border/50 bg-background/80 backdrop-blur-sm">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
