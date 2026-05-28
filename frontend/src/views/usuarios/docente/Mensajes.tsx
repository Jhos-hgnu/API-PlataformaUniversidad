import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { Mail, Megaphone, Search, AlertCircle, Inbox, Trash2, Plus, X } from 'lucide-react';

// TIPADOS e INTERFACES
interface MensajePrivado {
  id: string; fecha: string; remitente: string; asunto: string; contenido: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'; tipo: 'ENTRADA' | 'ENVIADO'; leido: boolean;
}

interface AnuncioCurso {
  id: string; curso: string; codigoCurso: string; titulo: string; contenido: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA'; fechaPublicacion: string;
}

// CONFIGURACIONES ESTATICA
const initialForm = { destino: 'Programación I', asunto: '', contenido: '', prioridad: 'MEDIA' as const };

const CONFIG_ESTILOS: Record<string, Record<string, string>> = {
  oscuro: {
    title: 'text-slate-200', desc: 'text-slate-400', card: 'bg-slate-800 border-slate-700 text-slate-100',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white', headerBg: 'bg-slate-800 text-slate-200',
    bg: 'bg-slate-950 border-slate-800 text-slate-300', input: 'bg-slate-900 border-transparent text-slate-200',
    modal: 'bg-slate-900 border-slate-800 text-white', modalInput: 'bg-slate-950 border-slate-800 text-slate-200',
    btnSec: 'border-slate-800 text-slate-400', textTitle: '#f8fafc', tabActive: 'border-blue-600 text-blue-600 dark:text-slate-200'
  },
  coquette: {
    title: 'text-[#6d4c51] font-bold', desc: 'text-[#b3888d]', card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
    btn: 'bg-[#f472b6] hover:bg-[#ec4899] text-white', headerBg: 'bg-[#fff5f6] text-[#f472b6]',
    bg: 'bg-white border-gray-200 text-slate-700', input: 'bg-gray-50 border-transparent',
    modal: 'bg-white border-gray-100 text-slate-800', modalInput: 'bg-gray-50 border-transparent',
    btnSec: 'border-gray-200 text-gray-500', textTitle: '#6d4c51', tabActive: 'border-[#f472b6] text-[#6d4c51]'
  },
  claro: {
    title: 'text-gray-700 font-bold', desc: 'text-gray-400', card: 'bg-white border-gray-100 text-slate-800',
    btn: 'bg-[#1a365d] hover:bg-[#152c4d] text-white', headerBg: 'bg-slate-100 text-slate-700',
    bg: 'bg-white border-gray-200 text-slate-700', input: 'bg-gray-50 border-transparent',
    modal: 'bg-white border-gray-100 text-slate-800', modalInput: 'bg-gray-50 border-transparent',
    btnSec: 'border-gray-200 text-gray-500', textTitle: '#0f172a', tabActive: 'border-blue-600 text-blue-600 dark:text-slate-200'
  }
};

