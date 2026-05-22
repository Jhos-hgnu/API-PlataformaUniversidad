import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileSpreadsheet, Users, MessageSquare, Settings, LogOut, Search, Bell, ShieldCheck, X, ArrowRight, Info,GraduationCap} from 'lucide-react';
import { Cursos } from './Cursos';
import { ControlNotas } from './ControlNotas';
import { Estudiantes } from './Estudiantes';
import { Mensajes } from './Mensajes';
import { ConfiguracionDoc } from './ConfiguracionDoc';
import { TableroDoc } from './TableroDoc';
import adminImg from '../../../assets/imagenes/docente.webp';

type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config';

export const DocenteDashboard: React.FC = () => {
  const { user, logout, theme } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('tablero');

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Listado estático de notificaciones para el Portal UMG
  const [notifications] = useState([
    { id: 1, title: 'Cierre de Actas', desc: 'El ingreso de notas del primer ciclo finaliza este sábado.', time: 'Hace 10 min', unread: true },
    { id: 2, title: 'Mantenimiento Programado', desc: 'El portal de asignaciones tendrá un reinicio a las 22:00 hrs.', time: 'Hace 2 horas', unread: true },
    { id: 3, title: 'Usuario Creado', desc: 'Se ha registrado exitosamente al docente Josué Hicho.', time: 'Hace 1 día', unread: false },
  ]);

  // Diccionario del buscador adaptado estrictamente a las secciones del Docente
  const searchIndex: { keys: string[]; section: Section; label: string }[] = [
    { keys: ['tablero', 'metricas', 'inicio', 'graficas', 'dashboard', 'general', 'resumen'], section: 'tablero', label: 'Ir al Tablero Principal' },
    { keys: ['cursos', 'materias', 'asignaturas', 'clases', 'horarios'], section: 'cursos', label: 'Ir a Mis Cursos Asignados' },
    { keys: ['notas', 'actas', 'calificaciones', 'cuadros', 'ingresar notas'], section: 'notas', label: 'Ir a Control de Notas' },
    { keys: ['estudiantes', 'alumnos', 'listados', 'asistencia'], section: 'estudiantes', label: 'Ir a Mis Estudiantes' },
    { keys: ['mensajes', 'chat', 'bandeja', 'notificaciones', 'correo'], section: 'mensajes', label: 'Ir a Mensajes' },
    { keys: ['configuracion', 'ajustes', 'tema', 'claro', 'oscuro', 'perfil'], section: 'config', label: 'Ir a Configuración' },
  ];

  // Filtrar los accesos según la búsqueda global
  const searchResults = searchQuery.trim() === '' ? [] : searchIndex.filter(item => 
    item.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Cerrar ventanas flotantes al hacer clic afuera de los componentes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menú de navegación sincronizado con las secciones y componentes del Docente
  const menuItems = [
    { id: 'tablero' as Section, label: 'Tablero', icon: <LayoutDashboard size={18} /> },
    { id: 'cursos' as Section, label: 'Mis Cursos', icon: <BookOpen size={18} /> },
    { id: 'notas' as Section, label: 'Actas de Notas', icon: <FileSpreadsheet size={18} /> },
    { id: 'estudiantes' as Section, label: 'Mis Estudiantes', icon: <Users size={18} /> },
    { id: 'mensajes' as Section, label: 'Mensajes', icon: <MessageSquare size={18} /> },
    { id: 'config' as Section, label: 'Configuración', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
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
          dropdownPanel: 'bg-slate-900 border-slate-800 text-white shadow-black/40',
          dropdownItemHover: 'hover:bg-slate-800 text-slate-200'
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
          dropdownPanel: 'bg-white border-[#fbcdd4] text-[#6d4c51] shadow-pink-100/50',
          dropdownItemHover: 'hover:bg-[#fff5f6] text-[#6d4c51]'
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
          dropdownPanel: 'bg-white border-gray-200 text-slate-800 shadow-xl shadow-gray-100',
          dropdownItemHover: 'hover:bg-gray-50 text-slate-700'
        };
    }
  };

  const g = obtenerEstilosGlobales();

  const handleSetActiveSection = (section: Section) => {
    setActiveSection(section);
  };

  // El renderizado de componentes secundarios del Dashboard
  const renderRightContent = () => {
    switch (activeSection) {
      case 'tablero':
        return <TableroDoc setActiveSection={handleSetActiveSection} />;
      case 'cursos':
        return <Cursos />;
      case 'notas':
        return <ControlNotas />;
      case 'estudiantes':
        return <Estudiantes />;
      case 'mensajes':
        return <Mensajes />;
      case 'config':
        return <ConfiguracionDoc />;
      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <div className={`fixed inset-0 h-screen w-screen flex overflow-hidden m-0 p-0 font-sans antialiased transition-colors duration-300 ${g.wrapper}`}>

      {/* SIDEBAR DINÁMICO */}
      <aside className={`w-64 flex flex-col shrink-0 h-full transition-all duration-300 shadow-xl ${g.sidebar}`}>
        <div className={`p-5 flex flex-col items-center border-b shrink-0 transition-colors ${g.sidebarHeader}`}>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h2 className="font-black text-lg tracking-tight uppercase text-white">Universidad UMG</h2>
          <p className={`${theme === 'coquette' ? 'text-pink-200' : 'text-blue-200'} text-[9px] uppercase tracking-widest font-bold mt-0.5`}>
            Panel Docente
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSearchQuery('');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                activeSection === item.id ? g.sidebarActiveTab : g.sidebarInactiveTab
              }`}
            >
              <span className={`transition-colors ${activeSection === item.id ? g.sidebarIconActive : g.sidebarIconInactive}`}>
                {item.icon}
              </span>
              <span className="font-normal text-xs tracking-wide">{item.label}</span>
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
          <div className="flex items-center space-x-3 p-1.5 rounded-xl bg-transparent">
            <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border border-white/20 shadow-md">
              <img
                src={adminImg}
                alt="Docente Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80";
                }}
              />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-xs font-black truncate leading-tight text-white">
                {user?.nombre || 'Docente UMG'}
              </p>
              <p className={`${theme === 'coquette' ? 'text-pink-300' : 'text-blue-300'} text-[10px] font-medium truncate mt-0.5`}>
                Catedrático
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO MUTABLE */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">

        {/* BARRA SUPERIOR ADAPTATIVA */}
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 z-30 transition-all duration-300 ${g.header}`}>
          <div className="flex items-center">
            <span className={`text-2xl font-black tracking-tight transition-colors ${ 
              theme === 'oscuro' ? 'text-white' : 
              theme === 'coquette' ? 'text-[#4c282c]' : 
              'text-slate-900'
            }`}>
              {activeSection === 'tablero' && 'Tablero General'}
              {activeSection === 'cursos' && 'Mis Cursos Asignados'}
              {activeSection === 'notas' && 'Control de Notas'}
              {activeSection === 'estudiantes' && 'Mis Estudiantes'}
              {activeSection === 'mensajes' && 'Bandeja de Mensajes'}
              {activeSection === 'config' && 'Configuración de Cuenta'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">

            {/* BUSCADOR PRINCIPAL GLOBAL CONECTADO */}
            <div ref={searchRef} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400/80" size={15} />
              <input
                type="text"
                placeholder="Buscar secciones o herramientas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-8 py-2 border rounded-full text-xs w-64 outline-none transition-all duration-300 ${g.searchInput}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}

              {/* Menú de Resultados Flotante del Buscador */}
              {searchResults.length > 0 && (
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl border p-2 shadow-2xl z-50 transition-all ${g.dropdownPanel}`}>
                  <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100/10 mb-1">
                    Secciones del Portal
                  </div>
                  <div className="space-y-0.5">
                    {searchResults.map((result) => (
                      <button
                        key={result.section}
                        onClick={() => {
                          setActiveSection(result.section);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-colors font-semibold group cursor-pointer ${g.dropdownItemHover}`}
                      >
                        <span>{result.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {searchQuery.trim() !== '' && searchResults.length === 0 && (
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl border p-4 text-center text-xs text-gray-400 shadow-2xl ${g.dropdownPanel}`}>
                  No se encontraron módulos con ese nombre.
                </div>
              )}
            </div>

            {/* NOTIFICACIONES CONECTADAS AL CLICK */}
            <div ref={notificationRef} className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full transition-colors relative cursor-pointer ${g.notificationBtn}`}
              >
                <Bell size={18} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {/* Panel Desplegable de Notificaciones */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl border p-2 shadow-2xl z-50 text-left transition-all animate-in fade-in slide-in-from-top-3 duration-150 ${g.dropdownPanel}`}>
                  <div className="p-3 border-b border-gray-100/10 flex justify-between items-center">
                    <span className="font-bold text-xs">Notificaciones Académicas</span>
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">UMG</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100/10">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-gray-50/5 dark:hover:bg-slate-800/50 transition-colors relative group">
                        {n.unread && (
                          <span className="absolute top-4 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        )}
                        <div className="flex items-start space-x-2">
                          <Info size={13} className="mt-0.5 text-gray-400 shrink-0" />
                          <div>
                            <p className="font-bold text-xs pr-2">{n.title}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">{n.desc}</p>
                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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