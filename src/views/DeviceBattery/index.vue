<template>
  <div class="voltage-class devices-battery">
    <!-- 页面头部 -->
    <div class="devices-battery__header">
      <div class="devices-battery__tabs">
        <el-button
          :type="activeTab === 'overview' ? 'primary' : 'warning'"
          @click="activeTab = 'overview'"
          class="devices-battery__tab-btn"
        >
          <img :src="alarmCurrentIcon" class="devices-battery__tab-icon" />
          Overview
        </el-button>
        <el-button
          :type="activeTab === 'value' ? 'primary' : 'warning'"
          @click="activeTab = 'value'"
          class="devices-battery__tab-btn"
        >
          <img :src="alarmHistoryIcon" class="devices-battery__tab-icon" />
          Value value
        </el-button>
        <el-button
          :type="activeTab === 'management' ? 'primary' : 'warning'"
          @click="activeTab = 'management'"
          class="devices-battery__tab-btn"
        >
          <img :src="alarmCurrentIcon" class="devices-battery__tab-icon" />
          Battery Management
        </el-button>
      </div>
    </div>
    <!-- 动态内容区域 -->
    <div class="devices-battery__content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出来
import alarmCurrentIcon from '@/assets/icons/alarm-current.svg'
import alarmHistoryIcon from '@/assets/icons/alarm-history.svg'

// 响应式数据
import BatteryOverview from './BatteryOverview.vue'
import BatteryValuevalue from './BatteryValue.vue'
import BatteryManagement from './BatteryManagement.vue'

const activeTab = ref<'overview' | 'value' | 'management'>('overview')

// 计算当前要显示的组件名
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'overview':
      return BatteryOverview
    case 'value':
      return BatteryValuevalue
    case 'management':
      return BatteryManagement
    default:
      return BatteryOverview
  }
})
</script>

<style scoped lang="scss">
.voltage-class.devices-battery {
  height: 100%;
  display: flex;
  flex-direction: column;
  .devices-battery__header {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .devices-battery__tabs {
      display: flex;
      align-items: center;
      gap: 16px;
      .devices-battery__tab-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        .devices-battery__tab-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .devices-battery__content {
    flex: 1;
    padding-top: 20px;
  }
}
</style>
