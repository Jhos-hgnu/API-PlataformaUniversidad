<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
// IMPORTS
import React, { useState } from 'react';
>>>>>>> Stashed changes
import { useAuth } from '../../../context/useAuth';
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, AlertTriangle, Eye, BookOpen } from 'lucide-react';
<<<<<<< Updated upstream
import { docentesService } from '../../../services/docentes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
=======

// TIPOS E INTERFACES
interface CursoDocente {
  id: string; 
  carreraNombre: string; 
  cursoCodigo: string; 
  cursoNombre: string;
  docenteNombre: string; 
  seccion: 'A' | 'B' | 'C'; 
  dias: string; 
  horario: string;
  aula: string; 
  cupoMaximo: number; 
  cupoInscritos: number;
}
>>>>>>> Stashed changes

// DICCIONARIO DE ESTILOS CENTRALIZADOS
const CONFIG_ESTILOS: Record<string, Record<string, string>> = {
  oscuro: {
    title: 'text-slate-200', desc: 'text-slate-400', card: 'bg-slate-800 border-slate-700 text-slate-100',
    textLabel: 'text-slate-400', btn: 'bg-blue-600 hover:bg-blue-700 text-white', headerBg: 'bg-slate-800 text-slate-200'
  },
  coquette: {
    title: 'text-[#6d4c51] font-bold', desc: 'text-[#b3888d]', card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
    textLabel: 'text-[#b3888d]', btn: 'bg-[#f472b6] hover:bg-[#ec4899] text-white shadow-xs', headerBg: 'bg-[#fff5f6] text-[#f472b6]'
  },
  claro: {
    title: 'text-gray-700 font-bold', desc: 'text-gray-400', card: 'bg-white border-gray-100 text-slate-800',
    textLabel: 'text-gray-400', btn: 'bg-[#1a365d] hover:bg-[#152c4d] text-white', headerBg: 'bg-slate-100 text-slate-700'
  }
};

