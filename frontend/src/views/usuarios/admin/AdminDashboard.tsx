import React, { useState } from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { CarrerasCursos } from './CarrerasCursos';
import { GestionUsuarios } from './GestionUsuarios';
import { Asignaciones } from './Asignaciones';
import { ReportesAuditoria } from './ReportesAuditoria';
import { Configuracion } from './Configuracion';
import { TableroGlobal } from './TableroGlobal';

type Section = 'tablero' | 'usuarios' | 'carreras' | 'asignaciones' | 'reportes' | 'config';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('tablero');

  const handleSetActiveSection = (section: Section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tablero':
        return <TableroGlobal setActiveSection={handleSetActiveSection} />;
      case 'carreras':
        return <CarrerasCursos />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'asignaciones':
        return <Asignaciones />;
      case 'reportes':
        return <ReportesAuditoria />;
      case 'config':
        return <Configuracion />;
      default:
        return <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50" />;
    }
  };

  return (
    <AdminLayout activeTab={activeSection} setActiveTab={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  );
};
