import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Browse from './pages/Browse';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import Search from './pages/Search';
import Watch from './pages/Watch';

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Browse />} />
      <Route path="/search" element={<Search />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/watch/:titleId" element={<Watch />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
