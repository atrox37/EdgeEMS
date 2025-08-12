import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/MainLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/HomeView/index.vue'),
          meta: {
            title: 'home',
            roles: ['admin', 'operator', 'engineer'],
          },
        },
        {
          path: 'devices',
          name: 'devices',
          meta: {
            title: 'devices',
            roles: ['admin', 'operator', 'engineer'],
          },
          children: [
            {
              path: 'devicesPV',
              name: 'devicesPV',
              component: () => import('../views/DevicesPV/index.vue'),
            },
            {
              path: 'deviceBattery',
              name: 'deviceBattery',
              component: () => import('../views/DeviceBattery/index.vue'),
            },
            {
              path: 'devicePCS',
              name: 'devicePCS',
              component: () => import('../views/DevicePCS/index.vue'),
            },
            {
              path: 'devicemeter2',
              name: 'devicemeter2',
              component: () => import('../views/Devicemeter2/index.vue'),
            },
            {
              path: 'devicemeter1',
              name: 'devicemeter1',
              component: () => import('../views/Devicemeter1/index.vue'),
            },

            {
              path: 'dieselGenerator',
              name: 'dieselGenerator',
              component: () => import('../views/DieselGenerator/index.vue'),
            },
          ],
        },
        {
          path: 'alarm',
          name: 'alarm',
          meta: {
            title: 'alarm',
            roles: ['admin', 'operator', 'engineer'],
          },
          children: [
            {
              path: 'alarmRecords',
              name: 'alarmRecords',
              component: () => import('../views/AlarmRecords/index.vue'),
            },
            {
              path: 'ruleManagement',
              name: 'ruleManagement',
              component: () => import('../views/RulesManagement/index.vue'),
            },
          ],
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('../views/Statistics/index.vue'),
          meta: {
            title: 'statistics',
            roles: ['admin', 'operator', 'engineer'],
          },
        },
        {
          path: 'setting',
          name: 'setting',
          meta: {
            title: 'setting',
            roles: ['admin', 'operator', 'engineer'],
          },
          children: [
            {
              path: 'systemSetting',
              name: 'systemSetting',
              component: () => import('../views/SystemSetting/index.vue'),
            },
            {
              path: 'userManagement',
              name: 'userManagement',
              component: () => import('../views/UserManagement/index.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView/index.vue'),
      meta: {
        title: '登录页面',
      },
    },
  ],
})

export default router
