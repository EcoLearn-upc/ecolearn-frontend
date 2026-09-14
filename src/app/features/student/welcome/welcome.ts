import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService, PerfilUsuario } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-welcome',
  imports: [RouterModule, CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  alumno: any = null;
  clase: any = null;
  perfil: PerfilUsuario | null = null;

  misiones = 0;
  xp = 0;
  posicion = 0;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const state = history.state as { nombre?: string; avatar?: string };
    if (!state?.nombre) {
      this.router.navigate(['/student/class-code']);
      return;
    }
    this.alumno = { nombre: state.nombre, avatar: state.avatar || '🌱' };

    this.usuarioService.perfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.xp = p.puntos;
        this.clase = { codigo: null, nombre: p.nombre, colegio: p.colegio };
      },
      error: () => {}
    });
  }

  getNombreCorto(): string {
    const nombre = this.alumno?.nombre || '';
    const partes = nombre.split(',');
    if (partes.length >= 2) return partes[1].trim().split(' ')[0];
    return nombre.split(' ')[0];
  }

  comenzar() {
    this.router.navigate(['/student/home']);
  }
}
