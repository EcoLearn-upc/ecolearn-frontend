import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [RouterModule, CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  alumno: any = null;
  clase: any = null;

  misiones = 3;
  xp = 0;
  posicion = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const alumnoData = localStorage.getItem('alumnoSeleccionado');
    const claseData = localStorage.getItem('claseAlumno');
    if (!alumnoData) { this.router.navigate(['/student/class-code']); return; }
    this.alumno = JSON.parse(alumnoData);
    if (claseData) this.clase = JSON.parse(claseData);
  }

  getNombreCorto(): string {
    const nombre = this.alumno?.nombre || '';
    const partes = nombre.split(',');
    if (partes.length >= 2) return partes[1].trim().split(' ')[0];
    return nombre.split(' ')[0];
  }

  comenzar() {
    this.router.navigate(['/student/home']);
  }
}
