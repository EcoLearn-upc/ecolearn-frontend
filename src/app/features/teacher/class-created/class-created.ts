import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-created',
  imports: [RouterModule, CommonModule],
  templateUrl: './class-created.html',
  styleUrl: './class-created.css'
})
export class ClassCreated implements OnInit {

  codigo = '';
  claseData: any = null;
  alumnosCreados: any[] = [];
  conObservacion = 0;
  copiado = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo') || '';
    if (!this.codigo) {
      this.router.navigate(['/teacher/home']);
      return;
    }

    const state = history.state as { alumnosCreados?: any[]; alumnos?: string[]; claseNombre?: string; colegio?: string };
    this.alumnosCreados = state?.alumnosCreados || [];
    const alumnos = state?.alumnos || [];
    this.conObservacion = alumnos.filter((a: string) => a.trim().split(' ').length < 3).length;

    // Reconstruir claseData para compatibilidad con el template
    this.claseData = {
      codigo: this.codigo,
      nombre: state?.claseNombre || '',
      colegio: state?.colegio || '',
      alumnos
    };
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.codigo);
    this.copiado = true;
    setTimeout(() => this.copiado = false, 2000);
  }

  verClase() {
    this.router.navigate(['/teacher/class-detail', this.codigo]);
  }

  crearOtra() {
    this.router.navigate(['/teacher/create-class']);
  }
}
