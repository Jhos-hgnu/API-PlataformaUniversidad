import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { LoginView } from './views/auth/LoginView';
import { AdminDashboard } from './views/usuarios/admin/AdminDashboard';
import './App.css';

function DashboardSelector() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.rol === 'ADMIN') {
    return <AdminDashboard />;
  }
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta del Login */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={<DashboardSelector />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;