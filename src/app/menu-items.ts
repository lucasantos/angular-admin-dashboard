import { MenuItems } from "./models/menu-item";
import { UserShell } from "./pages/user/users/user-shell";
import { userBreadcrumbResolver } from "./services/user-breadcrumb-resolver";

export const menuItems: MenuItems[] = [
  {
    label: 'menu.dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    component: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    label: 'menu.content',
    icon: 'video_library',
    route: '/content',
    component: () => import('./pages/content/content').then((m) => m.Content),
    subItems: [
      {
        label: 'menu.articles',
        icon: 'article',
        route: '/articles',
        component: () => import('./pages/content/articles/articles').then((m) => m.Articles),
        subItems: [
          {
            label: 'menu.tech',
            icon: 'memory',
            route: '/tech',
            component: () => import('./pages/content/articles/tech/tech').then((m) => m.Tech),
            subItems: [
              {
                label: 'menu.ai',
                icon: 'smart_toy',
                route: '/ai',
                component: () => import('./pages/content/articles/tech/ai/ai').then((m) => m.AI),
              },
              {
                label: 'menu.cloud',
                icon: 'cloud',
                route: '/cloud',
                component: () =>
                  import('./pages/content/articles/tech/cloud/cloud').then((m) => m.Cloud),
              },
              {
                label: 'menu.mobile',
                icon: 'phone_android',
                route: '/mobile',
                component: () =>
                  import('./pages/content/articles/tech/mobile/mobile').then((m) => m.Mobile),
              },
            ],
          },
          {
            label: 'menu.health',
            icon: 'health_and_safety',
            route: '/health',
            component: () => import('./pages/content/articles/health/health').then((m) => m.Health),
          },
          {
            label: 'menu.travel',
            icon: 'flight_takeoff',
            route: '/travel',
            component: () => import('./pages/content/articles/travel/travel').then((m) => m.Travel),
          },
        ],
      },
      {
        label: 'menu.videos',
        icon: 'videocam',
        route: '/videos',
        component: () => import('./pages/content/videos/videos').then((m) => m.Videos),

        subItems: [
          {
            label: 'menu.tutorials',
            icon: 'school',
            route: '/tutorials',
            component: () =>
              import('./pages/content/videos/tutorials/tutorials').then((m) => m.Tutorials),
          },
          {
            label: 'menu.interviews',
            icon: 'record_voice_over',
            route: '/interviews',
            component: () =>
              import('./pages/content/videos/interviews/interviews').then((m) => m.Interviews),
          },
        ],
      },
      {
        label: 'menu.podcasts',
        icon: 'podcasts',
        route: '/podcasts',
        component: () => import('./pages/content/podcasts/podcasts').then((m) => m.Podcasts),
      },
      {
        label: 'menu.images',
        icon: 'image',
        route: '/images',
        component: () => import('./pages/content/images/images').then((m) => m.Images),
      },
      {
        label: 'menu.documents',
        icon: 'description',
        route: '/documents',
        component: () => import('./pages/content/documents/documents').then((m) => m.Documents),
      },
    ],
  },
  {
    label: 'menu.analytics',
    icon: 'analytics',
    route: '/analytics',
    component: () => import('./pages/analytics/analytics').then((m) => m.Analytics),
  },
  {
    label: 'menu.comments',
    icon: 'comment',
    route: '/comments',
    component: () => import('./pages/comments/comments').then((m) => m.Comments),
  },
  {
    label: 'menu.settings',
    icon: 'settings',
    route: '/settings',
    component: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    label: 'menu.feedback',
    icon: 'feedback',
    route: '/feedback',
    component: () => import('./pages/feedback/feedback').then((m) => m.Feedback),
  },
  {
    label: 'menu.users',
    icon: 'people',
    route: '/users',
    component: UserShell,
    subItems: [
      {
        label: 'menu.usersList',
        icon: 'list',
        route: '',
        component: () => import('./pages/user/users/users').then((m) => m.Users),
      },
      {
        label: 'menu.userDetail',
        icon: 'person',
        route: '/user/:id',
        hidden: true, // This route won't appear in the menu but can be accessed programmatically or via links
        component: () => import('./pages/user/user-detail/user-detail').then((m) => m.UserDetail),
        resolve: { resolvedLabel: userBreadcrumbResolver },
      },
    ],
  },
  {
    label: 'menu.faq',
    icon: 'question_answer',
    route: '/faq',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Help menu
    component: () => import('./components/tools/help-menu/faq/faq').then((m) => m.Faq),
  },
  {
    label: 'menu.support',
    icon: 'support',
    route: '/support',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Help menu
    component: () => import('./components/tools/help-menu/support/support').then((m) => m.Support),
  },
  {
    label: 'menu.profile',
    icon: 'person',
    route: '/profile',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Account menu
    component: () => import('./components/tools/account-menu/profile/profile').then((m) => m.Profile),
  },
  {
    label: 'menu.accountSettings',
    icon: 'settings',
    route: '/account-settings',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Account menu
    component: () => import('./components/tools/account-menu/settings/settings').then((m) => m.Settings),
  },
  {
    label: 'menu.securityPrivacy',
    icon: 'security',
    route: '/security-privacy',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Account menu
    component: () =>
      import('./components/tools/account-menu/security-privacy/security-privacy').then(
        (m) => m.SecurityPrivacy,
      ),
  },
  {
    label: 'menu.accountFeedback',
    icon: 'feedback',
    route: '/account-feedback',
    hidden: true, // This route won't appear in the main menu but can be accessed via the Account menu
    component: () =>
      import('./components/tools/account-menu/feedback/feedback').then((m) => m.Feedback),
  },
  { label: 'auth.logout.logout', icon: 'logout', class: 'logout', route: '/logout' },
];
