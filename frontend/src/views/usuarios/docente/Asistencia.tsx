// IMPORTS
import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { ArrowLeft, Calendar, Search, CheckSquare, Save } from 'lucide-react';

// TIPOS E INTERFACES
interface EstudianteAsistencia {
  id: string;
  carnet: string;
  nombre: string;
  correo: string;
  estado: 'presente' | 'ausente' | 'tarde' | null;
}

interface AsistenciaProps {
  setActiveSection: (section: 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config' | 'asistencia' | 'calificaciones') => void;
}

// COMPONENTE PRINCIPAL
export const Asistencia: React.FC<AsistenciaProps> = ({ setActiveSection }) => {
  const { theme } = useAuth();
  const globalStyles = getThemeStyles(theme);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [estudiantes, setEstudiantes] = useState<EstudianteAsistencia[]>([
    { id: '1', carnet: '2024-001', nombre: 'Ana García', correo: 'agarciap@miumg.edu.gt', estado: null },
    { id: '2', carnet: '2024-042', nombre: 'Carlos Ruiz', correo: 'cruizs@miumg.edu.gt', estado: null },
    { id: '3', carnet: '2024-115', nombre: 'Elena Beltrán', correo: 'ebeltranm@miumg.edu.gt', estado: null },
    { id: '4', carnet: '2024-089', nombre: 'David Jiménez', correo: 'djimenezf@miumg.edu.gt', estado: null },
    { id: '5', carnet: '2024-210', nombre: 'Sofía Morales', correo: 'smoralesl@miumg.edu.gt', estado: null },
    { id: '6', carnet: '2024-315', nombre: 'Miguel Torres', correo: 'mtorresc@miumg.edu.gt', estado: null },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  });

  // LÓGICA Y MANEJO DE ESTADOS
  const obtenerFechaFormateada = () => {
    if (!fechaSeleccionada) return '';
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    return new Date(year, month - 1, day)
      .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
      .toUpperCase();
  };

  const abrirCalendario = () => {
    const input = dateInputRef.current;
    if (input) {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.click();
      }
    }
  };

  const cambiarEstado = (id: string, nuevoEstado: 'presente' | 'ausente' | 'tarde') => {
    setEstudiantes(prev => prev.map(est => est.id === id ? { ...est, estado: est.estado === nuevoEstado ? null : nuevoEstado } : est));
  };

  const conmutarTodosPresentes = () => {
    const todosPresentes = estudiantes.every(est => est.estado === 'presente');
    setEstudiantes(prev => prev.map(est => ({ ...est, estado: todosPresentes ? null : 'presente' })));
  };

