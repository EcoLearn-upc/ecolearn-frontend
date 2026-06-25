import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  data: RegisterRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'DOCENTE',
    colegio: ''
  };

  confirmPassword = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.data.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.authService.register(this.data).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/teacher/home']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Error al registrarse. Intenta nuevamente.';
      }
    });
  }
}
