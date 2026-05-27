import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { LoginView } from "./views/auth/LoginView";
import { AdminDashboard } from "./views/usuarios/admin/AdminDashboard";
import { DocenteDashboard } from "./views/usuarios/docente/DocenteDashboard";
import { EstudianteDashboardView } from "./views/estudiante/EstudianteDashboardView";
import "./App.css";

function DashboardSelector() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol === "ADMIN") {
    return <AdminDashboard />;
  }

  if (user.rol === "DOCENTE") {
    return <DocenteDashboard />;
  }

  if (user.rol === "ESTUDIANTE") {
    return <EstudianteDashboardView />;
  }

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* El Login se queda en la raíz */}
          <Route path="/" element={<LoginView />} />

          {/* Tu ruta de administración */}
          <Route path="/admin" element={<DashboardSelector />} />

          {/* Ruta del dashboard de docentes */}
          <Route path="/docente" element={<DashboardSelector />} />

          <Route path="/estudiante" element={<DashboardSelector />} />

          {/* Cualquier otra ruta regresa al Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
