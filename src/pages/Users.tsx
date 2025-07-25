import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users as UsersIcon, Search, Filter, MoreHorizontal, UserPlus, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { UserService, UserData, UserStats } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import AddUserModal from "@/components/AddUserModal";

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers({
        page,
        limit: 10,
        search: searchQuery || undefined
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);

      // Calculate stats from the user data
      const calculatedStats = UserService.calculateUserStats(response.users);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await UserService.updateUserStatus(userId, newStatus);
      toast({
        title: "Success",
        description: `User status updated to ${newStatus}.`
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format the user stats for display
  const userStatsDisplay = stats ? [
    { label: "Total Users", value: stats.totalUsers.toString(), change: "+8.2%", trend: "up" },
    { label: "Active Users", value: stats.activeUsers.toString(), change: "+12.1%", trend: "up" },
    { label: "New This Month", value: stats.newUsersThisMonth.toString(), change: "+15.3%", trend: "up" },
    { 
      label: "User Types", 
      value: Object.keys(stats.usersByType).length.toString(), 
      change: "+5.7%", 
      trend: "up" 
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage and monitor your Red Sea users</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowAddUserModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStatsDisplay.map((stat, index) => (
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
      <Card className="card-simple">
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
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{`${user.first_name} ${user.last_name}`}</h4>
                        <Badge 
                          variant="outline"
                          className={
                            user.type === 'Super Admin' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            user.type === 'Admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }
                        >
                          {user.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone_number && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        {user.status === 'Active' ? (
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={() => handleStatusChange(user.id, 'Inactive')}
                          >
                            Deactivate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-400"
                            onClick={() => handleStatusChange(user.id, 'Active')}
                          >
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <div className="text-sm flex items-center">
                    Page {page} of {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        open={showAddUserModal}
        onOpenChange={setShowAddUserModal}
        onUserAdded={fetchUsers}
      />
    </div>
  );
};

export default Users;
