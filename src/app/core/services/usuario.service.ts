import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PerfilUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  grado: string;
  seccion: string;
  colegio: string;
  puntos: number;
  nivel: number;
  totalClasificaciones: number;
  clasificacionesCorrectas: number;
  totalLogros: number;
}

export interface UsuarioRanking {
  id: string;
  nombre: string;
  puntos: number;
  nivel: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  perfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/usuarios/perfil`);
  }

  ranking(): Observable<UsuarioRanking[]> {
    return this.http.get<UsuarioRanking[]>(`${this.apiUrl}/usuarios/ranking`);
  }
}
