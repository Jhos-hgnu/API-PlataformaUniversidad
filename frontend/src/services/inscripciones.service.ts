import { api } from './api';
import type { Estudiante } from './estudiantes.service';
import type { Asignacion } from './asignaciones.service';

export interface Inscripcion {
  id_inscripcion: number;
  id_estudiante: number;
  id_asignacion: number;
  fecha_inscripcion: string;
  estado: boolean;
  Estudiantes?: Estudiante;
  Asignaciones?: Asignacion;
}

export interface CreateInscripcionRequest {
  id_estudiante: number;
  id_asignacion: number;
}

export interface UpdateInscripcionRequest {
  id_estudiante?: number;
  id_asignacion?: number;
}

export const inscripcionesService = {
  getAll: () => api.get<Inscripcion[]>('/inscripciones'),

  getById: (id: number) => api.get<Inscripcion>(`/inscripciones/${id}`),

  getByEstudiante: (idEstudiante: number) =>
    api.get<Inscripcion[]>(`/inscripciones/estudiante/${idEstudiante}`),

  getByAsignacion: (idAsignacion: number) =>
    api.get<Inscripcion[]>(`/inscripciones/asignacion/${idAsignacion}`),

  create: (data: CreateInscripcionRequest) =>
    api.post<Inscripcion>('/inscripciones', data),

  update: (id: number, data: UpdateInscripcionRequest) =>
    api.patch<Inscripcion>(`/inscripciones/${id}`, data),

  remove: (id: number) => api.delete<Inscripcion>(`/inscripciones/${id}`),

  restore: (id: number) => api.patch<Inscripcion>(`/inscripciones/${id}/restore`),
};
