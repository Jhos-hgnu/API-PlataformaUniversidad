import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import type { Role } from "../../context/authTypes";
import { getThemeStyles } from "../../utils/themeStyles";
import { AtSign, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoginView: React.FC = () => {
  const { login, user, theme } = useAuth();
  const styles = getThemeStyles(theme);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState(() => {
    return localStorage.getItem("remembered_correo") || "";
  });

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem("remembered_correo");
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si el usuario ya está autenticado, mandarlo a su dashboard según rol
  React.useEffect(() => {
    if (user?.rol === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (user?.rol === "DOCENTE") {
      navigate("/docente", { replace: true });
    } else if (user?.rol === "ESTUDIANTE") {
      navigate("/estudiante", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Credenciales invalidas");
      }

      const data = await res.json();
      const usuario = { ...data.usuario, rol: data.usuario.rol.toUpperCase() };
      login(data.access_token, usuario);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // =========================================================================
  // RENDERIZADO DE LA INTERFAZ DE LOGIN (Por defecto / No autenticado)
  // =========================================================================
  return (
    <div
      className={`fixed inset-0 h-screen w-screen flex flex-col items-center justify-center p-2 font-sans antialiased overflow-hidden select-none m-0 box-border transition-all duration-300 ${styles.page}`}
    >
      {/* Encabezado / Logo */}
      <div className="flex flex-col items-center mb-3 text-center">
        <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center shadow-md shadow-[#1a365d]/20 mb-1.5 shrink-0">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>
        <h1
          style={{ color: "#374151" }}
          className="text-2xl font-black tracking-tight uppercase leading-none"
        >
          UNIVERSIDAD UMG
        </h1>
        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
          Gestión Académica
        </p>
      </div>

      {/* Tarjeta de Login Principal */}
      <div
        className={`w-full max-w-95 rounded-2xl border ${styles.border} ${styles.panel} shadow-xl ${styles.shadow} p-6 box-border`}
      >
        <div className="text-center">
          <h2
            style={{ color: "#374151" }}
            className="text-xl font-black leading-none mb-1"
          >
            Bienvenido
          </h2>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Ingresa tus credenciales para continuar al portal académico.
          </p>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg border border-red-100 text-left leading-normal animate-pulse">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-left">
          {/* Input Correo */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <AtSign size={15} strokeWidth={2.2} />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="username"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@miumg.edu.gt"
                className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none transition-all ${styles.input} ${styles.border}`}
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={15} strokeWidth={2.2} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-xs pl-9 pr-10 py-2 rounded-lg focus:outline-none transition-all ${styles.input} ${styles.border} tracking-widest`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="flex items-center justify-between text-[11px] font-semibold pt-0.5">
            <label className="flex items-center space-x-1.5 text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#1a365d] border-gray-300 focus:ring-[#1a365d]/20 transition-all cursor-pointer"
              />
              <span>Recordarme</span>
            </label>
            <a
              href="#forgot"
              className="text-[#1a365d] hover:underline transition-all"
            >
              Olvidé mi contraseña
            </a>
          </div>

          {/* Botón de Iniciar Sesión */}
          <button
            type="submit"
            className={`w-full py-2 px-3 rounded-lg shadow-md ${styles.shadow} flex items-center justify-center space-x-1.5 transition-all active:scale-[0.99] cursor-pointer text-xs ${styles.buttonPrimary}`}
          >
            <span>Iniciar Sesión</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </form>

        {/* Soporte Técnico */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 text-center text-[11px] font-medium text-gray-500">
          ¿No tienes una cuenta?{" "}
          <a
            href="#soporte"
            className="text-[#1a365d] font-bold hover:underline transition-all"
          >
            Contactar a soporte IT
          </a>
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-4 flex items-center space-x-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
        <svg
          className="w-3 h-3 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.95 11.95 0 01-1.8 7.275 11.99 11.99 0 01-5.183 4.51.75.75 0 01-.702 0 11.99 11.99 0 01-5.183-4.51 11.95 11.95 0 01-1.8-7.275zM10 4.5a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 4.5zM10 11a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
        <span>Grupo 2 - Base de Datos</span>
      </div>
    </div>
  );
};
