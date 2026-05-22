import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Calendar, Clock, MapPin, Plus, Search, Filter, BookOpen, Award, Check } from 'lucide-react';

interface CursoOfertado {
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

export const InscripcionCursos: React.FC = () => {
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  // Filtros de búsqueda para la oferta académica
  const [searchQuery, setSearchQuery] = useState('');
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');

  // Estado que simula la base de datos de cursos ofertados (Asignaciones de la Universidad)
  const [ofertaAcademica, setOfertaAcademica] = useState<CursoOfertado[]>([
    {
      id: 'as-1',
      carreraNombre: 'Ingeniería en Sistemas de Información',
      cursoCodigo: '090001',
      cursoNombre: 'Programación I',
      docenteNombre: 'Ing. Roberto Sánchez',
      seccion: 'A',
      dias: 'Lunes y Miércoles',
      horario: '18:15 - 19:45',
      aula: 'Laboratorio de Cómputo B',
      cupoMaximo: 40,
      cupoInscritos: 28
    },
    {
      id: 'as-2',
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
      id: 'as-3',
      carreraNombre: 'Ingeniería en Sistemas de Información',
      cursoCodigo: '090003',
      cursoNombre: 'Física I',
      docenteNombre: 'Ing. Walter Rodas',
      seccion: 'A',
      dias: 'Viernes',
      horario: '18:15 - 21:15',
      aula: 'Salón 201',
      cupoMaximo: 35,
      cupoInscritos: 12
    },
    {
      id: 'as-4',
      carreraNombre: 'Licenciatura en Ciencias Jurídicas y Sociales',
      cursoCodigo: '020001',
      cursoNombre: 'Derecho Romano',
      docenteNombre: 'Dra. María Antonieta',
      seccion: 'A',
      dias: 'Sábados',
      horario: '07:00 - 09:30',
      aula: 'Salón 102',
      cupoMaximo: 50,
      cupoInscritos: 34
    }
  ]);

  // Estado de los cursos en los que el alumno ya se inscribió en el ciclo actual
  const [misInscripciones, setMisInscripciones] = useState<string[]>(['as-1']);

  // Métricas fijas o dinámicas para los widgets informativos del Estudiante
  const totalCursosInscritos = misInscripciones.length;
  const creditosAdquiridos = totalCursosInscritos * 4;
  const cursosInscritos = ofertaAcademica.filter((curso) => misInscripciones.includes(curso.id));

  // Lógica para inscribirse a un curso
  const handleInscribirse = (curso: CursoOfertado) => {
    if (misInscripciones.includes(curso.id)) {
      alert(`Ya te encuentras inscrito en el curso: ${curso.cursoNombre}.`);
      return;
    }

    if (curso.cupoInscritos >= curso.cupoMaximo) {
      alert(`Lo sentimos, la Sección ${curso.seccion} de ${curso.cursoNombre} no cuenta con cupos disponibles.`);
      return;
    }

    const confirma = window.confirm(`¿Deseas confirmar la asignación del curso "${curso.cursoNombre}" en la Sección ${curso.seccion}?`);
    if (confirma) {
      setMisInscripciones([...misInscripciones, curso.id]);
      setOfertaAcademica(ofertaAcademica.map(item => 
        item.id === curso.id ? { ...item, cupoInscritos: item.cupoInscritos + 1 } : item
      ));
    }
  };

  // Lógica para desasignarse de un curso
  const handleDesasignarse = (id: string, nombre: string) => {
    const confirma = window.confirm(`¿Está seguro que desea desasignarse del curso: ${nombre}? Esta acción liberará tu cupo.`);
    if (confirma) {
      setMisInscripciones(misInscripciones.filter(item => item !== id));
      setOfertaAcademica(ofertaAcademica.map(item => 
        item.id === id ? { ...item, cupoInscritos: item.cupoInscritos - 1 } : item
      ));
    }
  };

  // Filtrado lógico de la tabla de cursos
  const cursosFiltrados = ofertaAcademica.filter(c => {
    const matchesSearch = c.cursoNombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.docenteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.cursoCodigo.includes(searchQuery);
    const matchesSeccion = seccionFilter === 'TODAS' || c.seccion === seccionFilter;
    return matchesSearch && matchesSeccion;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* WIDGETS DE MÉTRICAS DEL ESTUDIANTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos Asignados</p>
            <h4 className="text-xl font-bold text-slate-800">{totalCursosInscritos} Materias</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Créditos del Semestre</p>
            <h4 className="text-xl font-bold text-slate-800">{creditosAdquiridos} UMG Créditos</h4>
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

      {/* FILTROS Y BUSCADOR DE OFERTA EDUCATIVA */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            {/* Buscador general */}
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
          
          <div className="text-right text-slate-500 font-semibold text-xs">
            Oferta Académica Disponible
          </div>
        </div>

        {/* RESUMEN DE CURSOS INSCRITOS */}
        <div className={`p-5 ${styles.panel} ${styles.border} ${styles.shadow} rounded-b-2xl`}>          
          <h3 className="text-sm font-bold mb-4">Mis Cursos Inscritos</h3>
          {cursosInscritos.length > 0 ? (
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

        {/* TABLA DE PROCESAMIENTO DE INSCRIPCIONES */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                <th className="py-3.5 px-6">Código / Asignatura</th>
                <th className="py-3.5 px-6">Facultad / Carrera</th>
                <th className="py-3.5 px-6 text-center">Sec.</th>
                <th className="py-3.5 px-6">Catedrático</th>
                <th className="py-3.5 px-6">Horarios e Instalaciones</th>
                <th className="py-3.5 px-6">Disponibilidad de Cupo</th>
                <th className="py-3.5 px-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((c) => {
                  const porcCupo = (c.cupoInscritos / c.cupoMaximo) * 100;
                  const estaLleno = c.cupoInscritos >= c.cupoMaximo;
                  const yaInscrito = misInscripciones.includes(c.id);

                  return (
                    <tr key={c.id} className={`transition-colors ${styles.tableRowHover}`}>
                      {/* Código y Nombre del Curso */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-blue-600 text-[11px]">{c.cursoCodigo}</div>
                        <div className="font-semibold text-slate-800 mt-0.5">{c.cursoNombre}</div>
                      </td>
                      
                      {/* Carrera */}
                      <td className="py-4 px-6 max-w-45 truncate text-gray-500 font-medium">
                        {c.carreraNombre}
                      </td>

                      {/* Sección */}
                      <td className="py-4 px-6 text-center">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">
                          {c.seccion}
                        </span>
                      </td>

                      {/* Docente */}
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {c.docenteNombre}
                      </td>

                      {/* Horario y Salón */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center text-gray-600 text-[11px]">
                          <Clock size={12} className="mr-1 text-gray-400" />
                          <span>{c.dias} ({c.horario})</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-[11px]">
                          <MapPin size={12} className="mr-1 text-gray-400" />
                          <span>{c.aula}</span>
                        </div>
                      </td>

                      {/* Progreso del Cupo */}
                      <td className="py-4 px-6 w-44">
                        <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                          <span className={estaLleno ? "text-amber-600" : "text-slate-600"}>
                            {c.cupoInscritos} / {c.cupoMaximo} Alumnos
                          </span>
                          {estaLleno ? (
                            <span className="text-amber-600 flex items-center gap-0.5">Sin Cupo</span>
                          ) : (
                            <span className="text-emerald-600 flex items-center gap-0.5">Cupos Libres</span>
                          )}
                        </div>
                        {/* Barra de Progreso */}
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${estaLleno ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(porcCupo, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Acciones de inscripción dinámica */}
                      <td className="py-4 px-6 text-center">
                        {yaInscrito ? (
                          <button 
                            onClick={() => handleDesasignarse(c.id, c.cursoNombre)}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all ${styles.buttonSecondary}`}
                          >
                            <Check size={12} />
                            <span>Desasignar</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleInscribirse(c)}
                            disabled={estaLleno}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                              estaLleno 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                : styles.buttonPrimary
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
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No hay asignaturas disponibles que coincidan con los criterios de búsqueda.
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