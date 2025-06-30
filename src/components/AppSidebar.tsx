import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  ChartBar,
  ChartPie,
  Users,
  Package,
  Package2,
  Truck,
  Map,
  Settings,
  Image
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartBar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartPie,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Product Management",
    url: "/products",
    icon: Package2,
  },
  {
    title: "Order Management",
    url: "/orders",
    icon: Package,
  },
  {
    title: "Delivery Tracker",
    url: "/delivery",
    icon: Truck,
  },
  {
    title: "Delivery Map",
    url: "/map",
    icon: Map,
  },
  {
    title: "Banners",
    url: "/banners",
    icon: Image,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-sidebar-border glass-effect">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">Red sea </h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full transition-all duration-200 hover:bg-sidebar-accent rounded-lg ${
                      location.pathname === item.url 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30' 
                        : ''
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg glass-effect">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@Red sea .com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
