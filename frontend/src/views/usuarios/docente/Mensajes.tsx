import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Mail, Megaphone, Send, Search, AlertCircle, Info, Inbox, Trash2, Plus, X } from 'lucide-react';

interface MensajePrivado {
  id: string;
  fecha: string;
  remitente: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  asunto: string;
  contenido: string;
  tipo: 'ENTRADA' | 'ENVIADO';
  leido: boolean;
}

interface AnuncioCurso {
  id: string;
  curso: string;
  codigoCurso: string;
  titulo: string;
  contenido: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  fechaPublicacion: string;
}

export const Mensajes: React.FC = () => {
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  const [activeTab, setActiveTab] = useState<'mensajes' | 'anuncios'>('mensajes');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoMensajeFilter, setTipoMensajeFilter] = useState<string>('TODOS');

  // Estado para un modal básico de envío de mensajes/anuncios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDestino, setFormDestino] = useState('Programación I'); // o usuario
  const [formAsunto, setFormAsunto] = useState('');
  const [formContenido, setFormContenido] = useState('');
  const [formPrioridad, setFormPrioridad] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('MEDIA');

  // Datos Mock de Mensajes Privados (Bandeja)
  const [mensajes, setMensajes] = useState<MensajePrivado[]>([
    { id: 'm-1', fecha: '2026-05-20 14:32', remitente: 'Madelin Cerón', rol: 'ESTUDIANTE', asunto: 'Duda sobre proyecto final', contenido: 'Ingeniero, buenas tardes. Tengo una duda con la configuración de la base de datos de la tarea 3...', tipo: 'ENTRADA', leido: false },
    { id: 'm-2', fecha: '2026-05-20 12:15', remitente: 'Control Académico (Admin)', rol: 'ADMIN', asunto: 'Cierre de Actas Primer Parcial', contenido: 'Estimados docentes, se les recuerda que la plataforma para cargar notas cerrará este viernes...', tipo: 'ENTRADA', leido: true },
    { id: 'm-3', fecha: '2026-05-20 10:45', remitente: 'A: Josué Hicho', rol: 'DOCENTE', asunto: 'Coordinación de laboratorios', contenido: 'Hola Josué, te comparto la distribución de los salones para el examen del sábado...', tipo: 'ENVIADO', leido: true },
    { id: 'm-4', fecha: '2026-05-19 18:22', remitente: 'Dulce Prado', rol: 'ESTUDIANTE', asunto: 'Inasistencia por salud', contenido: 'Adjunto constancia médica por la cual no pude asistir a la clase presencial de Estructuras...', tipo: 'ENTRADA', leido: false }
  ]);

  // Datos Mock de Tablón de Anuncios por Curso
  const [anuncios, setAnuncios] = useState<AnuncioCurso[]>([
    { id: 'a-1', curso: 'Programación I', codigoCurso: '090', titulo: 'Publicación de Notas - Parcial II', contenido: 'Ya se encuentran disponibles los cuadros de zonas en el portal institucional.', prioridad: 'MEDIA', fechaPublicacion: '2026-05-18' },
    { id: 'a-2', curso: 'Estructuras de Datos', codigoCurso: '092', titulo: '🚨 Cambio de Aula para Examen Final', contenido: 'Atención: El examen final se realizará de forma presencial en el Laboratorio 302 del Edificio T.', prioridad: 'ALTA', fechaPublicacion: '2026-05-19' },
    { id: 'a-3', curso: 'Programación I', codigoCurso: '090', titulo: 'Material de Apoyo: Grafos y Árboles', contenido: 'Les he compartido un enlace de GitHub con ejemplos prácticos para que estudien.', prioridad: 'BAJA', fechaPublicacion: '2026-05-20' }
  ]);

  // Totales dinámicos para métricas
  const noLeidos = mensajes.filter(m => !m.leido && m.tipo === 'ENTRADA').length;
  const anunciosCriticos = anuncios.filter(a => a.prioridad === 'ALTA').length;

  // Filtrado de mensajes privados
  const mensajesFiltrados = mensajes.filter(m => {
    const matchesSearch = m.remitente.toLowerCase().includes(searchQuery.toLowerCase()) || m.asunto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = tipoMensajeFilter === 'TODOS' || m.tipo === tipoMensajeFilter;
    return matchesSearch && matchesTipo;
  });

  // Filtrado de anuncios
  const anunciosFiltrados = anuncios.filter(a => 
    a.curso.toLowerCase().includes(searchQuery.toLowerCase()) || a.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCrearMensajeAnuncio = (e: React.FormEvent) => {
    e.preventDefault();
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')} ${String(hoy.getHours()).padStart(2, '0')}:${String(hoy.getMinutes()).padStart(2, '0')}`;

    if (activeTab === 'mensajes') {
      const nuevoMensaje: MensajePrivado = {
        id: `m-${Date.now()}`,
        fecha: fechaActual,
        remitente: `A: ${formDestino}`,
        rol: 'DOCENTE',
        asunto: formAsunto,
        contenido: formContenido,
        tipo: 'ENVIADO',
        leido: true
      };
      setMensajes([nuevoMensaje, ...mensajes]);
    } else {
      const nuevoAnuncio: AnuncioCurso = {
        id: `a-${Date.now()}`,
        curso: formDestino,
        codigoCurso: formDestino === 'Programación I' ? '090' : '092',
        titulo: formAsunto,
        contenido: formContenido,
        prioridad: formPrioridad,
        fechaPublicacion: fechaActual.split(' ')[0]
      };
      setAnuncios([nuevoAnuncio, ...anuncios]);
    }

    setIsModalOpen(false);
    setFormAsunto('');
    setFormContenido('');
  };

  const eliminarMensaje = (id: string) => {
    setMensajes(mensajes.filter(m => m.id !== id));
  };

  const eliminarAnuncio = (id: string) => {
    setAnuncios(anuncios.filter(a => a.id !== id));
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* TARJETAS DE INFORMACIÓN DE COMUNICACIONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Inbox size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Mensajes No Leídos</p>
            <h4 className="text-xl font-bold text-slate-800">{noLeidos} Pendientes</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Avisos de Alta Prioridad</p>
            <h4 className="text-xl font-bold text-slate-800">{anunciosCriticos} Alertas</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Megaphone size={20} /></div>
          <div className="text-left">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Anuncios Vigentes</p>
            <h4 className="text-xl font-bold text-slate-800">{anuncios.length} Publicaciones</h4>
          </div>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS */}
      <div className={`flex space-x-2 border-b ${styles.border} pb-1`}>
        <button
          onClick={() => { setActiveTab('mensajes'); setSearchQuery(''); }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'mensajes' ? 'border-[#1a365d] text-[#1a365d]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Mail size={14} />
          <span>Bandeja de Entrada e Intercambio</span>
        </button>
        <button
          onClick={() => { setActiveTab('anuncios'); setSearchQuery(''); }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'anuncios' ? 'border-[#1a365d] text-[#1a365d]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Megaphone size={14} />
          <span>Tablón de Avisos y Cursos</span>
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
        
        {/* BARRA DE HERRAMIENTAS DINÁMICA */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/30">
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder={activeTab === 'mensajes' ? "Filtrar por remitente o asunto..." : "Buscar anuncios por curso o título..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
              />
            </div>

            {/* Filtro adicional solo para Mensajes Privados */}
            {activeTab === 'mensajes' && (
              <select 
                value={tipoMensajeFilter}
                onChange={(e) => setTipoMensajeFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-gray-300 outline-none text-gray-700 cursor-pointer font-medium"
              >
                <option value="TODOS">Todos los mensajes</option>
                <option value="ENTRADA">Recibidos (Entrada)</option>
                <option value="ENVIADO">Enviados</option>
              </select>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
            >
              <Plus size={13} />
              <span>{activeTab === 'mensajes' ? 'Redactar Mensaje' : 'Nuevo Aviso'}</span>
            </button>
          </div>
        </div>

        {/* TABLA: BANDEJA DE MENSAJES PRIVADOS */}
        {activeTab === 'mensajes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Fecha / Hora</th>
                  <th className="py-3.5 px-6">Dirección</th>
                  <th className="py-3.5 px-6">Contacto / Usuario</th>
                  <th className="py-3.5 px-6">Asunto y Contenido</th>
                  <th className="py-3.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {mensajesFiltrados.length > 0 ? (
                  mensajesFiltrados.map((m) => (
                    <tr key={m.id} className={`hover:bg-gray-50/20 transition-colors ${!m.leido && m.tipo === 'ENTRADA' ? 'bg-blue-50/20 font-medium' : ''}`}>
                      <td className="py-4 px-6 whitespace-nowrap text-gray-400 font-mono text-[11px]">{m.fecha}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          m.tipo === 'ENTRADA' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {m.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-left">
                        <div className="font-semibold text-slate-800">{m.remitente}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{m.rol}</div>
                      </td>
                      <td className="py-4 px-6 max-w-md text-left">
                        <div className="font-semibold text-slate-800">{m.asunto}</div>
                        <div className="text-gray-500 text-[11px] truncate">{m.contenido}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => eliminarMensaje(m.id)}
                          title="Eliminar mensaje"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                      No se encontraron mensajes en esta carpeta.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA: TABLÓN DE ANUNCIOS */}
        {activeTab === 'anuncios' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Publicado</th>
                  <th className="py-3.5 px-6">Curso Destino</th>
                  <th className="py-3.5 px-6">Prioridad</th>
                  <th className="py-3.5 px-6">Título y Aviso Informativo</th>
                  <th className="py-3.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {anunciosFiltrados.length > 0 ? (
                  anunciosFiltrados.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap text-gray-400 font-mono">{a.fechaPublicacion}</td>
                      <td className="py-4 px-6 text-left">
                        <div className="font-semibold text-slate-800">{a.curso}</div>
                        <div className="text-[10px] font-mono text-blue-600">Código: {a.codigoCurso}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          a.prioridad === 'BAJA' ? 'bg-blue-50 text-blue-600' :
                          a.prioridad === 'MEDIA' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {a.prioridad === 'BAJA' && <Info size={10} />}
                          {a.prioridad === 'MEDIA' && <AlertCircle size={10} />}
                          {a.prioridad === 'ALTA' && <AlertCircle size={10} />}
                          <span>{a.prioridad}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs text-left">
                        <div className="font-bold text-slate-800">{a.titulo}</div>
                        <div className="text-gray-600 text-[11px] whitespace-normal mt-0.5">{a.contenido}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => eliminarAnuncio(a.id)}
                          title="Remover aviso"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                      No hay avisos cartelera cargados para tus cursos asignados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL: REDACTAR COMUNICADO / MENSAJE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl border ${styles.border} ${styles.panel} animate-in fade-in zoom-in-95 duration-150`}>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {activeTab === 'mensajes' ? 'Enviar Mensaje Directo' : 'Publicar Aviso al Alumnado'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCrearMensajeAnuncio} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {activeTab === 'mensajes' ? 'Destinatario (Estudiante o Personal)' : 'Curso Destino'}
                </label>
                {activeTab === 'mensajes' ? (
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Madelin Cerón o Control Académico"
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                  />
                ) : (
                  <select
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-slate-400 text-gray-700 cursor-pointer font-medium"
                  >
                    <option value="Programación I">Programación I (Código: 090)</option>
                    <option value="Estructuras de Datos">Estructuras de Datos (Código: 092)</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Título / Asunto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Modificación de lineamientos / Consulta"
                  value={formAsunto}
                  onChange={(e) => setFormAsunto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700"
                />
              </div>

              {activeTab === 'anuncios' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nivel de Alerta</label>
                  <select
                    value={formPrioridad}
                    onChange={(e) => setFormPrioridad(e.target.value as 'ALTA' | 'MEDIA' | 'BAJA')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-slate-400 text-gray-700 cursor-pointer font-medium"
                  >
                    <option value="BAJA">Informativo Común (BAJA)</option>
                    <option value="MEDIA">Importante / Recordatorio (MEDIA)</option>
                    <option value="ALTA">Urgente / Crítico (ALTA)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cuerpo del Comunicado</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Escriba aquí los detalles correspondientes..."
                  value={formContenido}
                  onChange={(e) => setFormContenido(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-slate-400 text-gray-700 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`flex items-center space-x-1 px-4 py-2 text-white font-bold text-xs rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
                >
                  <Send size={12} />
                  <span>{activeTab === 'mensajes' ? 'Enviar Correo' : 'Publicar Tablón'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};