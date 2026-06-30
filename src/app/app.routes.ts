import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Landing } from './features/auth/landing/landing';
import { ProfileSelection } from './features/auth/profile-selection/profile-selection';
import { Login } from './features/teacher/login/login';
import { Register } from './features/teacher/register/register';
import { Home } from './features/teacher/home/home';
import { CreateClass } from './features/teacher/create-class/create-class';
import { AddStudents } from './features/teacher/add-students/add-students';
import { ConfirmStudents } from './features/teacher/confirm-students/confirm-students';
import { ClassCreated } from './features/teacher/class-created/class-created';
import { ClassDetail } from './features/teacher/class-detail/class-detail';
import { ClassCode } from './features/student/class-code/class-code';
import { SelectName } from './features/student/select-name/select-name';
import { EnterPin } from './features/student/enter-pin/enter-pin';
import { HomeStudent } from './features/student/home/home';
import { Welcome } from './features/student/welcome/welcome';
import { Classifier } from './features/student/classifier/classifier';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'auth', component: ProfileSelection },
  { path: 'teacher/login', component: Login },
  { path: 'teacher/register', component: Register },
  { path: 'teacher/home', component: Home, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'teacher/create-class', component: CreateClass, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'teacher/add-students', component: AddStudents, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'teacher/confirm-students', component: ConfirmStudents, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'teacher/class-created', component: ClassCreated, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'teacher/class-detail/:id', component: ClassDetail, canActivate: [authGuard], data: { redirectTo: '/teacher/login' } },
  { path: 'student/class-code', component: ClassCode },
  { path: 'student/select-name', component: SelectName },
  { path: 'student/enter-pin', component: EnterPin },
  { path: 'student/welcome', component: Welcome, canActivate: [authGuard], data: { redirectTo: '/student/class-code' } },
  { path: 'student/home', component: HomeStudent, canActivate: [authGuard], data: { redirectTo: '/student/class-code' } },
  { path: 'student/classifier', component: Classifier, canActivate: [authGuard], data: { redirectTo: '/student/class-code' } },
  { path: '**', redirectTo: '' }
];
