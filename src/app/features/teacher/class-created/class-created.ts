import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-created',
  imports: [RouterModule, CommonModule],
  templateUrl: './class-created.html',
  styleUrl: './class-created.css'
})
export class ClassCreated implements OnInit {

  claseData: any = null;
  conObservacion = 0;
  copiado = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('nuevaClase');
    if (!data) { this.router.navigate(['/teacher/home']); return; }
    this.claseData = JSON.parse(data);
    this.conObservacion = this.claseData.alumnos?.filter((a: string) => {
      return a.trim().split(' ').length < 3;
    }).length || 0;
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.claseData.codigo);
    this.copiado = true;
    setTimeout(() => this.copiado = false, 2000);
  }

  verClase() {
    const data = JSON.parse(sessionStorage.getItem('nuevaClase') || '{}');
    this.router.navigate(['/teacher/class-detail', data.codigo]);
  }

  crearOtra() {
    sessionStorage.removeItem('nuevaClase');
    this.router.navigate(['/teacher/create-class']);
  }
}
