import React from 'react';
import { useAuth } from '../../../context/useAuth';
import { Users, BookOpen, UserCheck, ShieldAlert, ArrowUpRight, PlusCircle, FileSpreadsheet, Clock } from 'lucide-react';
import { getThemeStyles } from '../../../utils/themeStyles'; // Ajusta la ruta si es necesario

type Section = 'tablero' | 'usuarios' | 'carreras' | 'asignaciones' | 'reportes' | 'config';

export const TableroGlobal: React.FC<{ setActiveSection: (section: Section) => void }> = ({ setActiveSection }) => {
  const { theme } = useAuth();

  const globalStyles = getThemeStyles(theme);

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

  const titleColor = theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a';

  const kpis = [
    { id: 1, label: 'Alumnos Matriculados', valor: '1,420', icon: <Users size={20} />, color: 'bg-blue-500/10 text-blue-500' },
    { id: 2, label: 'Cursos Activos', valor: '48', icon: <BookOpen size={20} />, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 3, label: 'Asignaciones Hoy', valor: '189', icon: <UserCheck size={20} />, color: 'bg-amber-500/10 text-amber-500' },
    { id: 4, label: 'Alertas de Auditoría', valor: '2', icon: <ShieldAlert size={20} />, color: 'bg-rose-500/10 text-rose-500' },
  ];

  const actividades = [
    { id: 1, usuario: 'Carlos Mendoza (Admin)', detalle: 'Modificó prerrequisitos de Programación II', hora: 'Hace 10 min' },
    { id: 2, usuario: 'Estudiante #4092', detalle: 'Asignación exitosa a Ingeniería sección A', hora: 'Hace 25 min' },
    { id: 3, usuario: 'Soporte TI', detalle: 'Respaldo general de base de datos exitoso', hora: 'Hace 1 hora' },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-xl font-black tracking-tight"
            style={{ color: theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a' }}
          >
            Vista General del Campus
          </h2>
          <p className={`text-xs ${globalStyles.mutedText}`}>
            Monitoreo operativo y estadísticas en tiempo real del ciclo actual.
          </p>
        </div>
      </div>

      {/* FILA DE RECUADROS ESTADÍSTICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`border rounded-2xl p-5 shadow-xs transition-all ${t.card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Estable</span>
            </div>
            <p className={`text-[11px] font-medium uppercase tracking-wider ${t.textMuted}`}>{kpi.label}</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{kpi.valor}</h3>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE ACCIONES RÁPIDAS Y ACTIVIDAD RECIENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CAPTACIÓN POR FACULTAD */}
        <div className={`lg:col-span-2 border rounded-2xl p-5 shadow-xs ${t.card}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
            <FileSpreadsheet size={14} className={t.accentText} />
            <span>Distribución de Matrícula por Facultad</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Facultad de Ingeniería en Sistemas</span>
                <span>640 Alumnos</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Facultad de Ciencias Jurídicas y Sociales</span>
                <span>490 Alumnos</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Facultad de Administración de Empresas</span>
                <span>290 Alumnos</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100/10 flex justify-end">
            <button 
              onClick={() => setActiveSection('reportes')}
              className={`text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${t.accentText}`}
            >
              <span>Ir a Reportes Detallados</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS Y BITÁCORA */}
        <div className="space-y-4">
          
          {/* ACCIONES DIRECTAS */}
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <PlusCircle size={14} className={t.accentText} />
              <span>Accesos Rápidos</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setActiveSection('usuarios')}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}
              >
                <span>Registrar Nuevo Usuario</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
              <button 
                onClick={() => setActiveSection('carreras')}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${t.actionBtn}`}
              >
                <span>Configurar Nueva Carrera</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
            </div>
          </div>

          {/* ÚLTIMOS LOGS */}
          <div className={`border rounded-2xl p-5 shadow-xs ${t.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
              <Clock size={14} className={t.accentText} />
              <span>Bitácora Reciente</span>
            </h3>
            <div className="space-y-3">
              {actividades.map((act) => (
                <div key={act.id} className={`p-2.5 rounded-xl border text-[11px] ${t.bgMiniCard}`}>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200">
                    <span className="truncate max-w-[120px]">{act.usuario}</span>
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