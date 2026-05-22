import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Calendar, Clock, MapPin, Users, Plus, Search, Trash2, X, Filter, CheckCircle, AlertTriangle, Edit2 } from 'lucide-react';

interface Asignacion {
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

export const Asignaciones: React.FC = () => {
  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  const [seccionFilter, setSeccionFilter] = useState<string>('TODAS');

  // Estados para Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsignacion, setEditingAsignacion] = useState<Asignacion | null>(null);

  // Estados del Formulario
  const [carreraNombre, setCarreraNombre] = useState('Ingeniería en Sistemas');
  const [cursoCodigo, setCursoCodigo] = useState('');
  const [cursoNombre, setCursoNombre] = useState('');
  const [docenteNombre, setDocenteNombre] = useState('');
  const [seccion, setSeccion] = useState<'A' | 'B' | 'C'>('A');
  const [dias, setDias] = useState('Lunes y Miércoles');
  const [horario, setHorario] = useState('18:15 - 19:45');
  const [aula, setAula] = useState('Salón 302');
  const [cupoMaximo, setCupoMaximo] = useState(45);

  // Datos de Producción Simulados
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([
    {
      id: 'as-1',
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

  // Abrir formulario limpio
  const handleNuevaAsignacion = () => {
    setEditingAsignacion(null);
    setCursoCodigo('');
    setCursoNombre('');
    setDocenteNombre('');
    setSeccion('A');
    setDias('Lunes y Miércoles');
    setHorario('18:15 - 19:45');
    setAula('Salón 302');
    setCupoMaximo(45);
    setIsModalOpen(true);
  };

  // Abrir formulario en modo edición
  const handleEditarAsignacion = (asig: Asignacion) => {
    setEditingAsignacion(asig);
    setCarreraNombre(asig.carreraNombre);
    setCursoCodigo(asig.cursoCodigo);
    setCursoNombre(asig.cursoNombre);
    setDocenteNombre(asig.docenteNombre);
    setSeccion(asig.seccion);
    setDias(asig.dias);
    setHorario(asig.horario);
    setAula(asig.aula);
    setCupoMaximo(asig.cupoMaximo);
    setIsModalOpen(true);
  };

  // Enviar el formulario (Crear / Editar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAsignacion) {
      setAsignaciones(asignaciones.map(a => a.id === editingAsignacion.id ? {
        ...a,
        carreraNombre,
        cursoCodigo,
        cursoNombre,
        docenteNombre,
        seccion,
        dias,
        horario,
        aula,
        cupoMaximo
      } : a));
    } else {
      const nueva: Asignacion = {
        id: `as-${Date.now()}`,
        carreraNombre,
        cursoCodigo,
        cursoNombre,
        docenteNombre,
        seccion,
        dias,
        horario,
        aula,
        cupoMaximo,
        cupoInscritos: 0 
      };
      setAsignaciones([...asignaciones, nueva]);
    }
    setIsModalOpen(false);
  };

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación? Se perderán los horarios del curso asignados a este docente.')) {
      setAsignaciones(asignaciones.filter(a => a.id !== id));
    }
  };

  // Filtrado lógico de la tabla
  const asignacionesFiltradas = asignaciones.filter(a => {
    const matchesSearch = a.cursoNombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.docenteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.cursoCodigo.includes(searchQuery);
    const matchesSeccion = seccionFilter === 'TODAS' || a.seccion === seccionFilter;
    return matchesSearch && matchesSeccion;
  });

  // Métricas para los widgets superiores
  const totalSecciones = asignaciones.length;
  const seccionesLlenas = asignaciones.filter(a => a.cupoInscritos >= a.cupoMaximo).length;

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* WIDGETS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Activas</p>
            <h4 className="text-xl font-bold text-slate-800">{totalSecciones}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Secciones Llenas</p>
            <h4 className="text-xl font-bold text-slate-800">{seccionesLlenas}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Clock size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Carga de Docentes</p>
            <h4 className="text-xl font-bold text-slate-800">
              {new Set(asignaciones.map(a => a.docenteNombre)).size} Profesores
            </h4>
          </div>
        </div>
      </div>

