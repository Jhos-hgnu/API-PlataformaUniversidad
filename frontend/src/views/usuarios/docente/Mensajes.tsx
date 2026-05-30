import React, { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { getThemeStyles } from "../../../utils/themeStyles";
import {
  Mail,
  Megaphone,
  Send,
  Search,
  AlertCircle,
  Info,
  Inbox,
  Trash2,
  Plus,
  X,
  Filter,
} from "lucide-react";

interface MensajePrivado {
  id: string;
  fecha: string;
  remitente: string;
  rol: "ADMIN" | "DOCENTE" | "ESTUDIANTE";
  asunto: string;
  contenido: string;
  tipo: "ENTRADA" | "ENVIADO";
  leido: boolean;
}

interface AnuncioCurso {
  id: string;
  curso: string;
  codigoCurso: string;
  titulo: string;
  contenido: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  fechaPublicacion: string;
}

export const Mensajes: React.FC = () => {
  const { theme } = useAuth();
  const globalStyles = getThemeStyles(theme);
  const [activeTab, setActiveTab] = useState<"mensajes" | "anuncios">(
    "mensajes",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoMensajeFilter, setTipoMensajeFilter] = useState<string>("TODOS");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDestino, setFormDestino] = useState("Programación I");
  const [formAsunto, setFormAsunto] = useState("");
  const [formContenido, setFormContenido] = useState("");
  const [formPrioridad, setFormPrioridad] = useState<"ALTA" | "MEDIA" | "BAJA">(
    "MEDIA",
  );

  // MOCK DATA DE BANDEJA DE ENTRADA Y CARTELERA DE AVISOS
  const [mensajes, setMensajes] = useState<MensajePrivado[]>([
    {
      id: "m-1",
      fecha: "2026-05-20 14:32",
      remitente: "Madelin Cerón",
      rol: "ESTUDIANTE",
      asunto: "Duda sobre proyecto final",
      contenido:
        "Ingeniero, buenas tardes. Tengo una duda con la configuración de la base de datos de la tarea 3...",
      tipo: "ENTRADA",
      leido: false,
    },
    {
      id: "m-2",
      fecha: "2026-05-20 12:15",
      remitente: "Control Académico (Admin)",
      rol: "ADMIN",
      asunto: "Cierre de Actas Primer Parcial",
      contenido:
        "Estimados docentes, se les recuerda que la plataforma para cargar notas cerrará este viernes...",
      tipo: "ENTRADA",
      leido: true,
    },
    {
      id: "m-3",
      fecha: "2026-05-20 10:45",
      remitente: "A: Josué Hicho",
      rol: "DOCENTE",
      asunto: "Coordinación de laboratorios",
      contenido:
        "Hola Josué, te comparto la distribución de los salones para el examen del sábado...",
      tipo: "ENVIADO",
      leido: true,
    },
    {
      id: "m-4",
      fecha: "2026-05-19 18:22",
      remitente: "Dulce Prado",
      rol: "ESTUDIANTE",
      asunto: "Inasistencia por salud",
      contenido:
        "Adjunto constancia médica por la cual no pude asistir a la clase presencial de Estructuras...",
      tipo: "ENTRADA",
      leido: false,
    },
  ]);

  const [anuncios, setAnuncios] = useState<AnuncioCurso[]>([
    {
      id: "a-1",
      curso: "Programación I",
      codigoCurso: "090",
      titulo: "Publicación de Notas - Parcial II",
      contenido:
        "Ya se encuentran disponibles los cuadros de zonas en el portal institucional.",
      prioridad: "MEDIA",
      fechaPublicacion: "2026-05-18",
    },
    {
      id: "a-2",
      curso: "Estructuras de Datos",
      codigoCurso: "092",
      titulo: "🚨 Cambio de Aula para Examen Final",
      contenido:
        "Atención: El examen final se realizará de forma presencial en el Laboratorio 302 del Edificio T.",
      prioridad: "ALTA",
      fechaPublicacion: "2026-05-19",
    },
    {
      id: "a-3",
      curso: "Programación I",
      codigoCurso: "090",
      titulo: "Material de Apoyo: Grafos y Árboles",
      contenido:
        "Les he compartido un enlace de GitHub con ejemplos prácticos para que estudien.",
      prioridad: "BAJA",
      fechaPublicacion: "2026-05-20",
    },
  ]);

  // CÓMPUTO DE MÉTRICAS INFORMATIVAS
  const noLeidos = mensajes.filter(
    (m) => !m.leido && m.tipo === "ENTRADA",
  ).length;
  const anunciosCriticos = anuncios.filter(
    (a) => a.prioridad === "ALTA",
  ).length;

  // FILTRADO DINÁMICO DE DATOS
  const mensajesFiltrados = mensajes.filter((m) => {
    const matchesSearch =
      m.remitente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.asunto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo =
      tipoMensajeFilter === "TODOS" || m.tipo === tipoMensajeFilter;
    return matchesSearch && matchesTipo;
  });

  const anunciosFiltrados = anuncios.filter(
    (a) =>
      a.curso.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.titulo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ACCIONES Y DESPACHO DE FORMULARIOS
  const handleCrearMensajeAnuncio = (e: React.FormEvent) => {
    e.preventDefault();
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")} ${String(hoy.getHours()).padStart(2, "0")}:${String(hoy.getMinutes()).padStart(2, "0")}`;

    if (activeTab === "mensajes") {
      const nuevoMensaje: MensajePrivado = {
        id: `m-${Date.now()}`,
        fecha: fechaActual,
        remitente: `A: ${formDestino}`,
        rol: "DOCENTE",
        asunto: formAsunto,
        contenido: formContenido,
        tipo: "ENVIADO",
        leido: true,
      };
      setMensajes([nuevoMensaje, ...mensajes]);
    } else {
      const nuevoAnuncio: AnuncioCurso = {
        id: `a-${Date.now()}`,
        curso: formDestino,
        codigoCurso: formDestino === "Programación I" ? "090" : "092",
        titulo: formAsunto,
        contenido: formContenido,
        prioridad: formPrioridad,
        fechaPublicacion: fechaActual.split(" ")[0],
      };
      setAnuncios([nuevoAnuncio, ...anuncios]);
    }

    setIsModalOpen(false);
    setFormAsunto("");
    setFormContenido("");
  };

  const eliminarMensaje = (id: string) =>
    setMensajes(mensajes.filter((m) => m.id !== id));
  const eliminarAnuncio = (id: string) =>
    setAnuncios(anuncios.filter((a) => a.id !== id));

  // CONFIGURACIÓN DE APARIENCIA Y ESTILOS DE TEMA
  const isDark = theme === "oscuro";
  const isCoquette = theme === "coquette";
  const titleColor = isDark ? "#f8fafc" : isCoquette ? "#6d4c51" : "#0f172a";
  const descColor = isDark
    ? "text-slate-400"
    : isCoquette
      ? "text-[#b3888d]"
      : "text-gray-400";

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
          <Mail size={22} />
        </div>
        <div>
          <h2
            className="text-base font-bold transition-colors"
            style={{ color: titleColor }}
          >
            Centro de Mensajería y Avisos
          </h2>
          <p className={`text-xs transition-colors ${descColor}`}>
            Gestiona la correspondencia interna con alumnos o administración y
            publica avisos directos en el tablón de tus asignaturas asignadas.
          </p>
        </div>
      </div>

      {/* TARJETAS DE INFORMACIÓN DE COMUNICACIONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Mensajes No Leídos
            </span>
            <Inbox className="text-blue-500" size={16} />
          </div>
          <p className="text-xl font-black">{noLeidos} Pendientes</p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Avisos de Alta Prioridad
            </span>
            <AlertCircle className="text-rose-500" size={16} />
          </div>
          <p className="text-xl font-black">{anunciosCriticos} Alertas</p>
        </div>

        <div
          className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-transparent shadow-xs"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Anuncios Vigentes
            </span>
            <Megaphone className="text-emerald-500" size={16} />
          </div>
          <p className="text-xl font-black">{anuncios.length} Publicaciones</p>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS ESTILIZADO */}
      <div
        className={`flex space-x-2 border-b text-left ${isDark ? "border-slate-800" : "border-gray-100"}`}
      >
        <button
          onClick={() => {
            setActiveTab("mensajes");
            setSearchQuery("");
          }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "mensajes"
              ? isDark
                ? "border-blue-500 text-blue-400"
                : isCoquette
                  ? "border-[#f472b6] text-[#6d4c51]"
                  : "border-slate-900 text-slate-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Mail size={14} />
          <span>Bandeja de Intercambio</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("anuncios");
            setSearchQuery("");
          }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "anuncios"
              ? isDark
                ? "border-blue-500 text-blue-400"
                : isCoquette
                  ? "border-[#f472b6] text-[#6d4c51]"
                  : "border-slate-900 text-slate-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Megaphone size={14} />
          <span>Tablón de Avisos</span>
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
            placeholder={
              activeTab === "mensajes"
                ? "Filtrar por remitente o asunto..."
                : "Buscar anuncios por curso o título..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none transition-all ${
              isDark
                ? "bg-slate-900 border-transparent text-slate-200 focus:border-slate-700"
                : "bg-gray-50 border-transparent focus:bg-white focus:border-gray-300"
            }`}
          />
        </div>

        <div className="flex items-center space-x-3 justify-end">
          {activeTab === "mensajes" && (
            <div className="relative flex items-center">
              <Filter className="absolute left-3 text-gray-400" size={13} />
              <select
                value={tipoMensajeFilter}
                onChange={(e) => setTipoMensajeFilter(e.target.value)}
                className={`pl-8 pr-8 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${
                  isDark
                    ? "bg-slate-900 border-transparent text-slate-200"
                    : "bg-gray-50 border-transparent text-gray-700"
                }`}
              >
                <option value="TODOS">Todos los mensajes</option>
                <option value="ENTRADA">Recibidos (Entrada)</option>
                <option value="ENVIADO">Enviados</option>
              </select>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : isCoquette
                  ? "bg-[#f472b6] hover:bg-[#e05fa4] text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            <Plus size={14} />
            <span>{activeTab === "mensajes" ? "Redactar" : "Nuevo Aviso"}</span>
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE CONTENIDO */}
      <div
        className={`border rounded-2xl overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent shadow-xs"}`}
      >
        <div className="overflow-x-auto">
          {activeTab === "mensajes" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-slate-800 bg-slate-900/50 text-slate-400" : "bg-gray-50/70 text-[#b3888d]"}`}
                >
                  <th className="py-3.5 px-6 w-40 text-center">Fecha / Hora</th>
                  <th className="py-3.5 px-6 w-32 text-center">Dirección</th>
                  <th className="py-3.5 px-6 w-56">Contacto / Usuario</th>
                  <th className="py-3.5 px-6">Asunto y Contenido</th>
                  <th className="py-3.5 px-6 text-center w-20">Acciones</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {mensajesFiltrados.length > 0 ? (
                  mensajesFiltrados.map((m) => (
                    <tr
                      key={m.id}
                      className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"} ${!m.leido && m.tipo === "ENTRADA" ? (isDark ? "bg-blue-950/20 font-bold" : "bg-blue-50/30 font-bold") : ""}`}
                    >
                      <td className="py-4 px-6 text-center font-mono text-gray-400 dark:text-slate-400 text-[11px]">
                        {m.fecha}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                            m.tipo === "ENTRADA"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                              : "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
                          }`}
                        >
                          {m.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {m.remitente}
                        </div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">
                          {m.rol}
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-md">
                        <div
                          className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}
                        >
                          {m.asunto}
                        </div>
                        <div className="text-gray-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                          {m.contenido}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => eliminarMensaje(m.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No se encontraron mensajes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-slate-800 bg-slate-900/50 text-slate-400" : "bg-gray-50/70 text-[#b3888d]"}`}
                >
                  <th className="py-3.5 px-6 w-40 text-center">Publicado</th>
                  <th className="py-3.5 px-6 w-56">Curso Destino</th>
                  <th className="py-3.5 px-6 w-32 text-center">Prioridad</th>
                  <th className="py-3.5 px-6">Título y Aviso Informativo</th>
                  <th className="py-3.5 px-6 text-center w-20">Acciones</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${isDark ? "divide-slate-800" : isCoquette ? "divide-[#fbcdd4]/40" : "divide-gray-100/70"}`}
              >
                {anunciosFiltrados.length > 0 ? (
                  anunciosFiltrados.map((a) => (
                    <tr
                      key={a.id}
                      className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="py-4 px-6 text-center font-mono text-gray-400 dark:text-slate-400">
                        {a.fechaPublicacion}
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {a.curso}
                        </div>
                        <div className="text-[10px] font-mono text-blue-500 mt-0.5">
                          Código: {a.codigoCurso}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            a.prioridad === "BAJA"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                              : a.prioridad === "MEDIA"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                          }`}
                        >
                          {a.prioridad === "BAJA" ? (
                            <Info size={10} />
                          ) : (
                            <AlertCircle size={10} />
                          )}
                          <span>{a.prioridad}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div
                          className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {a.titulo}
                        </div>
                        <div className="text-gray-500 dark:text-slate-400 text-[11px] whitespace-normal mt-1">
                          {a.contenido}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => eliminarAnuncio(a.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      No hay avisos cartelera cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL FORMULARIO DE INSERCIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div
            className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border transition-all ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-transparent"}`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-slate-800">
              <h3
                className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                {activeTab === "mensajes"
                  ? "Enviar Mensaje Directo"
                  : "Publicar Aviso al Alumnado"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleCrearMensajeAnuncio}
              className="mt-4 space-y-4 text-left"
            >
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  {activeTab === "mensajes"
                    ? "Destinatario (Estudiante o Personal)"
                    : "Curso Destino"}
                </label>
                {activeTab === "mensajes" ? (
                  <input
                    type="text"
                    required
                    placeholder="Ej. Madelin Cerón o Control Académico"
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-slate-700" : "bg-gray-50 border-gray-200 focus:border-gray-300"}`}
                  />
                ) : (
                  <select
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <option value="Programación I">
                      Programación I (Código: 090)
                    </option>
                    <option value="Estructuras de Datos">
                      Estructuras de Datos (Código: 092)
                    </option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Título / Asunto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Modificación de lineamientos"
                  value={formAsunto}
                  onChange={(e) => setFormAsunto(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-slate-700" : "bg-gray-50 border-gray-200 focus:border-gray-300"}`}
                />
              </div>

              {activeTab === "anuncios" && (
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                    Nivel de Alerta
                  </label>
                  <select
                    value={formPrioridad}
                    onChange={(e) =>
                      setFormPrioridad(
                        e.target.value as "ALTA" | "MEDIA" | "BAJA",
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-xl text-xs outline-none appearance-none cursor-pointer font-medium ${isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <option value="BAJA">Informativo Común (BAJA)</option>
                    <option value="MEDIA">
                      Importante / Recordatorio (MEDIA)
                    </option>
                    <option value="ALTA">Urgente / Crítico (ALTA)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Cuerpo del Comunicado
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escriba aquí los detalles correspondientes..."
                  value={formContenido}
                  onChange={(e) => setFormContenido(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-xs outline-none resize-none ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-slate-700" : "bg-gray-50 border-gray-200 focus:border-gray-300"}`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 border font-bold text-xs rounded-xl cursor-pointer transition-colors ${isDark ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex items-center space-x-1 px-4 py-2 text-white font-bold text-xs rounded-xl cursor-pointer transition-all ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700"
                      : isCoquette
                        ? "bg-[#f472b6] hover:bg-[#e05fa4]"
                        : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <Send size={12} />
                  <span>
                    {activeTab === "mensajes" ? "Enviar" : "Publicar"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
