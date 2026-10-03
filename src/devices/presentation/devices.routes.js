export const devicesRoutes = [
  {
    path: 'sensors',
    name: 'sensor-list',
    component: () => import('./views/sensor-list.vue'),
    meta: { titleKey: 'devices.sensorList.title', context: 'devices', stories: ["US06", "US07"], mockups: ["M31"] },
  },
  {
    path: 'sensors/link',
    name: 'sensor-link',
    component: () => import('./views/sensor-link.vue'),
    meta: { titleKey: 'devices.sensorLink.title', context: 'devices', stories: ["US04"], mockups: ["M32", "M33"] },
  },
  {
    path: 'sensors/:id/threshold',
    name: 'sensor-threshold',
    component: () => import('./views/sensor-threshold.vue'),
    meta: { titleKey: 'devices.sensorThreshold.title', context: 'devices', stories: ["US05"], mockups: ["M34", "M35"] },
  },
]
