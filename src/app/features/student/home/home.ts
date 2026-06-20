import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, PerfilUsuario, UsuarioRanking } from '../../../core/services/usuario.service';
import { RetoService, Reto, RetoUsuario } from '../../../core/services/reto.service';
import { ChatbotService } from '../../../core/services/chatbot.service';

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
  ranking: UsuarioRanking[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private retoService: RetoService,
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const alumnoData = localStorage.getItem('alumnoSeleccionado');
    const claseData = localStorage.getItem('claseAlumno');
    if (!alumnoData) { this.router.navigate(['/student/class-code']); return; }
    this.alumno = JSON.parse(alumnoData);
    if (claseData) this.clase = JSON.parse(claseData);

    this.cargarPerfil();
    this.cargarMisiones();
    this.cargarRanking();
  }

  cargarPerfil() {
    this.usuarioService.perfil().subscribe({
      next: (p) => { this.perfil = p; this.cdr.detectChanges(); },
      error: () => this.perfil = null
    });
  }

  cargarMisiones() {
    this.retoService.activos().subscribe({
      next: (retos) => {
        this.retoService.misRetos().subscribe({
          next: (misRetos) => {
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

  cargarRanking() {
    this.usuarioService.ranking().subscribe({
      next: (r) => { this.ranking = r; this.cdr.detectChanges(); },
      error: () => this.ranking = []
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
    return this.perfil?.nombre || this.alumno?.nombre || '';
  }

  getPorcentajeNivel(): number {
    if (!this.perfil) return 0;
    const metaNivel = this.perfil.nivel * 100;
    return Math.min(100, Math.round((this.perfil.puntos / metaNivel) * 100));
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
