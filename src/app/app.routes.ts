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
    children: [
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/content/articles/articles').then((m) => m.Articles),
        children: [
          {
            path: 'tech',
            loadComponent: () =>
              import('./pages/content/articles/tech/tech').then((m) => m.Tech),
          },
          {
            path: 'health',
            loadComponent: () =>
              import('./pages/content/articles/health/health').then((m) => m.Health),
          },
          {
            path: 'travel',
            loadComponent: () =>
              import('./pages/content/articles/travel/travel').then((m) => m.Travel),
          }
        ]
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('./pages/content/videos/videos').then((m) => m.Videos),
      },
      {
        path: 'podcasts',
        loadComponent: () =>
          import('./pages/content/podcasts/podcasts').then((m) => m.Podcasts),
      },
      {
        path: 'images',
        loadComponent: () =>
          import('./pages/content/images/images').then((m) => m.Images),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/content/documents/documents').then((m) => m.Documents),
      }
    ],
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
