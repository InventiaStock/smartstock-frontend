export const inventoryRoutes = [
  {
    path: 'comparison',
    name: 'comparison',
    component: () => import('./views/comparison.vue'),
    meta: { titleKey: 'inventory.comparison.title', context: 'inventory', stories: ["US11", "US12"], mockups: ["M39"], businessTypes: ['minimarket'] },
  },
  {
    path: 'sales',
    name: 'sale-list',
    component: () => import('./views/sale-list.vue'),
    meta: { titleKey: 'inventory.saleList.title', context: 'inventory', stories: ["US27"], mockups: ["M9", "M10"] },
  },
  {
    path: 'sales/new',
    name: 'sale-new',
    component: () => import('./views/sale-new.vue'),
    meta: { titleKey: 'inventory.saleNew.title', context: 'inventory', stories: ["US26"], mockups: ["M11", "M12", "M13"] },
  },
  {
    path: 'sales/:id',
    name: 'sale-details',
    component: () => import('./views/sale-details.vue'),
    meta: { titleKey: 'inventory.saleDetails.title', context: 'inventory', stories: ["US28"], mockups: ["M14"] },
  },
  {
    path: 'purchases',
    name: 'purchase-list',
    component: () => import('./views/purchase-list.vue'),
    meta: { titleKey: 'inventory.purchaseList.title', context: 'inventory', stories: ["US31"], mockups: ["M1", "M2"] },
  },
  {
    path: 'purchases/suppliers',
    name: 'supplier-list',
    component: () => import('./views/supplier-list.vue'),
    meta: { titleKey: 'inventory.supplierList.title', context: 'inventory', stories: ["US29"], mockups: ["M7", "M7A", "M8", "M7B"] },
  },
  {
    path: 'purchases/new',
    name: 'purchase-new',
    component: () => import('./views/purchase-new.vue'),
    meta: { titleKey: 'inventory.purchaseNew.title', context: 'inventory', stories: ["US30", "US32"], mockups: ["M3", "M4", "M16"] },
  },
  {
    path: 'purchases/:id',
    name: 'purchase-details',
    component: () => import('./views/purchase-details.vue'),
    meta: { titleKey: 'inventory.purchaseDetails.title', context: 'inventory', stories: ["US30"], mockups: ["M5", "M6", "M5A", "M6A"] },
  },
]
