import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Users, BookOpen, UserCheck, Search, Edit2, UserMinus, CheckCircle, Plus, Trash2, X } from 'lucide-react';
import { usuariosService, type Usuario } from '../../../services/usuarios.service';

interface UsuarioUI {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'Admin' | 'Docente' | 'Estudiante';
  estado: 'Activo' | 'Inactivo';
  fechaRegistro: string;
}

const mapBackendToUI = (u: Usuario): UsuarioUI => ({
  id: u.id_usuario,
  nombre: `${u.nombre} ${u.apellido}`,
  apellido: u.apellido,
  correo: u.correo,
  rol: u.rol === 'admin' ? 'Admin' : u.rol === 'docente' ? 'Docente' : 'Estudiante',
  estado: u.estado ? 'Activo' : 'Inactivo',
  fechaRegistro: new Date(u.fecha_creacion).toLocaleDateString('es-GT'),
});

const mapRolToBackend = (rol: string): 'admin' | 'docente' | 'estudiante' => {
  switch (rol) {
    case 'Admin': return 'admin';
    case 'Docente': return 'docente';
    default: return 'estudiante';
  }
};

export const GestionUsuarios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Admin' | 'Docente' | 'Estudiante'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioUI | null>(null);

  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRol, setFormRol] = useState<'Admin' | 'Docente' | 'Estudiante'>('Estudiante');

  const [usuarios, setUsuarios] = useState<UsuarioUI[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = useCallback(() => {
    setLoading(true);
    usuariosService.getAll()
      .then(res => setUsuarios(res.data.map(mapBackendToUI)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const toggleEstado = (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    usuariosService.update(id, { ...(nuevoEstado === 'Activo' ? { estado: true } : { estado: false }) })
      .then(() => cargarUsuarios())
      .catch(() => {});
  };

  const eliminarUsuario = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente este usuario?')) {
      usuariosService.remove(id)
        .then(() => cargarUsuarios())
        .catch(() => {});
    }
  };

  const handleNuevoUsuarioClick = () => {
    setEditingUsuario(null);
    setFormNombre('');
    setFormApellido('');
    setFormCorreo('');
    setFormPassword('');
    setFormRol('Estudiante');
    setIsModalOpen(true);
  };

  const handleEditarClick = (usuario: UsuarioUI) => {
    setEditingUsuario(usuario);
    const partes = usuario.nombre.split(' ');
    setFormNombre(partes[0] || '');
    setFormApellido(partes.slice(1).join(' ') || '');
    setFormCorreo(usuario.correo);
    setFormPassword('');
    setFormRol(usuario.rol);
    setIsModalOpen(true);
  };

  const handleGuardarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUsuario) {
        await usuariosService.update(editingUsuario.id, {
          nombre: formNombre,
          apellido: formApellido,
          correo: formCorreo,
          rol: mapRolToBackend(formRol),
          ...(formPassword ? { password: formPassword } : {}),
        });
      } else {
        await usuariosService.create({
          nombre: formNombre,
          apellido: formApellido,
          correo: formCorreo,
          password: formPassword,
          rol: mapRolToBackend(formRol),
        });
      }
      cargarUsuarios();
      setIsModalOpen(false);
    } catch {}
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const matchesTab = activeTab === 'Todos' || u.rol === activeTab;
    const matchesSearch = u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || u.correo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Total</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : usuarios.length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Estudiantes</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : usuarios.filter(u => u.rol === 'Estudiante').length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Docentes</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : usuarios.filter(u => u.rol === 'Docente').length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><UserCheck size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Activos</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : usuarios.filter(u => u.estado === 'Activo').length}</h4>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>

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
              className={`flex items-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
            >
              <Plus size={14} />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

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
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400 font-medium">Cargando usuarios...</td></tr>
              ) : usuariosFiltrados.length > 0 ? (
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
                        <button
                          onClick={() => handleEditarClick(u)}
                          title="Editar Usuario"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => toggleEstado(u.id)}
                          title={u.estado === 'Activo' ? "Desactivar" : "Activar"}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            u.estado === 'Activo' ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.estado === 'Activo' ? <UserMinus size={13} /> : <CheckCircle size={13} />}
                        </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} animate-in fade-in zoom-in-95 duration-150`}>

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

            <form onSubmit={handleGuardarSubmit} className="mt-4 space-y-4 text-left">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
                  <input
                    type="text" required value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej. René"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Apellido</label>
                  <input
                    type="text" required value={formApellido}
                    onChange={(e) => setFormApellido(e.target.value)}
                    placeholder="Ej. Paiz"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico Institucional</label>
                <input
                  type="email" required value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  placeholder="ejemplo@miumg.edu.gt"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{editingUsuario ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
                <input
                  type="password" required={!editingUsuario} value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
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
                  className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
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
