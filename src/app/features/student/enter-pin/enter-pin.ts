import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../../core/services/clase.service';

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
  loading = false;

  constructor(private router: Router, private claseService: ClaseService) {}

  ngOnInit() {
    const data = localStorage.getItem('alumnoSeleccionado');
    if (!data) { this.router.navigate(['/student/select-name']); return; }
    this.alumno = JSON.parse(data);
  }

  pinPress(val: string) {
    if (this.loading) return;
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
    this.loading = true;
    this.errorMsg = '';

    this.claseService.loginEstudiante(this.alumno.codigoAcceso, this.alumno.nombre, this.pinBuffer)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('alumnoActivo', JSON.stringify(this.alumno));
          this.loading = false;
          this.router.navigate(['/student/welcome']);
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'PIN incorrecto. ¡Inténtalo de nuevo!';
          this.pinBuffer = '';
        }
      });
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
