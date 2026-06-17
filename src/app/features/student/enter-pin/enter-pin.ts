import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enter-pin',
  imports: [RouterModule, CommonModule],
  templateUrl: './enter-pin.html',
  styleUrl: './enter-pin.css'
})
export class EnterPin implements OnInit {

  alumno: any = null;
  pinBuffer = '';
  errorMsg = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('alumnoSeleccionado');
    if (!data) { this.router.navigate(['/student/select-name']); return; }
    this.alumno = JSON.parse(data);
  }

  pinPress(val: string) {
    if (val === 'borrar') {
      this.pinBuffer = this.pinBuffer.slice(0, -1);
    } else if (val === 'ok') {
      this.validarPin();
    } else {
      if (this.pinBuffer.length >= 4) return;
      this.pinBuffer += val;
      if (this.pinBuffer.length === 4) {
        setTimeout(() => this.validarPin(), 200);
      }
    }
  }

  validarPin() {
    if (this.pinBuffer === this.alumno.pin) {
      this.router.navigate(['/student/welcome']);
    } else {
      this.errorMsg = 'PIN incorrecto. ¡Inténtalo de nuevo!';
      this.pinBuffer = '';
    }
  }

  getDots(): boolean[] {
    return [0,1,2,3].map(i => i < this.pinBuffer.length);
  }

  getNombreCorto(): string {
    const nombre = this.alumno?.nombre || '';
    const partes = nombre.split(',');
    if (partes.length >= 2) return partes[1].trim().split(' ')[0];
    return nombre.split(' ')[0];
  }
}
