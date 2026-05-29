import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { BookOpen, Award, TrendingUp, Clock, CheckCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { estudiantesService } from '../../../services/estudiantes.service';
import { inscripcionesService } from '../../../services/inscripciones.service';
import { notasService } from '../../../services/notas.service';
import { asignacionesService } from '../../../services/asignaciones.service';
import type { TabEstudiante } from '../../../layouts/EstudianteLayout';
import type { Inscripcion } from '../../../services/inscripciones.service';
import type { Nota } from '../../../services/notas.service';

interface TableroEstProps {
  setActiveSection: (tab: TabEstudiante) => void;
}

export const TableroEst: React.FC<TableroEstProps> = ({ setActiveSection }) => {
  const { theme, user } = useAuth();
  const styles = getThemeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [cursosInscritos, setCursosInscritos] = useState(0);
  const [cursosDisponibles, setCursosDisponibles] = useState(0);
  const [totalNotas, setTotalNotas] = useState(0);
  const [promedio, setPromedio] = useState(0);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [notasList, setNotasList] = useState<Nota[]>([]);

  useEffect(() => {
    setLoading(true);
    estudiantesService.getMe()
      .then(async (estRes) => {
        const idEstudiante = estRes.data.id_estudiante;
        const [iRes, aRes, nRes] = await Promise.all([
          inscripcionesService.getAll(),
          asignacionesService.getAll(),
          notasService.getAll(),
        ]);
        const misInscripciones = iRes.data.filter(i => i.id_estudiante === idEstudiante);
        const misNotas = nRes.data.filter(n =>
          misInscripciones.some(ins => ins.id_inscripcion === n.id_inscripcion)
        );
        setInscripciones(misInscripciones);
        setNotasList(misNotas);
        setCursosInscritos(new Set(misInscripciones.map(i => i.id_asignacion)).size);
        setCursosDisponibles(aRes.data.length);
        setTotalNotas(misNotas.length);
        if (misNotas.length > 0) {
          const sum = misNotas.reduce((acc, n) => acc + n.nota_final, 0);
          setPromedio(Math.round((sum / misNotas.length) * 100) / 100);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: 'Inscribirme en Cursos', tab: 'cursos' as TabEstudiante, desc: 'Ver oferta académica disponible' },
    { label: 'Consultar Notas', tab: 'notas' as TabEstudiante, desc: 'Revisar calificaciones' },
    { label: 'Expediente', tab: 'expediente' as TabEstudiante, desc: 'Historial académico' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-gray-800">
          Bienvenido, {user?.nombre?.split(' ')[0] ?? 'Estudiante'}
        </h2>
        <p className="text-gray-500 text-xs font-semibold mt-0.5">
          Portal Estudiantil · Primer Semestre 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Cursos Inscritos</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : cursosInscritos}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Materias asignadas</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Cursos Disponibles</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : cursosDisponibles}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Oferta académica</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Notas Registradas</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : totalNotas}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Calificaciones</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Promedio General</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : promedio.toFixed(1)}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>De {totalNotas} materias</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} lg:col-span-2`}>
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3 mb-4">
            <BookOpen size={18} className="text-[#1a365d]" /> Accesos Rápidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.tab}
                onClick={() => setActiveSection(action.tab)}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors text-left group cursor-pointer"
              >
                <div>
                  <p className="font-bold text-xs text-gray-800">{action.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>

          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3 mt-6 mb-4">
            <Award size={18} className="text-[#1a365d]" /> Últimas Notas
          </h3>

          {loading ? (
            <p className="text-xs text-gray-400">Cargando notas...</p>
          ) : notasList.length > 0 ? (
            <div className="space-y-2">
              {notasList.slice(0, 5).map((nota) => {
                const insc = inscripciones.find(i => i.id_inscripcion === nota.id_inscripcion);
                return (
                  <div key={nota.id_nota} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        nota.nota_final >= 61 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {nota.nota_final >= 61 ? <CheckCircle size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {insc ? `Inscripción #${insc.id_inscripcion}` : `Curso #${nota.id_inscripcion}`}
                        </p>
                        <p className={`text-[10px] font-semibold ${nota.nota_final >= 61 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {nota.nota_final >= 61 ? 'Aprobado' : 'Pendiente'} · Nota: {nota.nota_final}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-black ${nota.nota_final >= 61 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {nota.nota_final}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Aún no tienes notas registradas.</p>
          )}
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} space-y-4`}>
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3">
            <Clock size={18} className="text-[#1a365d]" /> Notificaciones
          </h3>
          <div className="flex gap-3 text-left">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
              <CheckCircle size={16} />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-gray-800 truncate">Inscripciones Abiertas</h4>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">Ya puedes inscribirte en cursos disponibles.</p>
            </div>
          </div>
          <div className="flex gap-3 text-left">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-600">
              <Award size={16} />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-gray-800 truncate">Notas Publicadas</h4>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">Revisa tus calificaciones en el módulo de notas.</p>
            </div>
          </div>
          <div className="flex gap-3 text-left">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-amber-50 text-amber-600">
              <Clock size={16} />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-gray-800 truncate">Cierre de Actas</h4>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">Próximo cierre de actas: 15 de junio.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setActiveSection('cursos')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a365d] hover:bg-[#152c4d] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Ir a Inscripciones
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
