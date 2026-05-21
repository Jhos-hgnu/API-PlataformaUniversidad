import React from 'react';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, Users, GraduationCap, UserPlus, FileText, Settings, LogOut, Search, Bell, User as UserIcon } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'tablero', label: 'Tablero', icon: <LayoutDashboard size={20} /> },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: <Users size={20} /> },
    { id: 'carreras', label: 'Carreras y Cursos', icon: <GraduationCap size={20} /> },
    { id: 'asignaciones', label: 'Asignaciones', icon: <UserPlus size={20} /> },
    { id: 'reportes', label: 'Reportes / Auditoría', icon: <FileText size={20} /> },
    { id: 'config', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f4f6f9] overflow-hidden">
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#1a365d] flex flex-col shadow-xl">
        <div className="p-6 flex flex-col items-center">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h2 className="text-white font-black text-xl tracking-tighter">UniDB</h2>
          <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold">Gestión Académica</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-white text-[#1a365d] shadow-lg' 
                : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <span className={activeTab === item.id ? 'text-[#1a365d]' : 'text-blue-300'}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* PERFIL EN EL MENÚ */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-2xl mb-2">
            <div className="w-9 h-9 bg-linear-to-tr from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white border-2 border-white/20">
              <UserIcon size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user?.nombre}</p>
              <p className="text-blue-300 text-[10px] truncate">Admin User</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 hover:bg-red-500/10 py-2 rounded-lg transition-colors text-xs font-bold"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* BARRA SUPERIOR (HEADER) */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Panel Admin</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar registros..."
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-[#1a365d] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO VARIABLE */}
        <section className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          {children}
        </section>
      </main>
    </div>
  );
};