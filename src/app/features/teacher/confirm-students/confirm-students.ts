import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../../core/services/clase.service';

@Component({
  selector: 'app-confirm-students',
  imports: [RouterModule, CommonModule],
  templateUrl: './confirm-students.html',
  styleUrl: './confirm-students.css'
})
export class ConfirmStudents implements OnInit {

  claseData: any = null;
  alumnos: any[] = [];
  conObservacion = 0;
  loading = false;
  errorMsg = '';

  constructor(private router: Router, private claseService: ClaseService) {}

  ngOnInit() {
    const data = localStorage.getItem('nuevaClase');
    if (!data) { this.router.navigate(['/teacher/add-students']); return; }
    this.claseData = JSON.parse(data);
    this.alumnos = this.claseData.alumnos.map((nombre: string) => {
      const partes = nombre.trim().split(' ');
      const observacion = partes.length < 3;
      if (observacion) this.conObservacion++;
      return { nombre, estado: observacion ? 'Por revisar' : 'Completo' };
    });
  }

  onImportar() {
    this.loading = true;
    this.errorMsg = '';

    this.claseService.crearClase({
      nombre: this.claseData.nombre,
      grado: this.claseData.grado,
      seccion: this.claseData.seccion,
      colegio: this.claseData.colegio,
      codigoAcceso: this.claseData.codigo
    }).subscribe({
      next: (claseCreada) => {
        this.claseService.agregarAlumnos(claseCreada.id, this.claseData.alumnos)
          .subscribe({
            next: (alumnosCreados) => {
              const dataFinal = {
                ...this.claseData,
                codigo: claseCreada.codigoAcceso,
                claseId: claseCreada.id,
                alumnosCreados
              };
              localStorage.setItem('nuevaClase', JSON.stringify(dataFinal));
              this.loading = false;
              this.router.navigate(['/teacher/class-created']);
            },
            error: (err) => {
              this.loading = false;
              this.errorMsg = err.error?.error || 'Error al agregar alumnos';
            }
          });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Error al crear la clase';
      }
    });
  }
}
