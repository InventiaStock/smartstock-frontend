export const analyticsRoutes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('./views/dashboard.vue'),
    meta: { titleKey: 'analytics.dashboard.title', context: 'analytics', stories: ["US15"], mockups: ["M17"] },
  },
  {
    path: 'reports',
    name: 'reports',
    component: () => import('./views/reports.vue'),
    meta: { titleKey: 'analytics.reports.title', context: 'analytics', stories: ["US25"], mockups: ["M18"], businessTypes: ['minimarket'] },
  },
]
