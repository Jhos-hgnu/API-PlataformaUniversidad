import React from 'react';
import { useAuth } from '../../../context/useAuth';
import { Users, BookOpen, GraduationCap, AlertCircle, ArrowUpRight, PlusCircle, FileSpreadsheet, Clock } from 'lucide-react';
import { getThemeStyles } from '../../../utils/themeStyles'; 

// Secciones que coinciden con las del DocenteDashboard
type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config';

export const TableroDoc: React.FC<{ setActiveSection: (section: Section) => void }> = ({ setActiveSection }) => {
  const { theme, user } = useAuth();

  const globalStyles = getThemeStyles(theme);
  const nombreDocente = user?.nombre || 'Ing. Richard Ortíz';

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

  // KPIs adaptados al control y estado del docente
  const kpis = [
    { id: 1, label: 'Total Estudiantes', valor: '63', icon: <Users size={20} />, color: 'bg-blue-500/10 text-blue-500' },
    { id: 2, label: 'Cursos Asignados', valor: '2', icon: <BookOpen size={20} />, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 3, label: 'Actas por Cerrar', valor: '1', icon: <GraduationCap size={20} />, color: 'bg-amber-500/10 text-amber-500' },
    { id: 4, label: 'Avisos de Coordinación', valor: '0', icon: <AlertCircle size={20} />, color: 'bg-rose-500/10 text-rose-500' },
  ];

  // Bitácora de eventos recientes ocurridos en los cursos del catedrático
  const actividadesCursos = [
    { id: 1, contexto: 'Estructuras de Datos', detalle: '3 estudiantes nuevos se inscribieron a la Sección B', hora: 'Hace 15 min' },
    { id: 2, contexto: 'Programación I', detalle: 'Asistencia del día de hoy guardada correctamente', hora: 'Hace 1 hora' },
    { id: 3, contexto: 'Control Académico', detalle: 'Se habilitó el portal para la carga del 2do Parcial', hora: 'Hace 4 horas' },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2
            className="text-xl font-black tracking-tight"
            style={{ color: theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a' }}
          >
            Panel del Docente
          </h2>
          <p className={`text-xs ${globalStyles.mutedText}`}>
            Bienvenido de nuevo, <span className="font-semibold">{nombreDocente}</span>. Aquí tienes el balance de tus aulas y actas académicas vigentes.
          </p>
        </div>
      </div>

      {/* FILA DE RECUADROS ESTADÍSTICOS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`border rounded-2xl p-5 shadow-xs transition-all text-left ${t.card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Ciclo Activo</span>
            </div>
            <p className={`text-[11px] font-medium uppercase tracking-wider ${t.textMuted}`}>{kpi.label}</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{kpi.valor}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* ESTADO Y CUPO DE CURSOS ASIGNADOS */}
        <div className={`lg:col-span-2 border rounded-2xl p-5 shadow-xs ${t.card}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
            <FileSpreadsheet size={14} className={t.accentText} />
            <span>Ocupación de Estudiantes por Curso</span>
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Programación I — Sección A</span>
                <span className={t.textMuted}>28 / 40 Alumnos (70%)</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Estructuras de Datos — Sección B</span>
                <span className="text-amber-500 font-bold">35 / 35 Alumnos (Lleno)</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100/10 flex justify-end">
            <button 
              onClick={() => setActiveSection('cursos')}
              className={`text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${t.accentText}`}
            >
              <span>Gestionar Mis Cursos</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS Y BITÁCORA DEL DOCENTE */}
        <div className="space-y-4">
          
          {/* ACCIONES DIRECTAS */}
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <PlusCircle size={14} className={t.accentText} />
              <span>Accesos Rápidos</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setActiveSection('calificaciones')}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}
              >
                <span>Ingresar Calificaciones</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
              <button 
                onClick={() => setActiveSection('asistencia')}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}
              >
                <span>Tomar Asistencia Hoy</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
            </div>
          </div>

          {/* ÚLTIMOS LOGS O CAMBIOS EN SUS SECCIONES */}
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <Clock size={14} className={t.accentText} />
              <span>Actividad en tus Aulas</span>
            </h3>
            <div className="space-y-3">
              {actividadesCursos.map((act) => (
                <div key={act.id} className={`p-2.5 rounded-xl border text-[11px] ${t.bgMiniCard}`}>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200">
                    <span className="truncate max-w-[140px] text-blue-600 dark:text-blue-400">{act.contexto}</span>
                    <span className={`text-[9px] font-medium ${t.textMuted}`}>{act.hora}</span>
                  </div>
                  <p className={`mt-0.5 ${t.textMuted} truncate`}>{act.detalle}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};