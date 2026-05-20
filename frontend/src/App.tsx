import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './views/auth/LoginView';
import { AdminDashboard } from './views/usuarios/admin/AdminDashboard';
import './App.css';

// Componente que evalúa los roles para decidir qué mostrar en la raíz "/"
function DashboardSelector() {
  const { user } = useAuth();

  // Si no hay usuario autenticado, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol es ADMIN, cargamos su Dashboard correspondiente
  if (user.rol === 'ADMIN') {
    return <AdminDashboard />;
  }

  // Por si acaso entra otro rol que aún no configuramos, lo regresa al login
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta del Login */}
          <Route path="/login" element={<LoginView />} />
          
          {/* La raíz "/" ahora evalúa el rol del usuario de forma dinámica */}
          <Route path="/" element={<DashboardSelector />} />

          {/* Comodín por si escriben cualquier otra ruta en el navegador */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;