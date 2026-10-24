import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RoadmapManagement from './pages/admin/RoadmapManagement';
import RoadmapForm from './pages/admin/RoadmapForm';
import UserManagement from './pages/admin/UserManagement';
import ChangePassword from './pages/admin/ChangePassword';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import ExploreCareers from './pages/user/ExploreCareers';
import RoadmapDetail from './pages/user/RoadmapDetail';
import MyProgress from './pages/user/MyProgress';
import Profile from './pages/user/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Admin ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="roadmaps" element={<RoadmapManagement />} />
          <Route path="roadmaps/new" element={<RoadmapForm />} />
          <Route path="roadmaps/edit/:id" element={<RoadmapForm />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* ── Normal User ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="explore" element={<ExploreCareers />} />
          <Route path="roadmap/:id" element={<RoadmapDetail />} />
          <Route path="progress" element={<MyProgress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
