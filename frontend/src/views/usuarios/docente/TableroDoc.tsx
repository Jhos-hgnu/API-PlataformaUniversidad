import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  Users,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { getThemeStyles } from "../../../utils/themeStyles";
import { docentesService } from "../../../services/docentes.service";
import {
  asignacionesService,
  type Asignacion,
} from "../../../services/asignaciones.service";
import { inscripcionesService } from "../../../services/inscripciones.service";

type Section =
  | "tablero"
  | "cursos"
  | "notas"
  | "estudiantes"
  | "mensajes"
  | "config";

export const TableroDoc: React.FC<{
  setActiveSection: (section: Section) => void;
}> = ({ setActiveSection }) => {
  const { theme, user } = useAuth();
  const globalStyles = getThemeStyles(theme);
  const nombreDocente = user?.nombre || "Docente";

  const [docenteId, setDocenteId] = useState<number | null>(null);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    docentesService
      .getAll()
      .then((res) => {
        const docente = res.data.find((d) => d.id_usuario === user.id);
        if (docente) setDocenteId(docente.id_docente);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!docenteId) return;

    const timer = setTimeout(() => {
      setLoading(true);
    }, 0);

    Promise.all([
      asignacionesService.getByDocente(docenteId),
      inscripcionesService.getAll(),
    ])
      .then(([aRes, iRes]) => {
        const asignacionesData = aRes.data;
        setAsignaciones(asignacionesData);

        const asignacionIds = new Set(
          asignacionesData.map((a) => a.id_asignacion),
        );
        const estudiantesSet = new Set(
          iRes.data
            .filter((i) => asignacionIds.has(i.id_asignacion))
            .map((i) => i.id_estudiante),
        );
        setTotalEstudiantes(estudiantesSet.size);
      })
      .catch((err) => {
        console.error("Error cargando el tablero:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => clearTimeout(timer);
  }, [docenteId]);

  // KPIs estructurados exactamente igual que en Cursos.tsx
  const kpis = [
    {
      id: 1,
      label: "Total Estudiantes",
      valor: loading ? "..." : `${totalEstudiantes} Estudiantes`,
      icon: <Users className="text-purple-500" size={16} />,
    },
    {
      id: 2,
      label: "Cursos Asignados",
      valor: loading ? "..." : `${asignaciones.length} Cursos`,
      icon: <BookOpen className="text-blue-500" size={16} />,
    },
    {
      id: 3,
      label: "Actas por Cerrar",
      valor: loading ? "..." : "0 Actas",
      icon: <GraduationCap className="text-amber-500" size={16} />,
    },
  ];

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

  return (
    <div
      className={`space-y-6 transition-all duration-300 w-full ${globalStyles.page}`}
    >
      {/* ENCABEZADO DE SECCIÓN ADAPTATIVO */}
      <div className="flex items-center space-x-3 text-left">
        <div
          className={`p-3 rounded-xl ${isDark ? "bg-slate-800 text-slate-200" : isCoquette ? "bg-[#fff5f6] text-[#f472b6]" : "bg-slate-100 text-slate-700"}`}
        >
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h2
            className="text-base font-bold transition-colors"
            style={{ color: titleColor }}
          >
            Panel del Docente
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Bienvenido de nuevo,{" "}
            <span className="font-semibold">{nombreDocente}</span>. Aquí tienes
            el balance de tus aulas y actas académicas vigentes.
          </p>
        </div>
      </div>

      {/* BLOQUE DE TARJETAS DE MÉTRICAS (Estilo Cursos.tsx) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {kpi.label}
              </span>
              {kpi.icon}
            </div>
            <p className="text-xl font-black">{kpi.valor}</p>
          </div>
        ))}
      </div>

      {/* BLOQUES INFERIORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* COLUMNA IZQUIERDA: GRÁFICO / OCUPACIÓN */}
        <div
          className={`border rounded-2xl p-5 lg:col-span-2 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <h3
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-2 mb-4 ${isDark ? "text-slate-400" : isCoquette ? "text-[#b3888d]" : "text-gray-400"}`}
          >
            <FileSpreadsheet size={14} className="text-blue-500" />
            <span>Ocupación de Estudiantes por Curso</span>
          </h3>
          <div className="space-y-5">
            {loading ? (
              <div className="text-xs text-gray-400 font-medium">
                Cargando cursos...
              </div>
            ) : asignaciones.length > 0 ? (
              asignaciones.map((a) => {
                const cupoMax = a.Cursos?.cupo_maximo ?? 0;
                const inscritos = cupoMax - a.cupo_disponible;
                const pct =
                  cupoMax > 0 ? Math.round((inscritos / cupoMax) * 100) : 0;
                const lleno = a.cupo_disponible <= 0;
                return (
                  <div key={a.id_asignacion}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span
                        className={isDark ? "text-slate-200" : "text-slate-800"}
                      >
                        {a.Cursos?.nombre} — Sección {a.seccion}
                      </span>
                      <span
                        className={
                          lleno
                            ? "text-amber-600"
                            : isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                        }
                      >
                        {inscritos} / {cupoMax} Alumnos ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${lleno ? "bg-amber-500" : "bg-blue-600"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 font-medium">
                No tienes cursos asignados en este ciclo.
              </div>
            )}
          </div>

          <div
            className={`mt-6 pt-4 border-t flex justify-end ${isDark ? "border-slate-800" : "border-gray-100/70"}`}
          >
            <button
              onClick={() => setActiveSection("cursos")}
              className={`text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${isCoquette ? "text-[#f472b6]" : "text-blue-500"}`}
            >
              <span>Gestionar Mis Cursos</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: ACCESOS RÁPIDOS Y ACTIVIDAD RECIENTE */}
        <div className="space-y-5">
          {/* ACCESOS RÁPIDOS */}
          <div
            className={`border rounded-2xl p-5 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
          >
            <h3
              className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-2 mb-3 ${isDark ? "text-slate-400" : isCoquette ? "text-[#b3888d]" : "text-gray-400"}`}
            >
              <PlusCircle size={14} className="text-purple-500" />
              <span>Accesos Rápidos</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setActiveSection("notas")}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-transparent"
                    : "bg-gray-50 hover:bg-gray-100/70 text-slate-700 border-transparent"
                }`}
              >
                <span>Ingresar Calificaciones</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
              <button
                onClick={() => setActiveSection("cursos")}
                className={`w-full py-2.5 px-4 border text-left rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-transparent"
                    : "bg-gray-50 hover:bg-gray-100/70 text-slate-700 border-transparent"
                }`}
              >
                <span>Ver Estudiantes</span>
                <ArrowUpRight size={13} className="opacity-60" />
              </button>
            </div>
          </div>

          {/* ACTIVIDAD EN AULAS */}
          <div
            className={`border rounded-2xl p-5 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
          >
            <h3
              className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-2 mb-3 ${isDark ? "text-slate-400" : isCoquette ? "text-[#b3888d]" : "text-gray-400"}`}
            >
              <Clock size={14} className="text-amber-500" />
              <span>Actividad en tus Aulas</span>
            </h3>
            <div className="space-y-3">
              {asignaciones.length > 0 ? (
                asignaciones.slice(0, 3).map((a) => (
                  <div
                    key={a.id_asignacion}
                    className={`p-3 rounded-xl border text-[11px] ${
                      isDark
                        ? "bg-slate-900 border-slate-800"
                        : "bg-gray-50/70 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[140px] text-blue-500">
                        {a.Cursos?.nombre}
                      </span>
                    </div>
                    <p
                      className={`mt-0.5 font-medium truncate ${isDark ? "text-slate-400" : isCoquette ? "text-[#b3888d]" : "text-gray-500"}`}
                    >
                      Sección {a.seccion} — {a.cupo_disponible} cupos
                      disponibles
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 font-medium">
                  Sin actividad reciente.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
