import { Route, Routes } from 'react-router-dom'; // Change from 'react-router' to 'react-router-dom'
import HomePage from './views/HomePage';
import StudentProfile from './views/StudentProfile';
import AdminPage from './views/AdminPage';
import ResourcesPage from './views/ResourcesPage';
import { LoginPage, RegisterPage } from './views/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Add a catch-all route to redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;