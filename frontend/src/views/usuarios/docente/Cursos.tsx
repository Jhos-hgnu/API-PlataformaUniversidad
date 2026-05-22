import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, AlertTriangle, Eye, BookOpen } from 'lucide-react';

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

export const Cursos: React.FC = () => {
  const { user, theme } = useAuth();
  const styles = getThemeStyles(theme);
  
  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');

  // El nombre del docente se extrae dinámicamente de la sesión actual
  const nombreDocenteLogueado = user?.nombre || 'Ing. Richard Ortíz';

  // Base de datos simulada con la oferta global de cursos de la universidad
  const [todosLosCursos] = useState<CursoDocente[]>([
    {
      id: 'c-1',
      carreraNombre: 'Ingeniería en Sistemas de Información',
      cursoCodigo: '090001',
      cursoNombre: 'Programación I',
      docenteNombre: 'Ing. Richard Ortíz', 
      seccion: 'A',
      dias: 'Lunes y Miércoles',
      horario: '18:15 - 19:45',
      aula: 'Laboratorio de Cómputo B',
      cupoMaximo: 40,
      cupoInscritos: 28
    },
    {
      id: 'c-2',
      carreraNombre: 'Ingeniería en Sistemas de Información',
      cursoCodigo: '090005',
      cursoNombre: 'Estructuras de Datos',
      docenteNombre: 'Ing. Richard Ortíz',
      seccion: 'B',
      dias: 'Lunes y Miércoles',
      horario: '19:45 - 21:15',
      aula: 'Laboratorio de Cómputo B',
      cupoMaximo: 35,
      cupoInscritos: 35 
    },
    {
      id: 'c-3',
      carreraNombre: 'Ingeniería en Sistemas de Información',
      cursoCodigo: '090002',
      cursoNombre: 'Cálculo I',
      docenteNombre: 'Lic. Estuardo Alvarado', 
      seccion: 'B',
      dias: 'Martes y Jueves',
      horario: '19:45 - 21:15',
      aula: 'Salón 405',
      cupoMaximo: 45,
      cupoInscritos: 45 
    },
    {
      id: 'c-4',
      carreraNombre: 'Licenciatura en Ciencias Jurídicas y Sociales',
      cursoCodigo: '020001',
      cursoNombre: 'Derecho Romano',
      docenteNombre: 'Dra. María Antonieta', 
      seccion: 'A',
      dias: 'Sábados',
      horario: '07:00 - 09:30',
      aula: 'Salón 102',
      cupoMaximo: 50,
      cupoInscritos: 12
    }
  ]);

  // FILTRO CRÍTICO: Filtrar estrictamente para que el docente solo vea los cursos que imparte él mismo
  const misCursosAsignados = todosLosCursos.filter(
    c => c.docenteNombre.toLowerCase() === nombreDocenteLogueado.toLowerCase()
  );

  // Filtrado secundario por buscador y selector de sección
  const cursosFiltrados = misCursosAsignados.filter(c => {
    const matchesSearch = c.cursoNombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.cursoCodigo.includes(searchQuery);
    const matchesSeccion = seccionFilter === 'TODAS' || c.seccion === seccionFilter;
    return matchesSearch && matchesSeccion;
  });

  // Métricas calculadas basadas exclusivamente en los cursos del Docente
  const totalCursosActivos = misCursosAsignados.length;
  const cursosLlenos = misCursosAsignados.filter(c => c.cupoInscritos >= c.cupoMaximo).length;
  const totalEstudiantesACargo = misCursosAsignados.reduce((acc, current) => acc + current.cupoInscritos, 0);

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* SECCIÓN DE ENCABEZADO */}
      <div className="flex flex-col space-y-1 text-left">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Mis Cursos Asignados</h2>
        <p className="text-gray-400 text-xs font-medium">
          Consulta los horarios, salones asignados y el control de estudiantes inscritos para este ciclo lectivo.
        </p>
      </div>

      {/* WIDGETS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos Activos</p>
            <h4 className="text-xl font-bold text-slate-800">{totalCursosActivos} Materias</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Sin Cupo</p>
            <h4 className="text-xl font-bold text-slate-800">{cursosLlenos} Al Máximo</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Total de Alumnos</p>
            <h4 className="text-xl font-bold text-slate-800">{totalEstudiantesACargo} Inscritos</h4>
          </div>
        </div>
      </div>

      {/* FILTROS PRINCIPALES */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            {/* Buscador de cursos */}
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

            {/* Filtro por Sección */}
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

        {/* TABLA DE CURSOS ASIGNADOS AL DOCENTE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                <th className="py-3.5 px-6">Código / Curso</th>
                <th className="py-3.5 px-6">Carrera Universitaria</th>
                <th className="py-3.5 px-6 text-center">Sec.</th>
                <th className="py-3.5 px-6">Días y Horarios</th>
                <th className="py-3.5 px-6">Aula / Salón</th>
                <th className="py-3.5 px-6">Estudiantes Registrados</th>
                <th className="py-3.5 px-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((curso) => {
                  const porcCupo = (curso.cupoInscritos / curso.cupoMaximo) * 100;
                  const estaLleno = curso.cupoInscritos >= curso.cupoMaximo;

                  return (
                    <tr key={curso.id} className={`transition-colors ${styles.tableRowHover}`}>
                      {/* Código y Nombre de Curso */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-blue-600 text-[11px]">{curso.cursoCodigo}</div>
                        <div className="font-semibold text-slate-800 mt-0.5">{curso.cursoNombre}</div>
                      </td>
                      
                      {/* Carrera */}
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {curso.carreraNombre}
                      </td>

                      {/* Sección */}
                      <td className="py-4 px-6 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-100">
                          {curso.seccion}
                        </span>
                      </td>

                      {/* Horario */}
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700 font-medium">
                          <Calendar size={12} className="mr-1.5 text-gray-400 shrink-0" />
                          <span>{curso.dias}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-[11px] mt-0.5">
                          <Clock size={12} className="mr-1.5 text-gray-400 shrink-0" />
                          <span>{curso.horario}</span>
                        </div>
                      </td>

                      {/* Salón */}
                      <td className="py-4 px-6">
                        <div className="flex items-center text-slate-700 font-semibold">
                          <MapPin size={13} className="mr-1 text-gray-400 shrink-0" />
                          <span>{curso.aula}</span>
                        </div>
                      </td>

                      {/* Ocupación y Progreso del Aula */}
                      <td className="py-4 px-6 w-48">
                        <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                          <span className={estaLleno ? "text-amber-600" : "text-slate-600"}>
                            {curso.cupoInscritos} / {curso.cupoMaximo} Alumnos
                          </span>
                          {estaLleno ? (
                            <span className="text-amber-600 flex items-center gap-0.5"><AlertTriangle size={10} />Lleno</span>
                          ) : (
                            <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} />Disponible</span>
                          )}
                        </div>
                        {/* Barra de Progreso */}
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${estaLleno ? 'bg-amber-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min(porcCupo, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Acción Informativa para el Docente */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => alert(`Cargando listado oficial de estudiantes para el curso de ${curso.cursoNombre} (Sección ${curso.seccion})...`)}
                            className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer text-[11px] font-bold"
                            title="Ver listado de alumnos asignados"
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
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No tienes cursos asignados que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};