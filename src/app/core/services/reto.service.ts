import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Reto {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  puntosRecompensa: number;
  meta: number;
  categoriaResiduo: string | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface RetoUsuario {
  id: string;
  usuarioId: string;
  retoId: string;
  progreso: number;
  completado: boolean;
  fechaInicio: string;
  fechaCompletado: string | null;
}

@Injectable({ providedIn: 'root' })
export class RetoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  activos(): Observable<Reto[]> {
    return this.http.get<Reto[]>(`${this.apiUrl}/retos`);
  }

  misRetos(): Observable<RetoUsuario[]> {
    return this.http.get<RetoUsuario[]>(`${this.apiUrl}/retos/mis-retos`);
  }
}
