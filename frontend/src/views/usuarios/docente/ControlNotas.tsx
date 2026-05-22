import React, { useState } from 'react';
import { FileSpreadsheet, Users, Search, Filter, Edit3, Eye, ArrowLeft, Save  } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';

// Estructura para la lista de Cursos/Actas del Docente
interface CursoActa {
  id_asignacion: number;
  codigo_curso: string;
  nombre_curso: string;
  seccion: string;
  total_estudiantes: number;
  rendimiento_promedio: number;
  estado_acta: 'ABIERTA' | 'REVISION' | 'CERRADA';
}

// Estructura para el listado de Notas de Estudiantes
interface NotaEstudiante {
  id_estudiante: number;
  carnet: string;
  nombre_completo: string;
  zona: number; 
  examen_final: number; 
}

export const ControlNotas: React.FC = () => {
  const { theme } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  
  // Estado para controlar qué curso se está editando/viendo 
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoActa | null>(null);

  // 1. Datos simulados de los cursos del Docente 
  const [actas, setActas] = useState<CursoActa[]>([
    { id_asignacion: 101, codigo_curso: '090001', nombre_curso: 'Programación I', seccion: 'A', total_estudiantes: 3, rendimiento_promedio: 74.3, estado_acta: 'ABIERTA' },
    { id_asignacion: 102, codigo_curso: '090002', nombre_curso: 'Cálculo I', seccion: 'B', total_estudiantes: 42, rendimiento_promedio: 58.1, estado_acta: 'CERRADA' },
    { id_asignacion: 103, codigo_curso: '090025', nombre_curso: 'Base de Datos II', seccion: 'A', total_estudiantes: 25, rendimiento_promedio: 68.4, estado_acta: 'REVISION' }
  ]);

  // 2. Datos de estudiantes asignados al curso (Se cargaría dinámicamente desde el Backend usando el id_asignacion)
  const [estudiantesNotas, setEstudiantesNotas] = useState<NotaEstudiante[]>([
    { id_estudiante: 1, carnet: '0905-20-4321', nombre_completo: 'Carlos Eduardo Mendoza Gómez', zona: 48, examen_final: 23 },
    { id_estudiante: 2, carnet: '0905-21-8976', nombre_completo: 'Glendy Vanessa Palacios Ramos', zona: 55, examen_final: 26 },
    { id_estudiante: 3, carnet: '0905-19-1245', nombre_completo: 'Brayan Josué Hicho Tobar', zona: 35, examen_final: 14 },
  ]);

  // Manejadores de cambios en las notas individuales de la tabla
  const handleNotaChange = (id: number, campo: 'zona' | 'examen_final', valor: string) => {
    const numValor = Math.min(campo === 'zona' ? 70 : 30, Math.max(0, parseInt(valor) || 0));
    setEstudiantesNotas(prev => prev.map(est => est.id_estudiante === id ? { ...est, [campo]: numValor } : est));
  };

  // Filtrado de la tabla del nivel 1
  const actasFiltradas = actas.filter(acta => {
    const matchesSearch = acta.nombre_curso.toLowerCase().includes(searchQuery.toLowerCase()) || acta.codigo_curso.includes(searchQuery);
    const matchesFilter = filterEstado === 'Todos' || acta.estado_acta === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';

  // --- RENDERIZADO DEL NIVEL 2: LISTADO DE ESTUDIANTES Y SUS NOTAS ---
  if (cursoSeleccionado) {
    const esActaCerrada = cursoSeleccionado.estado_acta === 'CERRADA';

    return (
      <div className="space-y-6 w-full animate-fade-in text-left">
        {/* Cabecera de Retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => setCursoSeleccionado(null)}
            className={`flex items-center space-x-2 text-xs font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900' : 
              isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51] hover:bg-[#fff5f6]' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-xs'
            }`}
          >
            <ArrowLeft size={14} />
            <span>Volver a Cursos</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
              cursoSeleccionado.estado_acta === 'CERRADA' ? 'bg-emerald-500/10 text-emerald-500' :
              cursoSeleccionado.estado_acta === 'REVISION' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              Acta {cursoSeleccionado.estado_acta}
            </span>
          </div>
        </div>

        {/* Info del Curso */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <span className="text-mono text-xs font-bold text-blue-500 block">{cursoSeleccionado.codigo_curso}</span>
          <h2 className="text-xl font-black mt-1">{cursoSeleccionado.nombre_curso} - Sección "{cursoSeleccionado.seccion}"</h2>
          <p className="text-xs text-gray-400 mt-1">Facultad de Ingeniería en Sistemas • Ciclo Académico Actual</p>
        </div>

        {/* Tabla de Estudiantes e Ingreso de Notas */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : isCoquette ? 'border-[#fbcdd4] bg-[#fff5f6] text-[#b3888d]' : 'bg-gray-50/70 text-slate-400'}`}>
                  <th className="py-3.5 px-6">Carnet</th>
                  <th className="py-3.5 px-6">Nombre del Estudiante</th>
                  <th className="py-3.5 px-6 text-center w-32">Zona (70 pts)</th>
                  <th className="py-3.5 px-6 text-center w-32">Final (30 pts)</th>
                  <th className="py-3.5 px-6 text-center w-32">Nota Total</th>
                  <th className="py-3.5 px-6 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : isCoquette ? 'divide-[#fbcdd4]' : 'divide-gray-100'}`}>
                {estudiantesNotas.map((estudiante) => {
                  const notaTotal = estudiante.zona + estudiante.examen_final;
                  const aprobado = notaTotal >= 61;

                  return (
                    <tr key={estudiante.id_estudiante} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-4 px-6 font-mono font-bold text-gray-500 dark:text-gray-400">{estudiante.carnet}</td>
                      <td className={`py-4 px-6 font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{estudiante.nombre_completo}</td>
                      
                      {/* Control Zona */}
                      <td className="py-4 px-6 text-center">
                        <input
                          type="number"
                          value={estudiante.zona}
                          disabled={esActaCerrada}
                          onChange={(e) => handleNotaChange(estudiante.id_estudiante, 'zona', e.target.value)}
                          className={`w-20 text-center py-1.5 border rounded-lg font-bold outline-none ${
                            esActaCerrada ? 'bg-gray-100 dark:bg-slate-900 text-gray-400 cursor-not-allowed border-transparent' :
                            isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-400'
                          }`}
                        />
                      </td>

                      {/* Control Examen Final */}
                      <td className="py-4 px-6 text-center">
                        <input
                          type="number"
                          value={estudiante.examen_final}
                          disabled={esActaCerrada}
                          onChange={(e) => handleNotaChange(estudiante.id_estudiante, 'examen_final', e.target.value)}
                          className={`w-20 text-center py-1.5 border rounded-lg font-bold outline-none ${
                            esActaCerrada ? 'bg-gray-100 dark:bg-slate-900 text-gray-400 cursor-not-allowed border-transparent' :
                            isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-400'
                          }`}
                        />
                      </td>

                      {/* Nota Acumulada Final */}
                      <td className={`py-4 px-6 text-center text-sm font-black ${aprobado ? 'text-emerald-500' : 'text-red-500'}`}>
                        {notaTotal} pts
                      </td>

                      {/* Estado Aprobado / Reprobado */}
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          aprobado ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                          {aprobado ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones de Guardado */}
        {!esActaCerrada && (
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setCursoSeleccionado(null)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                alert('¡Notas actualizadas y guardadas en la Base de Datos con éxito!');
                setCursoSeleccionado(null);
              }}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs ${
                isCoquette ? 'bg-[#f472b6]' : 'bg-blue-600'
              }`}
            >
              <Save size={14} />
              <span>Guardar Calificaciones</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- RENDERIZADO DEL NIVEL 1: DETALLE GENERAL DE ACTAS DE CURSOS ---
  return (
    <div className="space-y-6 w-full animate-fade-in text-left">
      
      {/* Tarjetas de métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Asignaturas Asignadas</span>
            <FileSpreadsheet className="text-blue-500" size={16} />
          </div>
          <p className="text-xl font-black">{actas.length} Módulos Activos</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Estudiantes de Alta</span>
            <Users className="text-purple-500" size={16} />
          </div>
          <p className="text-xl font-black">{actas.reduce((a, b) => a + b.total_estudiantes, 0)} Alumnos Totales</p>
        </div>
      </div>

      {/* Buscador y selectores de control */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-xs'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Buscar por nombre o código de curso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : isCoquette ? 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51] focus:border-[#f472b6]' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`}
          />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? 'bg-slate-900 border-transparent text-slate-200' : isCoquette ? 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51]' : 'bg-gray-50 border-transparent'}`}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="REVISION">En Revisión</option>
            <option value="CERRADA">Cerradas</option>
          </select>
        </div>
      </div>

      {/* Tabla limpia de Cursos */}
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : isCoquette ? 'border-[#fbcdd4] bg-[#fff5f6] text-[#b3888d]' : 'bg-gray-50/70 text-slate-400'}`}>
                <th className="py-3.5 px-6">Código / Curso</th>
                <th className="py-3.5 px-6 text-center">Sección</th>
                <th className="py-3.5 px-6 text-center">Alumnos Inscritos</th>
                <th className="py-3.5 px-6 text-center">Estado Acta</th>
                <th className="py-3.5 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : isCoquette ? 'divide-[#fbcdd4]' : 'divide-gray-100'}`}>
              {actasFiltradas.length > 0 ? (
                actasFiltradas.map((acta) => (
                  <tr key={acta.id_asignacion} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                    <td className="py-4 px-6">
                      <span className="font-mono text-blue-500 font-bold block text-[11px]">{acta.codigo_curso}</span>
                      <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{acta.nombre_curso}</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-300">{acta.seccion}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700 dark:text-slate-200">{acta.total_estudiantes} Alumnos</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                        acta.estado_acta === 'CERRADA' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        acta.estado_acta === 'REVISION' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {acta.estado_acta}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setCursoSeleccionado(acta)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          acta.estado_acta === 'CERRADA' 
                            ? 'text-gray-500 hover:bg-gray-100 dark:border-slate-800 dark:hover:bg-slate-900' 
                            : isCoquette ? 'bg-[#f472b6] text-white border-transparent' : 'bg-slate-950 text-white dark:bg-blue-600 border-transparent'
                        }`}
                      >
                        {acta.estado_acta === 'CERRADA' ? <Eye size={13} /> : <Edit3 size={13} />}
                        <span>{acta.estado_acta === 'CERRADA' ? 'Ver Notas' : 'Ingresar Notas'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No se encontraron cursos asignados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};