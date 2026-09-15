import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ClaseService } from '../../../core/services/clase.service';
import { UsuarioService, PerfilUsuario } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  user: PerfilUsuario | null = null;
  clases: any[] = [];
  totalAlumnos = 0;
  vistaActual = 'inicio';

  constructor(
    private authService: AuthService,
    private claseService: ClaseService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    forkJoin({
      perfil: this.usuarioService.perfil(),
      clases: this.claseService.misClases()
    }).subscribe({
      next: ({ perfil, clases }) => {
        this.user = perfil;
        this.clases = clases.map((c: any) => ({
          nombre: c.nombre,
          colegio: c.colegio,
          numEstudiantes: c.alumnosIds?.length || 0,
          codigo: c.codigoAcceso,
          progreso: 0
        }));
        this.totalAlumnos = this.clases.reduce((sum, c) => sum + c.numEstudiantes, 0);
        this.cdr.detectChanges();
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
