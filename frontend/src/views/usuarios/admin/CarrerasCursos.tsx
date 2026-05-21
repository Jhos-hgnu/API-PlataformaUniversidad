import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { GraduationCap, BookOpen, Layers, Plus, Search, Edit2, Trash2, X, ChevronDown, ChevronRight, Award, ToggleLeft, ToggleRight } from 'lucide-react';

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  prerrequisito: string; 
}

interface Carrera {
  id: string;
  codigo: string;
  nombre: string;
  facultad: string;
  estado: 'Activa' | 'En Cierre';
  cursos: Curso[];
}

export const CarrerasCursos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCarreraId, setExpandedCarreraId] = useState<string | null>(null);

  // Estados para Modales (Creación y Edición)
  const [isCarreraModalOpen, setIsCarreraModalOpen] = useState(false);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [selectedCarreraId, setSelectedCarreraId] = useState<string | null>(null);

  // Estados de Formulario de Carreras
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const [carreraNombre, setCarreraNombre] = useState('');
  const [carreraCodigo, setCarreraCodigo] = useState('');
  const [carreraFacultad, setCarreraFacultad] = useState('Ingeniería');

  // Estados de Formulario de Cursos
  const [cursoNombre, setCursoNombre] = useState('');
  const [cursoCodigo, setCursoCodigo] = useState('');
  const [cursoCreditos, setCursoCreditos] = useState(4);
  const [cursoSemestre, setCursoSemestre] = useState(1);
  const [cursoPrerrequisito, setCursoPrerrequisito] = useState(''); 

  // Datos Mock Iniciales estables
  const [carreras, setCarreras] = useState<Carrera[]>([
    {
      id: 'c1',
      codigo: '090',
      nombre: 'Ingeniería en Sistemas de Información',
      facultad: 'Ingeniería',
      estado: 'Activa',
      cursos: [
        { id: 'm1', codigo: '090001', nombre: 'Programación I', creditos: 5, semestre: 1, prerrequisito: 'Ninguno' },
        { id: 'm2', codigo: '090002', nombre: 'Cálculo I', creditos: 4, semestre: 1, prerrequisito: 'Ninguno' },
        { id: 'm3', codigo: '090003', nombre: 'Programación II', creditos: 5, semestre: 2, prerrequisito: 'Programación I (090001)' },
      ]
    },
    {
      id: 'c2',
      codigo: '020',
      nombre: 'Licenciatura en Ciencias Jurídicas y Sociales',
      facultad: 'Derecho',
      estado: 'Activa',
      cursos: [
        { id: 'm4', codigo: '020001', nombre: 'Derecho Romano', creditos: 3, semestre: 1, prerrequisito: 'Ninguno' },
        { id: 'm5', codigo: '020002', nombre: 'Derecho Constitucional', creditos: 4, semestre: 2, prerrequisito: 'Derecho Romano' },
      ]
    }
  ]);

  const toggleExpand = (id: string) => {
    setExpandedCarreraId(expandedCarreraId === id ? null : id);
  };

  // Cambiar estado de Carrera (Activa / En Cierre)
  const toggleEstadoCarrera = (id: string) => {
    setCarreras(carreras.map(c => c.id === id ? { ...c, estado: c.estado === 'Activa' ? 'En Cierre' : 'Activa' } : c));
  };

  // Abrir modal para Crear Carrera
  const handleNuevaCarreraClick = () => {
    setEditingCarrera(null);
    setCarreraNombre('');
    setCarreraCodigo('');
    setCarreraFacultad('Ingeniería');
    setIsCarreraModalOpen(true);
  };

  // Abrir modal para Editar Carrera
  const handleEditarCarreraClick = (carrera: Carrera) => {
    setEditingCarrera(carrera);
    setCarreraNombre(carrera.nombre);
    setCarreraCodigo(carrera.codigo);
    setCarreraFacultad(carrera.facultad);
    setIsCarreraModalOpen(true);
  };

  // Procesar Guardado de Carrera (Crear / Editar)
  const handleCarreraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCarrera) {
      setCarreras(carreras.map(c => c.id === editingCarrera.id ? {
        ...c,
        codigo: carreraCodigo,
        nombre: carreraNombre,
        facultad: carreraFacultad
      } : c));
    } else {
      const nueva: Carrera = {
        id: Date.now().toString(),
        codigo: carreraCodigo,
        nombre: carreraNombre,
        facultad: carreraFacultad,
        estado: 'Activa',
        cursos: []
      };
      setCarreras([...carreras, nueva]);
    }
    setIsCarreraModalOpen(false);
  };

  // Abrir modal para Crear Curso
  const handleNuevoCursoClick = (carreraId: string) => {
    setSelectedCarreraId(carreraId);
    setEditingCurso(null);
    setCursoNombre('');
    setCursoCodigo('');
    setCursoCreditos(4);
    setCursoSemestre(1);
    setCursoPrerrequisito('');
    setIsCursoModalOpen(true);
  };

  // Abrir modal para Editar Curso
  const handleEditarCursoClick = (carreraId: string, curso: Curso) => {
    setSelectedCarreraId(carreraId);
    setEditingCurso(curso);
    setCursoNombre(curso.nombre);
    setCursoCodigo(curso.codigo);
    setCursoCreditos(curso.creditos);
    setCursoSemestre(curso.semestre);
    setCursoPrerrequisito(curso.prerrequisito);
    setIsCursoModalOpen(true);
  };

  // Procesar Guardado de Curso (Crear / Editar)
  const handleCursoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarreraId) return;

    setCarreras(carreras.map(c => {
      if (c.id === selectedCarreraId) {
        if (editingCurso) {
          // Editar curso existente
          return {
            ...c,
            cursos: c.cursos.map(m => m.id === editingCurso.id ? {
              ...m,
              codigo: cursoCodigo,
              nombre: cursoNombre,
              creditos: cursoCreditos,
              semestre: cursoSemestre,
              prerrequisito: cursoPrerrequisito || 'Ninguno'
            } : m)
          };
        } else {
          // Agregar nuevo curso
          const nuevoM: Curso = {
            id: Date.now().toString(),
            codigo: cursoCodigo,
            nombre: cursoNombre,
            creditos: cursoCreditos,
            semestre: cursoSemestre,
            prerrequisito: cursoPrerrequisito || 'Ninguno'
          };
          return { ...c, cursos: [...c.cursos, nuevoM] };
        }
      }
      return c;
    }));
    setIsCursoModalOpen(false);
  };

  const eliminarCarrera = (id: string) => {
    if (window.confirm('¿Deseas eliminar esta carrera junto con todos sus cursos del sistema?')) {
      setCarreras(carreras.filter(c => c.id !== id));
    }
  };

  const eliminarCurso = (carreraId: string, cursoId: string) => {
    if (window.confirm('¿Deseas eliminar esta asignatura de la malla curricular?')) {
      setCarreras(carreras.map(c => {
        if (c.id === carreraId) {
          return { ...c, cursos: c.cursos.filter(m => m.id !== cursoId) };
        }
        return c;
      }));
    }
  };

  const carrerasFiltradas = carreras.filter(c => 
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || c.codigo.includes(searchQuery)
  );

  const totalCursos = carreras.reduce((acc, c) => acc + c.cursos.length, 0);

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><GraduationCap size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Carreras</p>
            <h4 className="text-xl font-bold text-slate-800">{carreras.length}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Cursos del Catálogo</p>
            <h4 className="text-xl font-bold text-slate-800">{totalCursos}</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Facultades</p>
            <h4 className="text-xl font-bold text-slate-800">
              {new Set(carreras.map(c => c.facultad)).size}
            </h4>
          </div>
        </div>
      </div>

      {/* CONTENEDOR CENTRAL */}
      <div className={`rounded-2xl border ${styles.border} shadow ${styles.shadow} overflow-hidden ${styles.panel}`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text"
              placeholder="Buscar carrera por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
            />
          </div>

          <button 
            onClick={handleNuevaCarreraClick}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-colors shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
          >
            <Plus size={14} />
            <span>Nueva Carrera</span>
          </button>
        </div>

        {/* TABLA PRINCIPAL DE ACORDEÓN */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 w-10"></th>
                <th className="py-3.5 px-6">Código</th>
                <th className="py-3.5 px-6">Nombre de la Carrera</th>
                <th className="py-3.5 px-6">Facultad</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {carrerasFiltradas.length > 0 ? (
                carrerasFiltradas.map((c) => (
                  <React.Fragment key={c.id}>
                    
                    {/* Fila de la Carrera */}
                    <tr className={`transition-colors ${styles.tableRowHover}`}>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => toggleExpand(c.id)}
                          className="text-gray-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                        >
                          {expandedCarreraId === c.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-blue-600">{c.codigo}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{c.nombre}</td>
                      <td className="py-4 px-6"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">{c.facultad}</span></td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.estado === 'Activa' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleNuevoCursoClick(c.id)}
                            className="flex items-center space-x-1 px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            <Plus size={10} />
                            <span>+ Curso</span>
                          </button>
                          <button 
                            onClick={() => handleEditarCarreraClick(c)}
                            title="Editar Carrera"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => toggleEstadoCarrera(c.id)}
                            title={c.estado === 'Activa' ? "Cambiar a En Cierre" : "Activar Carrera"}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {c.estado === 'Activa' ? <ToggleRight size={15} className="text-emerald-500" /> : <ToggleLeft size={15} />}
                          </button>
                          <button 
                            onClick={() => eliminarCarrera(c.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Desplegable Malla Curricular (Cursos) */}
                    {expandedCarreraId === c.id && (
                      <tr>
                        <td colSpan={6} className={`p-4 border-t border-b ${styles.border} ${styles.panelMuted}`}>
                          <div className="pl-12 pr-6">
                            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                              <Layers size={12} />
                              <span>Malla Curricular - Asignaturas ({c.cursos.length})</span>
                            </h5>
                            
                            {c.cursos.length > 0 ? (
                              <div className={`rounded-xl overflow-hidden border ${styles.border} ${styles.panel} shadow ${styles.shadow}`}>
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase ${styles.tableHeader}`}>
                                      <th className="py-2 px-4">Código</th>
                                      <th className="py-2 px-4">Nombre de Asignatura</th>
                                      <th className="py-2 px-4 text-center">Semestre</th>
                                      <th className="py-2 px-4 text-center">Créditos</th>
                                      <th className="py-2 px-4">Prerrequisito obligatorio</th>
                                      <th className="py-2 px-4 text-center">Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                                    {c.cursos.sort((a,b) => a.semestre - b.semestre).map((curso) => (
                                      <tr key={curso.id} className="hover:bg-slate-50/50">
                                        <td className="py-2.5 px-4 font-mono font-bold text-slate-800 text-[11px]">{curso.codigo}</td>
                                        <td className="py-2.5 px-4 font-medium text-slate-700">{curso.nombre}</td>
                                        <td className="py-2.5 px-4 text-center font-bold text-slate-500">{curso.semestre}°</td>
                                        <td className="py-2.5 px-4 text-center"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-bold text-[10px]">{curso.creditos}</span></td>
                                        <td className="py-2.5 px-4"><span className="text-gray-400 italic text-[11px]">{curso.prerrequisito}</span></td>
                                        <td className="py-2.5 px-4 text-center">
                                          <div className="flex items-center justify-center space-x-1">
                                            <button 
                                              onClick={() => handleEditarCursoClick(c.id, curso)}
                                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                            >
                                              <Edit2 size={12} />
                                            </button>
                                            <button 
                                              onClick={() => eliminarCurso(c.id, curso.id)}
                                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-400 text-xs italic py-2">Malla curricular vacía. Utiliza "+ Curso" para comenzar.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">No se encontraron registros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CARRERA */}
      {isCarreraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left`}>
            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">{editingCarrera ? 'Modificar Estructura de Carrera' : 'Apertura de Nueva Carrera'}</h3>
              <button onClick={() => setIsCarreraModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleCarreraSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Código de Pensum</label>
                <input 
                  type="text" required value={carreraCodigo} onChange={(e) => setCarreraCodigo(e.target.value)}
                  placeholder="Ej. 090" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Descriptivo de la Carrera</label>
                <input 
                  type="text" required value={carreraNombre} onChange={(e) => setCarreraNombre(e.target.value)}
                  placeholder="Ej. Ingeniería en Sistemas" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Facultad</label>
                <select value={carreraFacultad} onChange={(e) => setCarreraFacultad(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 cursor-pointer outline-none">
                  <option value="Ingeniería">Facultad de Ingeniería</option>
                  <option value="Derecho">Facultad de Ciencias Jurídicas</option>
                  <option value="Administración">Facultad de Administración</option>
                  <option value="Humanidades">Facultad de Humanidades</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsCarreraModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#1a365d] text-white font-bold text-xs rounded-xl hover:bg-[#152c4d] cursor-pointer shadow-xs">
                  {editingCarrera ? 'Guardar Cambios' : 'Aperturar Carrera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CURSO */}
      {isCursoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} text-left`}>
            <div className={`flex items-center justify-between border-b ${styles.border} pb-3`}>
              <h3 className="text-base font-bold text-slate-800">{editingCurso ? 'Editar Propiedades del Curso' : 'Integrar Nuevo Curso al Pensum'}</h3>
              <button onClick={() => setIsCursoModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleCursoSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Código de Curso</label>
                <input 
                  type="text" required value={cursoCodigo} onChange={(e) => setCursoCodigo(e.target.value)}
                  placeholder="Ej. 090523" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre de Asignatura</label>
                <input 
                  type="text" required value={cursoNombre} onChange={(e) => setCursoNombre(e.target.value)}
                  placeholder="Ej. Desarrollo Web Avanzado" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Créditos Académicos</label>
                  <input type="number" min={1} max={10} required value={cursoCreditos} onChange={(e) => setCursoCreditos(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Semestre</label>
                  <input type="number" min={1} max={12} required value={cursoSemestre} onChange={(e) => setCursoSemestre(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prerrequisito Académico</label>
                <input 
                  type="text" value={cursoPrerrequisito} onChange={(e) => setCursoPrerrequisito(e.target.value)}
                  placeholder="Ej. Programación I (090001) o 'Ninguno'" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsCursoModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#1a365d] text-white font-bold text-xs rounded-xl hover:bg-[#152c4d] cursor-pointer shadow-xs">
                  {editingCurso ? 'Aplicar Cambios' : 'Integrar Asignatura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};