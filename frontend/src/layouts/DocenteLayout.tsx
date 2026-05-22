import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { getThemeStyles } from '../utils/themeStyles';
import { LayoutDashboard, Users, GraduationCap, UserPlus, FileText, Settings, LogOut, Search, Bell, User as UserIcon, X, ArrowRight, Info } from 'lucide-react';

interface DocenteLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void; 
}

export const DocenteLayout: React.FC<DocenteLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout, theme } = useAuth();
  const styles = getThemeStyles(theme);

  // Estados globales para la barra superior
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notificaciones estáticas simuladas 
  const [notifications] = useState([
    { id: 1, title: 'Cierre de Actas', desc: 'El ingreso de notas del primer ciclo finaliza este sábado.', time: 'Hace 10 min', unread: true },
    { id: 2, title: 'Mantenimiento Programado', desc: 'El portal de asignaciones tendrá un reinicio a las 22:00 hrs.', time: 'Hace 2 horas', unread: true },
    { id: 3, title: 'Usuario Creado', desc: 'Se ha registrado exitosamente al docente Josué Hicho.', time: 'Hace 1 día', unread: false },
  ]);

  // Diccionario de comandos de voz/búsqueda para redirigir vistas
  const searchIndex = [
    { keys: ['nuevo usuario', 'crear usuario', 'registrar usuario', 'gestion de usuarios', 'usuarios', 'roles'], tab: 'usuarios', label: 'Ir a Gestión de Usuarios' },
    { keys: ['nueva asignacion', 'crear asignacion', 'asignar curso', 'secciones', 'horarios', 'asignaciones'], tab: 'asignaciones', label: 'Ir a Asignaciones Académicas' },
    { keys: ['tablero', 'metricas', 'inicio', 'graficas', 'dashboard', 'general'], tab: 'tablero', label: 'Ir al Tablero Principal' },
    { keys: ['carreras', 'cursos', 'pensum', 'facultades'], tab: 'carreras', label: 'Ir a Carreras y Cursos' },
    { keys: ['reportes', 'auditoria', 'excel', 'exportar', 'logs'], tab: 'reportes', label: 'Ir a Reportes / Auditoría' },
    { keys: ['configuracion', 'mantenimiento', 'ajustes', 'tema', 'coquette', 'claro', 'oscuro'], tab: 'config', label: 'Ir a Configuración del Sistema' },
  ];

  // Evaluar coincidencias del buscador principal
  const searchResults = searchQuery.trim() === '' ? [] : searchIndex.filter(item => 
    item.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Cerrar ventanas flotantes al hacer clic en cualquier otra parte de la pantalla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'tablero', label: 'Tablero', icon: <LayoutDashboard size={20} /> },
    { id: 'cursos', label: 'Mis cursos', icon: <Users size={20} /> },
    { id: 'actaNotas', label: 'Actas de Notas', icon: <GraduationCap size={20} /> },
    { id: 'estudiantes', label: 'Estudiantes', icon: <UserPlus size={20} /> },
    { id: 'mensajes', label: 'Mensajes', icon: <FileText size={20} /> },
    { id: 'config', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${styles.page}`}>
      
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-[#1a365d] flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 flex flex-col items-center">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-2">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h2 className="text-white font-black text-xl tracking-tighter">UNIVERSIDAD UMG</h2>
          <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold">Gestión Académica</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery('');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                activeTab === item.id 
                ? 'bg-white text-[#1a365d] shadow-lg font-bold' 
                : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <span className={activeTab === item.id ? 'text-[#1a365d]' : 'text-blue-300'}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* PERFIL ABAJO */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-2xl mb-2">
            <div className="w-9 h-9 bg-linear-to-tr from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white border-2 border-white/20">
              <UserIcon size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user?.nombre || 'Docente'}</p>
              <p className="text-blue-300 text-[10px] truncate">Docente User</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-100 hover:bg-red-500/10 py-2 rounded-lg transition-colors text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* BARRA SUPERIOR */}
        <header className={`h-20 border-b flex items-center justify-between px-8 shrink-0 z-30 ${styles.panel}`}>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-black uppercase tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label || 'Panel Docente'}
            </h1>
            
            {/* BUSCADOR PRINCIPAL */}
            <div ref={searchRef} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar registros (ej: usuario, asignación)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-8 py-2 text-sm w-72 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl transition-all ${styles.input}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}

              {/* Menú Flotante del Buscador Principal */}
              {searchResults.length > 0 && (
                <div className={`absolute top-full left-0 mt-2 w-80 rounded-2xl border p-2 shadow-2xl z-50 bg-white ${styles.panel}`}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b mb-1">
                    Secciones Encontradas
                  </div>
                  <div className="space-y-0.5">
                    {searchResults.map((result) => (
                      <button
                        key={result.tab}
                        onClick={() => {
                          setActiveTab(result.tab);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left text-gray-700 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors font-semibold group cursor-pointer"
                      >
                        <span>{result.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#f472b6]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {searchQuery.trim() !== '' && searchResults.length === 0 && (
                <div className={`absolute top-full left-0 mt-2 w-80 rounded-2xl border p-4 text-center text-xs text-gray-400 shadow-2xl bg-white ${styles.panel}`}>
                  No se encontraron accesos directos para esa búsqueda.
                </div>
              )}
            </div>
          </div>

          {/* NOTIFICACIONES */}
          <div className="flex items-center space-x-4">
            
            {/* BOTÓN CAMPANITA CONECTADO AL ESTADO */}
            <div ref={notificationRef} className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
              >
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Ventana de Notificaciones Flotante Corregida */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border p-2 shadow-2xl z-50 bg-white border-[#fbcdd4] text-[#6d4c51] animate-in fade-in slide-in-from-top-3 duration-150">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-sm">Notificaciones Académicas</span>
                    <span className="text-[10px] bg-pink-100 text-[#f472b6] px-2 py-0.5 rounded-full font-bold">UMG</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-[#fff5f6] transition-colors text-left relative group">
                        {n.unread && (
                          <span className="absolute top-4 right-3 w-1.5 h-1.5 bg-[#f472b6] rounded-full"></span>
                        )}
                        <div className="flex items-start space-x-2">
                          <Info size={14} className="mt-0.5 text-gray-400 shrink-0" />
                          <div>
                            <p className="font-bold text-xs pr-2 text-slate-800">{n.title}</p>
                            <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed">{n.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Escudo / Tema Dinámico lateral */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${styles.badgePrimary}`}>
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO VARIABLE */}
        <section className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] dark:bg-slate-950">
          {children}
        </section>
      </main>
    </div>
  );
};