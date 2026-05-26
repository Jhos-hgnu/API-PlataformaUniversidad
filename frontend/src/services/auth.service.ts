import { api } from './api';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol?: 'admin' | 'docente' | 'estudiante';
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'admin' | 'docente' | 'estudiante';
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioResponse;
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<UsuarioResponse>('/auth/register', data),
};
