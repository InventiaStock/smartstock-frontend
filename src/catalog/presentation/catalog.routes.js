export const catalogRoutes = [
  {
    path: 'products',
    name: 'product-list',
    component: () => import('./views/product-list.vue'),
    meta: { titleKey: 'catalog.productList.title', context: 'catalog', stories: ["US08"], mockups: ["M27"] },
  },
  {
    path: 'products/new',
    name: 'product-new',
    component: () => import('./views/product-new.vue'),
    meta: { titleKey: 'catalog.productNew.title', context: 'catalog', stories: ["US13"], mockups: ["M29", "M30"] },
  },
  {
    path: 'products/:id',
    name: 'product-details',
    component: () => import('./views/product-details.vue'),
    meta: { titleKey: 'catalog.productDetails.title', context: 'catalog', stories: ["US07"], mockups: ["M28"] },
  },
  {
    path: 'products/:id/edit',
    name: 'product-edit',
    component: () => import('./views/product-edit.vue'),
    meta: { titleKey: 'catalog.productEdit.title', context: 'catalog', stories: ["US14"], mockups: ["M19"] },
  },
]
