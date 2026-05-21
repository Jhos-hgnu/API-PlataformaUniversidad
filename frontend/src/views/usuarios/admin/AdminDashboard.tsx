import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, UserPlus, FileText, Settings, LogOut, Search, Bell, ShieldCheck } from 'lucide-react';
import { CarrerasCursos } from './CarrerasCursos';
import adminImg from '../../../assets/imagenes/admin.webp';
import { GestionUsuarios } from './GestionUsuarios';
import { Asignaciones } from './Asignaciones';
import { ReportesAuditoria } from './ReportesAuditoria';
import { Configuracion } from './Configuracion';
import { TableroGlobal } from './TableroGlobal';


type Section = 'tablero' | 'usuarios' | 'carreras' | 'asignaciones' | 'reportes' | 'config';

export const AdminDashboard: React.FC = () => {
  const { user, logout, theme } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('tablero');

  const menuItems = [
    { id: 'tablero' as Section, label: 'Tablero', icon: <LayoutDashboard size={18} /> },
    { id: 'usuarios' as Section, label: 'Gestión de Usuarios', icon: <Users size={18} /> },
    { id: 'carreras' as Section, label: 'Carreras y Cursos', icon: <GraduationCap size={18} /> },
    { id: 'asignaciones' as Section, label: 'Asignaciones', icon: <UserPlus size={18} /> },
    { id: 'reportes' as Section, label: 'Reportes / Auditoría', icon: <FileText size={18} /> },
    { id: 'config' as Section, label: 'Configuración', icon: <Settings size={18} /> },
  ];

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
          sidebarHeader: 'border-slate-800',
          sidebarActiveTab: 'bg-blue-600 text-white shadow-lg shadow-blue-900/30',
          sidebarInactiveTab: 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
          sidebarIconActive: 'text-white',
          sidebarIconInactive: 'text-slate-500',
          mainContent: 'bg-slate-900',
          header: 'bg-slate-950 border-b border-slate-800 text-white',
          headerTitle: 'text-slate-100',
          searchInput: 'bg-slate-800 border-transparent text-slate-200 focus:bg-slate-800/80 focus:border-slate-700 placeholder:text-slate-500',
          notificationBtn: 'text-slate-400 hover:bg-slate-900',
          shieldBox: 'bg-blue-950 text-blue-400 border border-blue-900',
          bodySection: 'bg-slate-900/40 text-slate-100',
          tableroCard: 'bg-slate-800 border-slate-700 text-white shadow-2xl shadow-black/20',
          tableroIconBox: 'bg-blue-950 text-blue-400',
          tableroTitle: 'text-slate-200',
          tableroDesc: 'text-slate-400'
        };

      case 'coquette':
        return {
          wrapper: 'bg-[#fff5f6]',
          sidebar: 'bg-[#4c282c] border-r border-[#fbcdd4]/20',
          sidebarHeader: 'border-white/10',
          sidebarActiveTab: 'bg-[#f472b6] text-white shadow-md shadow-pink-950/20',
          sidebarInactiveTab: 'text-[#fbcdd4]/80 hover:bg-[#5c3439] hover:text-white',
          sidebarIconActive: 'text-white',
          sidebarIconInactive: 'text-[#fbcdd4]/50',
          mainContent: 'bg-[#fff5f6]',
          header: 'bg-white border-b border-[#fbcdd4] text-[#6d4c51]',
          headerTitle: 'text-[#6d4c51] font-bold',
          searchInput: 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51] focus:bg-white focus:border-[#f472b6] placeholder:text-[#b3888d]/60',
          notificationBtn: 'text-[#6d4c51] hover:bg-[#fff5f6]',
          shieldBox: 'bg-[#f472b6] text-white shadow-xs',
          bodySection: 'bg-[#fff5f6] text-[#6d4c51]',
          tableroCard: 'bg-white border-[#fbcdd4] text-[#6d4c51] shadow-lg shadow-pink-100/50',
          tableroIconBox: 'bg-[#fff5f6] text-[#f472b6]',
          tableroTitle: 'text-[#6d4c51]',
          tableroDesc: 'text-[#b3888d]'
        };

      case 'claro':
      default:
        return {
          wrapper: 'bg-[#f4f6f9]',
          sidebar: 'bg-[#1a365d]',
          sidebarHeader: 'border-white/10',
          sidebarActiveTab: 'bg-white text-[#1a365d] shadow-md',
          sidebarInactiveTab: 'text-blue-100 hover:bg-white/5',
          sidebarIconActive: 'text-[#1a365d]',
          sidebarIconInactive: 'text-blue-300',
          mainContent: 'flex-1 flex flex-col overflow-hidden h-full',
          header: 'bg-white border-b border-gray-100 text-slate-700',
          headerTitle: 'text-slate-800',
          searchInput: 'bg-[#f1f5f9] border border-transparent text-gray-700 focus:bg-white focus:border-gray-300 placeholder:text-gray-400',
          notificationBtn: 'text-gray-500 hover:bg-gray-100',
          shieldBox: 'bg-[#0f172a] text-white shadow-md',
          bodySection: 'bg-[#f8fafc] text-slate-800',
          tableroCard: 'bg-white border-gray-200 text-slate-800 shadow-xl shadow-gray-100',
          tableroIconBox: 'bg-blue-50 text-[#1a365d]',
          tableroTitle: 'text-gray-700',
          tableroDesc: 'text-gray-400'
        };
    }
  };

  const g = obtenerEstilosGlobales();

  const handleSetActiveSection = (section: Section) => {
    setActiveSection(section);
  };

  const renderRightContent = () => {
    switch (activeSection) {
      case 'tablero':
        return <TableroGlobal setActiveSection={handleSetActiveSection} />;

      case 'carreras':
        return <CarrerasCursos />;

      case 'usuarios':
        return <GestionUsuarios />;

      case 'asignaciones':
        return <Asignaciones />;

      case 'reportes':
        return <ReportesAuditoria />;

      case 'config':
        return <Configuracion />;

      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <div className={`fixed inset-0 h-screen w-screen flex overflow-hidden m-0 p-0 font-sans antialiased transition-colors duration-300 ${g.wrapper}`}>

      {/* SIDEBAR DINÁMICO */}
      <aside className={`w-64 flex flex-col shrink-0 h-full transition-all duration-300 shadow-xl ${g.sidebar}`}>
        {/* Encabezado */}
        <div className={`p-5 flex flex-col items-center border-b shrink-0 transition-colors ${g.sidebarHeader}`}>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h2 className="font-black text-lg tracking-tight uppercase text-white">Universidad UMG</h2>
          <p className={`${theme === 'coquette' ? 'text-pink-200' : 'text-blue-200'} text-[9px] uppercase tracking-widest font-bold mt-0.5`}>
            Gestión Académica
          </p>
        </div>

        {/* Navegación Interna */}
        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const targetTab = item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(targetTab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                  activeSection === item.id ? g.sidebarActiveTab : g.sidebarInactiveTab
                }`}
              >
                <span className={`transition-colors ${activeSection === item.id ? g.sidebarIconActive : g.sidebarIconInactive}`}>
                  {item.icon}
                </span>
                <span className="font-normal text-xs tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sección Inferior del Perfil */}
        <div className="p-4 shrink-0 flex flex-col">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl transition-colors text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>

          <div className="w-full h-px bg-white/10 my-4" />

          <div className="flex items-center space-x-3 p-1.5 rounded-xl bg-transparent">
            <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border border-white/20 shadow-md">
              <img
                src={adminImg}
                alt="Admin Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80";
                }}
              />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-xs font-black truncate leading-tight text-white">
                {user?.nombre || 'Administrador General'}
              </p>
              <p className={`${theme === 'coquette' ? 'text-pink-300' : 'text-blue-300'} text-[10px] font-medium truncate mt-0.5`}>
                Admin User
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO MUTABLE */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">

        {/* BARRA SUPERIOR ADAPTATIVA */}
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 z-10 transition-all duration-300 ${g.header}`}>
          <div className="flex items-center">
            <span className={`text-2xl font-black tracking-tight transition-colors ${ 
              theme === 'oscuro' ? 'text-white!' : 
              theme === 'coquette' ? 'text-[#4c282c]!' : 
              'text-slate-900!'
            }`}>
              {activeSection === 'tablero' && 'Panel Admin'}
              {activeSection === 'usuarios' && 'Gestión de Usuarios'}
              {activeSection === 'carreras' && 'Carreras y Cursos'}
              {activeSection === 'asignaciones' && 'Asignaciones'}
              {activeSection === 'reportes' && 'Reportes / Auditoría'}
              {activeSection === 'config' && 'Configuración'}
            </span>
          </div>
          <div className="flex items-center space-x-4">

            {/* Buscador Redondeado Estilizado */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400/80" size={15} />
              <input
                type="text"
                placeholder="Buscar registros..."
                className={`pl-10 pr-4 py-2 border rounded-full text-xs w-64 outline-none transition-all duration-300 ${g.searchInput}`}
              />
            </div>

            {/* Notificaciones */}
            <button className={`p-2 rounded-full transition-colors relative cursor-pointer ${g.notificationBtn}`}>
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Escudo Informativo Adaptado */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 select-none ${g.shieldBox}`}>
              <ShieldCheck size={18} className={theme === 'coquette' ? 'text-white' : 'text-blue-400'} />
            </div>

          </div>
        </header>

        {/* ÁREA CENTRAL INTERACTIVA */}
        <section className={`flex-1 overflow-y-auto p-6 text-left transition-all duration-300 ${g.bodySection}`}>
          {renderRightContent()}
        </section>
      </main>

    </div>
  );
};