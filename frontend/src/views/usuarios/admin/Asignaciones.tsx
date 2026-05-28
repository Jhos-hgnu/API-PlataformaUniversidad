import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Calendar, Users, Plus, Search, Trash2, X, Filter, CheckCircle, AlertTriangle, Edit2 } from 'lucide-react';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { cursosService, type Curso } from '../../../services/cursos.service';
import { docentesService, type Docente } from '../../../services/docentes.service';
import { periodosService, type Periodo } from '../../../services/periodos.service';

interface AsignacionUI {
  id: number;
  carreraNombre: string;
  cursoCodigo: string;
  cursoNombre: string;
  docenteNombre: string;
  seccion: string;
  cupoDisponible: number;
  cupoMaximo: number;
}

const mapToUI = (a: Asignacion): AsignacionUI => ({
  id: a.id_asignacion,
  carreraNombre: a.Cursos?.Carreras?.nombre ?? '—',
  cursoCodigo: a.Cursos?.codigo ?? '—',
  cursoNombre: a.Cursos?.nombre ?? '—',
  docenteNombre: a.Docentes?.Usuarios ? `${a.Docentes.Usuarios.nombre} ${a.Docentes.Usuarios.apellido}` : '—',
  seccion: a.seccion,
  cupoDisponible: a.cupo_disponible,
  cupoMaximo: a.Cursos?.cupo_maximo ?? 0,
});

export const Asignaciones: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  const isDark = theme === 'oscuro';
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [loading, setLoading] = useState(true);

  const [idCurso, setIdCurso] = useState<number>(0);
  const [idDocente, setIdDocente] = useState<number>(0);
  const [idPeriodo, setIdPeriodo] = useState<number>(0);
  const [seccion, setSeccion] = useState('A');
  const [cupoDisponible, setCupoDisponible] = useState(30);
  const [cursoCupoMax, setCursoCupoMax] = useState(40);

  const cargarTodo = useCallback(() => {
    setLoading(true);
    Promise.all([
      asignacionesService.getAll(),
      cursosService.getAll(),
      docentesService.getAll(),
      periodosService.getAll(),
    ])
      .then(([aRes, cRes, dRes, pRes]) => {
        setAsignaciones(aRes.data.map(mapToUI));
        setCursos(cRes.data);
        setDocentes(dRes.data);
        setPeriodos(pRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { cargarTodo(); }, [cargarTodo]);

  const handleNueva = () => {
    setEditingId(null);
    setIdCurso(0);
    setIdDocente(0);
    setIdPeriodo(0);
    setSeccion('A');
    setCupoDisponible(30);
    setCursoCupoMax(40);
    setIsModalOpen(true);
  };

  const handleEditar = (a: AsignacionUI) => {
    setEditingId(a.id);
    const curso = cursos.find(c => c.nombre === a.cursoNombre);
    const docente = docentes.find(d => {
      const full = d.Usuarios ? `${d.Usuarios.nombre} ${d.Usuarios.apellido}` : '';
      return full === a.docenteNombre;
    });
    setIdCurso(curso?.id_curso ?? 0);
    setCursoCupoMax(curso?.cupo_maximo ?? 0);
    setIdDocente(docente?.id_docente ?? 0);
    const periodo = periodos[0];
    setIdPeriodo(periodo?.id_periodo ?? 0);
    setSeccion(a.seccion);
    setCupoDisponible(a.cupoDisponible);
    setIsModalOpen(true);
  };

  const handleCursoChange = (id: number) => {
    setIdCurso(id);
    const curso = cursos.find(c => c.id_curso === id);
    setCursoCupoMax(curso?.cupo_maximo ?? 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCurso || !idDocente || !idPeriodo) return;
    try {
      if (editingId) {
        await asignacionesService.update(editingId, {
          id_curso: idCurso,
          id_docente: idDocente,
          id_periodo: idPeriodo,
          seccion,
          cupo_disponible: cupoDisponible,
        });
      } else {
        await asignacionesService.create({
          id_curso: idCurso,
          id_docente: idDocente,
          id_periodo: idPeriodo,
          seccion,
          cupo_disponible: cupoDisponible,
        });
      }
      cargarTodo();
      setIsModalOpen(false);
    } catch {}
  };

  const handleEliminar = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación? Se perderán los horarios del curso asignados a este docente.')) {
      asignacionesService.remove(id).then(() => cargarTodo()).catch(() => {});
    }
  };

  const filtradas = asignaciones.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = a.cursoNombre.toLowerCase().includes(q) ||
      a.docenteNombre.toLowerCase().includes(q) ||
      a.cursoCodigo.includes(q);
    const matchSeccion = seccionFilter === 'TODAS' || a.seccion === seccionFilter;
    return matchSearch && matchSeccion;
  });

  const seccionesLlenas = asignaciones.filter(a => a.cupoDisponible <= 0).length;
  const totalDocentes = new Set(asignaciones.map(a => a.docenteNombre)).size;

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Activas</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : asignaciones.length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Llenas</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : seccionesLlenas}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Carga de Docentes</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : totalDocentes} Profesores</h4>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>

          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
