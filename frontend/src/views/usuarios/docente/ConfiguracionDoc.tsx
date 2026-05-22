import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { 
  Settings, 
  Palette, 
  Shield, 
  Sun, 
  Moon, 
  Heart, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  Bell, 
  Key, 
  User 
} from 'lucide-react';

export const ConfiguracionDoc: React.FC = () => {
  const { theme, setTheme } = useAuth();

  // Estados de preferencias individuales del Docente
  const [notificarInscripciones, setNotificarInscripciones] = useState(true);
  const [notificarActasCierre, setNotificarActasCierre] = useState(true);

  const handleGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Preferencias de docente e interfaz visual actualizadas con éxito!');
  };

  const handleCambiarPassword = () => {
    alert('Redireccionando al flujo seguro de cambio de contraseña...');
  };

  // Mapeo dinámico de tokens visuales internos de la vista según el tema del portal
  const obtenerEstilosInternos = () => {
    switch (theme) {
      case 'oscuro':
        return {
          title: 'text-slate-200', 
          desc: 'text-slate-400',
          card: 'bg-slate-800 border-slate-700 text-slate-100',
          input: 'bg-slate-700 border-slate-600 text-white focus:border-blue-500',
          textLabel: 'text-slate-400',
          btn: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      case 'coquette':
        return {
          title: 'text-[#6d4c51] font-bold', 
          desc: 'text-[#b3888d]',
          card: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
          input: 'bg-[#fffafb] border-[#fbcdd4] text-[#6d4c51] focus:border-[#f472b6]',
          textLabel: 'text-[#b3888d]',
          btn: 'bg-[#f472b6] hover:bg-[#ec4899] text-white shadow-xs'
        };
      case 'claro':
      default:
        return {
          title: 'text-gray-700 font-bold', 
          desc: 'text-gray-400',
          card: 'bg-white border-gray-100 text-slate-800',
          input: 'bg-white border-gray-200 text-gray-700 focus:border-slate-400',
          textLabel: 'text-gray-400',
          btn: 'bg-[#1a365d] hover:bg-[#152c4d] text-white'
        };
    }
  };

  const c = obtenerEstilosInternos();
  const titleColor = theme === 'oscuro' ? '#f8fafc' : theme === 'coquette' ? '#6d4c51' : '#0f172a';

  return (
    <div className="space-y-6 transition-all duration-300 w-full">
      
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex items-center space-x-3 text-left">
        <div className={`p-3 rounded-xl ${theme === 'oscuro' ? 'bg-slate-800 text-slate-200' : theme === 'coquette' ? 'bg-[#fff5f6] text-[#f472b6]' : 'bg-slate-100 text-slate-700'}`}>
          <Settings size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>
            Configuración Central del Sistema
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Administra las preferencias visuales, el comportamiento escolar y las credenciales de seguridad de tu cuenta.
          </p>
        </div>
      </div>

      {/* REESTRUCTURACIÓN DEL FORMULARIO EN BASE AL GRID DE ADMIN */}
      <form onSubmit={handleGuardarConfig} className="space-y-6 text-left">
        
        {/* BLOQUE SUPERIOR: TEMAS (COL-SPAN-2) Y SEGURIDAD (COL-SPAN-1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* 1. SELECCIÓN DE TEMAS (Ocupa 2 columnas, idéntico al de Admin) */}
          <div className={`border rounded-2xl p-5 transition-all duration-300 lg:col-span-2 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
                <Palette size={14} />
                <span>Personalización Visual (Temas de la Web)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Tema Claro */}
                <button
                  type="button"
                  onClick={() => setTheme('claro')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 active:scale-95 ${
                    theme === 'claro' 
                      ? 'border-[#1a365d] ring-2 ring-blue-100 bg-blue-50/10 text-slate-800' 
                      : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Sun size={18} className="text-amber-500" />
                    {theme === 'claro' && <span className="w-2 h-2 bg-[#1a365d] rounded-full" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme === 'claro' ? 'text-slate-800' : 'text-slate-700'}`}>Tema Claro</p>
                    <p className="text-[10px] text-gray-400">Diseño institucional limpio</p>
                  </div>
                </button>

                {/* Tema Oscuro */}
                <button
                  type="button"
                  onClick={() => setTheme('oscuro')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 active:scale-95 ${
                    theme === 'oscuro' 
                      ? 'border-blue-500 ring-2 ring-slate-700 bg-slate-900 text-white' 
                      : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Moon size={18} className="text-indigo-400" />
                    {theme === 'oscuro' && <span className="w-2 h-2 bg-blue-400 rounded-full" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme === 'oscuro' ? 'text-white' : 'text-slate-700'}`}>Tema Oscuro</p>
                    <p className={`text-[10px] ${theme === 'oscuro' ? 'text-slate-400' : 'text-gray-400'}`}>Cyberpunk académico</p>
                  </div>
                </button>

                {/* Tema Coquette */}
                <button
                  type="button"
                  onClick={() => setTheme('coquette')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 active:scale-95 ${
                    theme === 'coquette' 
                      ? 'border-[#f472b6] ring-2 ring-pink-200 bg-[#fff5f6]' 
                      : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[#f472b6]">
                    <Heart size={18} fill={theme === 'coquette' ? '#f472b6' : 'none'} />
                    {theme === 'coquette' && <span className="w-2 h-2 bg-[#f472b6] rounded-full" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme === 'coquette' ? 'text-[#6d4c51]' : 'text-slate-700'}`}>Tema Coquette</p>
                    <p className={`text-[10px] ${theme === 'coquette' ? 'text-[#b3888d]' : 'text-gray-400'}`}>Rosado Coquette</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 2. SEGURIDAD (A la par de los temas, del tamaño de Directivas de acceso) */}
          <div className={`border rounded-2xl p-5 transition-all duration-300 lg:col-span-1 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-3">
                <Shield size={14} />
                <span>Seguridad de la Cuenta</span>
              </h3>
              <p className={`text-[10px] mb-4 ${c.textLabel}`}>
                Mantén tus credenciales protegidas. Te sugerimos cambiar tu contraseña de acceso de forma periódica.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCambiarPassword}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-2 cursor-pointer ${
                theme === 'oscuro' ? 'bg-slate-700 hover:bg-slate-600 text-white border-transparent' : 
                theme === 'coquette' ? 'bg-[#fff5f6] border-[#fbcdd4] text-[#6d4c51] hover:bg-[#ffe4e6]' : 'bg-gray-50 hover:bg-gray-100 text-slate-700 border-gray-200 shadow-xs'
              }`}
            >
              <Key size={14} />
              <span>Cambiar Contraseña</span>
            </button>
          </div>
        </div>

        {/* BLOQUE INFERIOR: NOTIFICACIONES E INFORMACIÓN PERSONAL (LADO A LADO) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 3. NOTIFICACIONES (Debajo del cuadro de temas) */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
                <Bell size={14} />
                <span>Preferencias de Notificaciones</span>
              </h3>
              <div className="space-y-3">
                
                <div className={`flex items-center justify-between p-3 rounded-xl border ${theme === 'oscuro' ? 'bg-slate-700/30 border-slate-600' : theme === 'coquette' ? 'bg-[#fff5f6]/50 border-[#fbcdd4]' : 'bg-gray-50/50 border-gray-100'}`}>
                  <div>
                    <p className="text-xs font-bold">Notificaciones por Email</p>
                    <p className={`text-[10px] ${c.textLabel}`}>Recibir alertas sobre la gestión y asignación de tus cursos.</p>
                  </div>
                  <button type="button" onClick={() => setNotificarInscripciones(!notificarInscripciones)} className="p-1 cursor-pointer">
                    {notificarInscripciones ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-gray-400" />}
                  </button>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-xl border ${theme === 'oscuro' ? 'bg-slate-700/30 border-slate-600' : theme === 'coquette' ? 'bg-[#fff5f6]/50 border-[#fbcdd4]' : 'bg-gray-50/50 border-gray-100'}`}>
                  <div>
                    <p className="text-xs font-bold">Notificaciones del Sistema</p>
                    <p className={`text-[10px] ${c.textLabel}`}>Alertas en la campana de la plataforma sobre cierres de actas.</p>
                  </div>
                  <button type="button" onClick={() => setNotificarActasCierre(!notificarActasCierre)} className="p-1 cursor-pointer">
                    {notificarActasCierre ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-gray-400" />}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* 4. INFORMACIÓN PERSONAL (A la par de notificaciones) */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between ${c.card}`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
                <User size={14} />
                <span>Información Personal</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700/50">
                  <span className={`${c.textLabel} font-medium`}>Nombre:</span>
                  <span className="font-bold">Dr. Ricardo Arjona</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700/50">
                  <span className={`${c.textLabel} font-medium`}>Correo:</span>
                  <span className="font-bold font-mono">docente@miumg.edu.gt</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className={`${c.textLabel} font-medium`}>Rol asignado:</span>
                  <span className="font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md text-[10px] uppercase">Catedrático / Docente</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. BOTÓN GUARDAR CAMBIOS (Debajo de Información Personal alineado a la derecha) */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md w-full sm:w-auto ${c.btn}`}
          >
            <Save size={14} />
            <span>Guardar Configuración Global</span>
          </button>
        </div>

      </form>
    </div>
  );
};