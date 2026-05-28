import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { GraduationCap, BookOpen, Layers, Plus, Search, Edit2, Trash2, X, ChevronDown, ChevronRight, Award, ToggleLeft, ToggleRight } from 'lucide-react';
import { carrerasService, type Carrera } from '../../../services/carreras.service';
import { cursosService, type Curso } from '../../../services/cursos.service';

interface CursoUI {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  prerrequisito: string;
}

interface CarreraUI {
  id: number;
  codigo: string;
  nombre: string;
  facultad: string;
  estado: 'Activa' | 'En Cierre';
  cursos: CursoUI[];
}

const mapCarreraToUI = (c: Carrera): CarreraUI => ({
  id: c.id_carrera,
  codigo: c.id_carrera.toString().padStart(3, '0'),
  nombre: c.nombre,
  facultad: 'General',
  estado: c.estado ? 'Activa' : 'En Cierre',
  cursos: [],
});

const mapCursoToUI = (c: Curso): CursoUI => ({
  id: c.id_curso,
  codigo: c.codigo,
  nombre: c.nombre,
  creditos: c.creditos,
  semestre: 1,
  prerrequisito: 'Ninguno',
});

export const CarrerasCursos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCarreraId, setExpandedCarreraId] = useState<number | null>(null);
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  const isDark = theme === 'oscuro';

  const [isCarreraModalOpen, setIsCarreraModalOpen] = useState(false);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);

  const [editingCarrera, setEditingCarrera] = useState<CarreraUI | null>(null);
  const [editingCurso, setEditingCurso] = useState<CursoUI | null>(null);
  const [selectedCarreraId, setSelectedCarreraId] = useState<number | null>(null);

  const [carreras, setCarreras] = useState<CarreraUI[]>([]);
  const [loading, setLoading] = useState(true);

  const [carreraNombre, setCarreraNombre] = useState('');
  const [carreraDescripcion, setCarreraDescripcion] = useState('');

  const [cursoNombre, setCursoNombre] = useState('');
  const [cursoCodigo, setCursoCodigo] = useState('');
  const [cursoCreditos, setCursoCreditos] = useState(4);
  const [cursoCupo, setCursoCupo] = useState(40);

  const cargarCarreras = useCallback(() => {
    setLoading(true);
    carrerasService.getAll()
      .then(res => setCarreras(res.data.map(mapCarreraToUI)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { cargarCarreras(); }, [cargarCarreras]);

  const cargarCursosDeCarrera = useCallback(async (idCarrera: number) => {
    try {
      const res = await cursosService.getByCarrera(idCarrera);
      setCarreras(prev => prev.map(c =>
        c.id === idCarrera ? { ...c, cursos: res.data.map(mapCursoToUI) } : c
      ));
    } catch {}
  }, []);

  const toggleExpand = (id: number) => {
    if (expandedCarreraId === id) {
      setExpandedCarreraId(null);
    } else {
      setExpandedCarreraId(id);
      const carrera = carreras.find(c => c.id === id);
      if (carrera && carrera.cursos.length === 0) {
        cargarCursosDeCarrera(id);
      }
    }
  };

  const toggleEstadoCarrera = (id: number) => {
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) return;
    const nuevoEstado = carrera.estado === 'Activa';
    carrerasService.update(id, { estado: !nuevoEstado })
      .then(() => cargarCarreras())
      .catch(() => {});
  };

  const handleNuevaCarreraClick = () => {
    setEditingCarrera(null);
    setCarreraNombre('');
    setCarreraDescripcion('');
    setIsCarreraModalOpen(true);
  };

  const handleEditarCarreraClick = (carrera: CarreraUI) => {
    setEditingCarrera(carrera);
    setCarreraNombre(carrera.nombre);
    setCarreraDescripcion('');
    setIsCarreraModalOpen(true);
  };

  const handleCarreraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCarrera) {
        await carrerasService.update(editingCarrera.id, { nombre: carreraNombre, descripcion: carreraDescripcion || undefined });
      } else {
        await carrerasService.create({ nombre: carreraNombre, descripcion: carreraDescripcion || undefined });
      }
      cargarCarreras();
      setIsCarreraModalOpen(false);
    } catch {}
  };

  const handleNuevoCursoClick = (carreraId: number) => {
    setSelectedCarreraId(carreraId);
    setEditingCurso(null);
    setCursoNombre('');
    setCursoCodigo('');
    setCursoCreditos(4);
    setCursoCupo(40);
    setIsCursoModalOpen(true);
  };

  const handleEditarCursoClick = (carreraId: number, curso: CursoUI) => {
    setSelectedCarreraId(carreraId);
    setEditingCurso(curso);
    setCursoNombre(curso.nombre);
    setCursoCodigo(curso.codigo);
    setCursoCreditos(curso.creditos);
    setCursoCupo(40);
    setIsCursoModalOpen(true);
  };

  const handleCursoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarreraId) return;
    try {
      if (editingCurso) {
        await cursosService.update(editingCurso.id, {
          nombre: cursoNombre,
          codigo: cursoCodigo,
          creditos: cursoCreditos,
          cupo_maximo: cursoCupo,
          id_carrera: selectedCarreraId,
        });
      } else {
        await cursosService.create({
          nombre: cursoNombre,
          codigo: cursoCodigo,
          creditos: cursoCreditos,
          cupo_maximo: cursoCupo,
          id_carrera: selectedCarreraId,
        });
      }
      if (selectedCarreraId) cargarCursosDeCarrera(selectedCarreraId);
      setIsCursoModalOpen(false);
    } catch {}
  };

  const eliminarCarrera = (id: number) => {
    if (window.confirm('¿Deseas eliminar esta carrera junto con todos sus cursos del sistema?')) {
      carrerasService.remove(id)
        .then(() => cargarCarreras())
        .catch(() => {});
    }
  };

  const eliminarCurso = (carreraId: number, cursoId: number) => {
    if (window.confirm('¿Deseas eliminar esta asignatura de la malla curricular?')) {
      cursosService.remove(cursoId)
        .then(() => cargarCursosDeCarrera(carreraId))
        .catch(() => {});
    }
  };

  const carrerasFiltradas = carreras.filter(c =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || c.codigo.includes(searchQuery)
  );

  const totalCursos = carreras.reduce((acc, c) => acc + c.cursos.length, 0);

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><GraduationCap size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Carreras</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : carreras.length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos del Catálogo</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : totalCursos}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Facultades</p>
            <h4 className="text-xl font-bold text-slate-800">
              {loading ? '...' : new Set(carreras.map(c => c.facultad)).size}
            </h4>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>

          <div className="relative flex-1 max-w-2xl">
