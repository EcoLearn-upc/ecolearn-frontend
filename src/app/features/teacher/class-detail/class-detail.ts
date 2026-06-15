import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-detail',
  imports: [RouterModule, CommonModule],
  templateUrl: './class-detail.html',
  styleUrl: './class-detail.css'
})
export class ClassDetail implements OnInit {

  activeTab = 'alumnos';
  clase: any = null;
  alumnos: any[] = [];
  pinsVisible: { [key: string]: boolean } = {};
  showAllPins = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const claseData = sessionStorage.getItem('nuevaClase');
    if (claseData) {
      const data = JSON.parse(claseData);
      this.clase = {
        nombre: data.nombre,
        colegio: data.colegio,
        numAlumnos: data.alumnos?.length || 0,
        codigo: data.codigo,
        progreso: 0
      };
      if (data.alumnosConPin) {
        this.alumnos = data.alumnosConPin;
      } else {
        this.alumnos = (data.alumnos || []).map((nombre: string) => ({
          nombre,
          xp: 0,
          estado: 'Activo',
          pin: this.generarPin()
        }));
        data.alumnosConPin = this.alumnos;
        sessionStorage.setItem('nuevaClase', JSON.stringify(data));
      }
    } else {
      this.router.navigate(['/teacher/home']);
    }
  }

  generarPin(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  togglePin(nombre: string) {
    this.pinsVisible[nombre] = !this.pinsVisible[nombre];
  }

  toggleAllPins() {
    this.showAllPins = !this.showAllPins;
    this.pinsVisible = {};
  }

  isPinVisible(nombre: string): boolean {
    return this.showAllPins || !!this.pinsVisible[nombre];
  }

  regenPin(alumno: any) {
    alumno.pin = this.generarPin();
    // guardar en sessionStorage
    const data = JSON.parse(sessionStorage.getItem('nuevaClase') || '{}');
    data.alumnosConPin = this.alumnos;
    sessionStorage.setItem('nuevaClase', JSON.stringify(data));
  }

  getTop3(): any[] {
    return [...this.alumnos].sort((a, b) => b.xp - a.xp).slice(0, 3);
  }

  getRanking(): any[] {
    return [...this.alumnos].sort((a, b) => b.xp - a.xp);
  }

  getEstadoClass(estado: string): string {
    if (estado === 'Activo') return 'badge-activo';
    if (estado === 'Poco activo') return 'badge-poco';
    return 'badge-inactivo';
  }

  getNombreCorto(nombre: string): string {
    const partes = nombre.split(',');
    if (partes.length >= 2) {
      const apellido = partes[0].trim().split(' ')[0];
      const primerNombre = partes[1].trim().split(' ')[0];
      return `${primerNombre} ${apellido[0]}.`;
    }
    return nombre.split(' ')[0];
  }
}