      {/* FILTROS Y BOTONES PRINCIPALES */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            {/* Buscador general */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder="Buscar por curso, código o docente..."
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

          <button 
            onClick={handleNuevaAsignacion}
            className={`flex items-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
          >
            <Plus size={14} />
            <span>Nueva Asignación</span>
          </button>
        </div>

        {/* TABLA DE ASIGNACIONES */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                <th className="py-3.5 px-6">Código / Curso</th>
                <th className="py-3.5 px-6">Carrera</th>
                <th className="py-3.5 px-6 text-center">Sec.</th>
                <th className="py-3.5 px-6">Catedrático Asignado</th>
                <th className="py-3.5 px-6">Horario y Aula</th>
                <th className="py-3.5 px-6">Cupo / Progreso</th>
                <th className="py-3.5 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {asignacionesFiltradas.length > 0 ? (
                asignacionesFiltradas.map((a) => {
                  const porcCupo = (a.cupoInscritos / a.cupoMaximo) * 100;
                  const estaLleno = a.cupoInscritos >= a.cupoMaximo;

                  return (
                    <tr key={a.id} className={`transition-colors ${styles.tableRowHover}`}>
                      {/* Código y Nombre de Curso */}
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-blue-600 text-[11px]">{a.cursoCodigo}</div>
                        <div className="font-semibold text-slate-800 mt-0.5">{a.cursoNombre}</div>
                      </td>
                      
                      {/* Carrera */}
                      <td className="py-4 px-6 max-w-45 truncate text-gray-500 font-medium">
                        {a.carreraNombre}
                      </td>

                      {/* Sección */}
                      <td className="py-4 px-6 text-center">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">
                          {a.seccion}
                        </span>
                      </td>

                      {/* Docente */}
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {a.docenteNombre || <span className="text-red-400 italic">Por asignar</span>}
                      </td>

                      {/* Horario y Salón */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center text-gray-600 text-[11px]">
                          <Clock size={12} className="mr-1 text-gray-400" />
                          <span>{a.dias} ({a.horario})</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-[11px]">
                          <MapPin size={12} className="mr-1 text-gray-400" />
                          <span>{a.aula}</span>
                        </div>
                      </td>

                      {/* Progreso del Cupo */}
                      <td className="py-4 px-6 w-44">
                        <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                          <span className={estaLleno ? "text-amber-600" : "text-slate-600"}>
                            {a.cupoInscritos} / {a.cupoMaximo} Alumnos
                          </span>
                          {estaLleno ? (
                            <span className="text-amber-600 flex items-center gap-0.5"><AlertTriangle size={10} />Lleno</span>
                          ) : (
                            <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} />Disponible</span>
                          )}
                        </div>
                        {/* Barra de Progreso Tailwind */}
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${estaLleno ? 'bg-amber-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min(porcCupo, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleEditarAsignacion(a)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleEliminar(a.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No se encontraron asignaciones activas para esta búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREAR / EDITAR ASIGNACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-lg p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left animate-in fade-in zoom-in-95 duration-150`}>
            
            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">
                {editingAsignacion ? 'Modificar Planificación de Aula' : 'Crear Nueva Sección / Oferta Escolar'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              {/* Selección de Oferta Global */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Carrera Académica</label>
                <select value={carreraNombre} onChange={(e) => setCarreraNombre(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400">
                  <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
                  <option value="Licenciatura en Ciencias Jurídicas y Sociales">Licenciatura en Ciencias Jurídicas y Sociales</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Código Curso</label>
                  <input type="text" required value={cursoCodigo} onChange={(e) => setCursoCodigo(e.target.value)} placeholder="Ej. 090001" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700 outline-none focus:border-slate-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo del Curso</label>
                  <input type="text" required value={cursoNombre} onChange={(e) => setCursoNombre(e.target.value)} placeholder="Ej. Programación I" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400" />
                </div>
              </div>

              {/* Docente y Sección */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Docente / Catedrático</label>
                  <input type="text" required value={docenteNombre} onChange={(e) => setDocenteNombre(e.target.value)} placeholder="Ej. Ing. Roberto Sánchez" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sección</label>
                  <select value={seccion} onChange={(e) => setSeccion(e.target.value as 'A' | 'B' | 'C')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none cursor-pointer focus:border-slate-400 font-bold">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              {/* Días y Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Días de Impartición</label>
                  <input type="text" required value={dias} onChange={(e) => setDias(e.target.value)} placeholder="Ej. Lunes y Miércoles" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Horario (Rango)</label>
                  <input type="text" required value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="Ej. 18:15 - 19:45" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400" />
                </div>
              </div>

              {/* Aula y Capacidad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Aula / Salón / Ubicación</label>
                  <input type="text" required value={aula} onChange={(e) => setAula(e.target.value)} placeholder="Ej. Salón 302 o Virtual" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cupo Máximo (Alumnos)</label>
                  <input type="number" min={10} max={100} required value={cupoMaximo} onChange={(e) => setCupoMaximo(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-slate-400 font-bold" />
                </div>
              </div>

              {/* Botoneras */}
              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                {/* BOTÓN DEL FORMULARIO */}
                <button 
                  type="submit" 
                  className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all active:scale-95 shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
                >
                  {editingAsignacion ? 'Aplicar Cambios' : 'Aperturar Horario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};