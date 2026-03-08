import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Timeline from "@/components/Timeline";
import OverdueTasks from "@/components/OverdueTasks";
import GlossaryPage from "@/components/GlossaryPage";
import DocumentsPage from "@/components/DocumentsPage";
import SettingsPage from "@/components/Settings";
import Impressum from "./pages/Impressum";
import Privacy from "./pages/Privacy";
import Intro from "./pages/Intro";
import DataHandling from "./pages/DataHandling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/your-data" element={<DataHandling />} />
              <Route path="/glossary" element={<GlossaryPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/overdue" element={<OverdueTasks />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
