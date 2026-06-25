import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-class',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.css'
})
export class CreateClass implements OnInit {

  gradoMap: { [key: string]: string } = {
    'primero': '1', 'segundo': '2', 'tercero': '3',
    'cuarto': '4', 'quinto': '5', 'sexto': '6'
  };

  nivelMap: { [key: string]: string } = {
    'primaria': 'P', 'secundaria': 'S'
  };

  data = {
    nombre: '',
    grado: '',
    seccion: '',
    colegio: '',
    numEstudiantes: ''
  };

  errorMsg = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user?.colegio) {
      this.data.colegio = user.colegio;
    }
  }

  generarCodigo(): string {
    const palabras = this.data.colegio.trim().split(' ');
    const iniciales = palabras.map((p: string) => p[0]?.toUpperCase() || '').join('');
    const palabrasGrado = this.data.grado.toLowerCase().split(' ');
    const num = this.gradoMap[palabrasGrado[0]] || '?';
    const sec = this.data.seccion.toUpperCase();
    return `ECO-${iniciales}-${num}${sec}`;
  }

  onSiguiente() {
    if (!this.data.nombre || !this.data.grado || !this.data.seccion || !this.data.numEstudiantes) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }
    const codigo = this.generarCodigo();
    sessionStorage.setItem('nuevaClase', JSON.stringify({ ...this.data, codigo }));
    this.router.navigate(['/teacher/add-students']);
  }
}
