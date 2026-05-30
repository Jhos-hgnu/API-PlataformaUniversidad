import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import { getThemeStyles } from "../../../utils/themeStyles";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Eye,
  BookOpen,
} from "lucide-react";
import { docentesService } from "../../../services/docentes.service";
import {
  asignacionesService,
  type Asignacion,
} from "../../../services/asignaciones.service";

export const Cursos: React.FC = () => {
  const { user, theme } = useAuth();
  const globalStyles = getThemeStyles(theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [seccionFilter, setSeccionFilter] = useState<string>("TODAS");
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  // EFECTO DE CARGA DE DATOS DEL DOCENTE Y ASIGNACIONES
  useEffect(() => {
    if (!user) return;
    docentesService
      .getAll()
      .then((dRes) => {
        const docente = dRes.data.find((d) => d.id_usuario === user.id);
        if (docente) {
          asignacionesService
            .getByDocente(docente.id_docente)
            .then((aRes) => {
              setAsignaciones(aRes.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [user]);

  // PROCESAMIENTO DE FILTROS Y MÉTRICAS
  const filtradas = asignaciones.filter((a) => {
    const nombreCurso = a.Cursos?.nombre ?? "";
    const codigo = a.Cursos?.codigo ?? "";
    const q = searchQuery.toLowerCase();
    const matchSearch =
      nombreCurso.toLowerCase().includes(q) || codigo.includes(q);
    const matchSeccion =
      seccionFilter === "TODAS" || a.seccion === seccionFilter;
    return matchSearch && matchSeccion;
  });

  const totalInscritos = asignaciones.reduce(
    (acc, a) => acc + ((a.Cursos?.cupo_maximo ?? 0) - a.cupo_disponible),
    0,
  );

  // CONFIGURACIÓN DE ELEMENTOS DE DISEÑO Y TEMAS
  const isDark = theme === "oscuro";
  const isCoquette = theme === "coquette";

  const obtenerEstilosInternos = () => {
    switch (theme) {
      case "oscuro":
        return { desc: "text-slate-400" };
      case "coquette":
        return { desc: "text-[#b3888d]" };
      case "claro":
      default:
        return { desc: "text-gray-400" };
    }
  };

  const c = obtenerEstilosInternos();
  const titleColor = isDark ? "#f8fafc" : isCoquette ? "#6d4c51" : "#0f172a";

  // RENDER GENERAL DEL COMPONENTE
  return (
    <div
      className={`space-y-6 transition-all duration-300 w-full ${globalStyles.page}`}
    >
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex items-center space-x-3 text-left">
        <div
          className={`p-3 rounded-xl ${isDark ? "bg-slate-800 text-slate-200" : isCoquette ? "bg-[#fff5f6] text-[#f472b6]" : "bg-slate-100 text-slate-700"}`}
        >
          <BookOpen size={22} />
        </div>
        <div>
          <h2
            className="text-base font-bold transition-colors"
            style={{ color: titleColor }}
          >
            Mis Cursos Asignados
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Consulta los horarios, salones asignados y el control de estudiantes
            inscritos para este ciclo lectivo.
          </p>
        </div>
      </div>

      {/* BLOQUE DE TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Asignaturas Asignadas
            </span>
            <BookOpen className="text-blue-500" size={16} />
          </div>
          <p className="text-xl font-black">
            {loading ? "..." : asignaciones.length} Módulos Activos
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Estudiantes de Alta
            </span>
            <Users className="text-purple-500" size={16} />
          </div>
          <p className="text-xl font-black">
            {loading ? "..." : totalInscritos} Alumnos Totales
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BUSCADOR */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o código de curso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? "bg-slate-900 border-transparent text-slate-200 focus:border-slate-700" : "bg-gray-50 border-transparent focus:bg-white focus:border-gray-300"}`}
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select
            value={seccionFilter}
            onChange={(e) => setSeccionFilter(e.target.value)}
            className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? "bg-slate-900 border-transparent text-slate-200" : "bg-gray-50 border-transparent"}`}
          >
            <option value="TODAS">Todas las Secciones</option>
            <option value="A">Sección A</option>
            <option value="B">Sección B</option>
            <option value="C">Sección C</option>
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE CURSOS */}
      <div
        className={`border rounded-2xl overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">
              Cargando cursos...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-slate-800 bg-slate-900/50 text-slate-400" : "bg-gray-50/70 text-[#b3888d]"}`}
                >
                  <th className="py-3.5 px-6">Código / Curso</th>
                  <th className="py-3.5 px-6 text-center">Sección</th>
                  <th className="py-3.5 px-6 text-center">Días y Horarios</th>
                  <th className="py-3.5 px-6 text-center">Aula / Salón</th>
                  <th className="py-3.5 px-6 text-center">
                    Estudiantes Registrados
                  </th>
                  <th className="py-3.5 px-6 text-center">Acción</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {filtradas.length > 0 ? (
                  filtradas.map((a) => {
                    const cupoMax = a.Cursos?.cupo_maximo ?? 0;
                    const inscritos = cupoMax - a.cupo_disponible;
                    const porc = cupoMax > 0 ? (inscritos / cupoMax) * 100 : 0;
                    const lleno = a.cupo_disponible <= 0;

                    return (
                      <tr
                        key={a.id_asignacion}
                        className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6 text-left">
                          <span className="font-mono text-blue-500 font-bold block text-[11px]">
                            {a.Cursos?.codigo ?? "—"}
                          </span>
                          <span
                            className={`font-bold text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}
                          >
                            {a.Cursos?.nombre ?? "—"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-300">
                          {a.seccion}
                        </td>

                        <td className="py-4 px-6 text-left font-medium text-gray-500 dark:text-slate-400">
                          —
                        </td>

                        <td className="py-4 px-6 text-left font-medium text-gray-500 dark:text-slate-400">
                          —
                        </td>

                        <td className="py-4 px-6 w-52 text-left">
                          <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                            <span
                              className={
                                lleno
                                  ? "text-amber-600"
                                  : isDark
                                    ? "text-slate-300"
                                    : "text-slate-600"
                              }
                            >
                              {inscritos} / {cupoMax} Alumnos
                            </span>
                            {lleno ? (
                              <span className="text-amber-600 flex items-center gap-0.5">
                                <AlertTriangle size={10} />
                                Lleno
                              </span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <CheckCircle size={10} />
                                Disponible
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${lleno ? "bg-amber-500" : "bg-blue-600"}`}
                              style={{ width: `${Math.min(porc, 100)}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() =>
                              alert(
                                `Redirigiendo al listado de estudiantes para ${a.Cursos?.nombre} (Sección ${a.seccion})...`,
                              )
                            }
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isCoquette
                                ? "bg-[#f472b6] text-white border-transparent"
                                : "bg-slate-950 text-white dark:bg-blue-600 border-transparent"
                            }`}
                          >
                            <Eye size={13} />
                            <span>Ver Listado</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No tienes cursos asignados que coincidan con los filtros
                      seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
