import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { Settings, Palette, Shield, Sun, Moon, Heart, Save, ToggleLeft, ToggleRight, Bell, Key, User } from 'lucide-react';

// Diccionario de diseño centralizado 
const CONFIG_ESTILOS: Record<string, Record<string, string>> = {
  oscuro: {
    title: 'text-slate-200', desc: 'text-slate-400', card: 'bg-slate-800 border-slate-700 text-slate-100',
    textLabel: 'text-slate-400', btn: 'bg-blue-600 hover:bg-blue-700 text-white', headerBg: 'bg-slate-800 text-slate-200'
  },
  coquette: {
    title: 'text-[#6d4c51] font-bold', desc: 'text-[#b3888d]', card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
    textLabel: 'text-[#b3888d]', btn: 'bg-[#f472b6] hover:bg-[#ec4899] text-white shadow-xs', headerBg: 'bg-[#fff5f6] text-[#f472b6]'
  },
  claro: {
    title: 'text-gray-700 font-bold', desc: 'text-gray-400', card: 'bg-white border-gray-100 text-slate-800',
    textLabel: 'text-gray-400', btn: 'bg-[#1a365d] hover:bg-[#152c4d] text-white', headerBg: 'bg-slate-100 text-slate-700'
  }
};

export const ConfiguracionDoc: React.FC = () => {
  const { theme, setTheme } = useAuth();
  const currentTheme = CONFIG_ESTILOS[theme] ? theme : 'claro';
  const c = CONFIG_ESTILOS[currentTheme];

  const [notificarInscripciones, setNotificarInscripciones] = useState(true);
  const [notificarActasCierre, setNotificarActasCierre] = useState(true);

  const handleGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Preferencias de docente e interfaz visual actualizadas con éxito!');
  };

  const titleColor = theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a';
  const itemBgToggle = theme === 'oscuro' ? 'bg-slate-700/30 border-slate-600' : theme === 'coquette' ? 'bg-[#fff5f6]/50 border-[#fbcdd4]' : 'bg-gray-50/50 border-gray-100';

  // Configuración de botones de temas para renderizado dinámico
  const infoTemas = [
    { id: 'claro', label: 'Tema Claro', sub: 'Diseño institucional limpio', Icon: Sun, iconColor: 'text-amber-500', activeClass: 'border-[#1a365d] ring-2 ring-blue-100 bg-blue-50/10 text-slate-800', dot: 'bg-[#1a365d]' },
    { id: 'oscuro', label: 'Tema Oscuro', sub: 'Cyberpunk académico', Icon: Moon, iconColor: 'text-indigo-400', activeClass: 'border-blue-500 ring-2 ring-slate-700 bg-slate-900 text-white', dot: 'bg-blue-400' },
    { id: 'coquette', label: 'Tema Coquette', sub: 'Rosado Coquette', Icon: Heart, iconColor: 'text-[#f472b6]', activeClass: 'border-[#f472b6] ring-2 ring-pink-200 bg-[#fff5f6]', dot: 'bg-[#f472b6]' }
  ];

  return (
    <div className="space-y-6 transition-all duration-300 w-full">
      {/* ENCABEZADO */}
      <div className="flex items-center space-x-3 text-left">
        <div className={`p-3 rounded-xl ${c.headerBg}`}><Settings size={22} /></div>
        <div>
          <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>Configuración Central del Sistema</h2>
          <p className={`text-xs transition-colors ${c.desc}`}>Administra las preferencias visuales, el comportamiento escolar y las credenciales de seguridad de tu cuenta.</p>
        </div>
      </div>

      <form onSubmit={handleGuardarConfig} className="space-y-6 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 1. SELECCIÓN DE TEMAS */}
          <div className={`border rounded-2xl p-5 transition-all duration-300 lg:col-span-2 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4"><Palette size={14} /> <span>Personalización Visual (Temas de la Web)</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {infoTemas.map(({ id, label, sub, Icon, iconColor, activeClass, dot }) => (
                  <button
                  onClick={() => setTheme(id as typeof theme)}
                    //key={id} type="button" onClick={() => setTheme(id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 active:scale-95 ${theme === id ? activeClass : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon size={18} className={iconColor} fill={id === 'coquette' && theme === 'coquette' ? '#f472b6' : 'none'} />
                      {theme === id && <span className={`w-2 h-2 rounded-full ${dot}`} />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${theme === id ? (id === 'oscuro' ? 'text-white' : id === 'coquette' ? 'text-[#6d4c51]' : 'text-slate-800') : 'text-slate-700'}`}>{label}</p>
                      <p className={`text-[10px] ${theme === 'oscuro' && id === 'oscuro' ? 'text-slate-400' : theme === 'coquette' && id === 'coquette' ? 'text-[#b3888d]' : 'text-gray-400'}`}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. SEGURIDAD */}
          <div className={`border rounded-2xl p-5 transition-all duration-300 lg:col-span-1 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3"><Shield size={14} /> <span>Seguridad de la Cuenta</span></h3>
              <p className={`text-[10px] mb-4 ${c.textLabel}`}>Mantén tus credenciales protegidas. Te sugerimos cambiar tu contraseña de acceso de forma periódica.</p>
            </div>
            <button
              type="button" onClick={() => alert('Redireccionando al flujo seguro de cambio de contraseña...')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-2 cursor-pointer ${theme === 'oscuro' ? 'bg-slate-700 hover:bg-slate-600 text-white border-transparent' : theme === 'coquette' ? 'bg-[#fff5f6] border-[#fbcdd4] text-[#6d4c51] hover:bg-[#ffe4e6]' : 'bg-gray-50 hover:bg-gray-100 text-slate-700 border-gray-200 shadow-xs'}`}
            >
              <Key size={14} /> <span>Cambiar Contraseña</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* 3. NOTIFICACIONES */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4"><Bell size={14} /> <span>Preferencias de Notificaciones</span></h3>
              <div className="space-y-3">
                {[
                  { state: notificarInscripciones, setState: setNotificarInscripciones, title: 'Notificaciones por Email', desc: 'Recibir alertas sobre la gestión y asignación de tus cursos.' },
                  { state: notificarActasCierre, setState: setNotificarActasCierre, title: 'Notificaciones del Sistema', desc: 'Alertas en la campana de la plataforma sobre cierres de actas.' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-xl border ${itemBgToggle}`}>
                    <div>
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className={`text-[10px] ${c.textLabel}`}>{item.desc}</p>
                    </div>
                    <button type="button" onClick={() => item.setState(!item.state)} className="p-1 cursor-pointer">
                      {item.state ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-gray-400" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. INFORMACIÓN PERSONAL */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4"><User size={14} /> <span>Información Personal</span></h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Nombre:', val: <span className="font-bold">Dr. Ricardo Arjona</span>, b: true },
                  { label: 'Correo:', val: <span className="font-bold font-mono">docente@miumg.edu.gt</span>, b: true },
                  { label: 'Rol asignado:', val: <span className="font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md text-[10px] uppercase">Catedrático / Docente</span>, b: false }
                ].map(({ label, val, b }, i) => (
                  <div key={i} className={`flex justify-between py-2 ${b ? 'border-b border-gray-100 dark:border-slate-700/50' : ''}`}>
                    <span className={`${c.textLabel} font-medium`}>{label}</span> {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. BOTÓN GUARDAR */}
        <div className="flex justify-end pt-2">
          <button type="submit" className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md w-full sm:w-auto ${c.btn}`}>
            <Save size={14} /> <span>Guardar Configuración Global</span>
          </button>
        </div>
      </form>
    </div>
  );
};