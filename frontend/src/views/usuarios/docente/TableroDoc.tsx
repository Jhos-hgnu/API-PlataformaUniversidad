import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
<<<<<<< Updated upstream
import { Users, BookOpen, GraduationCap, AlertCircle, ArrowUpRight, PlusCircle, FileSpreadsheet, Clock } from 'lucide-react';
import { getThemeStyles } from '../../../utils/themeStyles';
import { docentesService } from '../../../services/docentes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { inscripcionesService } from '../../../services/inscripciones.service';

type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config';
=======
import { Users, BookOpen, GraduationCap, AlertCircle, ArrowUpRight, PlusCircle, FileSpreadsheet, Clock, LayoutDashboard } from 'lucide-react';
import { getThemeStyles } from '../../../utils/themeStyles'; 

type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config' | 'asistencia' | 'calificaciones';
>>>>>>> Stashed changes

// CONFIGURACIÓN DE ESTILOS POR TEMA
const THEME_MAP = {
  oscuro: { 
    card: 'bg-slate-800 border-slate-700 text-white', textMuted: 'text-slate-400', 
    bgMiniCard: 'bg-slate-900 border-slate-700', progressBg: 'bg-slate-700', 
    actionBtn: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600', 
    accentText: 'text-blue-400', titleHex: '#f8fafc', headerBg: 'bg-slate-800 text-blue-400', 
    divider: 'border-slate-700', status: 'bg-slate-950 border-slate-800 text-slate-300'
  },
  coquette: { 
    card: 'bg-white border-[#fbcdd4] text-[#6d4c51]', textMuted: 'text-[#b3888d]', 
    bgMiniCard: 'bg-[#fffafb] border-[#fbcdd4]', progressBg: 'bg-[#fff5f6]', 
    actionBtn: 'bg-[#fff5f6] hover:bg-[#fbcdd4]/30 text-[#6d4c51] border-[#fbcdd4]', 
    accentText: 'text-[#f472b6]', titleHex: '#6d4c51', headerBg: 'bg-[#fff5f6] text-[#f472b6]', 
    divider: 'border-[#fbcdd4]', status: 'bg-white border-[#fbcdd4] text-[#6d4c51]'
  },
  claro: { 
    card: 'bg-white border-gray-100 text-slate-800', textMuted: 'text-gray-400', 
    bgMiniCard: 'bg-gray-50/50 border-gray-100', progressBg: 'bg-gray-100', 
    actionBtn: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200', 
    accentText: 'text-[#1a365d]', titleHex: '#0f172a', headerBg: 'bg-slate-100 text-[#1a365d]', 
    divider: 'border-gray-100', status: 'bg-white border-gray-200 text-slate-700 shadow-2xs'
  }
};

