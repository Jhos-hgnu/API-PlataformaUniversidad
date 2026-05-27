import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Calendar, Plus, Search, Filter, BookOpen, Award, Check, X } from 'lucide-react';
import { estudiantesService } from '../../../services/estudiantes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { inscripcionesService, type Inscripcion } from '../../../services/inscripciones.service';

interface CursoOfertado {
  id: number;
  carreraNombre: string;
  cursoCodigo: string;
  cursoNombre: string;
  docenteNombre: string;
  seccion: string;
  cupoMaximo: number;
  cupoDisponible: number;
}

const mapToUI = (a: Asignacion): CursoOfertado => ({
  id: a.id_asignacion,
  carreraNombre: a.Cursos?.Carreras?.nombre ?? '—',
  cursoCodigo: a.Cursos?.codigo ?? '—',
  cursoNombre: a.Cursos?.nombre ?? '—',
  docenteNombre: a.Docentes?.Usuarios ? `${a.Docentes.Usuarios.nombre} ${a.Docentes.Usuarios.apellido}` : '—',
  seccion: a.seccion,
  cupoMaximo: a.Cursos?.cupo_maximo ?? 0,
  cupoDisponible: a.cupo_disponible,
});

export const InscripcionCursos: React.FC = () => {
  const { theme, user } = useAuth();
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');

  const [ofertaAcademica, setOfertaAcademica] = useState<CursoOfertado[]>([]);
  const [misInscripciones, setMisInscripciones] = useState<Inscripcion[]>([]);
  const [estudianteId, setEstudianteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(false);

  const cargarDatos = useCallback(() => {
    if (!user) return;
    setLoading(true);
    estudiantesService.getMe()
      .then(estRes => {
        const eId = estRes.data.id_estudiante;
        setEstudianteId(eId);
        return Promise.all([
          asignacionesService.getAll(),
          inscripcionesService.getAll(),
          Promise.resolve(eId),
        ]);
      })
      .then(([aRes, iRes, eId]) => {
        setOfertaAcademica(aRes.data.map(mapToUI));
        setMisInscripciones(iRes.data.filter(i => i.id_estudiante === eId));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const misIds = new Set(misInscripciones.map(i => i.id_asignacion));
  const totalCursosInscritos = misIds.size;
  const creditosAdquiridos = totalCursosInscritos * 4;
  const cursosInscritos = ofertaAcademica.filter(c => misIds.has(c.id));

  const handleInscribirse = async (curso: CursoOfertado) => {
    if (misIds.has(curso.id)) {
      alert(`Ya te encuentras inscrito en el curso: ${curso.cursoNombre}.`);
      return;
    }
    if (curso.cupoDisponible <= 0) {
      alert(`Lo sentimos, la Sección ${curso.seccion} de ${curso.cursoNombre} no cuenta con cupos disponibles.`);
      return;
    }
    if (!window.confirm(`¿Deseas confirmar la asignación del curso "${curso.cursoNombre}" en la Sección ${curso.seccion}?`)) return;

    setInscribiendo(true);
    try {
      const created = await inscripcionesService.create({
        id_estudiante: estudianteId!,
        id_asignacion: curso.id,
      });
      setMisInscripciones(prev => [...prev, created.data]);
      setOfertaAcademica(prev => prev.map(c =>
        c.id === curso.id ? { ...c, cupoDisponible: c.cupoDisponible - 1 } : c
      ));
    } catch {
      alert('Error al inscribirse. Intenta de nuevo.');
    }
    setInscribiendo(false);
  };

  const handleDesasignarse = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro que desea desasignarse del curso: ${nombre}? Esta acción liberará tu cupo.`)) return;

    const inscripcion = misInscripciones.find(i => i.id_asignacion === id);
    if (!inscripcion) return;

    setInscribiendo(true);
    try {
      await inscripcionesService.remove(inscripcion.id_inscripcion);
      setMisInscripciones(prev => prev.filter(i => i.id_inscripcion !== inscripcion.id_inscripcion));
      setOfertaAcademica(prev => prev.map(c =>
        c.id === id ? { ...c, cupoDisponible: c.cupoDisponible + 1 } : c
      ));
    } catch {
      alert('Error al desasignarse. Intenta de nuevo.');
    }
    setInscribiendo(false);
  };

  const cursosFiltrados = ofertaAcademica.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = c.cursoNombre.toLowerCase().includes(q) ||
      c.docenteNombre.toLowerCase().includes(q) ||
      c.cursoCodigo.includes(q);
    const matchSeccion = seccionFilter === 'TODAS' || c.seccion === seccionFilter;
    return matchSearch && matchSeccion;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos Asignados</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : totalCursosInscritos} Materias</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Créditos del Semestre</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : creditosAdquiridos} UMG Créditos</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Calendar size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Ciclo Académico</p>
            <h4 className="text-xl font-bold text-slate-800">Primer Semestre 2026</h4>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Buscar materias por nombre, código o catedrático..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
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

          <div className="text-right text-slate-500 font-semibold text-xs">
            Oferta Académica Disponible
          </div>
        </div>

        <div className={`p-5 ${styles.panel} ${styles.border} ${styles.shadow} rounded-b-2xl`}>
          <h3 className="text-sm font-bold mb-4">Mis Cursos Inscritos</h3>
          {loading ? (
            <p className="text-xs text-gray-400">Cargando inscripciones...</p>
          ) : cursosInscritos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {cursosInscritos.map((curso) => (
                <div key={curso.id} className={`rounded-2xl p-4 border ${styles.border} ${styles.panel} ${styles.shadow}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">{curso.cursoCodigo}</p>
                      <h4 className="font-bold text-sm text-slate-900">{curso.cursoNombre}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{curso.docenteNombre} · Sección {curso.seccion}</p>
                    </div>
                    <span className="rounded-full px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600">Inscrito</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Aún no te has inscrito en ninguna materia. Usa la tabla para agregar nuevas asignaturas.</p>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando oferta académica...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                  <th className="py-3.5 px-6">Código / Asignatura</th>
                  <th className="py-3.5 px-6">Facultad / Carrera</th>
                  <th className="py-3.5 px-6 text-center">Sec.</th>
                  <th className="py-3.5 px-6">Catedrático</th>
                  <th className="py-3.5 px-6">Disponibilidad de Cupo</th>
                  <th className="py-3.5 px-6 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {cursosFiltrados.length > 0 ? (
                  cursosFiltrados.map((c) => {
                    const inscritos = c.cupoMaximo - c.cupoDisponible;
                    const porc = c.cupoMaximo > 0 ? (inscritos / c.cupoMaximo) * 100 : 0;
                    const lleno = c.cupoDisponible <= 0;
                    const yaInscrito = misIds.has(c.id);

                    return (
                      <tr key={c.id} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6">
                          <div className="font-mono font-bold text-blue-600 text-[11px]">{c.cursoCodigo}</div>
                          <div className="font-semibold text-slate-800 mt-0.5">{c.cursoNombre}</div>
                        </td>

                        <td className="py-4 px-6 max-w-45 truncate text-gray-500 font-medium">{c.carreraNombre}</td>

                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">{c.seccion}</span>
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-700">{c.docenteNombre}</td>

                        <td className="py-4 px-6 w-44">
                          <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                            <span className={lleno ? "text-amber-600" : "text-slate-600"}>
                              {inscritos} / {c.cupoMaximo} Alumnos
                            </span>
                            {lleno ? (
                              <span className="text-amber-600 flex items-center gap-0.5">Sin Cupo</span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-0.5">{c.cupoDisponible} Disp.</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${lleno ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(porc, 100)}%` }} />
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          {yaInscrito ? (
                            <button
                              onClick={() => handleDesasignarse(c.id, c.cursoNombre)}
                              disabled={inscribiendo}
                              className={`inline-flex items-center space-x-1 px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${styles.buttonSecondary}`}
                            >
                              <X size={12} />
                              <span>Desasignar</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleInscribirse(c)}
                              disabled={lleno || inscribiendo}
                              className={`inline-flex items-center space-x-1 px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
                                lleno ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : styles.buttonPrimary
                              }`}
                            >
                              <Plus size={12} />
                              <span>Inscribirse</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      No hay asignaturas disponibles que coincidan con los criterios de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
