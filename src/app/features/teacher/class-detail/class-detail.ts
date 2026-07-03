import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../../core/services/clase.service';
import * as XLSX from 'xlsx';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private claseService: ClaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('id');
    if (!codigo) { this.router.navigate(['/teacher/home']); return; }

    this.claseService.obtenerDetallePorCodigo(codigo).subscribe({
      next: (data: any) => {
        this.clase = {
          nombre: data.nombre,
          colegio: data.colegio,
          numAlumnos: data.alumnos?.length || 0,
          codigo: data.codigoAcceso,
          progreso: 0
        };
        this.alumnos = (data.alumnos || []).map((a: any) => ({
          id: a.id,
          nombre: a.nombre,
          pin: a.pin,
          xp: a.puntos || 0,
          estado: 'Activo'
        }));
        this.cdr.detectChanges();
      },
      error: () => this.router.navigate(['/teacher/home'])
    });
  }

  setTab(tab: string) { this.activeTab = tab; }

  togglePin(nombre: string) { this.pinsVisible[nombre] = !this.pinsVisible[nombre]; }

  toggleAllPins() { this.showAllPins = !this.showAllPins; this.pinsVisible = {}; }

  isPinVisible(nombre: string): boolean { return this.showAllPins || !!this.pinsVisible[nombre]; }

  regenPin(alumno: any) {}

  getTop3(): any[] { return [...this.alumnos].sort((a, b) => b.xp - a.xp).slice(0, 3); }

  getRanking(): any[] { return [...this.alumnos].sort((a, b) => b.xp - a.xp); }

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

  descargarReporte() {
    const datos = this.alumnos.map(a => ({
      Nombre: a.nombre,
      XP: a.xp,
      PIN: a.pin,
      Estado: a.estado
    }));
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');
    const nombreClase = this.clase?.nombre?.replace(/\s+/g, '_') || 'clase';
    XLSX.writeFile(workbook, `reporte_${nombreClase}.xlsx`);
  }
}
