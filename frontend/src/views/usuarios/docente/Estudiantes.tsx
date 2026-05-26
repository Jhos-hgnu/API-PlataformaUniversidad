import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Users, Search, Mail, CalendarCheck } from 'lucide-react';
import { docentesService } from '../../../services/docentes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { inscripcionesService, type Inscripcion } from '../../../services/inscripciones.service';

interface EstudianteUI {
  id: number;
  carnet: string;
  nombre: string;
  correo: string;
  curso: string;
  seccion: string;
  estado: string;
}

export const Estudiantes: React.FC = () => {
  const [activeCursoFilter, setActiveCursoFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    docentesService.getAll().then(dRes => {
      const docente = dRes.data.find(d => d.id_usuario === user.id);
      if (!docente) { setLoading(false); return; }
      asignacionesService.getByDocente(docente.id_docente).then(aRes => {
        setAsignaciones(aRes.data);
        const ids = aRes.data.map(a => a.id_asignacion);
        inscripcionesService.getAll().then(iRes => {
          setInscripciones(iRes.data.filter(i => ids.includes(i.id_asignacion)));
        }).catch(() => {}).finally(() => setLoading(false));
      }).catch(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, []);

  const { user } = useAuth();

  const cursosOptions = ['Todos', ...new Set(asignaciones.map(a => a.Cursos?.nombre ?? '').filter(Boolean))];

  const inscripcionesFiltradas = inscripciones.filter(i => {
    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? '';
    const matchCurso = activeCursoFilter === 'Todos' || cursoNombre === activeCursoFilter;

    const est = i.Estudiantes;
    const nombre = est?.Usuarios ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}` : '';
    const correo = est?.Usuarios?.correo ?? '';
    const carnet = est?.carnet ?? '';
    const q = searchQuery.toLowerCase();
    const matchSearch = nombre.toLowerCase().includes(q) || correo.toLowerCase().includes(q) || carnet.includes(q);

    return matchCurso && matchSearch;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Inscripciones en tus Cursos</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : inscripciones.length}</h4>
          </div>
        </div>

        <button
          onClick={() => alert('Redireccionando al panel modular de Asistencia Diaria...')}
          className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} hover:border-emerald-300 dark:hover:border-emerald-800 flex items-center group transition-all cursor-pointer text-left w-full`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 rounded-xl transition-colors">
              <CalendarCheck size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm tracking-tight group-hover:text-emerald-600 transition-colors">Asistencia</p>
              <p className="text-gray-400 text-[11px] font-medium mt-0.5">Tomar la asistencia diaria del curso</p>
            </div>
          </div>
        </button>
      </div>

      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${styles.panelMuted}`}>

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {cursosOptions.map((curso) => (
              <button
                key={curso}
                onClick={() => setActiveCursoFilter(curso)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCursoFilter === curso ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                {curso}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar por carné, nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando estudiantes...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  <th className="py-3.5 px-6 text-center w-40">Carné UMG</th>
                  <th className="py-3.5 px-6 text-center">Estudiante</th>
                  <th className="py-3.5 px-6 text-center">Correo Institucional</th>
                  <th className="py-3.5 px-6 text-center">Curso</th>
                  <th className="py-3.5 px-6 text-center">Sec.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700 text-center">
                {inscripcionesFiltradas.length > 0 ? (
                  inscripcionesFiltradas.map((i) => {
                    const est = i.Estudiantes;
                    const nombre = est?.Usuarios ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}` : '—';
                    const correo = est?.Usuarios?.correo ?? '—';
                    const carnet = est?.carnet ?? '—';
                    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? '—';
                    const seccion = i.Asignaciones?.seccion ?? '—';

                    return (
                      <tr key={i.id_inscripcion} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6 text-center font-mono font-bold text-sm text-blue-600">{carnet}</td>
                        <td className="py-4 px-6 text-center text-gray-500 font-medium">{nombre}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center space-x-1.5 text-gray-500 font-medium">
                            <Mail size={12} className="text-gray-400" />
                            <span>{correo}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-gray-500">{cursoNombre}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">{seccion}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                      No se encontraron alumnos inscritos bajo este criterio.
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
