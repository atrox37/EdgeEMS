<template>
  <div class="voltage-class configuration">
    <!-- 页面头部 -->
    <div class="configuration__header">
      <div class="configuration__tabs">
        <el-button
          :type="activeTab === 'configuration and point configuration' ? 'primary' : 'warning'"
          @click="handleTabClick('configuration and point configuration')"
          class="configuration__tab-btn"
        >
          <img :src="alarmCurrentIcon" class="configuration__tab-icon" />
          configuration and point configuration
        </el-button>
        <el-button
          :type="activeTab === 'Device model configuration' ? 'primary' : 'warning'"
          @click="handleTabClick('Device model configuration')"
          class="configuration__tab-btn"
        >
          <img :src="alarmHistoryIcon" class="configuration__tab-icon" />
          Device model configuration
        </el-button>
      </div>
    </div>
    <!-- 路由内容区域 -->
    <div class="configuration__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出来
import alarmCurrentIcon from '@/assets/icons/alarm-current.svg'
import alarmHistoryIcon from '@/assets/icons/alarm-history.svg'

// 响应式数据
const route = useRoute()
const router = useRouter()

// 根据当前路由计算激活的标签
const activeTab = computed(() => {
  const path = route.path
  if (path.includes('/channelConfiguration')) {
    return 'configuration and point configuration'
  }
  return 'Device model configuration'
})

// 处理标签点击事件
const handleTabClick = (
  tab: 'configuration and point configuration' | 'Device model configuration',
) => {
  if (tab === 'configuration and point configuration') {
    router.push('/setting/configuration/channelConfiguration')
  } else {
    router.push('/setting/configuration/modelConfiguration')
  }
}
</script>

<style scoped lang="scss">
.voltage-class.configuration {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .configuration__header {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .configuration__tabs {
      display: flex;
      align-items: center;
      gap: 16px;
      .configuration__tab-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        .configuration__tab-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .configuration__content {
    height: calc(100% - 52px);
    display: flex;
    flex-direction: column;

    .configuration__toolbar {
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .configuration__toolbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .configuration__toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;

        .configuration__export-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          .configuration__export-icon {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    .configuration__table {
      flex: 1;
      display: flex;
      flex-direction: column;

      .configuration__table-content {
        flex: 1;
        overflow-y: auto;
      }

      .configuration__pagination {
        padding: 20px 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
