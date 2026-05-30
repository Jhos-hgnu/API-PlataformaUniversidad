import React, { useState, useEffect, useCallback } from "react";
import {
  FileSpreadsheet,
  Users,
  Search,
  Eye,
  ArrowLeft,
  Save,
  Filter,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { getThemeStyles } from "../../../utils/themeStyles";
import { docentesService } from "../../../services/docentes.service";
import { asignacionesService } from "../../../services/asignaciones.service";
import { inscripcionesService } from "../../../services/inscripciones.service";
import { notasService } from "../../../services/notas.service";

interface CursoActa {
  id_asignacion: number;
  codigo_curso: string;
  nombre_curso: string;
  seccion: string;
  total_estudiantes: number;
  estado_acta: "ABIERTA" | "REVISION" | "CERRADA";
}

interface NotaEdit {
  idInscripcion: number;
  idEstudiante: number;
  carnet: string;
  nombre: string;
  notaFinal: number;
  idNota?: number;
}

export const ControlNotas: React.FC = () => {
  const { theme, user } = useAuth();
  const globalStyles = getThemeStyles(theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const [actas, setActas] = useState<CursoActa[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoActa | null>(
    null,
  );
  const [estudiantesNotas, setEstudiantesNotas] = useState<NotaEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // EFECTO DE CARGA DE ASIGNACIONES Y ACTAS
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
            setActas(
              aRes.data.map((a) => ({
                id_asignacion: a.id_asignacion,
                codigo_curso: a.Cursos?.codigo ?? "",
                nombre_curso: a.Cursos?.nombre ?? "",
                seccion: a.seccion,
                total_estudiantes: 0,
                estado_acta: "ABIERTA" as const,
              })),
            );
          })
          .catch((err) => console.error("Error al cargar asignaciones:", err))
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        console.error("Error al cargar docentes:", err);
        setLoading(false);
      });
  }, [user]);

  // PROCESAMIENTO Y CARGA DE CALIFICACIONES
  const cargarEstudiantes = useCallback(async (asignacionId: number) => {
    try {
      const [iRes, nRes] = await Promise.all([
        inscripcionesService.getByAsignacion(asignacionId),
        notasService.getAll(),
      ]);
      const inscripciones = iRes.data;
      const notas = nRes.data;

      const editList: NotaEdit[] = inscripciones.map((ins) => {
        const nota = notas.find((n) => n.id_inscripcion === ins.id_inscripcion);
        const est = ins.Estudiantes;
        return {
          idInscripcion: ins.id_inscripcion,
          idEstudiante: est?.id_estudiante ?? 0,
          carnet: est?.carnet ?? "",
          nombre: est?.Usuarios
            ? `${est.Usuarios.nombre} ${est.Usuarios.apellido}`
            : "",
          notaFinal: nota?.nota_final ?? 0,
          idNota: nota?.id_nota,
        };
      });
      setEstudiantesNotas(editList);
    } catch (err) {
      console.error("Error al cargar estudiantes o notas:", err);
    }
  }, []);

  // CONTROLADORES DE EVENTOS Y PERSISTENCIA
  const seleccionarCurso = async (acta: CursoActa) => {
    setCursoSeleccionado(acta);
    await cargarEstudiantes(acta.id_asignacion);
  };

  const handleNotaChange = (idInscripcion: number, valor: string) => {
    const num = Math.min(100, Math.max(0, parseInt(valor) || 0));
    setEstudiantesNotas((prev) =>
      prev.map((e) =>
        e.idInscripcion === idInscripcion ? { ...e, notaFinal: num } : e,
      ),
    );
  };

  const guardarNotas = async () => {
    setSaving(true);
    try {
      for (const e of estudiantesNotas) {
        if (e.idNota) {
          await notasService.update(e.idNota, { nota_final: e.notaFinal });
        } else {
          const created = await notasService.create({
            id_inscripcion: e.idInscripcion,
            nota_final: e.notaFinal,
          });
          setEstudiantesNotas((prev) =>
            prev.map((p) =>
              p.idInscripcion === e.idInscripcion
                ? { ...p, idNota: created.data.id_nota }
                : p,
            ),
          );
        }
      }
      setCursoSeleccionado(null);
    } catch (err) {
      console.error("Error al guardar las calificaciones:", err);
    }
    setSaving(false);
  };

  // CONFIGURACIÓN DE ELEMENTOS DE DISEÑO Y FILTROS
  const isDark = theme === "oscuro";
  const isCoquette = theme === "coquette";

  const actasFiltradas = actas.filter((acta) => {
    const matchesSearch =
      acta.nombre_curso.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acta.codigo_curso.includes(searchQuery);
    const matchesFilter =
      filterEstado === "Todos" || acta.estado_acta === filterEstado;
    return matchesSearch && matchesFilter;
  });

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

  // RENDER: FORMULARIO DE EDICIÓN DE CALIFICACIONES
  if (cursoSeleccionado) {
    return (
      <div
        className={`space-y-6 transition-all duration-300 w-full text-left ${globalStyles.page}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setCursoSeleccionado(null)}
            className={`flex items-center space-x-2 text-xs font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
              isDark
                ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                : isCoquette
                  ? "bg-white border-[#fbcdd4] text-[#6d4c51] hover:bg-[#fff5f6]"
                  : "bg-white border-transparent hover:bg-gray-50 shadow-xs"
            }`}
          >
            <ArrowLeft size={14} />
            <span>Volver a Cursos</span>
          </button>
        </div>

        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <span className="font-mono text-[11px] font-bold text-blue-500 block">
            {cursoSeleccionado.codigo_curso}
          </span>
          <h2
            className="text-sm font-bold mt-0.5"
            style={{ color: titleColor }}
          >
            {cursoSeleccionado.nombre_curso} — Sección "
            {cursoSeleccionado.seccion}"
          </h2>
          <p className={`text-xs mt-1 ${c.desc}`}>Ciclo Académico Lectivo</p>
        </div>

        <div
          className={`border rounded-2xl overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-slate-800 bg-slate-900/50 text-slate-400" : "bg-gray-50/70 text-[#b3888d]"}`}
                >
                  <th className="py-3.5 px-6">Carnet</th>
                  <th className="py-3.5 px-6">Nombre del Estudiante</th>
                  <th className="py-3.5 px-6 text-center w-32">
                    Nota Final (0-100)
                  </th>
                  <th className="py-3.5 px-6 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {estudiantesNotas.length > 0 ? (
                  estudiantesNotas.map((e) => {
                    const aprobado = e.notaFinal >= 61;
                    return (
                      <tr
                        key={e.idInscripcion}
                        className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6 font-mono font-bold text-gray-500">
                          {e.carnet}
                        </td>
                        <td
                          className={`py-4 px-6 font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
                        >
                          {e.nombre}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <input
                            type="number"
                            value={e.notaFinal}
                            onChange={(ev) =>
                              handleNotaChange(e.idInscripcion, ev.target.value)
                            }
                            className={`w-24 text-center py-1.5 border rounded-lg font-bold outline-none transition-all ${
                              isDark
                                ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                : "bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-400"
                            }`}
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${aprobado ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
                          >
                            {aprobado ? "Aprobado" : "Reprobado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No hay estudiantes inscritos en este módulo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setCursoSeleccionado(null)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={guardarNotas}
            disabled={saving}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-50 ${isCoquette ? "bg-[#f472b6]" : "bg-slate-950 dark:bg-blue-600"}`}
          >
            <Save size={14} />
            <span>{saving ? "Guardando..." : "Guardar Calificaciones"}</span>
          </button>
        </div>
      </div>
    );
  }

  // RENDER: VISTA DEL TABLERO GENERAL DE CURSOS
  return (
    <div
      className={`space-y-6 transition-all duration-300 w-full ${globalStyles.page}`}
    >
      <div className="flex items-center space-x-3 text-left">
        <div
          className={`p-3 rounded-xl ${isDark ? "bg-slate-800 text-slate-200" : isCoquette ? "bg-[#fff5f6] text-[#f472b6]" : "bg-slate-100 text-slate-700"}`}
        >
          <FileSpreadsheet size={22} />
        </div>
        <div>
          <h2
            className="text-base font-bold transition-colors"
            style={{ color: titleColor }}
          >
            Control de Actas y Notas
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Gestiona las calificaciones finales de los estudiantes, visualiza el
            estado de las actas y procesa los cierres de ciclo correspondientes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Asignaturas Asignadas
            </span>
            <FileSpreadsheet className="text-blue-500" size={16} />
          </div>
          <p className="text-2xl font-black">
            {loading ? "..." : actas.length}
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Cursos Disponibles
            </span>
            <Users className="text-purple-500" size={16} />
          </div>
          <p className="text-2xl font-black">
            {loading ? "..." : actas.length}
          </p>
        </div>
      </div>

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
            placeholder="Buscar por nombre o código de curso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${isDark ? "bg-slate-900 border-transparent text-slate-200 focus:border-slate-700" : "bg-gray-50 border-transparent focus:bg-white focus:border-gray-300"}`}
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="absolute left-3 text-gray-400" size={13} />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? "bg-slate-900 border-transparent text-slate-200" : "bg-gray-50 border-transparent"}`}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="REVISION">En Revisión</option>
            <option value="CERRADA">Cerradas</option>
          </select>
        </div>
      </div>

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
                  <th className="py-3.5 px-6 text-center">Estado Acta</th>
                  <th className="py-3.5 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {actasFiltradas.length > 0 ? (
                  actasFiltradas.map((acta) => (
                    <tr
                      key={acta.id_asignacion}
                      className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="py-4 px-6 text-left">
                        <span className="font-mono text-blue-500 font-bold block text-[11px]">
                          {acta.codigo_curso}
                        </span>
                        <span
                          className={`font-bold text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}
                        >
                          {acta.nombre_curso}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-300">
                        {acta.seccion}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                            acta.estado_acta === "CERRADA"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : acta.estado_acta === "REVISION"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-blue-500/10 text-blue-600"
                          }`}
                        >
                          {acta.estado_acta}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => seleccionarCurso(acta)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isCoquette
                              ? "bg-[#f472b6] text-white border-transparent"
                              : "bg-slate-950 text-white dark:bg-blue-600 border-transparent"
                          }`}
                        >
                          <Eye size={13} />
                          <span>Ver / Ingresar Notas</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No se encontraron cursos asignados que coincidan con los
                      filtros seleccionados.
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
