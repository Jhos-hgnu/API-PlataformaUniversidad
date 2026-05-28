import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
<<<<<<< Updated upstream
import { getThemeStyles } from '../../../utils/themeStyles';
import { Users, Search, Mail, CalendarCheck } from 'lucide-react';
import { docentesService } from '../../../services/docentes.service';
import { asignacionesService, type Asignacion } from '../../../services/asignaciones.service';
import { inscripcionesService, type Inscripcion } from '../../../services/inscripciones.service';

interface EstudianteUI {
  id: number;
  carnet: string;
  nombre: string;
  correo: string;
  curso: string;
  seccion: string;
  estado: string;
}

export const Estudiantes: React.FC = () => {
  const [activeCursoFilter, setActiveCursoFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    docentesService.getAll().then(dRes => {
      const docente = dRes.data.find(d => d.id_usuario === user.id);
      if (!docente) { setLoading(false); return; }
      asignacionesService.getByDocente(docente.id_docente).then(aRes => {
        setAsignaciones(aRes.data);
        const ids = aRes.data.map(a => a.id_asignacion);
        inscripcionesService.getAll().then(iRes => {
          setInscripciones(iRes.data.filter(i => ids.includes(i.id_asignacion)));
        }).catch(() => {}).finally(() => setLoading(false));
      }).catch(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, []);

  const { user } = useAuth();

  const cursosOptions = ['Todos', ...new Set(asignaciones.map(a => a.Cursos?.nombre ?? '').filter(Boolean))];

  const inscripcionesFiltradas = inscripciones.filter(i => {
    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? '';
    const matchCurso = activeCursoFilter === 'Todos' || cursoNombre === activeCursoFilter;

    const est = i.Estudiantes;
    const nombre = est?.Usuarios ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}` : '';
    const correo = est?.Usuarios?.correo ?? '';
    const carnet = est?.carnet ?? '';
    const q = searchQuery.toLowerCase();
    const matchSearch = nombre.toLowerCase().includes(q) || correo.toLowerCase().includes(q) || carnet.includes(q);

    return matchCurso && matchSearch;
  });

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Inscripciones en tus Cursos</p>
            <h4 className="text-xl font-bold text-slate-800">{loading ? '...' : inscripciones.length}</h4>
          </div>
        </div>

        <button
          onClick={() => alert('Redireccionando al panel modular de Asistencia Diaria...')}
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
=======
import { Users, Search, Edit2, Plus, Trash2, X, CalendarCheck, Filter } from 'lucide-react';

// CONFIGURACIÓN DE ESTILOS POR TEMA
const CONFIG_ESTILOS: Record<string, Record<string, string>> = {
  oscuro: {
    title: 'text-slate-200', desc: 'text-slate-400', card: 'bg-slate-800 border-slate-700 text-slate-100',
    textLabel: 'text-slate-400', btn: 'bg-blue-600 hover:bg-blue-700 text-white', headerBg: 'bg-slate-800 text-slate-200',
    metrics: 'bg-slate-950 border-slate-800 text-white', icon: 'bg-slate-900 text-blue-400', icon2: 'bg-slate-900 text-emerald-400'
  },
  coquette: {
    title: 'text-[#6d4c51] font-bold', desc: 'text-[#b3888d]', card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
    textLabel: 'text-[#b3888d]', btn: 'bg-[#f472b6] hover:bg-[#ec4899] text-white shadow-xs', headerBg: 'bg-[#fff5f6] text-[#f472b6]',
    metrics: 'bg-white border-gray-100 shadow-xs', icon: 'bg-blue-50 text-blue-600', icon2: 'bg-emerald-50 text-emerald-600'
  },
  claro: {
    title: 'text-gray-700 font-bold', desc: 'text-gray-400', card: 'bg-white border-gray-100 text-slate-800',
    textLabel: 'text-gray-400', btn: 'bg-[#1a365d] hover:bg-[#152c4d] text-white', headerBg: 'bg-slate-100 text-slate-700',
    metrics: 'bg-white border-gray-100 shadow-xs', icon: 'bg-blue-50 text-blue-600', icon2: 'bg-emerald-50 text-emerald-600'
  }
};

// TIPADOS E INTERFACES
interface Estudiante {
  id: string; carnet: string; nombre: string; correo: string; carrera: string;
  cursoAsignado: 'Programación I' | 'Estructuras de Datos'; estado: 'Activo' | 'Inactivo'; fechaInscripcion: string;
}

type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config' | 'asistencia' | 'calificaciones';

interface FormState {
  carnet: string; nombre: string; correo: string; carrera: string;
  cursoAsignado: 'Programación I' | 'Estructuras de Datos';
}

const initialForm: FormState = { carnet: '', nombre: '', correo: '', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Programación I' };
const API_URL = 'http://localhost:5000/api/estudiantes';

// COMPONENTE PRINCIPAL
export const Estudiantes: React.FC<{ setActiveSection: (section: Section) => void }> = ({ setActiveSection }) => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Programación I' | 'Estructuras de Datos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const { theme } = useAuth();
  const c = CONFIG_ESTILOS[CONFIG_ESTILOS[theme] ? theme : 'claro'];
  const isDark = theme === 'oscuro';
  const titleColor = isDark ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a';

  // EFECTOS
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) setEstudiantes(await response.json());
      } catch {
        setEstudiantes([{ id: '1', carnet: '0905-21-4032', nombre: 'Madelin Yasmiz Cerón Molina', correo: 'mceron@miumg.edu.gt', carrera: 'Ingeniería en Sistemas', cursoAsignado: 'Programación I', estado: 'Activo', fechaInscripcion: '02/02/2026' }]);
      } finally { setLoading(false); }
    })();
  }, []);

  // OPERACIONES CRUD
  const desvincularEstudiante = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas retirar a este estudiante?')) return;
    try { await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    setEstudiantes(prev => prev.filter(e => e.id !== id));
  };

  const handleGuardarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEstudiante) {
      try {
        const res = await fetch(`${API_URL}/${editingEstudiante.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const data = res.ok ? await res.json() : { ...editingEstudiante, ...form };
        setEstudiantes(prev => prev.map(est => est.id === editingEstudiante.id ? data : est));
      } catch { setEstudiantes(prev => prev.map(est => est.id === editingEstudiante.id ? { ...est, ...form } : est)); }
    } else {
      const nuevo = { ...form, estado: 'Activo' as const, fechaInscripcion: new Date().toLocaleDateString('es-GT') };
      try {
        const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevo) });
        if (res.ok) {
          const creado = await res.json();
          setEstudiantes(prev => [...prev, creado]);
        } else {
          setEstudiantes(prev => [...prev, { id: Date.now().toString(), ...nuevo }]);
        }
      } catch { setEstudiantes(prev => [...prev, { id: Date.now().toString(), ...nuevo }]); }
    }
    setIsModalOpen(false);
  };

  // CONTROLADORES AUXILIARES
  const abrirModal = (estudiante: Estudiante | null = null) => {
    setEditingEstudiante(estudiante);
    setForm(estudiante ? { carnet: estudiante.carnet, nombre: estudiante.nombre, correo: estudiante.correo, carrera: estudiante.carrera, cursoAsignado: estudiante.cursoAsignado } : initialForm);
    setIsModalOpen(true);
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const estudiantesFiltrados = estudiantes.filter(e => 
    (activeTab === 'Todos' || e.cursoAsignado === activeTab) &&
    (e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || e.correo.toLowerCase().includes(searchQuery.toLowerCase()) || e.carnet.includes(searchQuery))
  );

  const inputsFormulario: { label: string; name: keyof Omit<FormState, 'cursoAsignado'>; type: string; placeholder?: string }[] = [
    { label: 'Carné Universitario', name: 'carnet', type: 'text', placeholder: 'Ej. 0905-22-XXXX' },
    { label: 'Nombre Completo', name: 'nombre', type: 'text' },
    { label: 'Correo Institucional', name: 'correo', type: 'email', placeholder: 'usuario@miumg.edu.gt' },
    { label: 'Carrera', name: 'carrera', type: 'text' }
  ];

  return (
    <div className="space-y-6 w-full animate-fade-in text-left">
      
      {/* ENCABEZADO */}
      <div className="flex items-center space-x-3 text-left">
        <div className={`p-3 rounded-xl transition-all duration-300 ${c.headerBg}`}><Users size={22} /></div>
        <div>
          <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>Control y Registro de Estudiantes</h2>
          <p className={`text-xs transition-colors ${c.desc}`}>Administra la nómina oficial, actualiza fichas de inscripción y gestiona la vinculación de alumnos.</p>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-2xl border flex items-center space-x-4 ${c.metrics}`}>
          <div className={`p-3 rounded-xl ${c.icon}`}><Users size={18} /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Asignados Total</span>
            <p className="text-xl font-black mt-0.5">{estudiantes.length} Alumnos</p>
          </div>
        </div>
        <button onClick={() => setActiveSection('asistencia')} className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-4 ${c.metrics} ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-gray-50/50'}`}>
          <div className={`p-3 rounded-xl ${c.icon2}`}><CalendarCheck size={18} /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Tomar la asistencia de la fecha vigente</span>
            <p className="text-xl font-black mt-0.5">Asistencia Diaria</p>
>>>>>>> Stashed changes
          </div>
        </button>
      </div>

<<<<<<< Updated upstream
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${styles.panelMuted}`}>

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {cursosOptions.map((curso) => (
              <button
                key={curso}
                onClick={() => setActiveCursoFilter(curso)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCursoFilter === curso ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                {curso}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar por carné, nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">Cargando estudiantes...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  <th className="py-3.5 px-6 text-center w-40">Carné UMG</th>
                  <th className="py-3.5 px-6 text-center">Estudiante</th>
                  <th className="py-3.5 px-6 text-center">Correo Institucional</th>
                  <th className="py-3.5 px-6 text-center">Curso</th>
                  <th className="py-3.5 px-6 text-center">Sec.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700 text-center">
                {inscripcionesFiltradas.length > 0 ? (
                  inscripcionesFiltradas.map((i) => {
                    const est = i.Estudiantes;
                    const nombre = est?.Usuarios ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}` : '—';
                    const correo = est?.Usuarios?.correo ?? '—';
                    const carnet = est?.carnet ?? '—';
                    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? '—';
                    const seccion = i.Asignaciones?.seccion ?? '—';

                    return (
                      <tr key={i.id_inscripcion} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6 text-center font-mono font-bold text-sm text-blue-600">{carnet}</td>
                        <td className="py-4 px-6 text-center text-gray-500 font-medium">{nombre}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center space-x-1.5 text-gray-500 font-medium">
                            <Mail size={12} className="text-gray-400" />
                            <span>{correo}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-gray-500">{cursoNombre}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">{seccion}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                      No se encontraron alumnos inscritos bajo este criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
=======
      {/* BARRA DE FILTROS */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-xs'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Buscar por carné o nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none ${isDark ? 'bg-slate-900 border-transparent text-slate-200 focus:border-slate-700' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-300'}`} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative w-full sm:w-56">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
            <select value={activeTab} onChange={(e) => setActiveTab(e.target.value as 'Todos' | 'Programación I' | 'Estructuras de Datos')} className={`w-full pl-9 pr-10 py-2 border rounded-xl text-xs font-semibold outline-none appearance-none cursor-pointer ${isDark ? 'bg-slate-900 border-transparent text-slate-300' : 'bg-gray-50/70 border-transparent text-gray-600'}`}>
              <option value="Todos">Todos los Cursos</option>
              <option value="Programación I">Programación I</option>
              <option value="Estructuras de Datos">Estructuras de Datos</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[3.5px] border-r-[3.5px] border-t-[4px] border-transparent border-t-gray-500" />
          </div>
          <button onClick={() => abrirModal()} className={`flex items-center justify-center space-x-1.5 h-9 px-4 w-full sm:w-auto text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer shrink-0 ${theme === 'coquette' ? 'bg-[#f472b6]' : 'bg-blue-600'}`}>
            <Plus size={14} /><span>Matricular Estudiante</span>
          </button>
        </div>
      </div>

      {/* TABLA DE ESTUDIANTES */}
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs font-medium text-gray-400 animate-pulse">Conectando con la base de datos...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'bg-gray-50/70 text-[#b3888d]'}`}>
                  <th className="py-3.5 px-6">Carné UMG</th><th className="py-3.5 px-6">Estudiante</th><th className="py-3.5 px-6">Correo</th><th className="py-3.5 px-6 text-center">Curso</th><th className="py-3.5 px-6 text-center w-28">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                {estudiantesFiltrados.length > 0 ? estudiantesFiltrados.map((e) => (
                  <tr key={e.id} className={`transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                    <td className="py-4 px-6 font-mono font-bold text-[13px] text-blue-500">{e.carnet}</td>
                    <td className="py-4 px-6 font-bold text-gray-500 dark:text-gray-400">{e.nombre}</td>
                    <td className="py-4 px-6 font-medium text-gray-400">{e.correo}</td>
                    <td className="py-4 px-6 text-center font-bold text-gray-500 dark:text-gray-400">{e.cursoAsignado}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button onClick={() => abrirModal(e)} className={`p-2 rounded-xl border cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400' : 'bg-white border-gray-100 text-gray-400 hover:text-blue-600 shadow-2xs'}`}><Edit2 size={12} /></button>
                        <button onClick={() => desvincularEstudiante(e.id)} className={`p-2 rounded-xl border cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400' : 'bg-white border-gray-100 text-gray-400 hover:text-red-600 shadow-2xs'}`}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No se encontraron alumnos matriculados.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE MATRÍCULA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 border shadow-2xl ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-sm font-black" style={{ color: titleColor }}>{editingEstudiante ? 'Actualizar Ficha de Matrícula' : 'Matricular Alumno'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleGuardarSubmit} className="mt-4 space-y-4">
              {inputsFormulario.map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input type={f.type} name={f.name} required placeholder={f.placeholder || ''} value={form[f.name]} onChange={changeInput} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`} />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Asignar a Curso</label>
                <select name="cursoAsignado" value={form.cursoAsignado} onChange={changeInput} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none cursor-pointer font-medium ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`}>
                  <option value="Programación I">Programación I</option>
                  <option value="Estructuras de Datos">Estructuras de Datos</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
                <button type="submit" className={`px-5 py-2 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer ${theme === 'coquette' ? 'bg-[#f472b6]' : 'bg-blue-600'}`}>{editingEstudiante ? 'Guardar Cambios' : 'Confirmar Matrícula'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};
