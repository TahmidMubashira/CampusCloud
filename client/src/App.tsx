import { Outlet, Route, Routes } from 'react-router';
import HomePage from './views/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
