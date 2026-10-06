import { createRouter, createWebHistory } from 'vue-router'
import { authenticationGuard } from '../iam/infrastructure/authentication.guard.js'
import { iamRoutes } from '../iam/presentation/iam.routes.js'
import { catalogRoutes } from '../catalog/presentation/catalog.routes.js'
import { devicesRoutes } from '../devices/presentation/devices.routes.js'
import { inventoryRoutes } from '../inventory/presentation/inventory.routes.js'
import { alertsRoutes } from '../alerts/presentation/alerts.routes.js'
import { analyticsRoutes } from '../analytics/presentation/analytics.routes.js'

const routes = [
  ...iamRoutes, // /sign-in, /sign-up, /forgot-password (public, without layout)
  {
    path: '/',
    component: () => import('../shared/presentation/components/layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      ...analyticsRoutes,
      ...catalogRoutes,
      ...devicesRoutes,
      ...inventoryRoutes,
      ...alertsRoutes,
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../shared/presentation/views/page-not-found.vue'),
  },
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })
router.beforeEach(authenticationGuard)

export default router