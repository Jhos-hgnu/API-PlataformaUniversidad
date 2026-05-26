import { api } from './api';
import type { Curso } from './cursos.service';
import type { Docente } from './docentes.service';
import type { Periodo } from './periodos.service';

export interface Asignacion {
  id_asignacion: number;
  id_docente: number;
  id_curso: number;
  id_periodo: number;
  seccion: string;
  cupo_disponible: number;
  estado: boolean;
  Docentes?: Docente;
  Cursos?: Curso;
  Periodos?: Periodo;
}

export interface CreateAsignacionRequest {
  id_docente: number;
  id_curso: number;
  id_periodo: number;
  seccion: string;
  cupo_disponible: number;
}

export interface UpdateAsignacionRequest {
  id_docente?: number;
  id_curso?: number;
  id_periodo?: number;
  seccion?: string;
  cupo_disponible?: number;
}

export const asignacionesService = {
  getAll: () => api.get<Asignacion[]>('/asignaciones'),

  getById: (id: number) => api.get<Asignacion>(`/asignaciones/${id}`),

  getByDocente: (idDocente: number) =>
    api.get<Asignacion[]>(`/asignaciones/docente/${idDocente}`),

  getByPeriodo: (idPeriodo: number) =>
    api.get<Asignacion[]>(`/asignaciones/periodo/${idPeriodo}`),

  create: (data: CreateAsignacionRequest) =>
    api.post<Asignacion>('/asignaciones', data),

  update: (id: number, data: UpdateAsignacionRequest) =>
    api.patch<Asignacion>(`/asignaciones/${id}`, data),

  remove: (id: number) => api.delete<Asignacion>(`/asignaciones/${id}`),

  restore: (id: number) => api.patch<Asignacion>(`/asignaciones/${id}/restore`),
};
