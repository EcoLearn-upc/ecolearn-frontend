import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-code',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './class-code.html',
  styleUrl: './class-code.css'
})
export class ClassCode {

  codigo = '';
  errorMsg = '';

  constructor(private router: Router) {}

  onEnviar() {
    if (!this.codigo.trim()) {
      this.errorMsg = 'Por favor ingresa el código de clase';
      return;
    }
    // buscar clase en sessionStorage por ahora
    const claseData = localStorage.getItem('nuevaClase');
    if (claseData) {
      const data = JSON.parse(claseData);
      if (data.codigo.toUpperCase() === this.codigo.toUpperCase().trim()) {
        localStorage.setItem('claseAlumno', JSON.stringify(data));
        this.router.navigate(['/student/select-name']);
      } else {
        this.errorMsg = 'Código de clase incorrecto. Verifica con tu profesor.';
      }
    } else {
      this.errorMsg = 'No se encontró ninguna clase. Verifica el código.';
    }
  }
}
