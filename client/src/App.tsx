import { Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import StudentProfile from './views/StudentProfile';
import AdminPage from './views/AdminPage';
import ResourcesPage from './views/ResourcesPage';
import { LoginPage, RegisterPage, AdminLoginPage } from './views/Auth';
import RewardsPage from './views/Rewardspage';
import UploadPage from './views/Uploadpage';
import AiAssistant from './views/AiAssistant';
import ProtectedRoute from './helpers/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - login required */}
        <Route path="/resources" element={
          <ProtectedRoute>
            <ResourcesPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />

        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />

        <Route path="/rewards" element={
          <ProtectedRoute>
            <RewardsPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } />

        {/* AI Assistant route */}
        <Route path="/assistant" element={
          <ProtectedRoute>
            <AiAssistant />
          </ProtectedRoute>
        } />

        {/* catch-all */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;