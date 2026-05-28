<<<<<<< Updated upstream
import React, { useState, useEffect, useCallback } from 'react';
import { FileSpreadsheet, Users, Search, Eye, ArrowLeft, Save } from 'lucide-react';
=======
// IMPORTS
import React, { useState } from 'react';
import { FileSpreadsheet, Users, Search, Filter, Edit3, Eye, ArrowLeft, Save, RefreshCw } from 'lucide-react';
>>>>>>> Stashed changes
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { docentesService } from '../../../services/docentes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { inscripcionesService, type Inscripcion } from '../../../services/inscripciones.service';
import { notasService, type Nota } from '../../../services/notas.service';

<<<<<<< Updated upstream
=======
// CONFIGURACIÓN DE ESTILOS CENTRALIZADOS
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

// TIPOS E INTERFACES
>>>>>>> Stashed changes
interface CursoActa {
  id_asignacion: number;
  codigo_curso: string;
  nombre_curso: string;
  seccion: string;
  total_estudiantes: number;
  estado_acta: 'ABIERTA' | 'REVISION' | 'CERRADA';
}

<<<<<<< Updated upstream
interface NotaEdit {
  idInscripcion: number;
  idEstudiante: number;
  carnet: string;
  nombre: string;
  notaFinal: number;
  idNota?: number;
=======
interface NotaEstudiante {
  id_estudiante: number;
  carnet: string;
  nombre_completo: string;
  curso_pertenece: string; 
  parcial_1: number;
  parcial_2: number;
  zona: number;
  proyecto: number;
  examen_final: number;
>>>>>>> Stashed changes
}

// COMPONENTE PRINCIPAL
export const ControlNotas: React.FC = () => {
  const { theme, user } = useAuth();
  const globalStyles = getThemeStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
<<<<<<< Updated upstream

  const [actas, setActas] = useState<CursoActa[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoActa | null>(null);
  const [estudiantesNotas, setEstudiantesNotas] = useState<NotaEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cargarActas = useCallback(() => {
    if (!user) return;
    setLoading(true);
    docentesService.getAll().then(dRes => {
      const docente = dRes.data.find(d => d.id_usuario === user.id);
      if (!docente) { setLoading(false); return; }
      asignacionesService.getByDocente(docente.id_docente).then(aRes => {
        setActas(aRes.data.map(a => ({
          id_asignacion: a.id_asignacion,
          codigo_curso: a.Cursos?.codigo ?? '',
          nombre_curso: a.Cursos?.nombre ?? '',
          seccion: a.seccion,
          total_estudiantes: 0,
          estado_acta: 'ABIERTA' as const,
        })));
      }).catch(() => {}).finally(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, [user]);

  useEffect(() => { cargarActas(); }, [cargarActas]);

  const cargarEstudiantes = useCallback(async (asignacionId: number) => {
    try {
      const [iRes, nRes] = await Promise.all([
        inscripcionesService.getByAsignacion(asignacionId),
        notasService.getAll(),
      ]);
      const inscripciones = iRes.data;
      const notas = nRes.data;

      const editList: NotaEdit[] = inscripciones.map(ins => {
        const nota = notas.find(n => n.id_inscripcion === ins.id_inscripcion);
        const est = ins.Estudiantes;
        return {
          idInscripcion: ins.id_inscripcion,
          idEstudiante: est?.id_estudiante ?? 0,
          carnet: est?.carnet ?? '',
          nombre: est?.Usuarios ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}` : '',
          notaFinal: nota?.nota_final ?? 0,
          idNota: nota?.id_nota,
        };
      });
      setEstudiantesNotas(editList);
    } catch {}
  }, []);

  const seleccionarCurso = async (acta: CursoActa) => {
    setCursoSeleccionado(acta);
    await cargarEstudiantes(acta.id_asignacion);
  };

  const handleNotaChange = (idInscripcion: number, valor: string) => {
    const num = Math.min(100, Math.max(0, parseInt(valor) || 0));
    setEstudiantesNotas(prev => prev.map(e => e.idInscripcion === idInscripcion ? { ...e, notaFinal: num } : e));
  };

  const guardarNotas = async () => {
    setSaving(true);
    try {
      for (const e of estudiantesNotas) {
        if (e.idNota) {
          await notasService.update(e.idNota, { nota_final: e.notaFinal });
        } else {
          const created = await notasService.create({ id_inscripcion: e.idInscripcion, nota_final: e.notaFinal });
          setEstudiantesNotas(prev => prev.map(p => p.idInscripcion === e.idInscripcion ? { ...p, idNota: created.data.id_nota } : p));
        }
      }
      setCursoSeleccionado(null);
    } catch {}
    setSaving(false);
  };

  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';

=======
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoActa | null>(null);
  
  const currentTheme = CONFIG_ESTILOS[theme] ? theme : 'claro';
  const c = CONFIG_ESTILOS[currentTheme];

  const [actas, setActas] = useState<CursoActa[]>([
    { id_asignacion: 101, codigo_curso: '090001', nombre_curso: 'Programación I', seccion: 'A', total_estudiantes: 4, rendimiento_promedio: 74.3, estado_acta: 'ABIERTA' },
    { id_asignacion: 102, codigo_curso: '090002', nombre_curso: 'Cálculo I', seccion: 'B', total_estudiantes: 42, rendimiento_promedio: 58.1, estado_acta: 'CERRADA' },
    { id_asignacion: 103, codigo_curso: '090025', nombre_curso: 'Base de Datos II', seccion: 'A', total_estudiantes: 25, rendimiento_promedio: 68.4, estado_acta: 'REVISION' }
  ]);

  const [todasLasNotas, setTodasLasNotas] = useState<NotaEstudiante[]>([
    { id_estudiante: 1, carnet: '0905-20-4321', nombre_completo: 'Carlos Eduardo Mendoza Gómez', curso_pertenece: 'Programación I', parcial_1: 12, parcial_2: 10, zona: 15, proyecto: 11, examen_final: 16 },
    { id_estudiante: 2, carnet: '0905-21-8976', nombre_completo: 'Glendy Vanessa Palacios Ramos', curso_pertenece: 'Cálculo I', parcial_1: 14, parcial_2: 13, zona: 18, proyecto: 14, examen_final: 22 },
    { id_estudiante: 3, carnet: '0905-19-1245', nombre_completo: 'Brayan Josué Hicho Tobar', curso_pertenece: 'Base de Datos II', parcial_1: 10, parcial_2: 9, zona: 12, proyecto: 11, examen_final: 19 },
    { id_estudiante: 4, carnet: '0905-21-4032', nombre_completo: 'Madelin Yasmiz Cerón Molina', curso_pertenece: 'Programación I', parcial_1: 0, parcial_2: 0, zona: 0, proyecto: 0, examen_final: 0 }
  ]);

  const estudiantesNotasFiltradas = cursoSeleccionado 
    ? todasLasNotas.filter(est => est.curso_pertenece.toLowerCase() === cursoSeleccionado.nombre_curso.toLowerCase())
    : [];

  const handleNotaChange = (id: number, campo: keyof Omit<NotaEstudiante, 'id_estudiante' | 'carnet' | 'nombre_completo' | 'curso_pertenece'>, valor: string) => {
    const maxPts: Record<string, number> = { parcial_1: 15, parcial_2: 15, proyecto: 15, zona: 20, examen_final: 35 };
    const numValor = Math.min(maxPts[campo] || 100, Math.max(0, parseInt(valor) || 0));
    setTodasLasNotas(prev => prev.map(est => est.id_estudiante === id ? { ...est, [campo]: numValor } : est));
  };

  const handleCambiarEstadoActa = (nuevoEstado: 'ABIERTA' | 'REVISION' | 'CERRADA') => {
    if (!cursoSeleccionado) return;
    setActas(prev => prev.map(acta => acta.id_asignacion === cursoSeleccionado.id_asignacion ? { ...acta, estado_acta: nuevoEstado } : acta));
    setCursoSeleccionado(prev => prev ? { ...prev, estado_acta: nuevoEstado } : null);
  };

>>>>>>> Stashed changes
  const actasFiltradas = actas.filter(acta => {
    const matchesSearch = acta.nombre_curso.toLowerCase().includes(searchQuery.toLowerCase()) || acta.codigo_curso.includes(searchQuery);
    const matchesFilter = filterEstado === 'Todos' || acta.estado_acta === filterEstado;
    return matchesSearch && matchesFilter;
  });

<<<<<<< Updated upstream
  if (cursoSeleccionado) {
    return (
      <div className="space-y-6 w-full text-left">
=======
  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';
  const titleColor = isDark ? '#f8fafc' : isCoquette ? '#6d4c51' : '#0f172a';
  const inputBgClass = isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200';

  // VISTA DETALLE DE CALIFICACIONES
  if (cursoSeleccionado) {
    const esActaCerrada = cursoSeleccionado.estado_acta === 'CERRADA';
    const estadoColors = esActaCerrada ? 'bg-emerald-500/10 text-emerald-500' : cursoSeleccionado.estado_acta === 'REVISION' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500';

    return (
      <div className="space-y-6 w-full animate-fade-in text-left">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        </div>

        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <span className="text-mono text-xs font-bold text-blue-500 block">{cursoSeleccionado.codigo_curso}</span>
          <h2 className="text-xl font-black mt-1">{cursoSeleccionado.nombre_curso} - Sección "{cursoSeleccionado.seccion}"</h2>
          <p className="text-xs text-gray-400 mt-1">Ciclo Académico Actual</p>
        </div>

        <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : isCoquette ? 'border-[#fbcdd4] bg-[#fff5f6] text-[#b3888d]' : 'bg-gray-50/70 text-slate-400'}`}>
                  <th className="py-3.5 px-6">Carnet</th>
                  <th className="py-3.5 px-6">Nombre del Estudiante</th>
                  <th className="py-3.5 px-6 text-center w-32">Nota Final (0-100)</th>
                  <th className="py-3.5 px-6 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : isCoquette ? 'divide-[#fbcdd4]' : 'divide-gray-100'}`}>
                {estudiantesNotas.map((e) => {
                  const aprobado = e.notaFinal >= 61;
                  return (
                    <tr key={e.idInscripcion} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-4 px-6 font-mono font-bold text-gray-500">{e.carnet}</td>
                      <td className={`py-4 px-6 font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{e.nombre}</td>
                      <td className="py-4 px-6 text-center">
                        <input
                          type="number"
                          value={e.notaFinal}
                          onChange={(ev) => handleNotaChange(e.idInscripcion, ev.target.value)}
                          className={`w-24 text-center py-1.5 border rounded-lg font-bold outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-400'
                          }`}
                        />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${aprobado ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {aprobado ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
=======
          
          <div className="flex items-center space-x-3">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${estadoColors}`}>
              Acta {cursoSeleccionado.estado_acta}
            </span>
            
            <div className="relative flex items-center">
              <RefreshCw className="absolute left-2.5 text-gray-400 pointer-events-none" size={12} />
              <select
                value={cursoSeleccionado.estado_acta}
                onChange={(e) => handleCambiarEstadoActa(e.target.value as 'ABIERTA' | 'REVISION' | 'CERRADA')}
                className={`pl-7 pr-7 py-1 border rounded-lg text-[11px] font-bold outline-none appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : isCoquette ? 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51]' : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <option value="ABIERTA">Abierta</option>
                <option value="REVISION">Revisión</option>
                <option value="CERRADA">Cerrada</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`}>
          <span className="text-mono text-xs font-bold text-blue-500 block">{cursoSeleccionado.codigo_curso}</span>
          <h2 className="text-xl font-bold mt-1 transition-colors" style={{ color: titleColor }}>
            {cursoSeleccionado.nombre_curso} - Sección "{cursoSeleccionado.seccion}"
          </h2>
          <p className="text-xs text-gray-400 mt-1">Facultad de Ingeniería en Sistemas - Nómina Oficial</p>
        </div>

        <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'bg-gray-50/70 text-[#b3888d]'}`}>
                  {['Carnet', 'Nombre del Estudiante'].map(h => <th key={h} className="py-3.5 px-6 text-[#b3888d]">{h}</th>)}
                  {[['Parcial I', 15], ['Parcial II', 15], ['Zona', 20], ['Proyecto', 15], ['Final', 35]].map(([name, pts]) => (
                    <th key={name} className="py-3.5 px-4 text-center w-24 text-[#b3888d]"><div>{name}</div><div className="text-[11px] text-gray-500 font-bold">({pts} pts)</div></th>
                  ))}
                  <th className="py-3.5 px-6 text-center w-28 text-[#b3888d]">Nota Total<div className="text-[11px] text-gray-500 font-bold">(100 pts)</div></th>
                  <th className="py-3.5 px-6 text-center text-[#b3888d]">Resultado</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                {estudiantesNotasFiltradas.length > 0 ? (
                  estudiantesNotasFiltradas.map((estudiante) => {
                    const notaTotal = estudiante.parcial_1 + estudiante.parcial_2 + estudiante.zona + estudiante.proyecto + estudiante.examen_final;
                    const aprobado = notaTotal >= 61;
                    const inputs: (keyof Omit<NotaEstudiante, 'id_estudiante' | 'carnet' | 'nombre_completo' | 'curso_pertenece'>)[ ] = ['parcial_1', 'parcial_2', 'zona', 'proyecto', 'examen_final'];
                    
                    return (
                      <tr key={estudiante.id_estudiante} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                        <td className="py-4 px-6 font-mono font-bold text-gray-500 dark:text-gray-400">{estudiante.carnet}</td>
                        <td className="py-4 px-6 font-bold text-gray-500 dark:text-gray-400">{estudiante.nombre_completo}</td>
                        {inputs.map(campo => (
                          <td key={campo} className="py-4 px-2 text-center">
                            <input 
                              type="number" 
                              value={estudiante[campo]} 
                              disabled={esActaCerrada} 
                              onChange={(e) => handleNotaChange(estudiante.id_estudiante, campo, e.target.value)} 
                              className={`w-16 text-center mx-auto py-1.5 border rounded-lg text-sm font-black outline-none block !text-gray-500 dark:!text-gray-400 ${esActaCerrada ? 'cursor-not-allowed opacity-60 bg-gray-100 dark:bg-slate-900' : ''} ${inputBgClass}`} 
                            />
                          </td>
                        ))}
                        <td className={`py-4 px-6 text-center text-sm font-black ${aprobado ? 'text-emerald-500' : 'text-red-500'}`}>{notaTotal} pts</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${aprobado ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{aprobado ? 'Aprobado' : 'Reprobado'}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={9} className="py-8 text-center text-gray-400 font-medium">No hay estudiantes matriculados en este curso todavía.</td></tr>
                )}
>>>>>>> Stashed changes
              </tbody>
            </table>
          </div>
        </div>

<<<<<<< Updated upstream
        <div className="flex justify-end space-x-3">
          <button onClick={() => setCursoSeleccionado(null)} className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button
            onClick={guardarNotas}
            disabled={saving}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-50 ${isCoquette ? 'bg-[#f472b6]' : 'bg-blue-600'}`}
          >
            <Save size={14} />
            <span>{saving ? 'Guardando...' : 'Guardar Calificaciones'}</span>
          </button>
        </div>
=======
        {!esActaCerrada && (
          <div className="flex justify-end space-x-3">
            <button onClick={() => setCursoSeleccionado(null)} className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={() => { alert('¡Notas oficiales actualizadas y guardadas en el acta!'); setCursoSeleccionado(null); }}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs ${isCoquette ? 'bg-[#f472b6]' : 'bg-blue-600'}`}
            >
              <Save size={14} />
              <span>Guardar Calificaciones</span>
            </button>
          </div>
        )}
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
  return (
    <div className="space-y-6 w-full text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Asignaturas Asignadas</span>
            <FileSpreadsheet className="text-blue-500" size={16} />
          </div>
          <p className="text-xl font-black">{loading ? '...' : actas.length} Módulos Activos</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cursos Disponibles</span>
            <Users className="text-purple-500" size={16} />
          </div>
          <p className="text-xl font-black">{loading ? '...' : actas.length} Asignaciones</p>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-xs'}`}>
=======
  // VISTA PRINCIPAL DE ASIGNATURAS
  return (
    <div className="space-y-6 w-full animate-fade-in text-left">
      
      {/* ENCABEZADO */}
      <div className="flex items-center space-x-3 text-left">
        <div className={`p-3 rounded-xl transition-all duration-300 ${c.headerBg}`}>
          <FileSpreadsheet size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>
            Control de Actas y Notas Oficiales
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Visualiza el rendimiento de tus asignaturas, gestiona notas parciales y administra los estados de cierre de actas escolares.
          </p>
        </div>
      </div>

      {/* METRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-100 shadow-xs'} flex items-center space-x-4`}>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Asignaturas Asignadas</span>
            <p className="text-xl font-black mt-0.5">{actas.length} Módulos Activos</p>
          </div>
        </div>
        
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-100 shadow-xs'} flex items-center space-x-4`}>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Estudiantes de Alta</span>
            <p className="text-xl font-black mt-0.5">{todasLasNotas.length} Alumnos Totales</p>
          </div>
        </div>
      </div>

      {/* FILTROS Y ACCIONES */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`}>
>>>>>>> Stashed changes
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Buscar por nombre o código de curso..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`} />
        </div>
        <div className="relative flex items-center">
<<<<<<< Updated upstream
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className={`pl-3 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? 'bg-slate-900 border-transparent text-slate-200' : isCoquette ? 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51]' : 'bg-gray-50 border-transparent'}`}
          >
=======
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? 'bg-slate-900 border-transparent text-slate-200' : 'bg-gray-50 border-transparent'}`}>
>>>>>>> Stashed changes
            <option value="Todos">Todos los Estados</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="REVISION">En Revisión</option>
            <option value="CERRADA">Cerradas</option>
          </select>
        </div>
      </div>

<<<<<<< Updated upstream
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando cursos...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : isCoquette ? 'border-[#fbcdd4] bg-[#fff5f6] text-[#b3888d]' : 'bg-gray-50/70 text-slate-400'}`}>
                  <th className="py-3.5 px-6">Código / Curso</th>
                  <th className="py-3.5 px-6 text-center">Sección</th>
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
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                          acta.estado_acta === 'CERRADA' ? 'bg-emerald-500/10 text-emerald-600' :
                          acta.estado_acta === 'REVISION' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {acta.estado_acta}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => seleccionarCurso(acta)} className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isCoquette ? 'bg-[#f472b6] text-white border-transparent' : 'bg-slate-950 text-white dark:bg-blue-600 border-transparent'
                        }`}>
                          <Eye size={13} />
                          <span>Ver / Ingresar Notas</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">No se encontraron cursos asignados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
=======
      {/* TABLA PRINCIPAL */}
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'bg-gray-50/70 text-[#b3888d]'}`}>
                <th className="py-3.5 px-6">Código / Curso</th>
                {['Sección', 'Alumnos Inscritos', 'Estado Acta', 'Acción'].map(h => <th key={h} className="py-3.5 px-6 text-center text-[#b3888d]">{h}</th>)}
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
              {actasFiltradas.length > 0 ? (
                actasFiltradas.map((acta) => {
                  const alumnosDeEsteCurso = todasLasNotas.filter(e => e.curso_pertenece === acta.nombre_curso).length;
                  const esCerrada = acta.estado_acta === 'CERRADA';
                  
                  return (
                    <tr key={acta.id_asignacion} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-4 px-6">
                        <span className="font-mono text-blue-500 font-bold block text-[11px]">{acta.codigo_curso}</span>
                        <span className="font-bold text-sm text-gray-500 dark:text-gray-400">{acta.nombre_curso}</span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-gray-500 dark:text-gray-400">{acta.seccion}</td>
                      <td className="py-4 px-6 text-center font-bold text-gray-500 dark:text-gray-400">{alumnosDeEsteCurso} Alumnos</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${esCerrada ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : acta.estado_acta === 'REVISION' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>{acta.estado_acta}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => setCursoSeleccionado(acta)} 
                          className={`inline-flex items-center justify-center space-x-1.5 h-8 w-36 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            esCerrada 
                              ? 'bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 border-gray-300 shadow-2xs' 
                              : `text-white border-transparent shadow-xs ${isCoquette ? 'bg-[#f472b6] hover:bg-[#ec4899]' : 'bg-blue-600 hover:bg-blue-500'}`
                          }`}
                        >
                          {esCerrada ? <Eye size={13} /> : <Edit3 size={13} />}
                          <span>{esCerrada ? 'Ver Notas' : 'Ingresar Notas'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No se encontraron cursos asignados.</td></tr>
              )}
            </tbody>
          </table>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};
