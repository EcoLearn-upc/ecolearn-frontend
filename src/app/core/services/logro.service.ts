import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  tipo: string;
  condicion: { cantidad: number };
  puntosBonus: number;
}

export interface LogroUsuario {
  id: string;
  usuarioId: string;
  logroId: string;
  fechaObtenido: string;
}

@Injectable({ providedIn: 'root' })
export class LogroService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  todos(): Observable<Logro[]> {
    return this.http.get<Logro[]>(`${this.apiUrl}/logros`);
  }

  misLogros(): Observable<LogroUsuario[]> {
    return this.http.get<LogroUsuario[]>(`${this.apiUrl}/logros/mis-logros`);
  }
}
