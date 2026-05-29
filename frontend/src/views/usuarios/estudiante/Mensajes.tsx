import React from 'react';
import { useAuth } from '../../../context/useAuth';
import { getThemeStyles } from '../../../utils/themeStyles';
import { MessageSquare, Bell, Info, Calendar } from 'lucide-react';

const avisos = [
  {
    id: 1,
    titulo: 'Inscripciones Segundo Semestre 2026',
    fecha: '28 de mayo de 2026',
    desc: 'Las inscripciones para el segundo semestre estarán abiertas del 1 al 15 de junio. No olvides revisar los cursos disponibles.',
    tipo: 'info',
  },
  {
    id: 2,
    titulo: 'Publicación de Notas',
    fecha: '25 de mayo de 2026',
    desc: 'Las notas del primer semestre han sido publicadas. Puedes consultarlas en el módulo de notas.',
    tipo: 'success',
  },
  {
    id: 3,
    titulo: 'Mantenimiento del Sistema',
    fecha: '20 de mayo de 2026',
    desc: 'El sistema estará en mantenimiento el sábado 3 de junio de 22:00 a 06:00 horas.',
    tipo: 'warning',
  },
];

export const Mensajes: React.FC = () => {
  const { theme } = useAuth();
  const styles = getThemeStyles(theme);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'success': return 'bg-emerald-50 text-emerald-600';
      case 'warning': return 'bg-amber-50 text-amber-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${styles.panel} p-6 rounded-2xl border ${styles.border} ${styles.shadow}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={18} className="text-[#1a365d]" /> Mensajes y Avisos
            </h3>
            <p className="text-gray-500 text-xs mt-1">Comunicados importantes de la universidad</p>
          </div>
          <Bell size={20} className="text-gray-300" />
        </div>

        <div className="space-y-3">
          {avisos.map((aviso) => (
            <div key={aviso.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/30 transition-colors">
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getIcon(aviso.tipo)}`}>
                <Info size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-gray-800">{aviso.titulo}</h4>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                    <Calendar size={10} /> {aviso.fecha}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{aviso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.panel} p-6 rounded-2xl border ${styles.border} ${styles.shadow} flex items-center justify-center h-32`}>
        <p className={`${styles.mutedText} text-xs font-medium`}>
          Próximamente: Bandeja de mensajes y comunicación con docentes.
        </p>
      </div>
    </div>
  );
};
