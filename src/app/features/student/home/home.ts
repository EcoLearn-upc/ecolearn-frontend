import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  misiones = [
    { titulo: 'Clasifica 3 residuos esta semana', xp: 50, progreso: 66, actual: 2, total: 3, color: 'green', badge: '2/3' },
    { titulo: 'Completa el quiz ambiental', xp: 30, progreso: 0, actual: 0, total: 5, color: 'yellow', badge: 'Nuevo' },
    { titulo: 'Chatea con EcoBot por 1ra vez', xp: 20, progreso: 0, actual: 0, total: 1, color: 'red', badge: '0/1' }
  ];

  ranking: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const alumnoData = localStorage.getItem('alumnoSeleccionado');
    const claseData = localStorage.getItem('claseAlumno');
    if (!alumnoData) { this.router.navigate(['/student/class-code']); return; }
    this.alumno = JSON.parse(alumnoData);
    if (claseData) {
      this.clase = JSON.parse(claseData);
      this.ranking = (this.clase.alumnosConPin || []).map((a: any, i: number) => ({
        nombre: this.getNombreCorto(a.nombre),
        xp: Math.floor(Math.random() * 400) + 100
      })).sort((a: any, b: any) => b.xp - a.xp);
    }
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
    return this.getNombreCorto(this.alumno?.nombre || '');
  }

  setTab(tab: string) { this.activeTab = tab; }

  abrirEcobot() { this.ecobotAbierto = true; }
  cerrarEcobot() { this.ecobotAbierto = false; }

  enviarMensaje() {
    if (!this.chatInput.trim()) return;
    this.chatMensajes.push({ tipo: 'user', texto: this.chatInput });
    const pregunta = this.chatInput;
    this.chatInput = '';
    setTimeout(() => {
      this.chatMensajes.push({
        tipo: 'bot',
        texto: '¡Buena pregunta! 🌱 Recuerda siempre separar los residuos en sus tachos correspondientes: amarillo para plástico, azul para papel y verde para orgánicos.'
      });
    }, 800);
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
