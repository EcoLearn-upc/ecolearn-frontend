import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ClaseService } from '../../../core/services/clase.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  user: any = null;
  clases: any[] = [];
  totalAlumnos = 0;
  vistaActual = 'inicio';

  constructor(
    private authService: AuthService,
    private claseService: ClaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.claseService.misClases().subscribe({
      next: (clases) => {
        this.clases = clases.map((c: any) => ({
          nombre: c.nombre,
          colegio: c.colegio,
          numEstudiantes: c.alumnosIds?.length || 0,
          codigo: c.codigoAcceso,
          progreso: 0
        }));
        this.totalAlumnos = this.clases.reduce((sum, c) => sum + c.numEstudiantes, 0);
      },
      error: () => {}
    });
  }

  verDetalle(clase: any) {
    this.router.navigate(['/teacher/class-detail', clase.codigo]);
  }

  logout() {
    this.authService.logout();
  }
}
