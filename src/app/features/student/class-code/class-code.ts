import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../../core/services/clase.service';

@Component({
  selector: 'app-class-code',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './class-code.html',
  styleUrl: './class-code.css'
})
export class ClassCode {

  codigo = '';
  errorMsg = '';
  loading = false;

  constructor(private router: Router, private claseService: ClaseService) {}

  onEnviar() {
    if (!this.codigo.trim()) {
      this.errorMsg = 'Por favor ingresa el código de clase';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.claseService.obtenerPorCodigo(this.codigo.trim().toUpperCase()).subscribe({
      next: (info) => {
        localStorage.setItem('claseAlumno', JSON.stringify(info));
        this.loading = false;
        this.router.navigate(['/student/select-name']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Código de clase incorrecto. Verifica con tu profesor.';
      }
    });
  }
}
