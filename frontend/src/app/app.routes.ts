import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
