export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  colegio: string;
  grado?: string;
  seccion?: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  nombre: string;
  email: string;
  rol: string;
  colegio: string;
  grado: string;
  seccion: string;
  puntos: number;
  nivel: number;
}
