import React, { useState } from 'react';
import { DocenteLayout } from '../../../layouts/DocenteLayout';
import { Cursos } from './Cursos';
import { ControlNotas } from './ControlNotas';
import { Estudiantes } from './Estudiantes';
import { Mensajes } from './Mensajes';
import { ConfiguracionDoc } from './ConfiguracionDoc';
import { TableroDoc } from './TableroDoc';

type Section = 'tablero' | 'cursos' | 'notas' | 'estudiantes' | 'mensajes' | 'config';

export const DocenteDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('tablero');

  const handleSetActiveSection = (section: Section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tablero':
        return <TableroDoc setActiveSection={handleSetActiveSection} />;
      case 'cursos':
        return <Cursos />;
      case 'notas':
        return <ControlNotas />;
      case 'estudiantes':
        return <Estudiantes />;
      case 'mensajes':
        return <Mensajes />;
      case 'config':
        return <ConfiguracionDoc />;
      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <DocenteLayout activeTab={activeSection} setActiveTab={setActiveSection}>
      {renderContent()}
    </DocenteLayout>
  );
};
