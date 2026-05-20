import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  UserPlus, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Bell
} from 'lucide-react';

// Importación de tu asset local
import adminImg from '../../../assets/imagenes/admin.webp';

type Section = 'tablero' | 'usuarios' | 'carreras' | 'asignaciones' | 'reportes' | 'config';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
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

  const renderRightContent = () => {
    switch (activeSection) {
      case 'tablero':
        return (
          <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-100 p-8 flex flex-col items-center justify-center text-center min-h-[350px]">
            <div className="w-14 h-14 bg-blue-50 text-[#1a365d] rounded-2xl flex items-center justify-center mb-3">
              <LayoutDashboard size={28} />
            </div>
            <h3 style={{ color: '#374151' }} className="text-xl font-black uppercase tracking-tight">Área del Tablero Global</h3>
            <p className="text-gray-400 text-xs mt-1 max-w-sm leading-relaxed">
              Bienvenido al sistema. Selecciona cualquiera de los módulos del menú lateral para gestionar la plataforma académica.
            </p>
          </div>
        );
      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#f4f6f9] flex overflow-hidden m-0 p-0 font-sans antialiased">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#1a365d] flex flex-col shadow-xl shrink-0 h-full">
        {/* Encabezado */}
        <div className="p-5 flex flex-col items-center border-b border-white/10 shrink-0">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h2 style={{ color: '#ffffff' }} className="font-black text-lg tracking-tight uppercase">Universidad UMG</h2>
          <p className="text-blue-200 text-[9px] uppercase tracking-widest font-bold mt-0.5">Gestión Académica</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-150 group cursor-pointer ${
                activeSection === item.id 
                  ? 'bg-white text-[#1a365d] shadow-md' 
                  : 'text-blue-100 hover:bg-white/5'
              }`}
            >
              <span className={activeSection === item.id ? 'text-[#1a365d]' : 'text-blue-300'}>
                {item.icon}
              </span>
              <span className="font-bold text-xs tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* SECCIÓN INFERIOR REESTRUCTURADA */}
        <div className="p-4 shrink-0 flex flex-col">
          
          {/* Requisito #1: Primero va el botón Cerrar Sesión */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl transition-colors text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>

          {/* Requisito #2: Línea blanca decorativa DEBAJO del botón Cerrar Sesión */}
          <div className="w-full h-[1px] bg-white/10 my-4" />

          {/* Requisito #3: Cuadro de información (Imagen a la izquierda, seguido de los títulos a la izquierda) */}
          <div className="flex items-center space-x-3 p-1.5 rounded-xl bg-transparent">
            {/* Imagen admin.webp circular en el extremo izquierdo */}
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

            {/* Bloque de títulos alineado a la izquierda inmediatamente después de la foto */}
            <div className="flex flex-col text-left overflow-hidden">
              <p style={{ color: '#ffffff' }} className="text-xs font-black truncate leading-tight">
                {user?.nombre || 'Administrador General'}
              </p>
              <p className="text-blue-300 text-[10px] font-medium truncate mt-0.5">
                Admin User
              </p>
            </div>
          </div>

        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <h1 style={{ color: '#374151' }} className="text-sm font-black uppercase tracking-wider">
              {menuItems.find(m => m.id === activeSection)?.label}
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar registros..."
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs w-60 focus:bg-white focus:border-[#1a365d] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors relative cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xs shadow-inner">
              UI
            </div>
          </div>
        </header>

        {/* ÁREA CENTRAL INTERACTIVA */}
        <section className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] text-left">
          {renderRightContent()}
        </section>
      </main>

    </div>
  );
};