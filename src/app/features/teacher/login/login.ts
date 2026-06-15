import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.rol === 'DOCENTE') {
          this.router.navigate(['/teacher/home']);
        } else {
          this.router.navigate(['/student/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Correo o contraseña incorrectos';
      }
    });
  }
}
