<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__header">
      <div class="cards-item" v-for="item in energyCardData" :key="item.title">
        <PVCard :title="item.title" :icon="item.icon" :value="item.value" :unit="item.unit" />
      </div>
    </div>
    <div class="pv-overview__content"></div>
  </div>
</template>
<script setup lang="ts">
import useWebSocket from '@/composables/useWebSocket'
import type { SubscriptionConfig } from '@/types/websocket'

// // 页面订阅配置
// const pageId = 'pv-overview'
// const pageSubscriptionConfig: SubscriptionConfig = {
//   channels: [1001], // 订阅更多频道
//   dataTypes: ['T'], // 订阅遥测和遥信数据
//   interval: 1000,
// }

// // 页面监听器
// const pageListeners = {
//   onBatchDataUpdate: (data: any) => {
//     console.log('[PVOverview] 页面批量数据更新:', data)
//     // 处理批量数据更新
//     energyCardData.forEach((item, index) => {
//       item.value = data.updates[0].values[index + 1]
//     })
//   },
// }
// const { stats, subscribePage, unsubscribePage } = useWebSocket(
//   pageId,
//   pageSubscriptionConfig,
//   pageListeners,
// )

const energyCardData = reactive([
  {
    title: 'PV Power',
    icon: 'Power',
    value: 35,
    unit: 'kW',
  },
  {
    title: 'PV Voltage',
    icon: 'Voltage',
    value: 220,
    unit: 'V',
  },
  {
    title: 'PV Current',
    icon: 'Current',
    value: 20,
    unit: 'A',
  },
  {
    title: 'Coolant Temp',
    icon: 'CoolantTemp',
    value: 96,
    unit: '°F',
  },
])
</script>
<style scoped lang="scss">
.voltage-class.pv-overview {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .pv-overview__header {
    width: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cards-item {
      height: 100px;
      width: calc((100% - 120px) / 4);
    }
  }
  .pv-overview__content {
    width: 100%;
    flex: 1;
    background-image: url('@/assets/images/PV-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