<<<<<<< Updated upstream
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
=======
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
>>>>>>> Stashed changes
                type="text"
                placeholder="Buscar por curso, código o docente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`}
              />
            </div>

            <div className="relative">
              <select
                value={seccionFilter}
                onChange={(e) => setSeccionFilter(e.target.value)}
                className={`pl-3 pr-8 py-2 rounded-xl text-xs outline-none cursor-pointer font-medium transition-all ${styles.input} ${styles.border}`}
              >
                <option value="TODAS">Todas las Secciones</option>
                <option value="A">Sección A</option>
                <option value="B">Sección B</option>
                <option value="C">Sección C</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
          </div>

          <button
            onClick={handleNueva}
            className={`flex items-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
          >
            <Plus size={14} />
            <span>Nueva Asignación</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando asignaciones...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                  <th className="py-3.5 px-6">Código / Curso</th>
                  <th className="py-3.5 px-6">Carrera</th>
                  <th className="py-3.5 px-6 text-center">Sec.</th>
                  <th className="py-3.5 px-6">Catedrático Asignado</th>
                  <th className="py-3.5 px-6">Cupo / Progreso</th>
                  <th className="py-3.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {filtradas.length > 0 ? (
                  filtradas.map((a) => {
                    const inscritos = a.cupoMaximo - a.cupoDisponible;
                    const porc = a.cupoMaximo > 0 ? (inscritos / a.cupoMaximo) * 100 : 0;
                    const lleno = a.cupoDisponible <= 0;

                    return (
                      <tr key={a.id} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6">
                          <div className="font-mono font-bold text-blue-600 text-[11px]">{a.cursoCodigo}</div>
                          <div className="font-semibold text-slate-800 mt-0.5">{a.cursoNombre}</div>
                        </td>
                        <td className="py-4 px-6 max-w-45 truncate text-gray-500 font-medium">{a.carreraNombre}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">{a.seccion}</span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {a.docenteNombre !== '—' ? a.docenteNombre : <span className="text-red-400 italic">Por asignar</span>}
                        </td>
                        <td className="py-4 px-6 w-44">
                          <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                            <span className={lleno ? 'text-amber-600' : 'text-slate-600'}>
                              {inscritos} / {a.cupoMaximo} Alumnos
                            </span>
                            {lleno ? (
                              <span className="text-amber-600 flex items-center gap-0.5"><AlertTriangle size={10} />Lleno</span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} />{a.cupoDisponible} Disp.</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${lleno ? 'bg-amber-500' : 'bg-blue-600'}`}
                              style={{ width: `${Math.min(porc, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-1">
                            <button onClick={() => handleEditar(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => handleEliminar(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      No se encontraron asignaciones activas para esta búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-lg p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left`}>

            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">
                {editingId ? 'Modificar Asignación' : 'Crear Nueva Asignación'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Curso</label>
                <select required value={idCurso} onChange={(e) => handleCursoChange(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400">
                  <option value={0}>— Seleccionar —</option>
                  {cursos.map(c => (
                    <option key={c.id_curso} value={c.id_curso}>
                      [{c.codigo}] {c.nombre} ({c.Carreras?.nombre ?? ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Docente</label>
                <select required value={idDocente} onChange={(e) => setIdDocente(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400">
                  <option value={0}>— Seleccionar —</option>
                  {docentes.map(d => (
                    <option key={d.id_docente} value={d.id_docente}>
                      {d.Usuarios?.nombre} {d.Usuarios?.apellido} {d.especialidad ? `(${d.especialidad})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Período Académico</label>
                <select required value={idPeriodo} onChange={(e) => setIdPeriodo(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400">
                  <option value={0}>— Seleccionar —</option>
                  {periodos.map(p => (
                    <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sección</label>
                  <select value={seccion} onChange={(e) => setSeccion(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400 font-bold">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cupo Disponible</label>
                  <input type="number" min={0} max={cursoCupoMax} required value={cupoDisponible} onChange={(e) => setCupoDisponible(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400 font-bold" />
                  <p className="text-[10px] text-gray-400 mt-0.5">Máx: {cursoCupoMax}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all active:scale-95 shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}>
                  {editingId ? 'Aplicar Cambios' : 'Crear Asignación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
