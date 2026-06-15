import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    const claseData = sessionStorage.getItem('nuevaClase');
    if (claseData) {
      const data = JSON.parse(claseData);
      this.clases = [{
        nombre: data.nombre,
        colegio: data.colegio,
        numEstudiantes: data.alumnos?.length || 0,
        codigo: data.codigo,
        progreso: 0
      }];
      this.totalAlumnos = data.alumnos?.length || 0;
    }
  }

  verDetalle(clase: any) {
    this.router.navigate(['/teacher/class-detail', clase.codigo]);
  }

  logout() {
    this.authService.logout();
  }
}
