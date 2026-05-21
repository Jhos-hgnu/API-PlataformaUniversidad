import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { FileText, ShieldAlert, Download, Search, AlertCircle, Info, UserCheck, TrendingUp, Clock, Printer } from 'lucide-react';

interface LogSistema {
  id: string;
  fecha: string;
  usuario: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  accion: string;
  modulo: string;
  severidad: 'INFO' | 'WARN' | 'DANGER';
  ip: string;
}

interface ReporteInscripcion {
  id: string;
  carrera: string;
  codigoPensum: string;
  inscritosActivos: number;
  proyeccionMeta: number;
  facultad: string;
}

export const ReportesAuditoria: React.FC = () => {
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);
  const [activeTab, setActiveTab] = useState<'reportes' | 'auditoria'>('reportes');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('TODOS');

  // Datos Mock de Inscripciones Globales
  const [reportes] = useState<ReporteInscripcion[]>([
    { id: 'r1', carrera: 'Ingeniería en Sistemas de Información', codigoPensum: '090', inscritosActivos: 145, proyeccionMeta: 180, facultad: 'Ingeniería' },
    { id: 'r2', carrera: 'Licenciatura en Ciencias Jurídicas y Sociales', codigoPensum: '020', inscritosActivos: 210, proyeccionMeta: 200, facultad: 'Derecho' },
    { id: 'r3', carrera: 'Licenciatura en Administración de Empresas', codigoPensum: '031', inscritosActivos: 95, proyeccionMeta: 150, facultad: 'Administración' },
    { id: 'r4', carrera: 'Ingeniería Industrial', codigoPensum: '092', inscritosActivos: 60, proyeccionMeta: 80, facultad: 'Ingeniería' }
  ]);

  // Datos Mock de Auditoría de Seguridad (Logs)
  const [logs] = useState<LogSistema[]>([
    { id: 'log-1', fecha: '2026-05-20 14:32:10', usuario: 'Carlos Mendoza (Admin)', rol: 'ADMIN', accion: 'Apertura de nueva sección A para Curso 090001', modulo: 'Asignaciones', severidad: 'INFO', ip: '192.168.1.45' },
    { id: 'log-2', fecha: '2026-05-20 12:15:04', usuario: 'Dra. María Antonieta', rol: 'DOCENTE', accion: 'Intento de inicio de sesión fallido - Contraseña incorrecta', modulo: 'Auth', severidad: 'WARN', ip: '186.151.22.109' },
    { id: 'log-3', fecha: '2026-05-20 10:45:55', usuario: 'Carlos Mendoza (Admin)', rol: 'ADMIN', accion: 'Eliminó al usuario Estudiante ID: 405', modulo: 'Gestión Usuarios', severidad: 'DANGER', ip: '192.168.1.45' },
    { id: 'log-4', fecha: '2026-05-19 18:22:41', usuario: 'Juan Fernando Gómez', rol: 'ESTUDIANTE', accion: 'Asignación exitosa a ciclo escolar de Ingeniería', modulo: 'Matrícula', severidad: 'INFO', ip: '190.111.45.12' },
    { id: 'log-5', fecha: '2026-05-19 09:11:18', usuario: 'Ing. Roberto Sánchez', rol: 'DOCENTE', accion: 'Modificación de prerrequisito en Curso: Programación II', modulo: 'Carreras y Cursos', severidad: 'WARN', ip: '172.20.10.4' }
  ]);

  // Totales dinámicos para métricas
  const totalInscritosGlobales = reportes.reduce((acc, r) => acc + r.inscritosActivos, 0);
  const totalAlertasCriticas = logs.filter(l => l.severidad === 'DANGER').length;

  // Filtrado de logs
  const logsFiltrados = logs.filter(l => {
    const matchesSearch = l.usuario.toLowerCase().includes(searchQuery.toLowerCase()) || l.accion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'TODOS' || l.severidad === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Filtrado de reportes
  const reportesFiltradas = reportes.filter(r => 
    r.carrera.toLowerCase().includes(searchQuery.toLowerCase()) || r.codigoPensum.includes(searchQuery)
  );

  const handleExport = () => {
    alert('Generando descarga del archivo... El reporte consolidado se guardará en su carpeta de descargas en formato CSV.');
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${styles.page}`}>
      
      {/* TARJETAS DE INFORMACIÓN ESTRATÉGICA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UserCheck size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Matrícula Global Activa</p>
            <h4 className="text-xl font-bold text-slate-800">{totalInscritosGlobales} Alumnos</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Eventos Críticos (Logs)</p>
            <h4 className="text-xl font-bold text-slate-800">{totalAlertasCriticas} Alertas</h4>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${styles.border} ${styles.panel} ${styles.shadow} flex items-center space-x-4`}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Efectividad de Metas</p>
            <h4 className="text-xl font-bold text-slate-800">
              {Math.round((totalInscritosGlobales / reportes.reduce((acc,r) => acc + r.proyeccionMeta, 0)) * 100)}% Alcance
            </h4>
          </div>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS */}
      <div className={`flex space-x-2 border-b ${styles.border} pb-1`}>
        <button
          onClick={() => { setActiveTab('reportes'); setSearchQuery(''); }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'reportes' ? 'border-[#1a365d] text-[#1a365d]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText size={14} />
          <span>Reportes de Inscripción Global</span>
        </button>
        <button
          onClick={() => { setActiveTab('auditoria'); setSearchQuery(''); }}
          className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'auditoria' ? 'border-[#1a365d] text-[#1a365d]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Clock size={14} />
          <span>Auditoría y Logs del Sistema</span>
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
        
        {/* BARRA DE HERRAMIENTAS DINÁMICA SEGÚN LA PESTAÑA */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/30">
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder={activeTab === 'reportes' ? "Filtrar por carrera o código..." : "Buscar por usuario o acción..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full focus:outline-none transition-all ${styles.input} ${styles.border}`}
              />
            </div>

            {/* Filtro adicional solo visible en Logs */}
            {activeTab === 'auditoria' && (
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-gray-300 outline-none text-gray-700 cursor-pointer font-medium"
              >
                <option value="TODOS">Todas las severidades</option>
                <option value="INFO">Información (INFO)</option>
                <option value="WARN">Advertencias (WARN)</option>
                <option value="DANGER">Peligro / Crítico (DANGER)</option>
              </select>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleExport}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer text-xs font-bold ${styles.border} ${styles.panelMuted}`}
            >
              <Printer size={13} />
              <span>Imprimir</span>
            </button>
            <button 
              onClick={handleExport}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all shadow ${styles.shadow} cursor-pointer ${styles.buttonPrimary}`}
            >
              <Download size={13} />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        {/* TABLA DE REPORTES DE INSCRIPCIÓN */}
        {activeTab === 'reportes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Código Pensum</th>
                  <th className="py-3.5 px-6">Carrera Académica</th>
                  <th className="py-3.5 px-6">Facultad Relacionada</th>
                  <th className="py-3.5 px-6">Inscritos Actuales</th>
                  <th className="py-3.5 px-6">Meta Esperada</th>
                  <th className="py-3.5 px-6">Rendimiento / Meta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                {reportesFiltradas.map((r) => {
                  const pct = Math.round((r.inscritosActivos / r.proyeccionMeta) * 100);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600">{r.codigoPensum}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{r.carrera}</td>
                      <td className="py-4 px-6"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">{r.facultad}</span></td>
                      <td className="py-4 px-6 font-bold text-slate-700">{r.inscritosActivos} alumnos</td>
                      <td className="py-4 px-6 text-gray-400 font-medium">{r.proyeccionMeta} cupos</td>
                      <td className="py-4 px-6 w-48">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className={pct >= 100 ? "text-emerald-600" : "text-blue-600"}>{pct}% Completado</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* BITÁCORA DE AUDITORÍA */}
        {activeTab === 'auditoria' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Fecha / Hora</th>
                  <th className="py-3.5 px-6">Impacto</th>
                  <th className="py-3.5 px-6">Usuario Activo</th>
                  <th className="py-3.5 px-6">Acción Realizada</th>
                  <th className="py-3.5 px-6">Módulo</th>
                  <th className="py-3.5 px-6 font-mono">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[11px] text-gray-600">
                {logsFiltrados.length > 0 ? (
                  logsFiltrados.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50/20 transition-colors">
                      {/* Fecha y Hora */}
                      <td className="py-3.5 px-6 whitespace-nowrap text-gray-400 font-mono">{l.fecha}</td>
                      
                      {/* Severidad Badge */}
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          l.severidad === 'INFO' ? 'bg-blue-50 text-blue-600' :
                          l.severidad === 'WARN' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {l.severidad === 'INFO' && <Info size={10} />}
                          {l.severidad === 'WARN' && <AlertCircle size={10} />}
                          {l.severidad === 'DANGER' && <ShieldAlert size={10} />}
                          <span>{l.severidad}</span>
                        </span>
                      </td>

                      {/* Usuario */}
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-800">{l.usuario}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{l.rol}</div>
                      </td>

                      {/* Acción */}
                      <td className="py-3.5 px-6 max-w-xs text-slate-700 font-medium wrap-break-word">
                        {l.accion}
                      </td>

                      {/* Módulo afectado */}
                      <td className="py-3.5 px-6">
                        <span className="px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded font-medium text-[10px]">
                          {l.modulo}
                        </span>
                      </td>

                      {/* Dirección IP */}
                      <td className="py-3.5 px-6 font-mono text-gray-400 text-[10px]">{l.ip}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      No se encontraron registros de auditoría para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};