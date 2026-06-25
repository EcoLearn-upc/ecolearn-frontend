import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-students',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './add-students.html',
  styleUrl: './add-students.css'
})
export class AddStudents implements OnInit {

  alumnos: string[] = ['', '', ''];
  claseData: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('nuevaClase');
    if (!data) {
      this.router.navigate(['/teacher/create-class']);
      return;
    }
    this.claseData = JSON.parse(data);
  }

  agregarAlumno() {
    this.alumnos.push('');
  }

  eliminarAlumno(i: number) {
    if (this.alumnos.length > 1) {
      this.alumnos.splice(i, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSiguiente() {
    const filtrados = this.alumnos.filter(a => a.trim() !== '');
    if (filtrados.length === 0) {
      return;
    }
    const data = { ...this.claseData, alumnos: filtrados };
    localStorage.setItem('nuevaClase', JSON.stringify(data));
    this.router.navigate(['/teacher/confirm-students']);
  }
}