// COMPONENTE PRINCIPAL
export const TableroDoc: React.FC<{ setActiveSection: (section: Section) => void }> = ({ setActiveSection }) => {
  const { theme, user } = useAuth();
  const globalStyles = getThemeStyles(theme);
<<<<<<< Updated upstream
  const nombreDocente = user?.nombre || 'Docente';

  const [docenteId, setDocenteId] = useState<number | null>(null);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    docentesService.getAll().then(res => {
      const docente = res.data.find(d => d.id_usuario === user.id);
      if (docente) setDocenteId(docente.id_docente);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!docenteId) return;
    setLoading(true);
    Promise.all([
      asignacionesService.getByDocente(docenteId),
      inscripcionesService.getAll(),
    ])
      .then(([aRes, iRes]) => {
        const asignacionesData = aRes.data;
        setAsignaciones(asignacionesData);

        const asignacionIds = new Set(asignacionesData.map(a => a.id_asignacion));
        const estudiantesSet = new Set(
          iRes.data.filter(i => asignacionIds.has(i.id_asignacion)).map(i => i.id_estudiante)
        );
        setTotalEstudiantes(estudiantesSet.size);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [docenteId]);

  const kpis = [
    { id: 1, label: 'Total Estudiantes', valor: loading ? '...' : String(totalEstudiantes), icon: <Users size={20} />, color: 'bg-blue-500/10 text-blue-500' },
    { id: 2, label: 'Cursos Asignados', valor: loading ? '...' : String(asignaciones.length), icon: <BookOpen size={20} />, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 3, label: 'Actas por Cerrar', valor: loading ? '...' : '0', icon: <GraduationCap size={20} />, color: 'bg-amber-500/10 text-amber-500' },
    { id: 4, label: 'Avisos de Coordinación', valor: '0', icon: <AlertCircle size={20} />, color: 'bg-rose-500/10 text-rose-500' },
  ];

  const obtenerEstilosTablero = () => {
    switch (theme) {
      case 'oscuro':
        return {
          card: 'bg-slate-800 border-slate-700 text-white',
          textMuted: 'text-slate-400',
          title: 'text-slate-100',
          bgMiniCard: 'bg-slate-900 border-slate-700',
          actionBtn: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600',
          progressBg: 'bg-slate-700',
          accentText: 'text-blue-400'
        };
      case 'coquette':
        return {
          card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
          textMuted: 'text-[#b3888d]',
          title: 'text-slate-900 font-bold',
          bgMiniCard: 'bg-[#fffafb] border-[#fbcdd4]',
          actionBtn: 'bg-[#fff5f6] hover:bg-[#fbcdd4]/30 text-[#6d4c51] border-[#fbcdd4]',
          progressBg: 'bg-[#fff5f6]',
          accentText: 'text-[#f472b6]'
        };
      case 'claro':
      default:
        return {
          card: 'bg-white border-gray-100 text-slate-800',
          textMuted: 'text-gray-400',
          title: 'text-slate-800 font-bold',
          bgMiniCard: 'bg-gray-50/50 border-gray-100',
          actionBtn: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200',
          progressBg: 'bg-gray-100',
          accentText: 'text-[#1a365d]'
        };
    }
  };

  const t = obtenerEstilosTablero();

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a' }}>
            Panel del Docente
          </h2>
          <p className={`text-xs ${globalStyles.mutedText}`}>
            Bienvenido de nuevo, <span className="font-semibold">{nombreDocente}</span>. Aquí tienes el balance de tus aulas y actas académicas vigentes.
          </p>
        </div>
      </div>

=======
  const t = THEME_MAP[theme as keyof typeof THEME_MAP] || THEME_MAP.claro;

  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';

  const kpis = [
    { id: 1, label: 'Total Estudiantes', valor: '63', icon: <Users size={18} />, color: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600' },
    { id: 2, label: 'Cursos Asignados', valor: '2', icon: <BookOpen size={18} />, color: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600' },
    { id: 3, label: 'Actas por Cerrar', valor: '1', icon: <GraduationCap size={18} />, color: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600' },
    { id: 4, label: 'Avisos de Coordinación', valor: '0', icon: <AlertCircle size={18} />, color: isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600' },
  ];

  const cursosData = [
    { titulo: 'Programación I — Sección A', info: '28 / 40 Alumnos (70%)', clase: isCoquette ? 'bg-[#f472b6]' : 'bg-blue-600', width: '70%' },
    { titulo: 'Estructuras de Datos — Sección B', info: '35 / 35 Alumnos (Lleno)', clase: 'bg-amber-500', width: '100%', textClase: 'text-amber-500 font-bold' }
  ];

  return (
    <div className="space-y-6 w-full animate-fade-in text-left">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${t.headerBg}`}>
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold transition-colors" style={{ color: t.titleHex }}>Panel General del Docente</h2>
            <p className={`text-xs transition-colors ${globalStyles.mutedText}`}>
              Bienvenido de nuevo, <span className="font-semibold">{user?.nombre || 'Ing. Richard Ortíz'}</span>. Aquí tienes el balance de tus aulas.
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center select-none h-9 shrink-0 ${t.status}`}>
          Ciclo Académico 2026
        </div>
      </div>

      {/* RECUADROS ESTADÍSTICOS */}
>>>>>>> Stashed changes
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`border rounded-2xl p-5 shadow-xs text-left transition-colors ${t.card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.color}`}>{kpi.icon}</div>
<<<<<<< Updated upstream
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Ciclo Activo</span>
=======
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Vigente</span>
>>>>>>> Stashed changes
            </div>
            <p className={`text-[11px] font-medium uppercase tracking-wider ${t.textMuted}`}>{kpi.label}</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{kpi.valor}</h3>
          </div>
        ))}
      </div>

      {/* GRILLA PRINCIPAL DEL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
<<<<<<< Updated upstream
        <div className={`lg:col-span-2 border rounded-2xl p-5 shadow-xs ${t.card}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
            <FileSpreadsheet size={14} className={t.accentText} />
            <span>Ocupación de Estudiantes por Curso</span>
          </h3>

          <div className="space-y-5">
            {loading ? (
              <p className="text-xs text-gray-400">Cargando cursos...</p>
            ) : asignaciones.length > 0 ? (
              asignaciones.map((a) => {
                const cupoMax = a.Cursos?.cupo_maximo ?? 0;
                const inscritos = cupoMax - a.cupo_disponible;
                const pct = cupoMax > 0 ? Math.round((inscritos / cupoMax) * 100) : 0;
                const lleno = a.cupo_disponible <= 0;
                return (
                  <div key={a.id_asignacion}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{a.Cursos?.nombre} — Sección {a.seccion}</span>
                      <span className={lleno ? 'text-amber-500 font-bold' : t.textMuted}>
                        {inscritos} / {cupoMax} Alumnos ({pct}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                      <div className={`h-full rounded-full ${lleno ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400">No tienes cursos asignados en este ciclo.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100/10 flex justify-end">
=======
        
        {/* OCUPACIÓN DE ESTUDIANTES */}
        <div className={`lg:col-span-2 border rounded-2xl p-5 shadow-xs flex flex-col justify-between ${t.card}`}>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
              <FileSpreadsheet size={14} className={t.accentText} />
              <span>Ocupación de Estudiantes por Curso</span>
            </h3>
            <div className="space-y-5">
              {cursosData.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">{c.titulo}</span>
                    <span className={c.textClase || t.textMuted}>{c.info}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                    <div className={`${c.clase} h-full rounded-full transition-all duration-500`} style={{ width: c.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`mt-6 pt-4 border-t flex justify-end ${t.divider}`}>
>>>>>>> Stashed changes
            <button onClick={() => setActiveSection('cursos')} className={`text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${t.accentText}`}>
              <span>Gestionar Mis Cursos</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

<<<<<<< Updated upstream
        <div className="space-y-4">
=======
        {/* ACCIONES RÁPIDAS Y BITÁCORA */}
        <div className="space-y-4">
          
          {/* ACCESOS RÁPIDOS */}
>>>>>>> Stashed changes
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <PlusCircle size={14} className={t.accentText} />
              <span>Accesos Rápidos</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
<<<<<<< Updated upstream
              <button onClick={() => setActiveSection('notas')} className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}>
                <span>Ingresar Calificaciones</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
              <button onClick={() => setActiveSection('estudiantes')} className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}>
                <span>Ver Estudiantes</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
            </div>
          </div>

=======
              {([
                { label: 'Ingresar Calificaciones', sec: 'calificaciones' },
                { label: 'Tomar Asistencia Hoy', sec: 'asistencia' }
              ] as const).map((btn, i) => (
                <button key={i} onClick={() => setActiveSection(btn.sec)} className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}>
                  <span>{btn.label}</span>
                  <ArrowUpRight size={13} className="opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* BITÁCORA DE ACTIVIDAD */}
>>>>>>> Stashed changes
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <Clock size={14} className={t.accentText} />
              <span>Actividad en tus Aulas</span>
            </h3>
            <div className="space-y-3">
<<<<<<< Updated upstream
              {asignaciones.length > 0 ? (
                asignaciones.slice(0, 3).map((a) => (
                  <div key={a.id_asignacion} className={`p-2.5 rounded-xl border text-[11px] ${t.bgMiniCard}`}>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200">
                      <span className="truncate max-w-[140px] text-blue-600 dark:text-blue-400">{a.Cursos?.nombre}</span>
                    </div>
                    <p className={`mt-0.5 ${t.textMuted} truncate`}>Sección {a.seccion} — {a.cupo_disponible} cupos disponibles</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">Sin actividad reciente.</p>
              )}
=======
              {[
                { ctx: 'Estructuras de Datos', desc: '3 estudiantes nuevos se inscribieron a la Sección B', h: 'Hace 15 min' },
                { ctx: 'Programación I', desc: 'Asistencia del día de hoy guardada correctamente', h: 'Hace 1 hora' },
                { ctx: 'Control Académico', desc: 'Se habilitó el portal para la carga del 2do Parcial', h: 'Hace 4 horas' },
              ].map((act, i) => (
                <div key={i} className={`p-3 rounded-xl border text-[11px] transition-colors ${t.bgMiniCard}`}>
                  <div className="flex justify-between items-center font-bold">
                    <span className={`truncate max-w-[130px] ${isDark ? 'text-blue-400' : isCoquette ? 'text-[#f472b6]' : 'text-blue-600'}`}>{act.ctx}</span>
                    <span className={`text-[9px] font-medium ${t.textMuted}`}>{act.h}</span>
                  </div>
                  <p className={`mt-0.5 ${t.textMuted} truncate`}>{act.desc}</p>
                </div>
              ))}
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
