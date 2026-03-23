import { MenuItems } from "./models/menu-item";

export const menuItems: MenuItems[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    label: 'Content',
    icon: 'video_library',
    route: '/content',
    component: () => import('./pages/content/content').then((m) => m.Content),
    subItems: [
      {
        label: 'Articles 123',
        icon: 'article',
        route: '/articles',
        component: () => import('./pages/content/articles/articles').then((m) => m.Articles),
        subItems: [
          {
            label: 'Tech',
            icon: 'memory',
            route: '/tech',
            component: () => import('./pages/content/articles/tech/tech').then((m) => m.Tech),
            subItems: [
              {
                label: 'AI',
                icon: 'smart_toy',
                route: '/ai',
                component: () => import('./pages/content/articles/tech/ai/ai').then((m) => m.AI),
              },
              {
                label: 'Cloud',
                icon: 'cloud',
                route: '/cloud',
                component: () =>
                  import('./pages/content/articles/tech/cloud/cloud').then((m) => m.Cloud),
              },
              {
                label: 'Mobile',
                icon: 'phone_android',
                route: '/mobile',
                component: () =>
                  import('./pages/content/articles/tech/mobile/mobile').then((m) => m.Mobile),
              },
            ],
          },
          {
            label: 'Health',
            icon: 'health_and_safety',
            route: '/health',
            component: () => import('./pages/content/articles/health/health').then((m) => m.Health),
          },
          {
            label: 'Travel',
            icon: 'flight_takeoff',
            route: '/travel',
            component: () => import('./pages/content/articles/travel/travel').then((m) => m.Travel),
          },
        ],
      },
      {
        label: 'Videos',
        icon: 'videocam',
        route: '/videos',
        component: () => import('./pages/content/videos/videos').then((m) => m.Videos),

        subItems: [
          {
            label: 'Tutorials',
            icon: 'school',
            route: '/tutorials',
            component: () =>
              import('./pages/content/videos/tutorials/tutorials').then((m) => m.Tutorials),
          },
          {
            label: 'Interviews',
            icon: 'record_voice_over',
            route: '/interviews',
            component: () =>
              import('./pages/content/videos/interviews/interviews').then((m) => m.Interviews),
          },
        ],
      },
      {
        label: 'Podcasts',
        icon: 'podcasts',
        route: '/podcasts',
        component: () => import('./pages/content/podcasts/podcasts').then((m) => m.Podcasts),
      },
      {
        label: 'Images',
        icon: 'image',
        route: '/images',
        component: () => import('./pages/content/images/images').then((m) => m.Images),
      },
      {
        label: 'Documents',
        icon: 'description',
        route: '/documents',
        component: () => import('./pages/content/documents/documents').then((m) => m.Documents),
      },
    ],
  },
  {
    label: 'Analytics',
    icon: 'analytics',
    route: '/analytics',
    component: () => import('./pages/analytics/analytics').then((m) => m.Analytics),
  },
  {
    label: 'Comments',
    icon: 'comment',
    route: '/comments',
    component: () => import('./pages/comments/comments').then((m) => m.Comments),
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/settings',
    component: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    label: 'Feedback',
    icon: 'feedback',
    route: '/feedback',
    component: () => import('./pages/feedback/feedback').then((m) => m.Feedback),
  },
  { label: 'Logout', icon: 'logout', class: 'logout', route: '/logout' },
];
