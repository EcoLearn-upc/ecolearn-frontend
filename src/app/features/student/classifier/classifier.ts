import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  alumno: any = null;
  perfil: PerfilUsuario | null = null;
  estado: 'idle' | 'loading' | 'result' | 'error' = 'idle';
  resultado: any = null;
  imagenPreview: string | null = null;
  errorMsg = '';

  recientes = [
    { emoji: '🧴', nombre: 'Botella plástico', fecha: 'Hoy 10:32am', tipo: 'Reciclable', xp: 10, color: 'green' },
    { emoji: '🍌', nombre: 'Cáscara de fruta', fecha: 'Ayer 2:15pm', tipo: 'Orgánico', xp: 10, color: 'yellow' },
    { emoji: '📰', nombre: 'Papel Periódico', fecha: 'Lun 9:00am', tipo: 'Reciclable', xp: 10, color: 'green' },
  ];

  tipos = [
    { emoji: '♻️', nombre: 'Plástico', subtipo: 'Reciclable', color: 'green' },
    { emoji: '🍂', nombre: 'Orgánico', subtipo: 'Compostable', color: 'yellow' },
    { emoji: '📰', nombre: 'Papel', subtipo: 'Reciclable', color: 'gray' },
    { emoji: '🥫', nombre: 'Metal', subtipo: 'Reciclable', color: 'red' },
  ];

  desempeno = {
    clasificados: 7,
    racha: 5,
    correctas: 6,
    total: 7
  };

  constructor(
    private residuoService: ResiduoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const alumnoData = localStorage.getItem('alumnoSeleccionado');
    if (alumnoData) this.alumno = JSON.parse(alumnoData);
    const recientesData = localStorage.getItem('recientes');
    if (recientesData) this.recientes = JSON.parse(recientesData);
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.usuarioService.perfil().subscribe({
      next: (p) => { this.perfil = p; this.cdr.detectChanges(); },
      error: () => this.perfil = null
    });
  }

  getPorcentajeNivel(): number {
    if (!this.perfil) return 0;
    const metaNivel = this.perfil.nivel * 100;
    return Math.min(100, Math.round((this.perfil.puntos / metaNivel) * 100));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.clasificarImagen(file);
  }

  onTomarFoto() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.accept = 'image/*';
    input.capture = 'environment';
    input.click();
  }

  onSubirImagen() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.accept = 'image/*';
    input.removeAttribute('capture');
    input.click();
  }

  clasificarImagen(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => { this.imagenPreview = e.target.result; };
    reader.readAsDataURL(file);

    this.estado = 'loading';
    this.errorMsg = '';

    this.residuoService.clasificar(file).subscribe({
      next: (res) => {
        this.resultado = {
          clase: res.categoriaDetectada,
          confianza: res.confianza,
          puntosGanados: res.puntosGanados,
          esCorrecta: res.esCorrecta,
          claseTraducida: this.traducirClase(res.categoriaDetectada)
        };
        this.guardarReciente(res.categoriaDetectada, this.resultado.claseTraducida, res.puntosGanados);
        this.cargarPerfil();
        this.estado = 'result';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.estado = 'error';
        this.errorMsg = err.error?.error || 'No se pudo clasificar la imagen. Intenta con otra foto.';
      }
    });
  }

  traducirClase(clase: string): string {
    const map: any = {
      'glass':      'Vidrio',
      'plastic':    'Plástico',
      'paper':      'Papel',
      'cardboard':  'Cartón',
      'metal':      'Metal',
      'trash':      'Basura general',
      'organic':    'Orgánico',
      'biological': 'Orgánico',
      'clothes':    'Ropa',
      'shoes':      'Calzado',
      'battery':    'Batería'
    };
    return map[clase?.toLowerCase()] || clase;
  }

  resetear() {
    this.estado = 'idle';
    this.resultado = null;
    this.imagenPreview = null;
    this.errorMsg = '';
  }

  getConfianzaPct(): number {
    return Math.round((this.resultado?.confianza || 0) * 100);
  }

  getTipoBadgeColor(tipo: string): string {
    if (tipo?.toLowerCase().includes('plástico') || tipo?.toLowerCase().includes('plastic')) return 'badge-green';
    if (tipo?.toLowerCase().includes('orgánico') || tipo?.toLowerCase().includes('organic')) return 'badge-yellow';
    if (tipo?.toLowerCase().includes('papel') || tipo?.toLowerCase().includes('paper')) return 'badge-gray';
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

  guardarReciente(clase: string, claseTraducida: string, xp: number) {
    const nuevo = {
      emoji: this.getEmojiPorClase(clase),
      nombre: claseTraducida,
      fecha: 'Hoy ' + new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      tipo: this.getTipoTexto(clase),
      xp: xp,
      color: this.getColorPorClase(clase)
    };
    this.recientes.unshift(nuevo);
    if (this.recientes.length > 5) this.recientes.pop();
    localStorage.setItem('recientes', JSON.stringify(this.recientes));
  }

  getEmojiPorClase(clase: string): string {
    const map: any = {
      'glass': '🍶', 'plastic': '🧴', 'paper': '📰',
      'cardboard': '📦', 'metal': '🥫', 'trash': '🗑️',
      'organic': '🍌', 'biological': '🍌'
    };
    return map[clase?.toLowerCase()] || '♻️';
  }

  getTipoTexto(clase: string): string {
    const map: any = {
      'glass': 'Reciclable', 'plastic': 'Reciclable',
      'paper': 'Reciclable', 'cardboard': 'Reciclable',
      'metal': 'Reciclable', 'trash': 'No reciclable',
      'organic': 'Orgánico', 'biological': 'Orgánico'
    };
    return map[clase?.toLowerCase()] || 'Reciclable';
  }

  getColorPorClase(clase: string): string {
    if (['organic', 'biological'].includes(clase?.toLowerCase())) return 'yellow';
    if (clase?.toLowerCase() === 'trash') return 'red';
    return 'green';
  }
}
