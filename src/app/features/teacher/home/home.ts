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
  totalParticipacion = 0;
  totalInactivos = 0;
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
          progreso: 0,
          participacion: 0,
          inactivos: 0
        }));
        this.totalAlumnos = this.clases.reduce((sum, c) => sum + c.numEstudiantes, 0);
        this.cdr.detectChanges();
        this.cargarMetricas();
      },
      error: () => {}
    });
  }

  cargarMetricas() {
    this.clases.forEach((clase, index) => {
      this.claseService.obtenerDetallePorCodigo(clase.codigo).subscribe({
        next: (detalle) => {
          const alumnos = detalle.alumnos || [];
          const activos = alumnos.filter((a: any) => a.puntos > 0).length;
          const inactivos = alumnos.length - activos;
          const participacion = alumnos.length > 0
            ? Math.round((activos / alumnos.length) * 100)
            : 0;
          const progresoGeneral = alumnos.length > 0
            ? Math.min(100, Math.round(
              alumnos.reduce((sum: number, a: any) => sum + a.puntos, 0) /
              (alumnos.length * 100) * 100
            ))
            : 0;

          this.clases = this.clases.map((c, i) => i === index ? {
            ...c,
            progreso: progresoGeneral,
            participacion,
            inactivos
          } : c);
          this.recalcularTotales();
          this.cdr.detectChanges();
        },
        error: () => {}
      });
    });
  }

  recalcularTotales() {
    const totalEstudiantes = this.clases.reduce((sum, c) => sum + c.numEstudiantes, 0);
    const totalActivos = this.clases.reduce((sum, c) => sum + (c.numEstudiantes - (c.inactivos || 0)), 0);
    this.totalParticipacion = totalEstudiantes > 0
      ? Math.round((totalActivos / totalEstudiantes) * 100)
      : 0;
    this.totalInactivos = this.clases.reduce((sum, c) => sum + (c.inactivos || 0), 0);
  }

  verDetalle(clase: any) {
    this.router.navigate(['/teacher/class-detail', clase.codigo]);
  }

  logout() {
    this.authService.logout();
  }
}
