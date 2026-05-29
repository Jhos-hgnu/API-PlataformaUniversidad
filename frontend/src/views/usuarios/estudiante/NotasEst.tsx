import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Search, Award, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { estudiantesService } from '../../../services/estudiantes.service';
import { inscripcionesService } from '../../../services/inscripciones.service';
import { notasService } from '../../../services/notas.service';
import { asignacionesService } from '../../../services/asignaciones.service';

interface NotaConCurso {
  id_nota: number;
  id_inscripcion: number;
  nota_final: number;
  cursoCodigo: string;
  cursoNombre: string;
  docenteNombre: string;
  seccion: string;
  aprobado: boolean;
}

export const NotasEst: React.FC = () => {
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [notas, setNotas] = useState<NotaConCurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    estudiantesService.getMe()
      .then(async (estRes) => {
        const idEstudiante = estRes.data.id_estudiante;
        const [iRes, nRes, aRes] = await Promise.all([
          inscripcionesService.getAll(),
          notasService.getAll(),
          asignacionesService.getAll(),
        ]);

        const misInscripciones = iRes.data.filter(i => i.id_estudiante === idEstudiante);
        const mapaAsignacion = new Map(aRes.data.map(a => [a.id_asignacion, a]));

        const notasConCurso: NotaConCurso[] = misInscripciones.map(ins => {
          const nota = nRes.data.find(n => n.id_inscripcion === ins.id_inscripcion);
          const asignacion = mapaAsignacion.get(ins.id_asignacion);
          const curso = asignacion?.Cursos;
          const docente = asignacion?.Docentes?.Usuarios;
          return {
            id_nota: nota?.id_nota ?? 0,
            id_inscripcion: ins.id_inscripcion,
            nota_final: nota?.nota_final ?? 0,
            cursoCodigo: curso?.codigo ?? '—',
            cursoNombre: curso?.nombre ?? '—',
            docenteNombre: docente ? `${docente.nombre} ${docente.apellido}` : '—',
            seccion: asignacion?.seccion ?? '—',
            aprobado: nota ? nota.nota_final >= 61 : false,
          };
        });

        setNotas(notasConCurso);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const notasFiltradas = notas.filter(n =>
    n.cursoNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.cursoCodigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aprobadas = notas.filter(n => n.aprobado && n.nota_final > 0).length;
  const reprobadas = notas.filter(n => !n.aprobado && n.nota_final > 0).length;
  const pendientes = notas.filter(n => n.nota_final === 0).length;
  const promedio = notas.filter(n => n.nota_final > 0).length > 0
    ? notas.filter(n => n.nota_final > 0).reduce((acc, n) => acc + n.nota_final, 0) / notas.filter(n => n.nota_final > 0).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Total Cursos</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : notas.length}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Materias inscritas</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Aprobadas</span>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">{loading ? '...' : aprobadas}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Nota &ge; 61</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Reprobadas</span>
            <h3 className="text-3xl font-black text-red-500 mt-2">{loading ? '...' : reprobadas}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>Nota &lt; 61</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
            <XCircle size={24} />
          </div>
        </div>

        <div className={`${styles.panel} p-5 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${styles.label}`}>Promedio</span>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{loading ? '...' : promedio.toFixed(1)}</h3>
            <p className={`${styles.mutedText} text-xs font-bold mt-1`}>General</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className={`${styles.panel} rounded-2xl border ${styles.border} shadow overflow-hidden`}>
        <div className={`p-5 border-b ${styles.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${styles.panelMuted}`}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar por nombre o código de curso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
            />
          </div>
          <span className={`${styles.mutedText} font-semibold text-xs`}>
            {notas.length} materias inscritas
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400 font-medium">Cargando notas...</div>
        ) : notasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${styles.border} text-[10px] font-bold uppercase tracking-wider ${styles.tableHeader}`}>
                  <th className="py-3.5 px-6">Código / Curso</th>
                  <th className="py-3.5 px-6">Docente</th>
                  <th className="py-3.5 px-6 text-center">Sección</th>
                  <th className="py-3.5 px-6 text-center">Nota Final</th>
                  <th className="py-3.5 px-6 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {notasFiltradas.map((n) => (
                  <tr key={n.id_inscripcion} className={`transition-colors ${styles.tableRowHover}`}>
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-blue-600 text-[11px]">{n.cursoCodigo}</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{n.cursoNombre}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{n.docenteNombre}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">{n.seccion}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {n.nota_final > 0 ? (
                        <span className={`text-lg font-black ${n.aprobado ? 'text-emerald-600' : 'text-red-500'}`}>
                          {n.nota_final.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {n.nota_final > 0 ? (
                        n.aprobado ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                            <CheckCircle size={10} /> Aprobado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">
                            <XCircle size={10} /> Reprobado
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 font-medium">
            {searchQuery ? 'No se encontraron notas con ese criterio.' : 'Aún no tienes notas registradas.'}
          </div>
        )}
      </div>
    </div>
  );
};
