import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FolderHeart, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Award, 
  AlertCircle,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react';

import { InscripcionCursos } from './InscripcionCursos';

type StudentSection = 'tablero' | 'cursos' | 'expediente' | 'mensajes' | 'config';

interface Actividad {
  id: number;
  tipo: string;
  curso: string;
  detalle: string;
  fecha: string;
}

interface DashboardMetrics {
  cursosInscritosCount: number;
  promedioGeneral: number;
  alertasAcademicas: number;
  actividadReciente: Actividad[];
}

export const EstudianteDashboard: React.FC = () => {
  const { user, token, logout, theme } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<StudentSection>('tablero');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);

  const menuItems = [
    { id: 'tablero' as StudentSection, label: 'Tablero', icon: <LayoutDashboard size={18} /> },
    { id: 'cursos' as StudentSection, label: 'Cursos', icon: <BookOpen size={18} /> },
    { id: 'expediente' as StudentSection, label: 'Expediente', icon: <FolderHeart size={18} /> },
    { id: 'mensajes' as StudentSection, label: 'Mensajes / Avisos', icon: <MessageSquare size={18} /> },
    { id: 'config' as StudentSection, label: 'Configuración', icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('http://localhost:3000/students/dashboard-summary', {
          headers
        });
        setMetrics(response.data);
      } catch (error) {
        console.error("Error cargando métricas del estudiante", error);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const obtenerEstilosGlobales = () => {
    switch (theme) {
      case 'oscuro':
        return {
          wrapper: 'bg-slate-900',
          sidebar: 'bg-slate-950 border-r border-slate-800',
          sidebarActiveTab: 'bg-blue-600 text-white shadow-lg',
          sidebarInactiveTab: 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
          sidebarIconActive: 'text-white',
          sidebarIconInactive: 'text-slate-500',
          header: 'bg-slate-950 border-b border-slate-800 text-white',
          searchInput: 'bg-slate-800 text-slate-200 placeholder:text-slate-500',
          notificationBtn: 'text-slate-400 hover:bg-slate-900',
          bodySection: 'bg-slate-900/40 text-slate-100',
          card: 'bg-slate-800 border border-slate-700 text-white',
          cardSubText: 'text-slate-400',
          accentBlue: 'bg-blue-950 text-blue-400',
          accentGreen: 'bg-emerald-950 text-emerald-400',
          accentRed: 'bg-rose-950 text-rose-400'
        };
      case 'coquette':
        return {
          wrapper: 'bg-[#fff5f6]',
          sidebar: 'bg-[#4c282c] border-r border-[#fbcdd4]/20',
          sidebarActiveTab: 'bg-[#f472b6] text-white shadow-md',
          sidebarInactiveTab: 'text-[#fbcdd4]/80 hover:bg-[#5c3439] hover:text-white',
          sidebarIconActive: 'text-white',
          sidebarIconInactive: 'text-[#fbcdd4]/50',
          header: 'bg-white border-b border-[#fbcdd4] text-[#6d4c51]',
          searchInput: 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51] placeholder:text-[#b3888d]/60',
          notificationBtn: 'text-[#6d4c51] hover:bg-[#fff5f6]',
          bodySection: 'bg-[#fff5f6] text-[#6d4c51]',
          card: 'bg-white border border-[#fbcdd4] text-[#6d4c51]',
          cardSubText: 'text-[#b3888d]',
          accentBlue: 'bg-sky-50 text-sky-600',
          accentGreen: 'bg-pink-50 text-[#f472b6]',
          accentRed: 'bg-amber-50 text-amber-700'
        };
      case 'claro':
      default:
        return {
          wrapper: 'bg-[#f4f6f9]',
          sidebar: 'bg-[#1a365d]',
          sidebarActiveTab: 'bg-white text-[#1a365d] shadow-sm',
          sidebarInactiveTab: 'text-blue-100 hover:bg-white/5',
          sidebarIconActive: 'text-[#1a365d]',
          sidebarIconInactive: 'text-blue-300',
          header: 'bg-white border-b border-gray-100 text-slate-700',
          searchInput: 'bg-[#f1f5f9] text-gray-700 placeholder:text-gray-400',
          notificationBtn: 'text-gray-500 hover:bg-gray-100',
          bodySection: 'bg-[#f8fafc] text-slate-800',
          card: 'bg-white border border-gray-200 text-slate-800 shadow-sm',
          cardSubText: 'text-gray-400',
          accentBlue: 'bg-blue-50 text-blue-600',
          accentGreen: 'bg-emerald-50 text-emerald-600',
          accentRed: 'bg-red-50 text-red-600'
        };
    }
  };

  const g = obtenerEstilosGlobales();

  const renderStudentContent = () => {
    if (activeSection === 'cursos') {
      return <InscripcionCursos />;
    }

    if (activeSection !== 'tablero') {
      return (
        <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-medium">
          Contenido de la sección {activeSection} en desarrollo...
        </div>
      );
    }

    if (loadingMetrics) {
      return <div className="text-center text-xs py-12 font-medium opacity-60">Cargando métricas escolares...</div>;
    }

    return (
      <div className="space-y-6">
        {/* Mensaje de Bienvenida */}
        <div>
          <h2 className="text-2xl font-black tracking-tight">Bienvenido de nuevo, {user?.nombre || 'Alex'}</h2>
          <p className={`text-xs mt-1 font-medium ${g.cardSubText}`}>Tienes 3 entregas pendientes para esta semana.</p>
        </div>

        {/* Fila superior: Tarjetas Informativas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-5 rounded-2xl relative border ${g.card}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-3xl font-black tracking-tight">{metrics?.cursosInscritosCount || 6}</span>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${g.cardSubText}`}>Cursos Inscritos</p>
              </div>
              <div className={`p-2.5 rounded-xl ${g.accentBlue}`}>
                <BookOpen size={20} />
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl relative border ${g.card}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-3xl font-black tracking-tight">{(metrics?.promedioGeneral || 9.2)}</span>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${g.cardSubText}`}>Promedio General</p>
              </div>
              <div className={`p-2.5 rounded-xl ${g.accentGreen}`}>
                <Award size={20} />
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl relative border ${g.card}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-3xl font-black tracking-tight">{metrics?.alertasAcademicas || 2}</span>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${g.cardSubText}`}>Alertas Académicas</p>
              </div>
              <div className={`p-2.5 rounded-xl ${g.accentRed}`}>
                <AlertCircle size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Actividad y Avance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${g.card}`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
              <Clock size={16} /> Actividad Reciente
            </h3>
            <div className="space-y-4">
              {metrics?.actividadReciente && metrics.actividadReciente.length > 0 ? (
                metrics.actividadReciente.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                    <div className={`p-2 rounded-lg ${g.accentBlue}`}><FileText size={16} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{act.tipo}: <span className="font-semibold opacity-70">{act.curso}</span></p>
                      <p className={`text-[11px] mt-0.5 ${g.cardSubText}`}>{act.detalle}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-4 p-3 rounded-xl">
                  <div className={`p-2 rounded-lg ${g.accentGreen}`}><FileText size={16} /></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">Calificación publicada: <span className="font-semibold opacity-70">Sistemas Operativos II</span></p>
                    <p className={`text-[11px] mt-0.5 ${g.cardSubText}`}>Proyecto Final • 95/100</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1a2332] text-white p-6 rounded-2xl h-fit shadow-lg">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">Avance de Carrera</h4>
            <div className="my-4">
              <span className="text-3xl font-black tracking-tight">68%</span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Vas por buen camino, Alex. Te faltan pocos créditos para completar el ciclo actual.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 h-screen w-screen flex overflow-hidden m-0 p-0 font-sans antialiased transition-colors duration-300 ${g.wrapper}`}>
      
      {/* SIDEBAR */}
      <aside className={`w-64 flex flex-col shrink-0 h-full shadow-xl ${g.sidebar}`}>
        <div className="p-5 flex flex-col items-center border-b shrink-0 border-white/10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h2 className="font-black text-lg tracking-tight uppercase text-white">UniDB</h2>
          <p className="text-blue-200 text-[9px] uppercase tracking-widest font-bold mt-0.5">Portal Estudiante</p>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                activeSection === item.id ? g.sidebarActiveTab : g.sidebarInactiveTab
              }`}
            >
              <span className={activeSection === item.id ? g.sidebarIconActive : g.sidebarIconInactive}>
                {item.icon}
              </span>
              <span className="font-semibold text-xs tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 shrink-0 flex flex-col">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl transition-colors text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
          <div className="w-full h-px bg-white/10 my-4" />
          <div className="flex items-center space-x-3 p-1.5 text-white">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {user?.nombre?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-xs font-black truncate">{user?.nombre || 'Alex Rivera'}</p>
              <p className="text-blue-300 text-[10px] truncate">Estudiante</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 z-10 transition-all duration-300 ${g.header}`}>
          <span className="text-xl font-black tracking-tight">
            {activeSection === 'tablero' ? 'Tablero' : activeSection.toUpperCase()}
          </span>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Buscar cursos, notas..."
                className={`pl-10 pr-4 py-2 border border-transparent rounded-full text-xs w-64 outline-none ${g.searchInput}`}
              />
            </div>
            <button className={`p-2 rounded-full relative ${g.notificationBtn}`}>
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        <section className={`flex-1 overflow-y-auto p-8 text-left ${g.bodySection}`}>
          {renderStudentContent()}
        </section>
      </main>
    </div>
  );
};