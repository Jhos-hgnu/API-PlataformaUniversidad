import React from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { Settings, User, Shield, Sun, Moon, Heart } from 'lucide-react';

export const ConfigEst: React.FC = () => {
  const { theme, user, setTheme } = useAuth();
  const styles = getThemeStyles(theme);

  const themeIcon = theme === 'oscuro' ? <Moon size={16} /> : theme === 'coquette' ? <Heart size={16} /> : <Sun size={16} />;
  const nextTheme: Record<string, 'claro' | 'oscuro' | 'coquette'> = { claro: 'oscuro', oscuro: 'coquette', coquette: 'claro' };

  return (
    <div className="space-y-6">
      <div className={`${styles.panel} p-6 rounded-2xl border ${styles.border} ${styles.shadow}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <Settings size={18} className="text-[#1a365d]" /> Configuración de Cuenta
            </h3>
            <p className="text-gray-500 text-xs mt-1">Administra tu perfil y preferencias</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-800">Nombre de Usuario</p>
                <p className="text-xs text-gray-500">{user?.nombre || '—'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-800">Correo Electrónico</p>
                <p className="text-xs text-gray-500">{user?.correo || '—'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'oscuro' ? 'bg-slate-700 text-slate-200' :
                theme === 'coquette' ? 'bg-pink-100 text-pink-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {themeIcon}
              </div>
              <div>
                <p className="font-bold text-xs text-gray-800">Tema de la Aplicación</p>
                <p className="text-xs text-gray-500">
                  Actual: {theme === 'claro' ? 'Claro' : theme === 'oscuro' ? 'Oscuro' : 'Coquette'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(nextTheme[theme])}
              className="px-4 py-2 rounded-xl bg-[#1a365d] hover:bg-[#152c4d] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cambiar a {nextTheme[theme] === 'claro' ? 'Claro' : nextTheme[theme] === 'oscuro' ? 'Oscuro' : 'Coquette'}
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.panel} p-6 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-center h-24`}>
        <p className={`${styles.mutedText} text-xs font-medium`}>
          Más opciones de configuración próximamente.
        </p>
      </div>
    </div>
  );
};
