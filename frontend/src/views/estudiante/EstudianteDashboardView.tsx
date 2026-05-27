import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { EstudianteLayout, type TabEstudiante } from '../../layouts/EstudianteLayout';
import { InscripcionCursos } from '../usuarios/estudiante/InscripcionCursos';
import {
  BookOpen,
  FolderOpen,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
} from 'lucide-react';
import { inscripcionesService } from '../../services/inscripciones.service';
import { estudiantesService } from '../../services/estudiantes.service';

export const EstudianteDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabEstudiante>('tablero');
  const [cursosCount, setCursosCount] = useState(0);
  const [inscripcionesCount, setInscripcionesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    estudiantesService.getMe()
      .then(async (estRes) => {
        const idEstudiante = estRes.data.id_estudiante;
        try {
          const iRes = await inscripcionesService.getAll();
          const misInscripciones = iRes.data.filter(i => i.id_estudiante === idEstudiante);
          setInscripcionesCount(misInscripciones.length);
          setCursosCount(new Set(misInscripciones.map(i => i.id_asignacion)).size);
        } catch {}
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'inscripciones':
      case 'cursos':
        return <InscripcionCursos />;
      case 'expediente':
        return (
          <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-medium">
            Expediente académico — en desarrollo
          </div>
        );
      case 'mensajes':
        return (
          <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-medium">
            Mensajes y avisos — en desarrollo
          </div>
        );
      case 'config':
        return (
          <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-medium">
            Configuración — en desarrollo
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-800">
                Bienvenido de nuevo, {user?.nombre?.split(' ')[0] ?? 'Estudiante'}
              </h2>
              <p className="text-gray-500 text-xs font-semibold mt-0.5">
                Ciclo Académico Activo: Primer Semestre 2026
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Asignados</span>
                  <h3 className="text-3xl font-black text-gray-800 mt-3">{loading ? '...' : cursosCount}</h3>
                  <p className="text-gray-500 text-xs font-bold mt-1">Cursos Inscritos</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FolderOpen size={24} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Inscripciones</span>
                  <h3 className="text-3xl font-black text-gray-800 mt-3">{loading ? '...' : inscripcionesCount}</h3>
                  <p className="text-gray-500 text-xs font-bold mt-1">Materias Asignadas</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Award size={24} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Pendiente</span>
                  <h3 className="text-3xl font-black text-gray-800 mt-3">1</h3>
                  <p className="text-gray-500 text-xs font-bold mt-1">Pagos / Solicitudes</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                  <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={18} className="text-[#1a365d]" /> Mis Cursos Asignados
                  </h3>
                </div>
                <p className="text-xs text-gray-400">Navega a la sección "Cursos" para ver tus asignaciones.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Clock size={18} className="text-[#1a365d]" /> Notificaciones
                </h3>
                <div className="flex gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-gray-800 truncate">Portal de Estudiante activo</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">Ya puedes inscribirte en cursos disponibles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <EstudianteLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EstudianteLayout>
  );
};
