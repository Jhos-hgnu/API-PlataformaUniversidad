<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import type { Role } from '../../context/authTypes';
import { getThemeStyles } from '../../utils/themeStyles';
import { 
  AtSign, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  BookOpen,
  FolderOpen,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
=======
import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import type { Role } from "../../context/authTypes";
import { getThemeStyles } from "../../utils/themeStyles";
import { AtSign, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
>>>>>>> ba9cf5bd33bee373a3cd091f3b0265c2a80b04a7

export const LoginView: React.FC = () => {
  const { login, user, theme } = useAuth();
  const styles = getThemeStyles(theme);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  // CONTROL DE FLUJO ACADÉMICO / REDIRECCIÓN
  useEffect(() => {
    if (user?.rol === 'ADMIN') {
      navigate('/', { replace: true });
=======
  React.useEffect(() => {
    if (user?.rol === "ADMIN") {
      navigate("/", { replace: true });
>>>>>>> ba9cf5bd33bee373a3cd091f3b0265c2a80b04a7
    }
    // Si tu enrutador principal delega el renderizado directo en la raíz,
    // el estado de autenticación cambiará y mostrará el contenido condicional de abajo.
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

<<<<<<< HEAD
    // Validación obligatoria de correo institucional solicitada por el grupo
=======
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

    /*
>>>>>>> ba9cf5bd33bee373a3cd091f3b0265c2a80b04a7
    if (!correo.toLowerCase().endsWith('@miumg.edu.gt')) {
      setError('Acceso denegado. Debe utilizar su correo institucional (@miumg.edu.gt).');
      return;
    }

    let mockRol: Role = 'ESTUDIANTE';
    let mockNombre = 'Alex Rivera';

    if (correo.toLowerCase().includes('admin')) {
      mockRol = 'ADMIN';
      mockNombre = 'Administrador General';
    } else if (correo.toLowerCase().includes('docente')) {
      mockRol = 'DOCENTE';
      mockNombre = 'Dr. Ricardo Arjona';
    }

    // Datos estructurados compatibles con los endpoints de NestJS del backend
    const mockUser = {
      id: 1,
      nombre: mockNombre,
      correo: correo,
      rol: mockRol
    };

    const mockToken = 'jwt-fake-token-response';
    
    login(mockToken, mockUser);
    */
  };

  // =========================================================================
  // RENDERIZADO DEL DASHBOARD DE ESTUDIANTE (Si el usuario ya se autenticó)
  // =========================================================================
  if (user?.rol === 'ESTUDIANTE') {
    // Datos simulados estructurados en base al modelo Entidad-Relación del PDF
    const actividadesRecientes = [
      { id: 1, tipo: 'calificacion', titulo: 'Calificación publicada: Proyecto Final', subtitulo: 'Sistemas Operativos II • 95/100', haceCuanto: 'Hace 2h' },
      { id: 2, tipo: 'aviso', titulo: 'Nuevo aviso de Coordinación', subtitulo: 'Calendario de exámenes finales actualizado.', haceCuanto: 'Hace 5h' },
      { id: 3, tipo: 'mensaje', titulo: 'Mensaje de Catedrático', subtitulo: 'Re: Consulta sobre laboratorio 3 de Base de Datos', haceCuanto: 'Ayer' },
    ];

    const cursosActivos = [
      { codigo: 'SIS-002', nombre: 'Sistemas Operativos II', creditos: 5 },
      { codigo: 'BD2-003', nombre: 'Base de Datos II', creditos: 4 },
      { codigo: 'AN-001', nombre: 'Análisis de Sistemas I', creditos: 4 },
    ];

    return (
      <EstudianteLayout activeTab="tablero">
        <div className="space-y-8 animate-fadeIn">
          
          {/* Fila de Bienvenida */}
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Bienvenido de nuevo, {user.nombre.split(' ')[0]} 👋
            </h2>
            <p className="text-gray-500 text-xs font-semibold mt-0.5">
              Ciclo Académico Activo: Primer Semestre 2026
            </p>
          </div>

          {/* TARJETAS KPI METRICAS (Estilo Stitch / Admin unificado) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1: Cursos Activos */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Asignados</span>
                <h3 className="text-3xl font-black text-gray-800 mt-3">{cursosActivos.length}</h3>
                <p className="text-gray-500 text-xs font-bold mt-1">Cursos Inscritos</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FolderOpen size={24} />
              </div>
            </div>

            {/* KPI 2: Promedio Ponderado */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Eficiencia</span>
                <h3 className="text-3xl font-black text-gray-800 mt-3">88.5</h3>
                <p className="text-gray-500 text-xs font-bold mt-1">Promedio General</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
            </div>

            {/* KPI 3: Alertas Pendientes */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Pendiente</span>
                <h3 className="text-3xl font-black text-gray-800 mt-3">1</h3>
                <p className="text-gray-500 text-xs font-bold mt-1">Pagos / Solicitudes</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            </div>

          </div>

          {/* SECCIÓN DIVIDIDA: CURSOS ACTUALES Y ACTIVIDADES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Panel Principal Izquierdo: Cursos Asignados */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={18} className="text-[#1a365d]" /> Mis Cursos Asignados
                </h3>
              </div>
              <div className="space-y-2">
                {cursosActivos.map((curso, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all">
                    <div>
                      <h4 className="font-bold text-xs text-gray-800">{curso.nombre}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{curso.codigo} • {curso.creditos} Créditos</p>
                    </div>
                    <button className="px-3 py-1 bg-white hover:bg-[#1a365d] hover:text-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold transition-all shadow-2xs">
                      Ver Aula
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Secundario Derecho: Historial / Actividad */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3">
                <Clock size={18} className="text-[#1a365d]" /> Notificaciones
              </h3>
              <div className="space-y-3">
                {actividadesRecientes.map((act) => (
                  <div key={act.id} className="flex gap-3 text-left">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                      act.tipo === 'calificacion' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {act.tipo === 'calificacion' ? <CheckCircle size={16} /> : <MessageSquare size={16} />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-gray-800 truncate">{act.titulo}</h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{act.subtitulo}</p>
                      <span className="text-[9px] text-gray-400 font-bold block mt-1">{act.haceCuanto}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </EstudianteLayout>
    );
  }

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
