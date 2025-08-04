import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import UserManagement from "./components/admin/UserManagement";
import VideoManagement from "./components/admin/VideoManagement";
import EventManagement from "./components/admin/EventManagement";
import Analytics from "./components/admin/Analytics";
import DashboardLayout from "./components/layout/DashboardLayout";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import WatchHistory from "./components/user/WatchHistory";
import ProfilePage from "./pages/ProfilePage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/videos" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout>
              <VideoManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout>
              <EventManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['viewer']}>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute roles={['viewer']}>
            <DashboardLayout>
              <WatchHistory />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute roles={['viewer']}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
