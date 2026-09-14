import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-name',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './select-name.html',
  styleUrl: './select-name.css'
})
export class SelectName implements OnInit {

  alumnos: string[] = [];
  codigoAcceso = '';
  selectedAlumno = '';
  selectedAvatar = '';
  errorMsg = '';

  avatares = ['🌱', '🐢', '🦋', '🐸', '🌻', '🐝', '🦜', '🌊'];

  constructor(private router: Router) {}

  ngOnInit() {
    const state = history.state as { claseInfo?: any };
    if (!state?.claseInfo) {
      this.router.navigate(['/student/class-code']);
      return;
    }
    this.alumnos = state.claseInfo.alumnos || [];
    this.codigoAcceso = state.claseInfo.codigoAcceso;
  }

  seleccionarAvatar(av: string) {
    this.selectedAvatar = av;
  }

  onIngresar() {
    if (!this.selectedAlumno) {
      this.errorMsg = 'Por favor selecciona tu nombre';
      return;
    }
    if (!this.selectedAvatar) {
      this.errorMsg = 'Por favor elige un avatar';
      return;
    }
    this.router.navigate(['/student/enter-pin'], {
      state: {
        nombre: this.selectedAlumno,
        avatar: this.selectedAvatar,
        codigoAcceso: this.codigoAcceso
      }
    });
  }
}