<<<<<<< Updated upstream
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
=======
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
>>>>>>> Stashed changes
              type="text"
              placeholder="Buscar carrera por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`}
            />
          </div>

          <button
            onClick={handleNuevaCarreraClick}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-colors shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
          >
            <Plus size={14} />
            <span>Nueva Carrera</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando carreras...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-10"></th>
                  <th className="py-3.5 px-6">Código</th>
                  <th className="py-3.5 px-6">Nombre de la Carrera</th>
                  <th className="py-3.5 px-6">Facultad</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {carrerasFiltradas.length > 0 ? (
                  carrerasFiltradas.map((c) => (
                    <React.Fragment key={c.id}>
                      <tr className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => toggleExpand(c.id)}
                            className="text-gray-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                          >
                            {expandedCarreraId === c.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-blue-600">{c.codigo}</td>
                        <td className="py-4 px-6 font-semibold text-slate-800">{c.nombre}</td>
                        <td className="py-4 px-6"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">{c.facultad}</span></td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.estado === 'Activa' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {c.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleNuevoCursoClick(c.id)}
                              className="flex items-center space-x-1 px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              <Plus size={10} />
                              <span>+ Curso</span>
                            </button>
                            <button
                              onClick={() => handleEditarCarreraClick(c)}
                              title="Editar Carrera"
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => toggleEstadoCarrera(c.id)}
                              title={c.estado === 'Activa' ? "Desactivar" : "Activar"}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              {c.estado === 'Activa' ? <ToggleRight size={15} className="text-emerald-500" /> : <ToggleLeft size={15} />}
                            </button>
                            <button
                              onClick={() => eliminarCarrera(c.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedCarreraId === c.id && (
                        <tr>
                          <td colSpan={6} className={`p-4 border-t border-b ${styles.border} ${styles.panelMuted}`}>
                            <div className="pl-12 pr-6">
                              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                                <Layers size={12} />
                                <span>Malla Curricular - Asignaturas ({c.cursos.length})</span>
                              </h5>

                              {c.cursos.length > 0 ? (
                                <div className={`rounded-xl overflow-hidden border ${styles.border} ${styles.panel} shadow ${styles.shadow}`}>
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase ${styles.tableHeader}`}>
                                        <th className="py-2 px-4">Código</th>
                                        <th className="py-2 px-4">Nombre de Asignatura</th>
                                        <th className="py-2 px-4 text-center">Semestre</th>
                                        <th className="py-2 px-4 text-center">Créditos</th>
                                        <th className="py-2 px-4">Prerrequisito</th>
                                        <th className="py-2 px-4 text-center">Acciones</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                                      {c.cursos.map((curso) => (
                                        <tr key={curso.id} className="hover:bg-slate-50/50">
                                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800 text-[11px]">{curso.codigo}</td>
                                          <td className="py-2.5 px-4 font-medium text-slate-700">{curso.nombre}</td>
                                          <td className="py-2.5 px-4 text-center font-bold text-slate-500">{curso.semestre}°</td>
                                          <td className="py-2.5 px-4 text-center"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-bold text-[10px]">{curso.creditos}</span></td>
                                          <td className="py-2.5 px-4"><span className="text-gray-400 italic text-[11px]">{curso.prerrequisito}</span></td>
                                          <td className="py-2.5 px-4 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                              <button
                                                onClick={() => handleEditarCursoClick(c.id, curso)}
                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                              >
                                                <Edit2 size={12} />
                                              </button>
                                              <button
                                                onClick={() => eliminarCurso(c.id, curso.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-400 text-xs italic py-2">Malla curricular vacía. Utiliza "+ Curso" para comenzar.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">No se encontraron registros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isCarreraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left`}>
            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">{editingCarrera ? 'Modificar Carrera' : 'Apertura de Nueva Carrera'}</h3>
              <button onClick={() => setIsCarreraModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleCarreraSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre de la Carrera</label>
                <input
                  type="text" required value={carreraNombre} onChange={(e) => setCarreraNombre(e.target.value)}
                  placeholder="Ej. Ingeniería en Sistemas" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción (opcional)</label>
                <textarea
                  value={carreraDescripcion} onChange={(e) => setCarreraDescripcion(e.target.value)}
                  placeholder="Breve descripción de la carrera"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700 resize-none"
                  rows={3}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsCarreraModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#1a365d] text-white font-bold text-xs rounded-xl hover:bg-[#152c4d] cursor-pointer shadow-xs">
                  {editingCarrera ? 'Guardar Cambios' : 'Aperturar Carrera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCursoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left`}>
            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">{editingCurso ? 'Editar Propiedades del Curso' : 'Integrar Nuevo Curso al Pensum'}</h3>
              <button onClick={() => setIsCursoModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleCursoSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Código de Curso</label>
                <input
                  type="text" required value={cursoCodigo} onChange={(e) => setCursoCodigo(e.target.value)}
                  placeholder="Ej. 090523" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre de Asignatura</label>
                <input
                  type="text" required value={cursoNombre} onChange={(e) => setCursoNombre(e.target.value)}
                  placeholder="Ej. Desarrollo Web Avanzado" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Créditos Académicos</label>
                  <input type="number" min={1} max={20} required value={cursoCreditos} onChange={(e) => setCursoCreditos(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cupo Máximo</label>
                  <input type="number" min={1} required value={cursoCupo} onChange={(e) => setCursoCupo(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700" />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsCursoModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#1a365d] text-white font-bold text-xs rounded-xl hover:bg-[#152c4d] cursor-pointer shadow-xs">
                  {editingCurso ? 'Aplicar Cambios' : 'Integrar Asignatura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
