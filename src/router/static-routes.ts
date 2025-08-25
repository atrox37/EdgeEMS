import type { RouteRecordRaw } from 'vue-router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView/index.vue'),
    meta: {
      activeNav: '/login',
      roles: ['Admin', 'operator', 'Engineer'],
    },
  },
  {
    name: 'main',
    path: '/',
    component: () => import('../layout/MainLayout.vue'),
    children: [],
    meta: {
      activeNav: '/home',
      roles: ['Admin', 'operator', 'Engineer'],
    },
  },
]
