<template>
  <div class="voltage-class sidebar" :class="{ collapse: isCollapse }">
    <div class="sidebar__header" :class="{ collapse: isCollapse }">
      <div class="sidebar__header-img" :class="{ collapse: isCollapse }"></div>
    </div>

    <nav class="sidebar__nav">
      <el-menu
        :collapse="isCollapse"
        class="sidebar__menu"
        :default-active="activeMenu"
        router
        background-color="transparent"
        text-color="#fff"
        active-text-color="#fff"
        :unique-opened="true"
      >
        <template v-for="item in menuItems" :key="item.id">
          <el-sub-menu
            v-if="item.children && item.children.length > 0"
            :index="item.routeName"
            class="sidebar__subMenu"
          >
            <template #title>
              <img
                v-if="item.iconName"
                :src="getSidebarIconUrl(item.iconName)"
                class="sidebar__subMenu-img"
                :class="{ collapse: isCollapse }"
                alt=""
              />
              <span class="sidebar__subMenu-title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.id" :index="child.routeName">
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.routeName" class="sidebar__menu-item">
            <img
              v-if="item.iconName"
              :src="getSidebarIconUrl(item.iconName)"
              class="sidebar__subMenu-img"
              :class="{ collapse: isCollapse }"
              alt=""
            />
            <span class="sidebar__menu-text">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </nav>

    <div class="sidebar__footer" :class="{ collapse: isCollapse }">
      <div class="sidebar__footer-shrink" @click="handleShrink"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'

// 1. 使用import.meta.globEager批量导入侧边栏icon图片
const sidebarIcons = import.meta.glob('@/assets/images/sidebar-*-icon.png', {
  eager: true,
  import: 'default',
})

/**
 * 获取侧边栏icon图片的真实路径
 * @param iconName 图标名
 * @returns 图片路径
 */
function getSidebarIconUrl(iconName: string): string {
  // 兼容@和/src两种写法
  const key1 = `/src/assets/images/sidebar-${iconName}-icon.png`
  const key2 = `@/assets/images/sidebar-${iconName}-icon.png`
  return sidebarIcons[key1] || sidebarIcons[key2] || ''
}

interface MenuItem {
  id: number | string
  title: string
  routeName?: string
  iconName?: string
  children?: MenuItem[]
}

const isCollapse = ref(false)
const route = useRoute()

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: 'Home',
    iconName: 'home',
    children: [],
    routeName: '/home',
  },
  {
    id: 2,
    title: 'Devices',
    iconName: 'devices',
    routeName: '/devices',
    children: [
      {
        id: '2-1',
        title: 'PV',
        routeName: '/devices/devicesPV',
      },
      {
        id: '2-2',
        title: 'Battery',
        routeName: '/devices/deviceBattery',
      },
      {
        id: '2-3',
        title: 'PCS',
        routeName: '/devices/devicePCS',
      },
      {
        id: '2-4',
        title: 'meter1',
        routeName: '/devices/devicemeter1',
      },
      {
        id: '2-5',
        title: 'meter2',
        routeName: '/devices/devicemeter2',
      },

      {
        id: '2-6',
        title: 'Diesel Generator',
        routeName: '/devices/dieselGenerator',
      },
    ],
  },
  {
    id: 3,
    title: 'Alarm',
    iconName: 'warning',
    routeName: '/alarm',
    children: [
      {
        id: '3-1',
        title: 'Alarm Records',
        routeName: '/alarm/alarmRecords',
      },
      {
        id: '3-1',
        title: 'Rule Management',
        routeName: '/alarm/ruleManagement',
      },
    ],
  },
  {
    id: 4,
    title: 'Statistics',
    iconName: 'statistics',
    routeName: '/statistics',
    children: [],
  },
  {
    id: 5,
    title: 'Setting',
    iconName: 'setting',
    routeName: '/setting',
    children: [
      {
        id: '5-1',
        title: 'System setting',
        routeName: '/setting/systemSetting',
      },
      {
        id: '5-2',
        title: 'User management',
        routeName: '/setting/userManagement',
      },
    ],
  },
]

// 用watch监听路由变化，初始化时也会执行
const activeMenu = ref('/setting/systemSetting')
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
  { immediate: true },
)

const handleShrink = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.voltage-class {
  &.sidebar {
    height: 100vh;
    padding: 20px 0;
    background: rgba(84, 98, 140, 0.4);
    border-right: 1px solid;
    border-image-source: linear-gradient(
      147.24deg,
      rgba(148, 166, 197, 0.72) 39.16%,
      rgba(148, 166, 197, 0.36) 66.27%,
      rgba(148, 166, 197, 0.72) 98.58%
    );
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;

    transition: width 0.3s ease-in-out;

    width: 220px; // 默认展开
    &.collapse {
      width: 85px;
    }

    .sidebar__header {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      // 默认展开
      // &.collapse {
      //   margin: 20px 0;
      // }
      // &.no-collapse {
      //   margin: 20px 40px;
      // }
      .sidebar__header-img {
        background-repeat: no-repeat;
        background-image: url('@/assets/images/sidebar-logo.png');
        width: 100px;
        height: 68.6px;
        background-size: 100% 100%;
        &.collapse {
          background-image: url('@/assets/images/sidebar-logo-collapse.png');
          width: 50px;
          height: 68.6px;
          background-size: 100% auto;
        }
      }
    }

    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: 12px;

      .sidebar__logo-text {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        font-family: 'Montserrat', sans-serif;
      }
    }

    .sidebar__nav {
      flex: 1;
      padding: 20px;
      .sidebar__menu-item {
      }
    }
    .sidebar__subMenu-img {
      width: 24px;
      height: 24px;
      margin-right: 10px; // 默认展开
      &.collapse {
        margin-right: 0;
      }
    }
    .sidebar__menu-text {
      font-weight: 700;
      font-size: 14px;
    }
    .sidebar__subMenu-title {
      font-family: Arimo;
      font-weight: 700;
      font-style: Bold;
      font-size: 14px;
      letter-spacing: 0%;
      color: #fff;
    }
    .sidebar__footer {
      position: relative;
      right: 0;
      bottom: 0;
      padding: 0 20px;
      display: flex;
      flex-direction: row-reverse;
      transition: all 0.3s ease;
      justify-content: flex-start;
      align-items: center;
      &.collapse {
        justify-content: center;
        align-items: center;
      }
      .sidebar__footer-shrink {
        background-image: url('@/assets/images/sidebar-shrink.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
