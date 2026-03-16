import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'content',
    loadComponent: () =>
      import('./pages/content/content').then((m) => m.Content),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics/analytics').then((m) => m.Analytics),
  },
  {
    path: 'comments',
    loadComponent: () =>
      import('./pages/comments/comments').then((m) => m.Comments),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/feedback/feedback').then((m) => m.Feedback),
  }
];
