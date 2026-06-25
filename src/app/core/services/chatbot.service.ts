import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MensajeChat {
  rol: string;
  contenido: string;
  fecha: string;
}

export interface ChatbotHistorial {
  id: string;
  usuarioId: string;
  mensajes: MensajeChat[];
  fechaInicio: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  enviarMensaje(mensaje: string): Observable<ChatbotHistorial> {
    return this.http.post<ChatbotHistorial>(`${this.apiUrl}/chatbot/mensaje`, { mensaje });
  }
}
