import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Users, BookOpen, UserCheck, Search, Edit2, UserMinus, CheckCircle,Plus,Trash2,X } from 'lucide-react';

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: 'Admin' | 'Docente' | 'Estudiante';
  estado: 'Activo' | 'Inactivo';
  fechaRegistro: string;
}

export const GestionUsuarios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Admin' | 'Docente' | 'Estudiante'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  
  // Estados para controlar los Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  // Estados del Formulario (para crear y editar)
  const [formNombre, setFormNombre] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formRol, setFormRol] = useState<'Admin' | 'Docente' | 'Estudiante'>('Estudiante');

  // Datos mock iniciales
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nombre: 'Cindy Ruano', correo: 'cruano@miumg.edu.gt', rol: 'Admin', estado: 'Inactivo', fechaRegistro: '10/02/2026' },
    { id: '2', nombre: 'Josué Hicho', correo: 'jhicho@miumg.edu.gt', rol: 'Docente', estado: 'Inactivo', fechaRegistro: '15/01/2026' },
    { id: '3', nombre: 'Madelin Cerón', correo: 'mceron@miumg.edu.gt', rol: 'Estudiante', estado: 'Inactivo', fechaRegistro: '02/02/2026' },
    { id: '4', nombre: 'Yamilet Lindo', correo: 'ylindo@miumg.edu.gt', rol: 'Docente', estado: 'Inactivo', fechaRegistro: '20/11/2025' },
    { id: '5', nombre: 'María Lopéz', correo: 'mlopez@miumg.edu.gt', rol: 'Estudiante', estado: 'Activo', fechaRegistro: '18/02/2026' },
    { id: '6', nombre: 'Dulce Prado', correo: 'dprado@miumg.edu.gt', rol: 'Estudiante', estado: 'Activo', fechaRegistro: '18/02/2026' },

  ]);

  // Cambiar de Activo a Inactivo
  const toggleEstado = (id: string) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u));
  };

  // Eliminar un usuario permanentemente
  const eliminarUsuario = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  // Abrir modal para crear nuevo
  const handleNuevoUsuarioClick = () => {
    setEditingUsuario(null);
    setFormNombre('');
    setFormCorreo('');
    setFormRol('Estudiante');
    setIsModalOpen(true);
  };

  // Abrir modal para editar existente (Lápiz)
  const handleEditarClick = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormNombre(usuario.nombre);
    setFormCorreo(usuario.correo);
    setFormRol(usuario.rol);
    setIsModalOpen(true);
  };

  // Guardar datos
  const handleGuardarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUsuario) {
      // Modo Edición
      setUsuarios(usuarios.map(u => u.id === editingUsuario.id ? {
        ...u,
        nombre: formNombre,
        correo: formCorreo,
        rol: formRol
      } : u));
    } else {
      // Modo Creación
      const hoy = new Date();
      const fechaActual = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
      
      const nuevo: Usuario = {
        id: Date.now().toString(),
        nombre: formNombre,
        correo: formCorreo,
        rol: formRol,
        estado: 'Activo',
        fechaRegistro: fechaActual
      };
      setUsuarios([...usuarios, nuevo]);
    }

    setIsModalOpen(false);
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const matchesTab = activeTab === 'Todos' || u.rol === activeTab;
    const matchesSearch = u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || u.correo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Total</p>
            <h4 className="text-xl font-bold text-slate-800">{usuarios.length}</h4>
          </div>
        </div>

        {/* Estudiantes */}
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Estudiantes</p>
            <h4 className="text-xl font-bold text-slate-800">{usuarios.filter(u => u.rol === 'Estudiante').length}</h4>
          </div>
        </div>

        {/* Docentes */}
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Docentes</p>
            <h4 className="text-xl font-bold text-slate-800">{usuarios.filter(u => u.rol === 'Docente').length}</h4>
          </div>
        </div>

        {/* Activos */}
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><UserCheck size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Activos</p>
            <h4 className="text-xl font-bold text-slate-800">{usuarios.filter(u => u.estado === 'Activo').length}</h4>
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE FILTROS Y TABLA */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          
          {/* Pestañas de control */}
          <div className={`flex p-1 rounded-xl space-x-1 ${styles.panelMuted}`}>
            {(['Todos', 'Admin', 'Docente', 'Estudiante'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === tab ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                {tab === 'Todos' ? 'Todos' : tab + 's'}
              </button>
            ))}
          </div>

          {/* Buscador interno local y botón agregar */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder="Filtrar por nombre o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full sm:w-72 focus:outline-none transition-all ${styles.input} ${styles.border}`}
              />
            </div>
            <button 
              onClick={handleNuevoUsuarioClick}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#1a365d] text-white text-xs font-bold rounded-xl hover:bg-[#152c4d] transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* TABLA PRINCIPAL */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Usuario</th>
                <th className="py-3.5 px-6">Rol</th>
                <th className="py-3.5 px-6">Fecha Registro</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id} className={`transition-colors ${styles.tableRowHover}`}>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{u.nombre}</span>
                        <span className="text-gray-400 text-[11px] mt-0.5">{u.correo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.rol === 'Admin' ? 'bg-purple-50 text-purple-600' :
                        u.rol === 'Docente' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium">{u.fechaRegistro}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.estado === 'Activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${u.estado === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{u.estado}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-1">
                        {/* BOTÓN EDITAR */}
                        <button 
                          onClick={() => handleEditarClick(u)}
                          title="Editar Usuario" 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        
                        {/* BOTÓN TOGGLE ESTADO */}
                        <button 
                          onClick={() => toggleEstado(u.id)}
                          title={u.estado === 'Activo' ? "Desactivar" : "Activar"} 
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            u.estado === 'Activo' ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.estado === 'Activo' ? <UserMinus size={13} /> : <CheckCircle size={13} />}
                        </button>

                        {/* BOTÓN ELIMINAR */}
                        <button 
                          onClick={() => eliminarUsuario(u.id)}
                          title="Eliminar permanentemente" 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                    No hay usuarios en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DINÁMICO (NUEVO / EDITAR USUARIO) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} animate-in fade-in zoom-in-95 duration-150`}>
            
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingUsuario ? 'Modificar Usuario Académico' : 'Registrar Nuevo Usuario'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulario Interno */}
            <form onSubmit={handleGuardarSubmit} className="mt-4 space-y-4 text-left">
              
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej. Ing. René Paiz"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico Institucional</label>
                <input 
                  type="email" 
                  required
                  value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  placeholder="ejemplo@miumg.edu.gt"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rol del Sistema</label>
                <select 
                  value={formRol}
                  onChange={(e) => setFormRol(e.target.value as 'Admin' | 'Docente' | 'Estudiante')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-slate-400 text-gray-700 cursor-pointer"
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente">Docente</option>
                  <option value="Admin">Administrador</option>
                </select>
              </div>

              {/* Botoneras */}
              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1a365d] text-white font-bold text-xs rounded-xl hover:bg-[#152c4d] transition-colors shadow-xs cursor-pointer"
                >
                  {editingUsuario ? 'Guardar Cambios' : 'Registrar Cuenta'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};