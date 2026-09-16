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
  vistaQuiz: 'categorias' | 'info' | 'preguntas' | 'resultado' = 'categorias';
  categoriaSeleccionada: string | null = null;
  preguntasQuiz: Pregunta[] = [];
  preguntaActual = 0;
  respuestaSeleccionada: string | null = null;
  mostrarFeedback = false;
  respuestasEnviadas: { preguntaId: string; respuesta: string }[] = [];
  resultadoQuiz: ResultadoQuiz | null = null;
  cargandoQuiz = false;

  // --- INFO PREVIA (pantalla entre categorías y quiz) ---
  categoriaInfo: { key: string; label: string; emoji: string; facts: string[] } | null = null;
  ecobotInfoAbierto = false;
  chatInfoMensajes: { tipo: string; texto: string }[] = [];
  chatInfoInput = '';
  enviandoChatInfo = false;



categoriasDisponibles = [
  {
    key: 'plastico', label: 'Plástico', emoji: '♻️',
    facts: [
      'Las botellas de agua están hechas de PET, un tipo de plástico.',
      'Las bolsas de plástico van en el contenedor amarillo.',
      'Una botella de plástico puede tardar hasta 500 años en degradarse.',
      'Las cañitas, tapas de botella y envases de yogur son objetos de plástico.',
      'Las latas de refresco son de aluminio, no de plástico.',
      'El símbolo de reciclaje en un envase de plástico indica que puede reciclarse.'
    ]
  },
  {
    key: 'papel', label: 'Papel', emoji: '📄',
    facts: [
      'El papel y el cartón van en el contenedor azul.',
      'Los periódicos viejos pueden reciclarse y van en el contenedor azul.',
      'Reciclar una tonelada de papel permite ahorrar aproximadamente 17 árboles.',
      'El papel plastificado tiene una capa de plástico que dificulta su reciclaje.',
      'Una caja de pizza sucia con grasa no se puede reciclar porque la grasa contamina el papel.',
      'El papel puede reciclarse entre 5 y 7 veces antes de que sus fibras sean demasiado cortas.'
    ]
  },
  {
    key: 'vidrio', label: 'Vidrio', emoji: '🫙',
    facts: [
      'Las botellas de vidrio van en el contenedor verde.',
      'El vidrio es 100% reciclable y puede reciclarse infinitas veces sin perder calidad.',
      'Las botellas de vino, frascos de mermelada y botellas de salsa son envases de vidrio.',
      'Los espejos no deben ir en el contenedor de vidrio porque tienen un recubrimiento especial.',
      'Es recomendable enjuagar los frascos de vidrio antes de reciclarlos para retirar restos de comida.',
      'Cuando se recicla, el vidrio se derrite y se utiliza para fabricar nuevos envases de vidrio.'
    ]
  },
  {
    key: 'metal', label: 'Metal', emoji: '🥫',
    facts: [
      'Las latas de atún vacías son de metal y van en el contenedor amarillo.',
      'El aluminio es el metal más reciclado del mundo.',
      'Reciclar aluminio ahorra hasta el 95% de la energía necesaria para producirlo desde cero.',
      'Las latas de refresco pueden aplastarse antes de reciclarlas para ahorrar espacio.',
      'Una lata de refresco aplastada sigue siendo reciclable porque el metal se puede reciclar aunque esté aplastado.',
      'Las baterías de auto no deben ir en el contenedor de reciclaje normal porque contienen materiales peligrosos.'
    ]
  },
  {
    key: 'organico', label: 'Orgánico', emoji: '🌿',
    facts: [
      'Los residuos orgánicos son restos de comida, frutas, verduras y plantas.',
      'Los restos de comida y plantas son ejemplos de residuos orgánicos.',
      'Con los residuos orgánicos puedes hacer compost.',
      'El compost es un abono natural que sirve para ayudar a las plantas a crecer.',
      'Una cáscara de naranja tarda entre 2 y 6 meses en degradarse.',
      'Una bolsa de plástico no es un residuo orgánico.'
    ]
  },
  {
    key: 'bateria', label: 'Baterías', emoji: '🔋',
    facts: [
      'Las pilas contienen metales tóxicos como mercurio, plomo y cadmio que pueden contaminar el suelo y el agua.',
      'Las pilas y baterías nunca deben tirarse a la basura normal.',
      'Las pilas usadas deben llevarse a puntos de recogida especiales.',
      'Las pilas recargables pueden utilizarse cientos de veces y ayudan a reducir la cantidad de residuos.',
      'Una sola pila puede contaminar hasta 600.000 litros de agua si se desecha incorrectamente.',
      'Las baterías viejas de celulares deben llevarse a un punto de reciclaje electrónico o a un lugar especializado.'
    ]
  },
  {
    key: 'general', label: 'General', emoji: '🌍',
    facts: [
      'El reciclaje consiste en transformar residuos en nuevos materiales o materias primas para fabricar otros productos.',
      'Las 3R del medio ambiente son Reducir, Reutilizar y Reciclar.',
      'Reducir significa consumir menos y evitar generar residuos innecesarios.',
      'Reutilizar significa volver a utilizar un objeto en lugar de tirarlo.',
      'Reciclar significa transformar los residuos para crear nuevos materiales o productos.',
      'Según las 3R, primero debemos Reducir, después Reutilizar y finalmente Reciclar.',
      'Cada persona genera en promedio alrededor de 1 kilogramo de residuos al día.',
      'Un vertedero es un lugar donde se depositan los residuos que no se reciclan.'
    ]
  },
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
      const returnTab = params.get('returnTab');
      const tabFinal = returnTab || tab;
      if (tabFinal === 'inicio' || tabFinal === 'miclase' ||
        tabFinal === 'logros' || tabFinal === 'aprende') {
        this.activeTab = tabFinal;
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
      next: (c) => { this.clase = c; this.cdr.detectChanges(); },
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
    const cat = this.categoriasDisponibles.find(c => c.key === key);
    if (!cat) return;
    this.categoriaSeleccionada = key;
    this.categoriaInfo = cat;
    this.ecobotInfoAbierto = false;
    this.chatInfoMensajes = [
      { tipo: 'bot', texto: `¡Hola! Puedo ayudarte a entender todo sobre ${cat.label} antes del quiz. ¿Qué quieres saber? 🌿` }
    ];
    this.chatInfoInput = '';
    this.vistaQuiz = 'info';
    this.cdr.detectChanges();
  }

  toggleEcobotInfo() {
    this.ecobotInfoAbierto = !this.ecobotInfoAbierto;
    this.cdr.detectChanges();
  }

  enviarMensajeInfo() {
    if (!this.chatInfoInput.trim() || this.enviandoChatInfo) return;
    const pregunta = this.chatInfoInput;
    this.chatInfoMensajes.push({ tipo: 'user', texto: pregunta });
    this.chatInfoInput = '';
    this.enviandoChatInfo = true;
    this.cdr.detectChanges();

    this.chatbotService.enviarMensaje(pregunta).subscribe({
      next: (historial) => {
        const ultimo = historial.mensajes[historial.mensajes.length - 1];
        this.chatInfoMensajes.push({ tipo: 'bot', texto: ultimo.contenido });
        this.enviandoChatInfo = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chatInfoMensajes.push({ tipo: 'bot', texto: 'EcoBot no está disponible ahora 🌱' });
        this.enviandoChatInfo = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciarQuizDesdeInfo() {
    if (!this.categoriaSeleccionada) return;
    this.cargandoQuiz = true;
    this.ecobotInfoAbierto = false;
    this.quizService.obtenerPreguntas(this.categoriaSeleccionada).subscribe({
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
    this.categoriaInfo = null;
    this.preguntasQuiz = [];
    this.preguntaActual = 0;
    this.respuestaSeleccionada = null;
    this.mostrarFeedback = false;
    this.respuestasEnviadas = [];
    this.resultadoQuiz = null;
    this.ecobotInfoAbierto = false;
    this.chatInfoMensajes = [];
    this.chatInfoInput = '';
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  irAClasificador() {
    this.router.navigate(['/student/classifier'], {
      queryParams: { returnTab: this.activeTab }
    });
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
