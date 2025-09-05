import { markRaw, defineAsyncComponent } from 'vue'
import type { RouteItem } from '@/types/menu'
import homeIcon from '@/assets/icons/sidebar-home.svg'
import devicesIcon from '@/assets/icons/sidebar-devices.svg'
import alarmIcon from '@/assets/icons/sidebar-alarm.svg'
import controlIcon from '@/assets/icons/sidebar-control.svg'
import statisticsIcon from '@/assets/icons/sidebar-statistics.svg'
import settingIcon from '@/assets/icons/sidebar-setting.svg'

// 工具：安全的异步组件（避免被代理）

export const dynamicRoutes: RouteItem[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView/index.vue'),
    meta: {
      isSubMenu: false,
      activeNav: '/home',
      icon: homeIcon,
      title: 'Home',
      roles: ['Admin', 'operator', 'Engineer'],
    },
  },
  {
    path: '/devices',
    name: 'devices',
    meta: {
      isSubMenu: true,
      activeNav: '/devices',
      icon: devicesIcon,
      title: 'Devices',
      roles: ['Admin', 'operator', 'Engineer'],
    },
    children: [
      {
        path: 'devicesPV',
        name: 'devicesPV',
        redirect: '/devices/devicesPV/overview',
        component: () => import('@/views/DevicesPV/index.vue'),
        meta: {
          title: 'PV',
          activeNav: '/devices/devicesPV',
          roles: ['Admin', 'operator', 'Engineer'],
        },
        children: [
          {
            path: 'overview',
            name: 'devicesPVOverview',
            component: () => import('@/views/DevicesPV/PVOverview.vue'),
            meta: {
              activeNav: '/devices/devicesPV',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
          {
            path: 'monitoring',
            name: 'devicesPVMonitoring',
            component: () => import('@/views/DevicesPV/PVValueMonitoring.vue'),
            meta: {
              activeNav: '/devices/devicesPV',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
        ],
      },
      {
        path: 'deviceBattery',
        name: 'deviceBattery',
        component: () => import('@/views/DeviceBattery/index.vue'),
        redirect: '/devices/deviceBattery/overview',
        meta: {
          title: 'Battery',
          activeNav: '/devices/deviceBattery',
          roles: ['Admin', 'operator', 'Engineer'],
        },
        children: [
          {
            path: 'overview',
            name: 'deviceBatteryOverview',
            component: () => import('@/views/DeviceBattery/BatteryOverview.vue'),
            meta: {
              activeNav: '/devices/deviceBattery',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
          {
            path: 'value',
            name: 'deviceBatteryValue',
            component: () => import('@/views/DeviceBattery/BatteryValue.vue'),
            meta: {
              activeNav: '/devices/deviceBattery',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
          {
            path: 'management',
            name: 'deviceBatteryManagement',
            component: () => import('@/views/DeviceBattery/BatteryManagement.vue'),
            meta: {
              activeNav: '/devices/deviceBattery',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
        ],
      },
      {
        path: 'dieselGenerator',
        name: 'dieselGenerator',
        component: () => import('@/views/DieselGenerator/index.vue'),
        redirect: '/devices/dieselGenerator/overview',
        meta: {
          title: 'Diesel Generator',
          activeNav: '/devices/dieselGenerator',
          roles: ['Admin', 'operator', 'Engineer'],
        },
        children: [
          {
            path: 'overview',
            name: 'dieselGeneratorOverview',
            component: () => import('@/views/DieselGenerator/DieselOverview.vue'),
            meta: {
              activeNav: '/devices/dieselGenerator',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
          {
            path: 'monitoring',
            name: 'dieselGeneratorMonitoring',
            component: () => import('@/views/DieselGenerator/DieselValueMonitoring.vue'),
            meta: {
              activeNav: '/devices/dieselGenerator',
              roles: ['Admin', 'operator', 'Engineer'],
            },
          },
        ],
      },
      // {
      //   path: 'devicePCS',
      //   name: 'devicePCS',
      //   component: () => import('@/views/DevicePCS/index.vue'),
      //   meta: {
      //     title: 'PCS',
      //     activeNav: '/devices/devicePCS',
      //     roles: ['Admin', 'operator', 'Engineer'],
      //   },
      // },
      {
        path: 'devicemeter1',
        name: 'devicemeter1',
        component: () => import('@/views/DeviceMeter1/index.vue'),
        meta: {
          title: 'Meter1',
          activeNav: '/devices/devicemeter1',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'devicemeter2',
        name: 'devicemeter2',
        component: () => import('@/views/DeviceMeter2/index.vue'),
        meta: {
          title: 'Meter2',
          activeNav: '/devices/devicemeter2',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
    ],
  },
  {
    path: '/alarm',
    name: 'alarm',
    meta: {
      isSubMenu: true,
      activeNav: '/alarm',
      icon: alarmIcon,
      title: 'Alarm',
      roles: ['Admin', 'operator', 'Engineer'],
    },
    children: [
      {
        path: 'alarmCurrentRecords',
        name: 'alarmCurrentRecords',
        component: () => import('@/views/AlarmCurrentRecords/index.vue'),
        meta: {
          title: 'Current Records',
          activeNav: '/alarm/alarmCurrentRecords',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'alarmHistoryRecords',
        name: 'alarmHistoryRecords',
        component: () => import('@/views/AlarmHistoryRecords/index.vue'),
        meta: {
          title: 'History Records',
          activeNav: '/alarm/alarmHistoryRecords',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'ruleManagement',
        name: 'ruleManagement',
        component: () => import('@/views/RulesManagement/index.vue'),
        meta: {
          title: 'Rule Management',
          activeNav: '/alarm/ruleManagement',
          roles: ['Admin'],
        },
      },
    ],
  },
  {
    path: '/control',
    name: 'control',
    meta: {
      title: 'Control',
      isSubMenu: true,
      activeNav: '/control',
      icon: controlIcon,
      roles: ['Admin', 'operator', 'Engineer'],
    },
    children: [
      {
        path: 'controlRecord',
        name: 'controlRecord',
        component: () => import('@/views/ControlRecord/index.vue'),
        meta: {
          title: 'Control Record',
          activeNav: '/control/controlRecord',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'controlManagement',
        name: 'controlManagement',
        component: () => import('@/views/ControlManagement/index.vue'),
        meta: {
          title: 'Control Management',
          activeNav: '/control/controlManagement',
          roles: ['Admin'],
        },
      },
    ],
  },
  {
    path: '/statistics',
    name: 'statistics',
    // component: () => import('@/views/Statistics/index.vue'),
    redirect: '/statistics/overview',
    meta: {
      isSubMenu: true,
      title: 'Statistics',
      activeNav: '/statistics',
      icon: statisticsIcon,
      roles: ['Admin', 'operator', 'Engineer'],
    },
    children: [
      {
        path: 'overview',
        name: 'statisticsOverview',
        component: () => import('@/views/Statistics/Overview.vue'),
        meta: {
          title: 'Overview',
          activeNav: '/statistics/overview',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'curves',
        name: 'statisticsCurves',
        component: () => import('@/views/Statistics/Curves.vue'),
        meta: {
          title: 'Curves',
          activeNav: '/statistics/curves',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'operationLog',
        name: 'statisticsOperationLog',
        component: () => import('@/views/Statistics/OperationLog.vue'),
        meta: {
          title: 'Operation Log',
          activeNav: '/statistics/operationLog',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
      {
        path: 'runingLog',
        name: 'statisticsRuningLog',
        component: () => import('@/views/Statistics/RuningLog.vue'),
        meta: {
          title: 'Runing Log',
          activeNav: '/statistics/runingLog',
          roles: ['Admin', 'operator', 'Engineer'],
        },
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      isSubMenu: true,
      activeNav: '/setting',
      icon: settingIcon,
      title: 'Setting',
      roles: ['Admin'],
    },
    children: [
      {
        path: 'systemSetting',
        name: 'systemSetting',
        component: () => import('@/views/SystemSetting/index.vue'),
        meta: {
          title: 'System Setting',
          activeNav: '/setting/systemSetting',
          roles: ['Admin'],
        },
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import('@/views/UserManagement/index.vue'),
        meta: {
          title: 'User Management',
          activeNav: '/setting/userManagement',
          roles: ['Admin'],
        },
      },
      {
        path: 'configuration',
        name: 'configuration',
        component: () => import('@/views/Configuration/index.vue'),
        redirect: '/setting/configuration/channelConfiguration',
        meta: {
          title: 'Configuration',
          activeNav: '/setting/configuration',
          roles: ['Admin'],
        },
        children: [
          {
            path: 'channelConfiguration',
            name: 'channelConfiguration',
            component: () => import('@/views/ChannelConfiguration/index.vue'),
            meta: {
              title: 'Channel Configuration',
              activeNav: '/setting/configuration',
              roles: ['Admin'],
            },
          },
          {
            path: 'modelConfiguration',
            name: 'modelConfiguration',
            component: () => import('@/views/DeviceConfiguration/index.vue'),
            meta: {
              title: 'Model Configuration',
              activeNav: '/setting/configuration',
              roles: ['Admin'],
            },
          },
        ],
      },
    ],
  },
]
