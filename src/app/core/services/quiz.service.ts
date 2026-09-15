import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pregunta {
  id: string;
  pregunta: string;
  tipo: string;
  categoria: string;
  opciones: string[];
  respuestaCorrecta: string;
  explicacion: string;
  xp: number;
}

export interface RespuestaEnvio {
  preguntaId: string;
  respuesta: string;
}

export interface ResultadoQuiz {
  id: string;
  usuarioId: string;
  puntosGanados: number;
  correctas: number;
  total: number;
  fecha: string;
  respuestas: {
    preguntaId: string;
    respuestaUsuario: string;
    correcta: boolean;
  }[];
}

@Injectable({ providedIn: 'root' })
export class QuizService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerPreguntas(categoria?: string): Observable<Pregunta[]> {
    const params = categoria ? `?categoria=${categoria}` : '';
    return this.http.get<Pregunta[]>(`${this.apiUrl}/quiz/preguntas${params}`);
  }

  responder(respuestas: RespuestaEnvio[]): Observable<ResultadoQuiz> {
    return this.http.post<ResultadoQuiz>(`${this.apiUrl}/quiz/responder`, respuestas);
  }

  historial(): Observable<ResultadoQuiz[]> {
    return this.http.get<ResultadoQuiz[]>(`${this.apiUrl}/quiz/historial`);
  }
}
