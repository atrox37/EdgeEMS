<template>
  <div
    class="voltage-class main-layout"
    :class="isHomePage ? 'main-layout__homeBackground' : 'main-layout__SimpleBackground'"
  >
    <div class="main-layout__left">
      <!-- 侧边导航栏 -->
      <Sidebar />
    </div>
    <div class="main-layout__right">
      <!-- 头部 -->
      <Header />
      <!-- 主内容区域 -->
      <main class="main-layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

// 定义响应式变量，动态切换背景色
const route = useRoute()
const isHomePage: Ref<boolean> = computed(() => {
  return route.name === 'home' ? true : false
})
</script>

<style lang="scss" scoped>
.voltage-class.main-layout {
  height: 100%;
  width: 100%;
  display: flex;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  &.main-layout__homeBackground {
    background: transparent;
    // background-image: url('../assets/images/home-bg.png');
  }
  &.main-layout__SimpleBackground {
    background-image: url('../assets/images/simple-bg.png');
  }
  .main-layout__right {
    flex: 1;
    .main-layout__content {
      padding: 20px;
      height: calc(100% - 85px);
      width: 100%;
    }
  }
}
</style>