  // CONFIGURACIÓN DE ESTILOS DINÁMICOS
  const getBotonEstilos = (tipo: 'presente' | 'ausente' | 'tarde', activo: boolean) => {
    const t = theme === 'oscuro' ? 'oscuro' : theme === 'coquette' ? 'coquette' : 'claro';
    if (!activo) {
      return {
        oscuro: 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50',
        coquette: 'bg-[#fff5f6] text-[#b3888d] border-[#fbcdd4] hover:bg-[#fbcdd4]/20',
        claro: 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
      }[t];
    }
    return {
      presente: { oscuro: 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold', coquette: 'bg-[#e2f0d9] text-[#385723] border-[#a9d18e] font-bold', claro: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' },
      ausente: { oscuro: 'bg-rose-500/20 text-rose-400 border-rose-500 font-bold', coquette: 'bg-[#fce4d6] text-[#c65911] border-[#f4b183] font-bold', claro: 'bg-rose-50 text-rose-700 border-rose-300 font-bold' },
      tarde: { oscuro: 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold', coquette: 'bg-[#fff2cc] text-[#7f6000] border-[#ffd966] font-bold', claro: 'bg-amber-50 text-amber-700 border-amber-300 font-bold' }
    }[tipo][t];
  };

  const estudiantesFiltrados = estudiantes.filter(est =>
    est.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    est.carnet.includes(busqueda) ||
    est.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const isDark = theme === 'oscuro';
  const isCoquette = theme === 'coquette';

  const u = {
    titleHex: isDark ? '#f8fafc' : isCoquette ? '#6d4c51' : '#0f172a',
    headerBg: isDark ? 'bg-slate-800 text-blue-400' : isCoquette ? 'bg-[#fff5f6] text-[#f472b6]' : 'bg-slate-100 text-[#1a365d]',
    card: isDark ? 'bg-slate-800 border-slate-700 text-white' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51]' : 'bg-white border-gray-100 text-slate-800 shadow-xs',
    searchBox: isDark ? 'bg-slate-800 border-slate-700 text-white' : isCoquette ? 'bg-white border-[#fbcdd4]' : 'bg-white border-gray-100 shadow-xs',
    input: isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : isCoquette ? 'bg-[#fff5f6] border-transparent text-[#6d4c51] focus:border-[#fbcdd4]' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300',
    tablaHeader: isDark ? 'border-slate-700 bg-slate-900/50 text-slate-400' : isCoquette ? 'bg-[#fff5f6] border-[#fbcdd4] text-[#6d4c51]' : 'bg-gray-50/70 border-gray-100 text-slate-500',
    tablaFila: isDark ? 'hover:bg-slate-900/40 border-slate-700' : isCoquette ? 'hover:bg-[#fff5f6]/50 border-[#fbcdd4]' : 'hover:bg-gray-50/50 border-gray-100',
    divideColor: isDark ? 'divide-slate-700' : isCoquette ? 'divide-[#fbcdd4]' : 'divide-gray-100',
    textEstudiante: isDark ? 'text-slate-300' : isCoquette ? 'text-[#6d4c51]' : 'text-slate-600',
    btnPrimario: isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' : isCoquette ? 'bg-[#f472b6] hover:bg-[#ec4899] text-white' : 'bg-[#1a365d] hover:bg-[#2a4d7c] text-white shadow-xs',
    btnVolver: isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : isCoquette ? 'bg-white border-[#fbcdd4] text-[#6d4c51] hover:bg-[#fff5f6]' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 shadow-2xs',
  };

  const estanTodosPresentes = estudiantes.every(est => est.estado === 'presente');

  // RENDERIZADO DE LA INTERFAZ
  return (
    <div className="w-full h-full flex flex-col space-y-6 text-left animate-fade-in">
      
      {/* VISTA CABECERA Y ACCIONES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <button onClick={() => setActiveSection('tablero')} className={`flex items-center justify-center w-8 h-8 rounded-full transition-all border cursor-pointer shrink-0 ${u.btnVolver}`}>
            <ArrowLeft size={14} />
          </button>
          <div className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${u.headerBg}`}>
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold transition-colors" style={{ color: u.titleHex }}>Control Diario de Asistencia</h2>
            <p className={`text-xs transition-colors ${globalStyles.mutedText}`}>Registra y modifica la permanencia de los alumnos en el aula correspondiente hoy.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
          <button onClick={abrirCalendario} className={`flex items-center justify-center px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${isDark ? 'bg-slate-900 border-slate-800 text-blue-400 hover:bg-slate-800' : isCoquette ? 'text-[#f472b6] bg-[#fff5f6] border-[#fbcdd4] hover:bg-[#fbcdd4]/20' : 'bg-slate-50 border-gray-200 text-blue-600 hover:bg-gray-100'}`}>
            <span>{obtenerFechaFormateada()}</span>
            <input ref={dateInputRef} type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="absolute pointer-events-none opacity-0 w-0 h-0" style={{ colorScheme: isDark ? 'dark' : 'light' }} />
          </button>

          <button onClick={conmutarTodosPresentes} className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${estanTodosPresentes ? isCoquette ? 'bg-[#e2f0d9] border-[#a9d18e] text-[#385723]' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : isDark ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <CheckSquare size={14} />
            <span>{estanTodosPresentes ? 'Limpiar' : 'Marcar Todos'}</span>
          </button>

          <button onClick={() => alert(`Asistencia guardada para el: ${fechaSeleccionada}`)} className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${u.btnPrimario}`}>
            <Save size={14} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* VISTA BARRA DE BÚSQUEDA */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${u.searchBox}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Buscar estudiante por nombre, carnet o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${u.input}`} />
        </div>
        <div className={`text-[11px] font-medium px-2 transition-colors ${globalStyles.mutedText}`}>
          Filtrados: <span className={`font-bold ${isDark ? 'text-blue-400' : isCoquette ? 'text-[#f472b6]' : 'text-blue-600'}`}>{estudiantesFiltrados.length}</span> alumnos
        </div>
      </div>

      {/* VISTA TABLA DE ESTUDIANTES */}
      <div className={`border rounded-2xl overflow-hidden transition-colors ${u.card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider transition-colors ${u.tablaHeader}`}>
                <th className="py-3.5 px-6">Carnet</th>
                <th className="py-3.5 px-6">Nombre Completo</th>
                <th className="py-3.5 px-6">Correo Institucional</th>
                <th className="py-3.5 px-6 text-center">Registro de Asistencia</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs transition-colors ${u.divideColor}`}>
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((est) => (
                  <tr key={est.id} className={`transition-colors border-b last:border-0 ${u.tablaFila}`}>
                    <td className={`py-4 px-6 font-mono font-bold ${globalStyles.mutedText}`}>{est.carnet}</td>
                    <td className={`py-4 px-6 font-medium ${u.textEstudiante}`}>{est.nombre}</td>
                    <td className={`py-4 px-6 font-medium break-all ${globalStyles.mutedText}`}>{est.correo}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <button onClick={() => cambiarEstado(est.id, 'presente')} className={`px-3 sm:px-4 py-1 text-[11px] rounded-lg border transition-all cursor-pointer ${getBotonEstilos('presente', est.estado === 'presente')}`}>Presente</button>
                        <button onClick={() => cambiarEstado(est.id, 'tarde')} className={`px-3 sm:px-4 py-1 text-[11px] rounded-lg border transition-all cursor-pointer ${getBotonEstilos('tarde', est.estado === 'tarde')}`}>Tarde</button>
                        <button onClick={() => cambiarEstado(est.id, 'ausente')} className={`px-3 sm:px-4 py-1 text-[11px] rounded-lg border transition-all cursor-pointer ${getBotonEstilos('ausente', est.estado === 'ausente')}`}>Ausente</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={`py-8 text-center font-medium transition-colors ${globalStyles.mutedText}`}>No se encontraron alumnos registrados bajo ese criterio.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};