// COMPONENTE PRINCIPAL
export const Mensajes: React.FC = () => {
  const { theme } = useAuth();
  const c = CONFIG_ESTILOS[CONFIG_ESTILOS[theme] ? theme : 'claro'];
  
  // ESTADOS
  const [activeTab, setActiveTab] = useState<'mensajes' | 'anuncios'>('mensajes');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoMensajeFilter, setTipoMensajeFilter] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const [mensajes, setMensajes] = useState<MensajePrivado[]>([
    { id: 'm-1', fecha: '2026-05-20 14:32', remitente: 'Madelin Cerón', rol: 'ESTUDIANTE', asunto: 'Duda sobre proyecto final', contenido: 'Ingeniero, buenas tardes. Tengo una duda con la configuración de la base de datos de la tarea 3...', tipo: 'ENTRADA', leido: false },
    { id: 'm-2', fecha: '2026-05-20 12:15', remitente: 'Control Académico (Admin)', rol: 'ADMIN', asunto: 'Cierre de Actas Primer Parcial', contenido: 'Estimados docentes, se les recuerda que la plataforma para cargar notas cerrará este viernes...', tipo: 'ENTRADA', leido: true },
    { id: 'm-3', fecha: '2026-05-20 10:45', remitente: 'A: Josué Hicho', rol: 'DOCENTE', asunto: 'Coordinación de laboratorios', contenido: 'Hola Josué, te comparto la distribución de los salones para el examen del sábado...', tipo: 'ENVIADO', leido: true }
  ]);

  const [anuncios, setAnuncios] = useState<AnuncioCurso[]>([
    { id: 'a-1', curso: 'Programación I', codigoCurso: '090', titulo: 'Publicación de Notas - Parcial II', contenido: 'Ya se encuentran disponibles los cuadros de zonas en el portal institucional.', prioridad: 'MEDIA', fechaPublicacion: '2026-05-18' },
    { id: 'a-2', curso: 'Estructuras de Datos', codigoCurso: '092', titulo: '🚨 Cambio de Aula para Examen Final', contenido: 'Atención: El examen final se realizará de forma presencial en el Laboratorio 302 del Edificio T.', prioridad: 'ALTA', fechaPublicacion: '2026-05-19' }
  ]);

  // VARIABLES AUXILIARES Y FILTROS
  const isMsg = activeTab === 'mensajes';
  const query = searchQuery.toLowerCase();

  const mensajesFiltrados = mensajes.filter(m => 
    (tipoMensajeFilter === 'TODOS' || m.tipo === tipoMensajeFilter) &&
    (m.remitente.toLowerCase().includes(query) || m.asunto.toLowerCase().includes(query))
  );

  const anunciosFiltrados = anuncios.filter(a => a.curso.toLowerCase().includes(query) || a.titulo.toLowerCase().includes(query));

  // MANEJADORES DE EVENTOS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCrearMensajeAnuncio = (e: React.FormEvent) => {
    e.preventDefault();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    
    if (isMsg) {
      setMensajes([{ id: `m-${Date.now()}`, fecha: localISOTime.slice(0, 16), remitente: `A: ${form.destino}`, rol: 'DOCENTE', asunto: form.asunto, contenido: form.contenido, tipo: 'ENVIADO', leido: true }, ...mensajes]);
    } else {
      setAnuncios([{ id: `a-${Date.now()}`, curso: form.destino, codigoCurso: form.destino === 'Programación I' ? '090' : '092', titulo: form.asunto, contenido: form.contenido, prioridad: form.prioridad, fechaPublicacion: localISOTime.split(' ')[0] }, ...anuncios]);
    }
    setIsModalOpen(false);
    setForm(initialForm);
  };

  return (
    <div className="space-y-6 w-full text-left">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl transition-all duration-300 ${c.headerBg}`}>
            {isMsg ? <Mail size={22} /> : <Megaphone size={22} />}
          </div>
          <div>
            <h2 className="text-base font-bold transition-colors" style={{ color: c.textTitle }}>
              {isMsg ? 'Centro de Mensajería' : 'Tablón de Anuncios'}
            </h2>
            <p className={`text-xs transition-colors ${c.desc}`}>
              {isMsg ? 'Comunícate de manera directa con tus estudiantes y personal administrativo.' : 'Publica avisos importantes y alertas urgentes para tus asignaturas.'}
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center justify-center select-none h-9 shrink-0 ${c.bg}`}>
          Canal de Comunicación Activo
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: <Inbox size={18} />, label: 'Mensajes No Leídos', count: `${mensajes.filter(m => !m.leido && m.tipo === 'ENTRADA').length} Pendientes`, iconBg: theme === 'oscuro' ? 'bg-slate-900 text-blue-400' : 'bg-blue-50 text-blue-600' },
          { icon: <AlertCircle size={18} />, label: 'Avisos Críticos', count: `${anuncios.filter(a => a.prioridad === 'ALTA').length} Alertas`, iconBg: theme === 'oscuro' ? 'bg-slate-900 text-rose-400' : 'bg-rose-50 text-rose-600' },
          { icon: <Megaphone size={18} />, label: 'Anuncios del Ciclo', count: `${anuncios.length} Publicaciones`, iconBg: theme === 'oscuro' ? 'bg-slate-900 text-purple-400' : 'bg-purple-50 text-purple-600' }
        ].map((card, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border flex items-center space-x-4 ${c.bg}`}>
            <div className={`p-3 rounded-xl ${card.iconBg}`}>{card.icon}</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">{card.label}</span>
              <p className="text-xl font-black mt-0.5">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SELECTOR DE PESTAÑAS */}
      <div className={`flex space-x-2 border-b pb-1 ${theme === 'oscuro' ? 'border-slate-800' : 'border-gray-100'}`}>
        {(['mensajes', 'anuncios'] as const).map(tab => {
          const active = activeTab === tab;
          return (
            <button key={tab} onClick={() => { setActiveTab(tab); setSearchQuery(''); }} className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold border-b-2 cursor-pointer ${active ? c.tabActive : 'border-transparent text-gray-400'}`}>
              {tab === 'mensajes' ? <Mail size={14} /> : <Megaphone size={14} />}
              <span>{tab === 'mensajes' ? 'Bandeja de Entrada' : 'Tablón de Avisos'}</span>
            </button>
          );
        })}
      </div>

      {/* FILTROS Y BOTONES */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${c.bg}`}>
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" placeholder={isMsg ? "Filtrar mensajes..." : "Buscar anuncios..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs outline-none ${c.input}`} />
          </div>
          {isMsg && (
            <select value={tipoMensajeFilter} onChange={(e) => setTipoMensajeFilter(e.target.value)} className={`pl-4 pr-8 py-2 border rounded-xl text-xs outline-none cursor-pointer ${c.input}`}>
              <option value="TODOS">Todos</option>
              <option value="ENTRADA">Recibidos</option>
              <option value="ENVIADO">Enviados</option>
            </select>
          )}
        </div>
        <button onClick={() => setIsModalOpen(true)} className={`flex items-center justify-center space-x-1.5 h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${theme === 'oscuro' ? 'bg-slate-900 text-slate-200 border border-slate-700' : c.btn.split(' ')[0] + ' text-white'}`}>
          <Plus size={14} /><span>{isMsg ? 'Redactar' : 'Nuevo Aviso'}</span>
        </button>
      </div>

      {/* TABLA DE CONTENIDO */}
      <div className={`border rounded-2xl overflow-hidden ${theme === 'oscuro' ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${theme === 'oscuro' ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'bg-gray-50/70 text-gray-500'}`}>
                {isMsg ? (
                  <>
                    <th className="py-3.5 px-6">Fecha</th><th className="py-3.5 px-6 text-center">Dirección</th><th className="py-3.5 px-6">Usuario</th><th className="py-3.5 px-6">Asunto</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-6">Publicado</th><th className="py-3.5 px-6">Curso</th><th className="py-3.5 px-6 text-center">Prioridad</th><th className="py-3.5 px-6">Aviso</th>
                  </>
                )}
                <th className="py-3.5 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${theme === 'oscuro' ? 'divide-slate-800' : 'divide-gray-100'}`}>
              {isMsg ? (
                mensajesFiltrados.length > 0 ? mensajesFiltrados.map(m => (
                  <tr key={m.id} className={`transition-colors ${theme === 'oscuro' ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'} ${!m.leido && m.tipo === 'ENTRADA' ? (theme === 'oscuro' ? 'bg-blue-950/20 font-semibold' : 'bg-blue-50/30 font-semibold') : ''}`}>
                    <td className="py-4 px-6 font-mono text-gray-400">{m.fecha}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${m.tipo === 'ENTRADA' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600' : 'bg-purple-50 dark:bg-purple-950/50 text-purple-600'}`}>{m.tipo}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-700 dark:text-gray-300">{m.remitente}</div>
                      <div className="text-[9px] text-gray-400 font-extrabold uppercase">{m.rol}</div>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <div className="font-bold text-gray-800 dark:text-slate-200">{m.asunto}</div>
                      <div className="text-gray-500 text-[11px] truncate mt-0.5">{m.contenido}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => setMensajes(mensajes.filter(x => x.id !== m.id))} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={5} className="py-8 text-center text-gray-400">No se encontraron mensajes.</td></tr>
              ) : (
                anunciosFiltrados.length > 0 ? anunciosFiltrados.map(a => (
                  <tr key={a.id} className={`transition-colors ${theme === 'oscuro' ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                    <td className="py-4 px-6 font-mono text-gray-400">{a.fechaPublicacion}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-700 dark:text-gray-300">{a.curso}</div>
                      <div className="text-[10px] text-blue-500">Código: {a.codigoCurso}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${a.prioridad === 'BAJA' ? 'bg-blue-50 text-blue-600' : a.prioridad === 'MEDIA' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{a.prioridad}</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-gray-800 dark:text-slate-200">{a.titulo}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">{a.contenido}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => setAnuncios(anuncios.filter(x => x.id !== a.id))} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={5} className="py-8 text-center text-gray-400">No hay avisos publicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPONENTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className={`rounded-2xl w-full max-w-md p-6 border ${c.modal}`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold">{isMsg ? 'Enviar Mensaje Directo' : 'Publicar Aviso'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleCrearMensajeAnuncio} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{isMsg ? 'Destinatario' : 'Curso'}</label>
                {isMsg ? (
                  <input type="text" name="destino" required placeholder="Ej. Madelin Cerón" value={form.destino} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-xl text-xs ${c.modalInput}`} />
                ) : (
                  <select name="destino" value={form.destino} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-xl text-xs cursor-pointer ${c.modalInput}`}>
                    <option value="Programación I">Programación I (090)</option>
                    <option value="Estructuras de Datos">Estructuras de Datos (092)</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Asunto</label>
                <input type="text" name="asunto" required value={form.asunto} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-xl text-xs ${c.modalInput}`} />
              </div>
              {!isMsg && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Prioridad</label>
                  <select name="prioridad" value={form.prioridad} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-xl text-xs cursor-pointer ${c.modalInput}`}>
                    <option value="BAJA">Baja</option><option value="MEDIA">Media</option><option value="ALTA">Alta</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contenido</label>
                <textarea rows={4} name="contenido" required value={form.contenido} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-xl text-xs resize-none ${c.modalInput}`} />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2 border text-xs font-bold rounded-xl cursor-pointer ${c.btnSec}`}>Cancelar</button>
                <button type="submit" className={`px-4 py-2 text-white text-xs font-bold rounded-xl cursor-pointer ${theme === 'coquette' ? 'bg-[#f472b6]' : 'bg-[#1a365d]'}`}>Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};