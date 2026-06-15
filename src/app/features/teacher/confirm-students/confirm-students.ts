import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('nuevaClase');
    if (!data) { this.router.navigate(['/teacher/add-students']); return; }
    this.claseData = JSON.parse(data);
    this.alumnos = this.claseData.alumnos.map((nombre: string, i: number) => {
      const partes = nombre.trim().split(' ');
      const observacion = partes.length < 3;
      if (observacion) this.conObservacion++;
      return { nombre, estado: observacion ? 'Por revisar' : 'Completo' };
    });
  }

  onImportar() {
    this.router.navigate(['/teacher/class-created']);
  }
}
