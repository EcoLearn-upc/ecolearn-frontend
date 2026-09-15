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
import { QuizService, Pregunta, ResultadoQuiz } from '../../../core/services/quiz.service';

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

  // --- QUIZ ---
  vistaQuiz: 'categorias' | 'preguntas' | 'resultado' = 'categorias';
  categoriaSeleccionada: string | null = null;
  preguntasQuiz: Pregunta[] = [];
  preguntaActual = 0;
  respuestaSeleccionada: string | null = null;
  mostrarFeedback = false;
  respuestasEnviadas: { preguntaId: string; respuesta: string }[] = [];
  resultadoQuiz: ResultadoQuiz | null = null;
  cargandoQuiz = false;

  categoriasDisponibles = [
    { key: 'plastico',  label: 'Plástico',  emoji: '♻️' },
    { key: 'papel',     label: 'Papel',     emoji: '📄' },
    { key: 'vidrio',    label: 'Vidrio',    emoji: '🫙' },
    { key: 'metal',     label: 'Metal',     emoji: '🥫' },
    { key: 'organico',  label: 'Orgánico',  emoji: '🌿' },
    { key: 'bateria',   label: 'Baterías',  emoji: '🔋' },
    { key: 'general',   label: 'General',   emoji: '🌍' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private retoService: RetoService,
    private chatbotService: ChatbotService,
    private logroService: LogroService,
    private claseService: ClaseService,
    private quizService: QuizService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'inicio' || tab === 'miclase' || tab === 'logros' || tab === 'aprende') {
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

  // --- QUIZ METHODS ---

  seleccionarCategoria(key: string) {
    this.categoriaSeleccionada = key;
    this.cargandoQuiz = true;
    this.quizService.obtenerPreguntas(key).subscribe({
      next: (preguntas) => {
        this.preguntasQuiz = preguntas;
        this.preguntaActual = 0;
        this.respuestasEnviadas = [];
        this.respuestaSeleccionada = null;
        this.mostrarFeedback = false;
        this.resultadoQuiz = null;
        this.vistaQuiz = 'preguntas';
        this.cargandoQuiz = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoQuiz = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarRespuesta(opcion: string) {
    if (this.mostrarFeedback) return;
    this.respuestaSeleccionada = opcion;
  }

  confirmarRespuesta() {
    if (!this.respuestaSeleccionada || this.mostrarFeedback) return;
    const p = this.preguntasQuiz[this.preguntaActual];
    this.respuestasEnviadas.push({ preguntaId: p.id, respuesta: this.respuestaSeleccionada });
    this.mostrarFeedback = true;
    this.cdr.detectChanges();
  }

  siguientePregunta() {
    if (this.preguntaActual < this.preguntasQuiz.length - 1) {
      this.preguntaActual++;
      this.respuestaSeleccionada = null;
      this.mostrarFeedback = false;
      this.cdr.detectChanges();
    } else {
      this.enviarQuiz();
    }
  }

  enviarQuiz() {
    this.cargandoQuiz = true;
    this.quizService.responder(this.respuestasEnviadas).subscribe({
      next: (resultado) => {
        this.resultadoQuiz = resultado;
        this.vistaQuiz = 'resultado';
        this.cargandoQuiz = false;
        this.cargarPerfil();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoQuiz = false;
        this.cdr.detectChanges();
      }
    });
  }

  reiniciarQuiz() {
    this.vistaQuiz = 'categorias';
    this.categoriaSeleccionada = null;
    this.preguntasQuiz = [];
    this.preguntaActual = 0;
    this.respuestaSeleccionada = null;
    this.mostrarFeedback = false;
    this.respuestasEnviadas = [];
    this.resultadoQuiz = null;
  }

  esCorrecta(): boolean {
    const p = this.preguntasQuiz[this.preguntaActual];
    return this.respuestaSeleccionada === p?.respuestaCorrecta;
  }

  getOpcionClass(opcion: string): string {
    if (!this.mostrarFeedback) {
      return this.respuestaSeleccionada === opcion ? 'opcion-seleccionada' : 'opcion-normal';
    }
    const p = this.preguntasQuiz[this.preguntaActual];
    if (opcion === p.respuestaCorrecta) return 'opcion-correcta';
    if (opcion === this.respuestaSeleccionada) return 'opcion-incorrecta';
    return 'opcion-normal';
  }

  // --- HELPERS GENERALES ---

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

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab !== 'aprende') this.reiniciarQuiz();
  }

  abrirEcobot() { this.ecobotAbierto = true; }
  cerrarEcobot() { this.ecobotAbierto = false; }

  enviarMensaje() {
    if (!this.chatInput.trim() || this.enviandoChat) return;
    const pregunta = this.chatInput;
    this.chatMensajes.push({ tipo: 'user', texto: pregunta });
    this.chatInput = '';
    this.enviandoChat = true;
    this.cdr.detectChanges();

    this.chatbotService.enviarMensaje(pregunta).subscribe({
      next: (historial) => {
        const ultimo = historial.mensajes[historial.mensajes.length - 1];
        this.chatMensajes.push({ tipo: 'bot', texto: ultimo.contenido });
        this.enviandoChat = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chatMensajes.push({ tipo: 'bot', texto: 'EcoBot no está disponible ahora, intenta más tarde 🌱' });
        this.enviandoChat = false;
        this.cdr.detectChanges();
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
