import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Users, Search, Edit2, Plus, Trash2, X, Mail, CalendarCheck } from 'lucide-react';

interface Estudiante {
  id: string;
  carnet: string;
  nombre: string;
  correo: string;
  carrera: string;
  cursoAsignado: 'Programación I' | 'Estructuras de Datos';
  estado: 'Activo' | 'Inactivo';
  fechaInscripcion: string;
}

export const Estudiantes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Programación I' | 'Estructuras de Datos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  
  // Estados para controlar los Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);

  // Estados del Formulario de Alumnos
  const [formCarnet, setFormCarnet] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formCarrera, setFormCarrera] = useState('');
  const [formCurso, setFormCurso] = useState<'Programación I' | 'Estructuras de Datos'>('Programación I');

  // Datos mock oficiales
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(
    [
      { id: '1', carnet: '0905-21-4032', nombre: 'Madelin Yasmiz Cerón Molina', correo: 'mceron@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Programación I', estado: 'Activo', fechaInscripcion: '02/02/2026' },
      { id: '2', carnet: '0905-22-1982', nombre: 'María de los Ángeles López Fajardo', correo: 'mlopez@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Estructuras de Datos', estado: 'Activo', fechaInscripcion: '18/01/2026' },
      { id: '3', carnet: '0905-22-7711', nombre: 'Dulce María Prado Véliz', correo: 'dprado@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Programación I', estado: 'Activo', fechaInscripcion: '18/02/2026' },
      { id: '4', carnet: '0905-21-8890', nombre: 'Josué Fernando Hichos Cordero', correo: 'jhicho@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Estructuras de Datos', estado: 'Inactivo', fechaInscripcion: '20/11/2025' },
      { id: '5', carnet: '0905-23-1142', nombre: 'Cindy Maytté Ruano Calderón', correo: 'cruano@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Programación I', estado: 'Activo', fechaInscripcion: '05/02/2026' }
    ]
  );

  const desvincularEstudiante = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas retirar a este estudiante de tu listado oficial del curso?')) {
      setEstudiantes(estudiantes.filter(e => e.id !== id));
    }
  };

  const handleNuevoEstudianteClick = () => {
    setEditingEstudiante(null);
    setFormCarnet('');
    setFormNombre('');
    setFormCorreo('');
    setFormCarrera('Ingeniería en Sistemas');
    setFormCurso('Programación I');
    setIsModalOpen(true);
  };

  const handleEditarClick = (estudiante: Estudiante) => {
    setEditingEstudiante(estudiante);
    setFormCarnet(estudiante.carnet);
    setFormNombre(estudiante.nombre);
    setFormCorreo(estudiante.correo);
    setFormCarrera(estudiante.carrera);
    setFormCurso(estudiante.cursoAsignado);
    setIsModalOpen(true);
  };

  const handleGuardarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEstudiante) {
      setEstudiantes(estudiantes.map(est => est.id === editingEstudiante.id ? {
        ...est,
        carnet: formCarnet,
        nombre: formNombre,
        correo: formCorreo,
        carrera: formCarrera,
        cursoAsignado: formCurso
      } : est));
    } else {
      const hoy = new Date();
      const fechaActual = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
      
      const nuevo: Estudiante = {
        id: Date.now().toString(),
        carnet: formCarnet,
        nombre: formNombre,
        correo: formCorreo,
        carrera: formCarrera,
        cursoAsignado: formCurso,
        estado: 'Activo',
        fechaInscripcion: fechaActual
      };
      setEstudiantes([...estudiantes, nuevo]);
    }
    setIsModalOpen(false);
  };

  const handleIrAAsistencia = () => {
    console.log("Cambiando al módulo de asistencia diaria...");
    alert("Redireccionando al panel modular de Asistencia Diaria...");
  };

  const estudiantesFiltrados = estudiantes.filter(e => {
    const matchesTab = activeTab === 'Todos' || e.cursoAsignado === activeTab;
    const matchesSearch = 
      e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.carnet.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* CUADROS SUPERIORES METRICAS Y ASISTENCIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cuadro Total Asignados */}
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Asignados Total</p>
            <h4 className="text-xl font-bold text-slate-800">{estudiantes.length}</h4>
          </div>
        </div>

        {/* Botón de Asistencia Unificado */}
        <button
          onClick={handleIrAAsistencia}
          className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} hover:border-emerald-300 dark:hover:border-emerald-800 flex items-center group transition-all cursor-pointer text-left w-full`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 rounded-xl transition-colors">
              <CalendarCheck size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm tracking-tight group-hover:text-emerald-600 transition-colors">Asistencia</p>
              <p className="text-gray-400 text-[11px] font-medium mt-0.5">Tomar la asistencia diaria del curso</p>
            </div>
          </div>
        </button>
      </div>

      {/* CONTENEDOR DE FILTROS Y TABLA */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${styles.panelMuted}`}>
          
          {/* Pestañas de Cursos */}
          <div className={`flex p-1 rounded-xl space-x-1 self-start ${styles.panelMuted}`}>
            {(['Todos', 'Programación I', 'Estructuras de Datos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === tab ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Buscador de Estudiantes */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder="Buscar por carné, nombre o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full lg:w-80 focus:outline-none transition-all ${styles.input} ${styles.border}`}
              />
            </div>
            <button 
              onClick={handleNuevoEstudianteClick}
              className={`flex items-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary} whitespace-nowrap`}
            >
              <Plus size={14} />
              <span>Matricular Estudiante</span>
            </button>
          </div>
        </div>

        {/* TABLA PRINCIPAL TOTALMENTE CENTRADA */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                <th className="py-3.5 px-6 text-center w-40">Carné UMG</th>
                <th className="py-3.5 px-6 text-center">Estudiante</th>
                <th className="py-3.5 px-6 text-center">Correo Institucional</th>
                <th className="py-3.5 px-6 text-center">Curso Matriculado</th>
                <th className="py-3.5 px-6 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700 text-center">
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((e) => (
                  <tr key={e.id} className={`transition-colors ${styles.tableRowHover}`}>
                    
                    {/* Carné */}
                    <td className="py-4 px-6 text-center font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                      {e.carnet}
                    </td>

                    {/* Nombre corregido con color legible */}
                    <td className="py-4 px-6 text-center text-gray-500 dark:text-gray-400 font-medium">
                      {e.nombre}
                    </td>

                    {/* Correo Columna Propia */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 font-medium">
                        <Mail size={12} className="text-gray-400" />
                        <span>{e.correo}</span>
                      </div>
                    </td>

                    {/* Curso Matriculado */}
                    <td className="py-4 px-6 text-center font-medium text-gray-500 dark:text-gray-400">
                      {e.cursoAsignado}
                    </td>

                    {/* Acciones Simplificadas */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEditarClick(e)}
                          title="Editar Ficha Estudiante" 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button 
                          onClick={() => desvincularEstudiante(e.id)}
                          title="Dar de baja de la sección" 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                    No se encontraron alumnos matriculados bajo este criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO DIALOG: MATRICULAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} animate-in fade-in zoom-in-95 duration-150`}>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingEstudiante ? 'Actualizar Ficha de Matrícula' : 'Matricular Alumno en Sección'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGuardarSubmit} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Carné Universitario</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. 0905-22-XXXX"
                  value={formCarnet}
                  onChange={(e) => setFormCarnet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo del Alumno</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Carlos Estuardo Mendoza"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico Institucional</label>
                <input 
                  type="email" 
                  required
                  placeholder="usuario@miumg.edu.gt"
                  value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Carrera</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Ingeniería en Sistemas"
                  value={formCarrera}
                  onChange={(e) => setFormCarrera(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Asignar a Curso Impartido</label>
                <select 
                  value={formCurso}
                  onChange={(e) => setFormCurso(e.target.value as 'Programación I' | 'Estructuras de Datos')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-slate-400 text-gray-700 cursor-pointer"
                >
                  <option value="Programación I">Programación I</option>
                  <option value="Estructuras de Datos">Estructuras de Datos</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
                >
                  {editingEstudiante ? 'Guardar Ficha' : 'Matricular Alumno'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};