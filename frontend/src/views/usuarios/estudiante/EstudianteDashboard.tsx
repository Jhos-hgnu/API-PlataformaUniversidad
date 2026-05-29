import React, { useState } from 'react';
import { EstudianteLayout, type TabEstudiante } from '../../../layouts/EstudianteLayout';
import { TableroEst } from './TableroEst';
import { InscripcionCursos } from './InscripcionCursos';
import { NotasEst } from './NotasEst';
import { Expediente } from './Expediente';
import { Mensajes } from './Mensajes';
import { ConfigEst } from './ConfigEst';

export const EstudianteDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<TabEstudiante>('tablero');

  const renderContent = () => {
    switch (activeSection) {
      case 'tablero':
        return <TableroEst setActiveSection={setActiveSection} />;
      case 'cursos':
        return <InscripcionCursos />;
      case 'notas':
        return <NotasEst />;
      case 'expediente':
        return <Expediente />;
      case 'mensajes':
        return <Mensajes />;
      case 'config':
        return <ConfigEst />;
      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <EstudianteLayout activeTab={activeSection} setActiveTab={setActiveSection}>
      {renderContent()}
    </EstudianteLayout>
  );
};
