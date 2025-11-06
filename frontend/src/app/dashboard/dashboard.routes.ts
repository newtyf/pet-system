import { Routes } from '@angular/router';
import { authGuard } from '../core/guards';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'pets',
        pathMatch: 'full',
      },
      {
        path: 'pets',
        loadComponent: () =>
          import('./components/pet-list/pet-list.component').then(
            (m) => m.PetListComponent
          ),
      },
    ],
  },
];
