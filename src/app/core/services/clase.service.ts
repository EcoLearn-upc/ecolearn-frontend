import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClaseRequest {
  nombre: string;
  grado: string;
  seccion: string;
  colegio: string;
  codigoAcceso: string;
}

export interface Clase {
  id: string;
  codigoAcceso: string;
  nombre: string;
  docenteId: string;
  grado: string;
  seccion: string;
  colegio: string;
  alumnosIds: string[];
  fechaCreacion: string;
  activa: boolean;
}

export interface AlumnoCreado {
  id: string;
  nombre: string;
  pin: string;
  email: string;
  puntos?: number;
}

export interface InfoClasePublica {
  claseId: string;
  nombre: string;
  codigoAcceso: string;
  alumnos: string[];
}

@Injectable({ providedIn: 'root' })
export class ClaseService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearClase(data: ClaseRequest): Observable<Clase> {
    return this.http.post<Clase>(`${this.apiUrl}/clases`, data);
  }

  agregarAlumnos(claseId: string, nombres: string[]): Observable<AlumnoCreado[]> {
    return this.http.post<AlumnoCreado[]>(`${this.apiUrl}/clases/${claseId}/alumnos`, { nombres });
  }

  misClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.apiUrl}/clases/mis-clases`);
  }

  obtenerAlumnos(claseId: string): Observable<AlumnoCreado[]> {
    return this.http.get<AlumnoCreado[]>(`${this.apiUrl}/clases/${claseId}/alumnos`);
  }

  obtenerPorCodigo(codigoAcceso: string): Observable<InfoClasePublica> {
    return this.http.get<InfoClasePublica>(`${this.apiUrl}/clases/codigo/${codigoAcceso}`);
  }

  obtenerDetallePorCodigo(codigoAcceso: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clases/codigo/${codigoAcceso}/detalle`);
  }

  loginEstudiante(codigoAcceso: string, nombre: string, pin: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/clases/login`, { codigoAcceso, nombre, pin });
  }
}
