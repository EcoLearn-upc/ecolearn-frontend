import { Routes } from '@angular/router';
import { Landing } from './features/auth/landing/landing';
import { ProfileSelection } from './features/auth/profile-selection/profile-selection';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'auth', component: ProfileSelection },
  { path: '**', redirectTo: '' }
];
