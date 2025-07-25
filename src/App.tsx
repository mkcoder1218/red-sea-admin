import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import PersistLoader from '@/components/PersistLoader';
import AuthProvider from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AuthGuard from '@/components/AuthGuard';
import { ThemeProvider } from '@/components/theme-provider';
import Dashboard from "./pages/Dashboard";
import DebugDashboard from "./components/DebugDashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Delivery from "./pages/Delivery";
import DeliveryMap from "./pages/DeliveryMap";
import Settings from "./pages/Settings";
import Banners from "./pages/Banners";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="red-sea-theme">
    <Provider store={store}>
      <PersistGate loading={<PersistLoader />} persistor={persistor}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <AuthGuard>
                <Routes>
                  {/* Public routes */}
                  <Route path="/signin" element={<SignIn />} />

                  {/* Protected routes */}
                  <Route path="/" element={<AuthenticatedLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="debug" element={<DebugDashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="delivery" element={<Delivery />} />
                    <Route path="map" element={<DeliveryMap />} />
                    <Route path="banners" element={<Banners />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                </AuthGuard>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

export default App;
