export const alertsRoutes = [
  {
    path: 'alerts',
    name: 'alert-list',
    component: () => import('./views/alert-list.vue'),
    meta: { titleKey: 'alerts.alertList.title', context: 'alerts', stories: ["US12", "US32"], mockups: ["M15", "M15A", "M38"] },
  },
  {
    path: 'settings',
    name: 'notification-settings',
    component: () => import('./views/notification-settings.vue'),
    meta: { titleKey: 'alerts.notificationSettings.title', context: 'alerts', stories: ["US09", "US10"], mockups: ["M36", "M37"] },
  },
]
