import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UsuarioService, PerfilUsuario } from '../../../core/services/usuario.service';
import { RetoService } from '../../../core/services/reto.service';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { LogroService } from '../../../core/services/logro.service';
import { ClaseService } from '../../../core/services/clase.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeStudent implements OnInit {

  alumno: any = null;
  clase: any = null;
  activeTab = 'inicio';
  ecobotAbierto = false;
  chatMensajes: any[] = [
    { tipo: 'bot', texto: '¡Hola! Soy EcoBot 🌿 Tu asistente ambiental. Pregúntame sobre reciclaje y cuidado del planeta.' }
  ];
  chatInput = '';
  enviandoChat = false;

  perfil: PerfilUsuario | null = null;
  misiones: any[] = [];
  logros: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private retoService: RetoService,
    private chatbotService: ChatbotService,
    private logroService: LogroService,
    private claseService: ClaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'inicio' || tab === 'miclase' || tab === 'logros') {
        this.activeTab = tab;
      }
    });

    this.cargarPerfil();
    this.cargarClase();
    this.cargarMisiones();
    this.cargarLogros();
  }

  cargarPerfil() {
    this.usuarioService.perfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.alumno = { nombre: p.nombre, avatar: '🌱' };
        this.cdr.detectChanges();
      },
      error: () => this.perfil = null
    });
  }

  cargarClase() {
    this.claseService.miClase().subscribe({
      next: (c) => {
        this.clase = c;
        this.cdr.detectChanges();
      },
      error: () => this.clase = null
    });
  }

  cargarMisiones() {
    forkJoin({
      retos: this.retoService.activos(),
      misRetos: this.retoService.misRetos()
    }).subscribe({
      next: ({ retos, misRetos }) => {
        this.misiones = retos.map(r => {
          const ru = misRetos.find(m => m.retoId === r.id);
          const progreso = ru ? ru.progreso : 0;
          const pct = r.meta > 0 ? Math.round((progreso / r.meta) * 100) : 0;
          return {
            retoId: r.id,
            titulo: r.titulo,
            xp: r.puntosRecompensa,
            progreso: pct,
            actual: progreso,
            total: r.meta,
            inscrito: !!ru,
            completado: ru?.completado || false,
            color: ru?.completado ? 'green' : progreso > 0 ? 'yellow' : 'red',
            badge: `${progreso}/${r.meta}`
          };
        });
        this.cdr.detectChanges();
      },
      error: () => this.misiones = []
    });
  }

  unirseAMision(retoId: string) {
    this.retoService.inscribirse(retoId).subscribe({
      next: () => this.cargarMisiones(),
      error: (err) => console.error('Error al inscribirse:', err)
    });
  }

  cargarLogros() {
    forkJoin({
      todos: this.logroService.todos(),
      misLogros: this.logroService.misLogros()
    }).subscribe({
      next: ({ todos, misLogros }) => {
        this.logros = todos.map(l => {
          const obtenido = misLogros.find(m => m.logroId === l.id);
          return { ...l, obtenido: !!obtenido, fechaObtenido: obtenido?.fechaObtenido || null };
        });
        this.cdr.detectChanges();
      },
      error: () => this.logros = []
    });
  }

  getNombreCorto(nombre: string): string {
    const partes = nombre.split(',');
    if (partes.length >= 2) {
      const apellido = partes[0].trim().split(' ')[0];
      const primerNombre = partes[1].trim().split(' ')[0];
      return `${primerNombre} ${apellido[0]}.`;
    }
    return nombre.split(' ')[0];
  }

  getNombreAlumno(): string {
    return this.perfil?.nombre || '';
  }

  getPorcentajeNivel(): number {
    if (!this.perfil) return 0;
    const UMBRAL = 100;
    return Math.round((this.perfil.puntos % UMBRAL) / UMBRAL * 100);
  }

  setTab(tab: string) { this.activeTab = tab; }
  abrirEcobot() { this.ecobotAbierto = true; }
  cerrarEcobot() { this.ecobotAbierto = false; }

  enviarMensaje() {
    if (!this.chatInput.trim() || this.enviandoChat) return;
    const pregunta = this.chatInput;
    this.chatMensajes.push({ tipo: 'user', texto: pregunta });
    this.chatInput = '';
    this.enviandoChat = true;

    this.chatbotService.enviarMensaje(pregunta).subscribe({
      next: (historial) => {
        const ultimo = historial.mensajes[historial.mensajes.length - 1];
        this.chatMensajes.push({ tipo: 'bot', texto: ultimo.contenido });
        this.enviandoChat = false;
      },
      error: () => {
        this.chatMensajes.push({ tipo: 'bot', texto: 'EcoBot no está disponible ahora, intenta más tarde 🌱' });
        this.enviandoChat = false;
      }
    });
  }

  getMisionClass(color: string): string {
    if (color === 'green') return 'mision-green';
    if (color === 'yellow') return 'mision-yellow';
    return 'mision-red';
  }

  getBadgeClass(color: string): string {
    if (color === 'green') return 'badge-green';
    if (color === 'yellow') return 'badge-yellow';
    return 'badge-red';
  }

  getProgBarColor(color: string): string {
    if (color === 'green') return 'var(--green)';
    if (color === 'yellow') return 'var(--yellow)';
    return 'var(--red)';
  }
}
