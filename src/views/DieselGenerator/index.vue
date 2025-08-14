<template>
  <div class="voltage-class devices-diesel">
    <!-- 页面头部 -->
    <div class="devices-diesel__header">
      <div class="devices-diesel__tabs">
        <el-button
          :type="activeTab === 'overview' ? 'primary' : 'warning'"
          @click="activeTab = 'overview'"
          class="devices-diesel__tab-btn"
        >
          <img :src="alarmCurrentIcon" class="devices-diesel__tab-icon" />
          Overview
        </el-button>
        <el-button
          :type="activeTab === 'monitoring' ? 'primary' : 'warning'"
          @click="activeTab = 'monitoring'"
          class="devices-diesel__tab-btn"
        >
          <img :src="alarmHistoryIcon" class="devices-diesel__tab-icon" />
          Value Monitoring
        </el-button>
      </div>
    </div>
    <!-- 动态内容区域 -->
    <div class="devices-diesel__main">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出来
import alarmCurrentIcon from '@/assets/icons/alarm-current.svg'
import alarmHistoryIcon from '@/assets/icons/alarm-history.svg'

// 响应式数据
import DieselOverview from './DieselOverview.vue'
import DieselValueMonitoring from './DieselValueMonitoring.vue'

const activeTab = ref<'overview' | 'monitoring'>('overview')

// 计算当前要显示的组件名
const currentComponent = computed(() => {
  if (activeTab.value === 'overview') {
    return DieselOverview
  }
  return DieselValueMonitoring
})
</script>

<style scoped lang="scss">
.voltage-class.devices-diesel {
  height: 100%;
  display: flex;
  flex-direction: column;
  .devices-diesel__header {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .devices-diesel__tabs {
      display: flex;
      align-items: center;
      gap: 16px;
      .devices-diesel__tab-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        .devices-diesel__tab-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .devices-diesel__main {
    flex: 1;
    width: 100%;
  }
}
</style>
