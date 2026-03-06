import { Route, Routes } from 'react-router';
import HomePage from './views/HomePage';
import StudentProfile from './views/StudentProfile';
import AdminPage from './views/AdminPage';
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
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;