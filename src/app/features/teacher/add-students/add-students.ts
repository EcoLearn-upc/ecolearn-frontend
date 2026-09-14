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
    const state = history.state as { claseData?: any };
    if (!state?.claseData) {
      this.router.navigate(['/teacher/create-class']);
      return;
    }
    this.claseData = state.claseData;
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
    if (filtrados.length === 0) return;
    this.router.navigate(['/teacher/confirm-students'], {
      state: { claseData: { ...this.claseData, alumnos: filtrados } }
    });
  }
}
