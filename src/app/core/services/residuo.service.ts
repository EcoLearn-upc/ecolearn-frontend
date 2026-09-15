import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResultadoClasificacion {
  id: string;
  usuarioId: string;
  gridFsId: string;
  categoriaDetectada: string;
  confianza: number;
  esCorrecta: boolean;
  puntosGanados: number;
  fecha: string;
  recomendacion: string;
}

export interface ClasificacionPreguntaResponse {
  sesionId: string;
  opciones: string[];
}

@Injectable({ providedIn: 'root' })
export class ResiduoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  clasificar(file: File): Observable<ResultadoClasificacion> {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<ResultadoClasificacion>(`${this.apiUrl}/residuos/clasificar`, formData);
  }

  clasificarConPregunta(file: File): Observable<ClasificacionPreguntaResponse> {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<ClasificacionPreguntaResponse>(`${this.apiUrl}/residuos/clasificar-pregunta`, formData);
  }

  responderPrediccion(sesionId: string, respuestaUsuario: string): Observable<ResultadoClasificacion> {
    return this.http.post<ResultadoClasificacion>(`${this.apiUrl}/residuos/responder-prediccion`, { sesionId, respuestaUsuario });
  }

  historial(): Observable<ResultadoClasificacion[]> {
    return this.http.get<ResultadoClasificacion[]>(`${this.apiUrl}/residuos/historial`);
  }
}
