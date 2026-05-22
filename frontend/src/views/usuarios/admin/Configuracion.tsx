import React, { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { 
  Settings, Palette, Shield, Database, Sun, 
  Moon, Heart, Save, ToggleLeft, ToggleRight, School 
} from 'lucide-react';

export const Configuracion: React.FC = () => {
  const { theme, setTheme } = useAuth();

  const [cicloLectivo, setCicloLectivo] = useState('Primer Semestre 2026');
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [bloqueoIntentos, setBloqueoIntentos] = useState(true);
  const [minimoCaracteres, setMinimoCaracteres] = useState(8);

  const handleGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Configuraciones globales del sistema universitario guardadas!');
  };

  // Mapeo dinámico de tokens visuales internos de la vista
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
    <div className="space-y-6 transition-all duration-300">
      
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl ${theme === 'oscuro' ? 'bg-slate-800 text-slate-200' : theme === 'coquette' ? 'bg-[#fff5f6] text-[#f472b6]' : 'bg-slate-100 text-slate-700'}`}>
          <Settings size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold transition-colors" style={{ color: titleColor }}>
            Configuración Central del Sistema
          </h2>
          <p className={`text-xs transition-colors ${c.desc}`}>
            Administra las preferencias visuales, el comportamiento escolar y las directivas de seguridad global.
          </p>
        </div>
      </div>

      <form onSubmit={handleGuardarConfig} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BLOQUE DE SELECCIÓN DE TEMAS */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border rounded-2xl p-5 transition-all duration-300 ${c.card}`}>
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

          {/* PARÁMETROS OPERATIVOS */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 ${c.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
              <School size={14} />
              <span>Parámetros Operativos de la Universidad</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${c.textLabel}`}>Ciclo Escolar Activo</label>
                <select value={cicloLectivo} onChange={(e) => setCicloLectivo(e.target.value)} className={`w-full px-3 py-2 border rounded-xl text-xs outline-none cursor-pointer transition-colors ${c.input}`}>
                  <option value="Primer Semestre 2026">Primer Semestre 2026</option>
                  <option value="Segundo Semestre 2026">Segundo Semestre 2026</option>
                </select>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl border ${theme === 'oscuro' ? 'bg-slate-700/30 border-slate-600' : theme === 'coquette' ? 'bg-[#fff5f6]/50 border-[#fbcdd4]' : 'bg-gray-50/50 border-gray-100'}`}>
                <div>
                  <p className="text-xs font-bold">Modo Mantenimiento del Portal</p>
                  <p className={`text-[10px] ${c.textLabel}`}>Desactiva el acceso a estudiantes de forma transitoria.</p>
                </div>
                <button type="button" onClick={() => setModoMantenimiento(!modoMantenimiento)} className="p-1 cursor-pointer">
                  {modoMantenimiento ? <ToggleRight size={32} className={theme === 'coquette' ? 'text-[#f472b6]' : 'text-red-500'} /> : <ToggleLeft size={32} className="text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 ${c.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-4">
              <Shield size={14} />
              <span>Directivas de Acceso</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">Bloqueo por Intentos</p>
                  <p className={`text-[9px] ${c.textLabel}`}>Suspende la cuenta tras 3 fallos.</p>
                </div>
                <button type="button" onClick={() => setBloqueoIntentos(!bloqueoIntentos)} className="cursor-pointer">
                  {bloqueoIntentos ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
                </button>
              </div>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${c.textLabel}`}>Longitud mínima de Clave</label>
                <input type="number" min={6} max={20} value={minimoCaracteres} onChange={(e) => setMinimoCaracteres(Number(e.target.value))} className={`w-full px-3 py-1.5 border rounded-xl text-xs outline-none transition-colors ${c.input}`} />
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 ${c.card}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 mb-2">
              <Database size={14} />
              <span>Respaldos del Sistema</span>
            </h3>
            <p className={`text-[10px] mb-3 ${c.textLabel}`}>Genera un punto de restauración estructurado en caliente.</p>
            <button type="button" onClick={() => alert('Backup descargado.')} className={`w-full py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1 ${theme === 'oscuro' ? 'bg-slate-700 hover:bg-slate-600 text-white' : theme === 'coquette' ? 'bg-[#fff5f6] hover:bg-[#fbcdd4] text-[#6d4c51]' : 'bg-gray-100 hover:bg-gray-200 text-slate-700'}`}>
              <Database size={12} />
              <span>Respaldar Base de Datos</span>
            </button>
          </div>

          <button type="submit" className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${c.btn}`}>
            <Save size={14} />
            <span>Guardar Configuración Global</span>
          </button>
        </div>

      </form>
    </div>
  );
};