import { Route, Routes } from 'react-router';
import HomePage from './views/HomePage';
import StudentProfile from './views/StudentProfile';
import AdminPage from './views/AdminPage';
import { LoginPage, RegisterPage } from './views/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
        <Route path={'/profile'} element={<StudentProfile />} />
        <Route path={'/admin'} element={<AdminPage />} />
        <Route path={'/login'} element={<LoginPage />} />
        <Route path={'/register'} element={<RegisterPage />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;