// COMPONENTE PRINCIPAL
export const Cursos: React.FC = () => {
  const { user, theme } = useAuth();
<<<<<<< Updated upstream
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  const nombreDocenteLogueado = user?.nombre || 'Docente';

  useEffect(() => {
    if (!user) return;
    docentesService.getAll().then(dRes => {
      const docente = dRes.data.find(d => d.id_usuario === user.id);
      if (docente) {
        asignacionesService.getByDocente(docente.id_docente).then(aRes => {
          setAsignaciones(aRes.data);
        }).catch(() => {}).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, [user]);

  const filtradas = asignaciones.filter(a => {
    const nombreCurso = a.Cursos?.nombre ?? '';
    const codigo = a.Cursos?.codigo ?? '';
    const q = searchQuery.toLowerCase();
    const matchSearch = nombreCurso.toLowerCase().includes(q) || codigo.includes(q);
    const matchSeccion = seccionFilter === 'TODAS' || a.seccion === seccionFilter;
    return matchSearch && matchSeccion;
  });

  const cursosLlenos = asignaciones.filter(a => a.cupo_disponible <= 0).length;
  const totalInscritos = asignaciones.reduce((acc, a) => acc + ((a.Cursos?.cupo_maximo ?? 0) - a.cupo_disponible), 0);
=======
  const [searchQuery, setSearchQuery] = useState('');
  const [seccionFilter, setSeccionFilter] = useState('TODAS');
  
  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';
  const c = CONFIG_ESTILOS[CONFIG_ESTILOS[theme] ? theme : 'claro'];
  const titleColor = isDark ? '#f8fafc' : isCoquette ? '#6d4c51' : '#0f172a';
  const nombreDocenteLogueado = user?.nombre || 'Ing. Richard Ortíz';

  // BASE DE DATOS SIMULADA
  const [todosLosCursos] = useState<CursoDocente[]>([
    { id: 'c-1', carreraNombre: 'Ingeniería en Sistemas de Información', cursoCodigo: '090001', cursoNombre: 'Programación I', docenteNombre: 'Ing. Richard Ortíz', seccion: 'A', dias: 'Lunes y Miércoles', horario: '18:15 - 19:45', aula: 'Laboratorio de Cómputo B', cupoMaximo: 40, cupoInscritos: 28 },
    { id: 'c-2', carreraNombre: 'Ingeniería en Sistemas de Información', cursoCodigo: '090005', cursoNombre: 'Estructuras de Datos', docenteNombre: 'Ing. Richard Ortíz', seccion: 'B', dias: 'Lunes y Miércoles', horario: '19:45 - 21:15', aula: 'Laboratorio de Cómputo B', cupoMaximo: 35, cupoInscritos: 35 },
    { id: 'c-3', carreraNombre: 'Ingeniería en Sistemas de Información', cursoCodigo: '090002', cursoNombre: 'Cálculo I', docenteNombre: 'Lic. Estuardo Alvarado', seccion: 'B', dias: 'Martes y Jueves', horario: '19:45 - 21:15', aula: 'Salón 405', cupoMaximo: 45, cupoInscritos: 45 },
    { id: 'c-4', carreraNombre: 'Licenciatura en Ciencias Jurídicas y Sociales', cursoCodigo: '020001', cursoNombre: 'Derecho Romano', docenteNombre: 'Dra. María Antonieta', seccion: 'A', dias: 'Sábados', horario: '07:00 - 09:30', aula: 'Salón 102', cupoMaximo: 50, cupoInscritos: 12 }
  ]);

  // FILTRADO DE LOGICA Y NEGOCIO
  const misCursosAsignados = todosLosCursos.filter(c => {
    if (nombreDocenteLogueado === 'Ing. Richard Ortíz') {
      return c.docenteNombre.toLowerCase() === nombreDocenteLogueado.toLowerCase();
    }
    if (c.docenteNombre === 'Ing. Richard Ortíz') {
      c.docenteNombre = nombreDocenteLogueado;
    }
    return true;
  });

  const cursosFiltrados = misCursosAsignados.filter(c => {
    const matchesSearch = c.cursoNombre.toLowerCase().includes(searchQuery.toLowerCase()) || c.cursoCodigo.includes(searchQuery);
    return matchesSearch && (seccionFilter === 'TODAS' || c.seccion === seccionFilter);
  });
>>>>>>> Stashed changes

  const totalAlumnosMatriculados = misCursosAsignados.reduce((acc, curr) => acc + curr.cupoInscritos, 0);

  // ESTRUCTURA JSX
  return (
<<<<<<< Updated upstream
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      <div className="flex flex-col space-y-1 text-left">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Mis Cursos Asignados</h2>
        <p className="text-gray-400 text-xs font-medium">
          Consulta los horarios, salones asignados y el control de estudiantes inscritos para este ciclo lectivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos Activos</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : asignaciones.length} Materias</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Sin Cupo</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : cursosLlenos} Al Máximo</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Total de Alumnos</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : totalInscritos} Inscritos</h4>
=======
    <div className="space-y-6 w-full animate-fade-in text-left">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className={`p-3 rounded-xl transition-all duration-300 ${c.headerBg}`}>
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>
              Mis Cursos Asignados
            </h2>
            <p className={`text-xs transition-colors ${c.desc}`}>
              Consulta los horarios, salones asignados y el control de estudiantes inscritos para este ciclo lectivo.
            </p>
>>>>>>> Stashed changes
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Buscar por nombre o código de curso..."
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

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-gray-200/50">
            Ciclo Académico Vigente
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando cursos...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                  <th className="py-3.5 px-6">Código / Curso</th>
                  <th className="py-3.5 px-6">Carrera Universitaria</th>
                  <th className="py-3.5 px-6 text-center">Sec.</th>
                  <th className="py-3.5 px-6">Estudiantes Registrados</th>
                  <th className="py-3.5 px-6 text-center">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {filtradas.length > 0 ? (
                  filtradas.map((a) => {
                    const cupoMax = a.Cursos?.cupo_maximo ?? 0;
                    const inscritos = cupoMax - a.cupo_disponible;
                    const porc = cupoMax > 0 ? (inscritos / cupoMax) * 100 : 0;
                    const lleno = a.cupo_disponible <= 0;

                    return (
                      <tr key={a.id_asignacion} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6">
                          <div className="font-mono font-bold text-blue-600 text-[11px]">{a.Cursos?.codigo ?? '—'}</div>
                          <div className="font-semibold text-slate-800 mt-0.5">{a.Cursos?.nombre ?? '—'}</div>
                        </td>

                        <td className="py-4 px-6 text-gray-500 font-medium">{a.Cursos?.Carreras?.nombre ?? '—'}</td>

                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-100">{a.seccion}</span>
                        </td>

                        <td className="py-4 px-6 w-48">
                          <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                            <span className={lleno ? "text-amber-600" : "text-slate-600"}>
                              {inscritos} / {cupoMax} Alumnos
                            </span>
                            {lleno ? (
                              <span className="text-amber-600 flex items-center gap-0.5"><AlertTriangle size={10} />Lleno</span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} />Disponible</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${lleno ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(porc, 100)}%` }} />
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => alert(`Redirigiendo al listado de estudiantes para ${a.Cursos?.nombre} (Sección ${a.seccion})...`)}
                              className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer text-[11px] font-bold"
                            >
                              <Eye size={12} />
                              <span>Ver Listado</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                      No tienes cursos asignados que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
=======
      {/* METRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-100 shadow-xs'} flex items-center space-x-4`}>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Asignaturas Asignadas</span>
            <p className="text-xl font-black mt-0.5">{misCursosAsignados.length} Módulos Activos</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-100 shadow-xs'} flex items-center space-x-4`}>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Estudiantes de Alta</span>
            <p className="text-xl font-black mt-0.5">{totalAlumnosMatriculados} Alumnos Totales</p>
          </div>
        </div>
      </div>

      {/* ACCIONES Y FILTROS */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o código de curso..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`} 
          />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select 
            value={seccionFilter} 
            onChange={(e) => setSeccionFilter(e.target.value)} 
            className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? 'bg-slate-900 border-transparent text-slate-200' : 'bg-gray-50 border-transparent'}`}
          >
            <option value="TODAS">Todas las Secciones</option>
            <option value="A">Sección A</option>
            <option value="B">Sección B</option>
            <option value="C">Sección C</option>
          </select>
        </div>
      </div>

      {/* VISTA DE TABLA */}
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'bg-gray-50/70 text-[#b3888d]'}`}>
                <th className="py-3.5 px-6">Código / Curso</th>
                <th className="py-3.5 px-6 text-center">Sección</th>
                <th className="py-3.5 px-6 text-center">Días y Horarios</th>
                <th className="py-3.5 px-6 text-center">Aula / Salón</th>
                <th className="py-3.5 px-6 text-center">Estudiantes Registrados</th>
                <th className="py-3.5 px-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((curso) => {
                  const estaLleno = curso.cupoInscritos >= curso.cupoMaximo;
                  return (
                    <tr key={curso.id} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-4 px-6">
                        <span className="font-mono text-blue-500 font-bold block text-[11px]">{curso.cursoCodigo}</span>
                        <span className="font-bold text-sm text-gray-500 dark:text-gray-400">{curso.cursoNombre}</span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-gray-500 dark:text-gray-400">
                        {curso.seccion}
                      </td>
                      <td className="py-4 px-6 text-center font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium"><Calendar size={12} className="mr-1.5 text-gray-400 shrink-0" /><span>{curso.dias}</span></div>
                        <div className="flex items-center justify-center text-gray-500 text-[11px] mt-0.5"><Clock size={12} className="mr-1.5 text-gray-400 shrink-0" /><span>{curso.horario}</span></div>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-gray-500 dark:text-gray-400">
                        <div className="flex items-center justify-center text-slate-700 dark:text-slate-300"><MapPin size={13} className="mr-1 text-gray-400 shrink-0" /><span>{curso.aula}</span></div>
                      </td>
                      <td className="py-4 px-6 w-48 text-center">
                        <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                          <span className={estaLleno ? "text-amber-600" : "text-slate-600 dark:text-slate-400"}>{curso.cupoInscritos} / {curso.cupoMaximo} Alumnos</span>
                          <span className={`${estaLleno ? 'text-amber-600' : 'text-emerald-600'} flex items-center gap-0.5`}>
                            {estaLleno ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}{estaLleno ? 'Lleno' : 'Disponible'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${estaLleno ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((curso.cupoInscritos / curso.cupoMaximo) * 100, 100)}%` }} />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          type="button"
                          onClick={() => alert(`Cargando listado oficial de estudiantes para el curso de ${curso.cursoNombre} (Sección ${curso.seccion})...`)}
                          className={`inline-flex items-center justify-center space-x-1.5 h-8 w-32 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isDark 
                              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700' 
                              : isCoquette
                              ? 'bg-[#fff5f6] hover:bg-[#ffe4e6] text-[#6d4c51] border-[#fbcdd4]'
                              : 'bg-gray-100/90 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <Eye size={13} />
                          <span>Ver Listado</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 font-medium">No tienes cursos asignados que coincidan con los filtros seleccionados.</td></tr>
              )}
            </tbody>
          </table>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};
