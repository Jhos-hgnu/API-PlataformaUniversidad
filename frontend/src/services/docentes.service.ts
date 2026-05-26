import { api } from './api';
import type { Usuario } from './usuarios.service';

export interface Docente {
  id_docente: number;
  id_usuario: number;
  especialidad: string | null;
  estado: boolean;
  Usuarios?: Pick<Usuario, 'nombre' | 'apellido' | 'correo'>;
}

export interface CreateDocenteRequest {
  id_usuario: number;
  especialidad?: string;
}

export interface UpdateDocenteRequest {
  id_usuario?: number;
  especialidad?: string;
}

export const docentesService = {
  getAll: () => api.get<Docente[]>('/docentes'),

  getById: (id: number) => api.get<Docente>(`/docentes/${id}`),

  create: (data: CreateDocenteRequest) =>
    api.post<Docente>('/docentes', data),

  update: (id: number, data: UpdateDocenteRequest) =>
    api.patch<Docente>(`/docentes/${id}`, data),

  remove: (id: number) => api.delete<Docente>(`/docentes/${id}`),

  restore: (id: number) => api.patch<Docente>(`/docentes/${id}/restore`),
};
