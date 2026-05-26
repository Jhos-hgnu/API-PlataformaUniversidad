import { api } from './api';
import type { Inscripcion } from './inscripciones.service';

export interface Nota {
  id_nota: number;
  id_inscripcion: number;
  nota_final: number;
  estado: boolean;
  Inscripciones?: Inscripcion;
}

export interface CreateNotaRequest {
  id_inscripcion: number;
  nota_final: number;
}

export interface UpdateNotaRequest {
  id_inscripcion?: number;
  nota_final?: number;
}

export const notasService = {
  getAll: () => api.get<Nota[]>('/notas'),

  getById: (id: number) => api.get<Nota>(`/notas/${id}`),

  getByInscripcion: (idInscripcion: number) =>
    api.get<Nota>(`/notas/inscripcion/${idInscripcion}`),

  create: (data: CreateNotaRequest) =>
    api.post<Nota>('/notas', data),

  update: (id: number, data: UpdateNotaRequest) =>
    api.patch<Nota>(`/notas/${id}`, data),

  remove: (id: number) => api.delete<Nota>(`/notas/${id}`),

  restore: (id: number) => api.patch<Nota>(`/notas/${id}/restore`),
};
