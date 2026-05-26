import React from 'react';
import { useAuth } from '../../context/useAuth';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import {
  BookOpen,
  FolderOpen,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const EstudianteDashboardView: React.FC = () => {
  const { user } = useAuth();

  const actividadesRecientes = [
    { id: 1, tipo: 'calificacion', titulo: 'Calificación publicada: Proyecto Final', subtitulo: 'Sistemas Operativos II • 95/100', haceCuanto: 'Hace 2h' },
    { id: 2, tipo: 'aviso', titulo: 'Nuevo aviso de Coordinación', subtitulo: 'Calendario de exámenes finales actualizado.', haceCuanto: 'Hace 5h' },
    { id: 3, tipo: 'mensaje', titulo: 'Mensaje de Catedrático', subtitulo: 'Re: Consulta sobre laboratorio 3 de Base de Datos', haceCuanto: 'Ayer' },
  ];

  const cursosActivos = [
    { codigo: 'SIS-002', nombre: 'Sistemas Operativos II', creditos: 5 },
    { codigo: 'BD2-003', nombre: 'Base de Datos II', creditos: 4 },
    { codigo: 'AN-001', nombre: 'Análisis de Sistemas I', creditos: 4 },
  ];

  return (
    <EstudianteLayout activeTab="tablero">
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
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
              <h3 className="text-3xl font-black text-gray-800 mt-3">{cursosActivos.length}</h3>
              <p className="text-gray-500 text-xs font-bold mt-1">Cursos Inscritos</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FolderOpen size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Eficiencia</span>
              <h3 className="text-3xl font-black text-gray-800 mt-3">88.5</h3>
              <p className="text-gray-500 text-xs font-bold mt-1">Promedio General</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
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
            <div className="space-y-2">
              {cursosActivos.map((curso, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all">
                  <div>
                    <h4 className="font-bold text-xs text-gray-800">{curso.nombre}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{curso.codigo} • {curso.creditos} Créditos</p>
                  </div>
                  <button className="px-3 py-1 bg-white hover:bg-[#1a365d] hover:text-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold transition-all shadow-2xs">
                    Ver Aula
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3">
              <Clock size={18} className="text-[#1a365d]" /> Notificaciones
            </h3>
            <div className="space-y-3">
              {actividadesRecientes.map((act) => (
                <div key={act.id} className="flex gap-3 text-left">
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                    act.tipo === 'calificacion' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {act.tipo === 'calificacion' ? <CheckCircle size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-gray-800 truncate">{act.titulo}</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{act.subtitulo}</p>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">{act.haceCuanto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EstudianteLayout>
  );
};
