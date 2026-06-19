import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { EditableContentProvider } from "@/context/EditableContentContext";
import HomePage from "./pages/HomePage";
import PGDetailPage from "./pages/PGDetailPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLocationsPage from "./pages/admin/AdminLocationsPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import NotFound from "./pages/NotFound";
import { useAnalytics } from "./hooks/useAnalytics";

// Helper component to use the hook inside Router context
const AnalyticsTracker = () => {
  useAnalytics();
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <EditableContentProvider>
          <BrowserRouter>
            <AnalyticsTracker />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pg/:slug" element={<PGDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Admin Routes (Hidden - access via /admin) */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/locations" element={<AdminLocationsPage />} />
              <Route path="/admin/rooms" element={<AdminRoomsPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
              <Route path="/admin/settings" element={<AdminContentPage />} /> {/* Keep settings as alias or remove */}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EditableContentProvider>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
