import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import { getThemeStyles } from "../../../utils/themeStyles";
import { Users, Search, Mail, CalendarCheck, Filter } from "lucide-react";
import { docentesService } from "../../../services/docentes.service";
import {
  asignacionesService,
  type Asignacion,
} from "../../../services/asignaciones.service";
import {
  inscripcionesService,
  type Inscripcion,
} from "../../../services/inscripciones.service";

export const Estudiantes: React.FC = () => {
  const { theme, user } = useAuth();
  const globalStyles = getThemeStyles(theme);

  const [activeCursoFilter, setActiveCursoFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  // EFECTO DE CARGA DE ASIGNACIONES E INSCRIPCIONES ASOCIADAS
  useEffect(() => {
    if (!user) return;
    docentesService
      .getAll()
      .then((dRes) => {
        const docente = dRes.data.find((d) => d.id_usuario === user.id);
        if (!docente) {
          setLoading(false);
          return;
        }
        asignacionesService
          .getByDocente(docente.id_docente)
          .then((aRes) => {
            setAsignaciones(aRes.data);
            const ids = aRes.data.map((a) => a.id_asignacion);
            inscripcionesService
              .getAll()
              .then((iRes) => {
                setInscripciones(
                  iRes.data.filter((i) => ids.includes(i.id_asignacion)),
                );
              })
              .catch(() => {})
              .finally(() => setLoading(false));
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [user]);

  // PROCESAMIENTO DE FILTROS Y OPCIONES DE BÚSQUEDA
  const cursosOptions = [
    "Todos",
    ...new Set(asignaciones.map((a) => a.Cursos?.nombre ?? "").filter(Boolean)),
  ];

  const inscripcionesFiltradas = inscripciones.filter((i) => {
    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? "";
    const matchCurso =
      activeCursoFilter === "Todos" || cursoNombre === activeCursoFilter;

    const est = i.Estudiantes;
    const nombre = est?.Usuarios
      ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}`
      : "";
    const correo = est?.Usuarios?.correo ?? "";
    const carnet = est?.carnet ?? "";
    const q = searchQuery.toLowerCase();
    const matchSearch =
      nombre.toLowerCase().includes(q) ||
      correo.toLowerCase().includes(q) ||
      carnet.includes(q);

    return matchCurso && matchSearch;
  });

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
          <Users size={22} />
        </div>
        <div>
          <h2
            className="text-base font-bold transition-colors"
            style={{ color: titleColor }}
          >
            Control de Estudiantes
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Visualiza el listado de alumnos inscritos en tus asignaturas
            correspondientes, filtra por cursos y realiza búsquedas directas.
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
              Inscripciones en tus Cursos
            </span>
            <Users className="text-blue-500" size={16} />
          </div>
          <p className="text-xl font-black">
            {loading ? "..." : inscripciones.length} Alumnos Totales
          </p>
        </div>

        <button
          onClick={() =>
            alert("Redireccionando al panel modular de Asistencia Diaria...")
          }
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left group flex flex-col justify-between ${
            isDark
              ? "bg-slate-950 border-slate-800 text-white hover:bg-slate-900/60"
              : "bg-white border-transparent shadow-xs hover:bg-gray-50/80"
          }`}
        >
          <div className="flex items-center justify-between mb-2 w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-emerald-500 transition-colors">
              Asistencia Diaria
            </span>
            <CalendarCheck className="text-emerald-500" size={16} />
          </div>
          <p className="text-xl font-black">Tomar Asistencia</p>
        </button>
      </div>

      {/* BARRA DE FILTROS Y BUSCADOR */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
      >
        <div className="relative flex-1 text-left">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Buscar por carné, nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${
              isDark
                ? "bg-slate-900 border-transparent text-slate-200 focus:border-slate-700"
                : "bg-gray-50 border-transparent focus:bg-white focus:border-gray-300"
            }`}
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select
            value={activeCursoFilter}
            onChange={(e) => setActiveCursoFilter(e.target.value)}
            className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${
              isDark
                ? "bg-slate-900 border-transparent text-slate-200"
                : "bg-gray-50 border-transparent"
            }`}
          >
            {cursosOptions.map((curso) => (
              <option key={curso} value={curso}>
                {curso === "Todos" ? "Todas las Asignaturas" : curso}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE ESTUDIANTES */}
      <div
        className={`border rounded-2xl overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400 font-medium">
              Cargando estudiantes...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-slate-800 bg-slate-900/50 text-slate-400" : "bg-gray-50/70 text-[#b3888d]"}`}
                >
                  <th className="py-3.5 px-6 text-center w-40">Carné UMG</th>
                  <th className="py-3.5 px-6">Estudiante</th>
                  <th className="py-3.5 px-6">Correo Institucional</th>
                  <th className="py-3.5 px-6">Curso Matriculado</th>
                  <th className="py-3.5 px-6 text-center w-20">Sec.</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {inscripcionesFiltradas.length > 0 ? (
                  inscripcionesFiltradas.map((i) => {
                    const est = i.Estudiantes;
                    const nombre = est?.Usuarios
                      ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}`
                      : "—";
                    const correo = est?.Usuarios?.correo ?? "—";
                    const carnet = est?.carnet ?? "—";
                    const cursoNombre = i.Asignaciones?.Cursos?.nombre ?? "—";
                    const seccion = i.Asignaciones?.seccion ?? "—";

                    return (
                      <tr
                        key={i.id_inscripcion}
                        className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6 text-center font-mono font-bold text-blue-500 text-[11px]">
                          {carnet}
                        </td>

                        <td
                          className={`py-4 px-6 font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
                        >
                          {nombre}
                        </td>

                        <td className="py-4 px-6 font-medium text-gray-500 dark:text-slate-400">
                          <div className="flex items-center space-x-1.5">
                            <Mail
                              size={12}
                              className="text-gray-400 shrink-0"
                            />
                            <span>{correo}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium text-gray-500 dark:text-slate-400">
                          {cursoNombre}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                              isDark
                                ? "bg-slate-800 text-slate-300"
                                : "bg-gray-100 text-slate-600"
                            }`}
                          >
                            {seccion}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No se encontraron alumnos inscritos bajo este criterio.
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
