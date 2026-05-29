import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { FileText, BookOpen, Award, Calendar } from 'lucide-react';
import { estudiantesService } from '../../../services/estudiantes.service';
import { inscripcionesService } from '../../../services/inscripciones.service';
import { notasService } from '../../../services/notas.service';
import { asignacionesService } from '../../../services/asignaciones.service';

interface CursoExpediente {
  periodo: string;
  codigo: string;
  nombre: string;
  creditos: number;
  nota: number | null;
  aprobado: boolean | null;
}

export const Expediente: React.FC = () => {
  const { theme, user } = useAuth();
  const styles = getThemeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [carnet, setCarnet] = useState('');
  const [carrera, setCarrera] = useState('');
  const [expediente, setExpediente] = useState<CursoExpediente[]>([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [creditosAcumulados, setCreditosAcumulados] = useState(0);

  useEffect(() => {
    setLoading(true);
    estudiantesService.getMe()
      .then(async (estRes) => {
        const estudiante = estRes.data;
        setCarnet(estudiante.carnet);
        setCarrera(estudiante.Carreras?.nombre ?? '—');

        const [iRes, nRes, aRes] = await Promise.all([
          inscripcionesService.getAll(),
          notasService.getAll(),
          asignacionesService.getAll(),
        ]);

        const misInscripciones = iRes.data.filter(i => i.id_estudiante === estudiante.id_estudiante);
        const mapaAsignacion = new Map(aRes.data.map(a => [a.id_asignacion, a]));

        const cursos: CursoExpediente[] = misInscripciones.map(ins => {
          const nota = nRes.data.find(n => n.id_inscripcion === ins.id_inscripcion);
          const asignacion = mapaAsignacion.get(ins.id_asignacion);
          const curso = asignacion?.Cursos;
          const periodo = asignacion?.Periodos?.nombre ?? '—';
          return {
            periodo,
            codigo: curso?.codigo ?? '—',
            nombre: curso?.nombre ?? '—',
            creditos: curso?.creditos ?? 0,
            nota: nota?.nota_final ?? null,
            aprobado: nota ? nota.nota_final >= 61 : null,
          };
        });

        setExpediente(cursos);

        const conNota = cursos.filter(c => c.nota !== null);
        if (conNota.length > 0) {
          const sum = conNota.reduce((acc, c) => acc + (c.nota ?? 0), 0);
          setPromedioGeneral(Math.round((sum / conNota.length) * 100) / 100);
        }
        const creditos = cursos
          .filter(c => c.aprobado === true)
          .reduce((acc, c) => acc + c.creditos, 0);
        setCreditosAcumulados(creditos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className={`${styles.panel} p-6 rounded-2xl border ${styles.border} ${styles.shadow}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText size={18} className="text-[#1a365d]" /> Expediente Académico
            </h3>
            <p className="text-gray-500 text-xs mt-1">Información general del estudiante</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Estudiante</p>
            <p className="font-black text-gray-800 mt-1">{user?.nombre || '—'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Carnet</p>
            <p className="font-black text-gray-800 mt-1">{carnet || '—'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Carrera</p>
            <p className="font-black text-gray-800 mt-1">{carrera}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Cursos Tomados</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : expediente.length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Créditos Aprobados</span>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">{loading ? '...' : creditosAcumulados}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Promedio General</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : promedioGeneral.toFixed(1)}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      <div className={`${styles.panel} rounded-2xl border ${styles.border} shadow overflow-hidden`}>
        <div className={`p-5 border-b ${styles.border} ${styles.panelMuted}`}>
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider">Historial de Cursos</h3>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400 font-medium">Cargando expediente...</div>
        ) : expediente.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                  <th className="py-3.5 px-6">Periodo</th>
                  <th className="py-3.5 px-6">Código</th>
                  <th className="py-3.5 px-6">Curso</th>
                  <th className="py-3.5 px-6 text-center">Créditos</th>
                  <th className="py-3.5 px-6 text-center">Nota</th>
                  <th className="py-3.5 px-6 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {expediente.map((c, i) => (
                  <tr key={i} className={`transition-colors ${styles.tableRowHover}`}>
                    <td className="py-4 px-6 font-medium text-slate-700">{c.periodo}</td>
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-blue-600 text-[11px]">{c.codigo}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{c.nombre}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-600">{c.creditos}</td>
                    <td className="py-4 px-6 text-center">
                      {c.nota !== null ? (
                        <span className={`text-lg font-black ${c.aprobado ? 'text-emerald-600' : 'text-red-500'}`}>
                          {c.nota.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {c.aprobado === true ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Aprobado</span>
                      ) : c.aprobado === false ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">Reprobado</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold">Cursando</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 font-medium">No hay cursos en tu expediente.</div>
        )}
      </div>
    </div>
  );
};
