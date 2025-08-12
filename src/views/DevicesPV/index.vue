<template>
  <div class="voltage-class devices-pv">
    <!-- 页面头部 -->
    <div class="devices-pv__header">
      <div class="devices-pv__tabs">
        <el-button
          :type="activeTab === 'overview' ? 'primary' : 'warning'"
          @click="activeTab = 'overview'"
          class="devices-pv__tab-btn"
        >
          <img :src="alarmCurrentIcon" class="devices-pv__tab-icon" />
          Overview
        </el-button>
        <el-button
          :type="activeTab === 'monitoring' ? 'primary' : 'warning'"
          @click="activeTab = 'monitoring'"
          class="devices-pv__tab-btn"
        >
          <img :src="alarmHistoryIcon" class="devices-pv__tab-icon" />
          Value Monitoring
        </el-button>
      </div>
    </div>
    <!-- 动态内容区域 -->
    <div class="devices-pv__content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出来
import alarmCurrentIcon from '@/assets/icons/alarm-current.svg'
import alarmHistoryIcon from '@/assets/icons/alarm-history.svg'

// 响应式数据
import PVOverview from './PVOverview.vue'
import PVValueMonitoring from './PVValueMonitoring.vue'

const activeTab = ref<'overview' | 'monitoring'>('overview')

// 计算当前要显示的组件名
const currentComponent = computed(() => {
  if (activeTab.value === 'overview') {
    return PVOverview
  }
  return PVValueMonitoring
})
</script>

<style scoped lang="scss">
.voltage-class.devices-pv {
  height: 100%;
  display: flex;
  flex-direction: column;
  .devices-pv__header {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .devices-pv__tabs {
      display: flex;
      align-items: center;
      gap: 16px;
      .devices-pv__tab-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        .devices-pv__tab-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .devices-pv__content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .devices-pv__toolbar {
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .devices-pv__toolbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .devices-pv__toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;

        .devices-pv__export-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          .devices-pv__export-icon {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    .devices-pv__table {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 1660px;

      .devices-pv__table-content {
        flex: 1;
        max-height: 728px;
        overflow-y: auto;
      }

      .devices-pv__pagination {
        padding: 20px 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
