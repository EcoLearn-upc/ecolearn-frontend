import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResiduoService } from '../../../core/services/residuo.service';
import { UsuarioService, PerfilUsuario } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-classifier',
  imports: [RouterModule, CommonModule],
  templateUrl: './classifier.html',
  styleUrl: './classifier.css'
})
export class Classifier implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  perfil: PerfilUsuario | null = null;
  alumno: any = null;
  estado: 'idle' | 'loading' | 'pregunta' | 'result' | 'error' = 'idle';
  resultado: any = null;
  imagenPreview: string | null = null;
  errorMsg = '';
  recientes: any[] = [];

  // datos del nuevo flujo con pregunta
  sesionId: string | null = null;
  opcionesPregunta: string[] = [];
  respuestaSeleccionada: string | null = null;
  adivinoCorrectamente: boolean | null = null;

  tipos = [
    { emoji: '♻️', nombre: 'Plástico', subtipo: 'Reciclable', color: 'green' },
    { emoji: '🍂', nombre: 'Orgánico', subtipo: 'Compostable', color: 'yellow' },
    { emoji: '📰', nombre: 'Papel', subtipo: 'Reciclable', color: 'gray' },
    { emoji: '🥫', nombre: 'Metal', subtipo: 'Reciclable', color: 'red' },
  ];

  desempeno = { clasificados: 0, racha: 0, correctas: 0, total: 0 };

  constructor(
    private residuoService: ResiduoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPerfil();
    this.cargarHistorial();
  }

  cargarPerfil() {
    this.usuarioService.perfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.alumno = { nombre: p.nombre, avatar: '🌱' };
        this.desempeno.clasificados = p.totalClasificaciones;
        this.desempeno.correctas = p.clasificacionesCorrectas;
        this.desempeno.total = p.totalClasificaciones;
        this.cdr.detectChanges();
      },
      error: () => this.perfil = null
    });
  }

  cargarHistorial() {
    this.residuoService.historial().subscribe({
      next: (historial) => {
        this.recientes = historial.slice(0, 5).map(r => ({
          emoji: this.getEmojiPorClase(r.categoriaDetectada),
          nombre: this.traducirClase(r.categoriaDetectada),
          fecha: this.formatearFecha(r.fecha),
          tipo: this.getTipoTexto(r.categoriaDetectada),
          xp: r.puntosGanados,
          color: this.getColorPorClase(r.categoriaDetectada)
        }));
        this.cdr.detectChanges();
      },
      error: () => this.recientes = []
    });
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
    const hora = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === hoy.toDateString()) return `Hoy ${hora}`;
    if (d.toDateString() === ayer.toDateString()) return `Ayer ${hora}`;
    return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }) + ` ${hora}`;
  }

  getPorcentajeNivel(): number {
    if (!this.perfil) return 0;
    const UMBRAL = 100;
    return Math.round((this.perfil.puntos % UMBRAL) / UMBRAL * 100);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.clasificarImagen(file);
  }

  onTomarFoto() {
    this.fileInput.nativeElement.accept = 'image/*';
    this.fileInput.nativeElement.setAttribute('capture', 'environment');
    this.fileInput.nativeElement.click();
  }

  onSubirImagen() {
    this.fileInput.nativeElement.accept = 'image/*';
    this.fileInput.nativeElement.removeAttribute('capture');
    this.fileInput.nativeElement.click();
  }

  clasificarImagen(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => { this.imagenPreview = e.target.result; };
    reader.readAsDataURL(file);
    this.estado = 'loading';
    this.errorMsg = '';

    this.residuoService.clasificarConPregunta(file).subscribe({
      next: (res) => {
        this.sesionId = res.sesionId;
        this.opcionesPregunta = res.opciones;
        this.estado = 'pregunta';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.estado = 'error';
        this.errorMsg = err.error?.error || 'No se pudo clasificar la imagen. Intenta con otra foto.';
        this.cdr.detectChanges();
      }
    });
  }

  responderPregunta(opcion: string) {
    if (!this.sesionId) return;
    this.respuestaSeleccionada = opcion;
    this.cdr.detectChanges();

    this.residuoService.responderPrediccion(this.sesionId, opcion).subscribe({
      next: (res) => {
        this.adivinoCorrectamente = res.categoriaDetectada === opcion;
        this.resultado = {
          clase: res.categoriaDetectada,
          confianza: res.confianza,
          puntosGanados: res.puntosGanados,
          esCorrecta: res.esCorrecta,
          claseTraducida: this.traducirClase(res.categoriaDetectada),
          recomendacion: res.recomendacion,
          adivinoCorrectamente: res.categoriaDetectada === opcion
        };
        this.estado = 'result';
        this.cargarPerfil();
        this.cargarHistorial();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.estado = 'error';
        this.errorMsg = err.error?.error || 'Error al procesar tu respuesta.';
        this.cdr.detectChanges();
      }
    });
  }

  traducirClase(clase: string): string {
    const map: any = {
      'glass': 'Vidrio', 'plastic': 'Plástico', 'paper': 'Papel',
      'cardboard': 'Cartón', 'metal': 'Metal', 'trash': 'Basura general',
      'organic': 'Orgánico', 'biological': 'Orgánico',
      'clothes': 'Ropa', 'shoes': 'Calzado', 'battery': 'Batería'
    };
    return map[clase?.toLowerCase()] || clase;
  }

  getEmojiPorClase(clase: string): string {
    const map: any = {
      'glass': '🍶', 'plastic': '🧴', 'paper': '📰', 'cardboard': '📦',
      'metal': '🥫', 'trash': '🗑️', 'organic': '🍌', 'biological': '🍌',
      'clothes': '👕', 'shoes': '👟', 'battery': '🔋'
    };
    return map[clase?.toLowerCase()] || '♻️';
  }

  resetear() {
    this.estado = 'idle';
    this.resultado = null;
    this.imagenPreview = null;
    this.errorMsg = '';
    this.sesionId = null;
    this.opcionesPregunta = [];
    this.respuestaSeleccionada = null;
    this.adivinoCorrectamente = null;
  }

  getConfianzaPct(): number {
    return Math.round((this.resultado?.confianza || 0) * 100);
  }

  getTipoBadgeColor(tipo: string): string {
    if (tipo?.toLowerCase().includes('plástico')) return 'badge-green';
    if (tipo?.toLowerCase().includes('orgánico')) return 'badge-yellow';
    if (tipo?.toLowerCase().includes('papel')) return 'badge-gray';
    if (tipo?.toLowerCase().includes('metal')) return 'badge-red';
    return 'badge-green';
  }

  getTipoColor(color: string): string {
    const map: any = { green: '#4CAF50', yellow: '#FAC775', gray: '#888', red: '#E53935' };
    return map[color] || '#4CAF50';
  }

  getRecienteColor(color: string): string {
    if (color === 'green') return 'badge-green';
    if (color === 'yellow') return 'badge-yellow';
    return 'badge-gray';
  }

  getTipoTexto(clase: string): string {
    const map: any = {
      'glass': 'Reciclable', 'plastic': 'Reciclable', 'paper': 'Reciclable',
      'cardboard': 'Reciclable', 'metal': 'Reciclable', 'trash': 'No reciclable',
      'organic': 'Orgánico', 'biological': 'Orgánico',
      'clothes': 'Donación', 'shoes': 'Donación', 'battery': 'Especial'
    };
    return map[clase?.toLowerCase()] || 'Reciclable';
  }

  getColorPorClase(clase: string): string {
    if (['organic', 'biological'].includes(clase?.toLowerCase())) return 'yellow';
    if (clase?.toLowerCase() === 'trash') return 'red';
    return 'green';
  }
}
