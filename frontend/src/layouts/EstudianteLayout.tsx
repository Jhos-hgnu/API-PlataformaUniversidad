import React from 'react';
import { useAuth } from '../context/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  GraduationCap,
  User as UserIcon,
  Sun,
  Moon,
  Heart,
} from 'lucide-react';

export type TabEstudiante = 'tablero' | 'inscripciones' | 'cursos' | 'expediente' | 'mensajes' | 'config';

interface EstudianteLayoutProps {
  children: React.ReactNode;
  activeTab: TabEstudiante;
  onTabChange: (tab: TabEstudiante) => void;
}

export const EstudianteLayout: React.FC<EstudianteLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout, theme, setTheme } = useAuth();

  const menuItems = [
    { id: 'tablero' as TabEstudiante, label: 'Tablero (Inicio)', icon: <LayoutDashboard size={20} /> },
    { id: 'inscripciones' as TabEstudiante, label: 'Inscripciones', icon: <BookOpen size={20} /> },
    { id: 'cursos' as TabEstudiante, label: 'Cursos', icon: <FolderOpen size={20} /> },
    { id: 'expediente' as TabEstudiante, label: 'Expediente', icon: <FileText size={20} /> },
    { id: 'mensajes' as TabEstudiante, label: 'Mensajes / Avisos', icon: <MessageSquare size={20} /> },
    { id: 'config' as TabEstudiante, label: 'Configuración', icon: <Settings size={20} /> },
  ];

  const getStyles = () => {
    switch (theme) {
      case 'oscuro':
        return {
          wrapper: 'bg-slate-900',
          sidebar: 'bg-slate-950 border-r border-slate-800',
          sidebarItem: 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
          sidebarItemActive: 'bg-blue-600 text-white shadow-lg',
          sidebarIcon: 'text-blue-300',
          sidebarIconActive: 'text-white',
          header: 'bg-slate-950 border-b border-slate-800',
          headerTitle: 'text-slate-200',
          searchInput: 'bg-slate-800 text-slate-200 placeholder:text-slate-500',
          sectionBg: 'bg-slate-900/40',
          logo: 'text-white',
          logoSub: 'text-blue-300',
          userName: 'text-white',
          userRole: 'text-blue-300',
        };
      case 'coquette':
        return {
          wrapper: 'bg-[#fff5f6]',
          sidebar: 'bg-[#4c282c] border-r border-[#fbcdd4]/20',
          sidebarItem: 'text-[#fbcdd4]/80 hover:bg-[#5c3439] hover:text-white',
          sidebarItemActive: 'bg-[#f472b6] text-white shadow-md',
          sidebarIcon: 'text-[#fbcdd4]/50',
          sidebarIconActive: 'text-white',
          header: 'bg-white border-b border-[#fbcdd4]',
          headerTitle: 'text-[#6d4c51]',
          searchInput: 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51] placeholder:text-[#b3888d]/60',
          sectionBg: 'bg-[#fff5f6]',
          logo: 'text-white',
          logoSub: 'text-[#fbcdd4]',
          userName: 'text-white',
          userRole: 'text-[#fbcdd4]',
        };
      case 'claro':
      default:
        return {
          wrapper: 'bg-[#f4f6f9]',
          sidebar: 'bg-[#1a365d]',
          sidebarItem: 'text-blue-100 hover:bg-white/10',
          sidebarItemActive: 'bg-white text-[#1a365d] shadow-lg',
          sidebarIcon: 'text-blue-300',
          sidebarIconActive: 'text-[#1a365d]',
          header: 'bg-white border-b border-gray-100',
          headerTitle: 'text-gray-800',
          searchInput: 'bg-gray-50 text-gray-700 placeholder:text-gray-400',
          sectionBg: 'bg-[#f8fafc]',
          logo: 'text-white',
          logoSub: 'text-blue-200',
          userName: 'text-white',
          userRole: 'text-blue-200',
        };
    }
  };

  const s = getStyles();

  const themeIcon = theme === 'oscuro' ? <Moon size={16} /> : theme === 'coquette' ? <Heart size={16} /> : <Sun size={16} />;
  const nextTheme: Record<string, 'claro' | 'oscuro' | 'coquette'> = { claro: 'oscuro', oscuro: 'coquette', coquette: 'claro' };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${s.wrapper}`}>
      <aside className={`w-64 flex flex-col shrink-0 h-full shadow-xl ${s.sidebar}`}>
        <div className="p-5 flex flex-col items-center border-b shrink-0 border-white/10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h2 className={`font-black text-lg tracking-tight uppercase ${s.logo}`}>UniDB</h2>
          <p className={`${s.logoSub} text-[9px] uppercase tracking-widest font-bold mt-0.5`}>Portal Estudiante</p>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                activeTab === item.id ? s.sidebarItemActive : s.sidebarItem
              }`}
            >
              <span className={activeTab === item.id ? s.sidebarIconActive : s.sidebarIcon}>{item.icon}</span>
              <span className="font-semibold text-xs tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 shrink-0 flex flex-col">
          <button
            onClick={() => setTheme(nextTheme[theme])}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-xl transition-colors text-xs font-bold cursor-pointer mb-2 ${s.sidebarItem}`}
          >
            {themeIcon}
            <span>Tema: {theme === 'claro' ? 'Claro' : theme === 'oscuro' ? 'Oscuro' : 'Coquette'}</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl transition-colors text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
          <div className="w-full h-px bg-white/10 my-4" />
          <div className="flex items-center space-x-3 p-1.5">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.nombre?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <p className={`text-xs font-black truncate ${s.userName}`}>{user?.nombre || 'Estudiante'}</p>
              <p className={`${s.userRole} text-[10px] truncate`}>Estudiante</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden h-full">
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 z-10 transition-all duration-300 ${s.header}`}>
          <span className={`text-xl font-black tracking-tight ${s.headerTitle}`}>
            {activeTab === 'tablero' ? 'Tablero' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </span>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Buscar cursos, notas..."
                className={`pl-10 pr-4 py-2 border border-transparent rounded-full text-xs w-64 outline-none ${s.searchInput}`}
              />
            </div>
            <button className="p-2 rounded-full relative text-gray-400 hover:bg-gray-100">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        <section className={`flex-1 overflow-y-auto p-8 text-left ${s.sectionBg}`}>
          {children}
        </section>
      </main>
    </div>
  );
};
