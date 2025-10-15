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
  Image,
  User,
  Moon,
  Sun
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

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
    title: "Categories",
    url: "/categories",
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
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <img src="/public/logo.png" alt="Red Sea Market" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-sidebar-foreground tracking-tight">Red Sea Market</h2>
            <p className="text-sm text-muted-foreground font-medium">Administration</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full transition-all duration-200 rounded-lg group relative overflow-hidden ${
                      location.pathname === item.url
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-sidebar-accent text-sidebar-foreground hover:shadow-sm'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-4 px-4 py-3 relative">
                      <div className={`flex items-center justify-center w-5 h-5 transition-colors ${
                        location.pathname === item.url
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground group-hover:text-sidebar-foreground'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className={`font-medium text-nowrap text-sm transition-colors ${
                        location.pathname === item.url
                          ? 'text-primary-foreground'
                          : 'text-sidebar-foreground'
                      }`}>
                        {item.title}
                      </span>
                      {/* {location.pathname === item.url && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                      )} */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
          >
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <span className="text-xs">💻</span>
            )}
          </Button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
