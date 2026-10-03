export const iamRoutes = [
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('./views/sign-in.vue'),
    meta: { titleKey: 'iam.signIn.title', context: 'iam', stories: ["US02"], mockups: ["M20", "M21"], public: true },
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('./views/sign-up.vue'),
    meta: { titleKey: 'iam.signUp.title', context: 'iam', stories: ["US01"], mockups: ["M22", "M23", "M24"], public: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('./views/forgot-password.vue'),
    meta: { titleKey: 'iam.forgotPassword.title', context: 'iam', stories: ["US03"], mockups: ["M25", "M26"], public: true },
  },
]
