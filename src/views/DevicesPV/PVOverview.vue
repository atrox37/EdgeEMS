<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__header">
      <div class="cards-item" v-for="item in energyCardData" :key="item.title">
        <PVCard :title="item.title" :icon="item.icon" :value="item.value" :unit="item.unit" />
      </div>
    </div>
    <div class="pv-overview__content">
      <!-- <div class="trap-wrap" :style="{
        '--rows': rows,
        '--cols': cols,
        '--top-scale': topScale,
        '--bottom-scale': bottomScale
      }">
        <div v-for="r in rows" :key="r" class="row" :class="{ 'row--active': hoveredRow === r - 1 }"
          :style="rowStyle(r - 1)" @mouseleave="hoveredRow = null">
          <div v-for="c in 8" :key="`${r}-${c}`" class="cell cell-left" @mouseenter="hoveredRow = r - 1">
          </div>
          <div class="gap-placeholder"></div>
          <div v-for="c in 8" :key="`${r}-${c + 8}`" class="cell cell-right" @mouseenter="hoveredRow = r - 1">
          </div>
          <div v-if="hoveredRow === r - 1" class="row-highlight" aria-hidden="true" />
        </div>
      </div> -->

    </div>
  </div>
</template>
<script setup lang="ts">
import useWebSocket from '@/composables/useWebSocket'
import type { SubscriptionConfig } from '@/types/websocket'
import powerIcon from '@/assets/icons/Power.svg'
import voltageIcon from '@/assets/icons/Voltage.svg'
import currentIcon from '@/assets/icons/Current.svg'
import coolantTempIcon from '@/assets/icons/CoolantTemp.svg'

import { ref } from 'vue'

const rows = 6
const cols = 16

// 顶/底宽度缩放：1 = 100% 容器宽。可按需求调
const topScale = 0.8
const bottomScale = 1

const hoveredRow = ref<number | null>(null)

/**
 * 让第 i 行（0~rows-1）在 topScale 与 bottomScale 之间做线性插值，
 * 使得上窄下宽（形成梯形）。
 */
const rowStyle = (i: number) => {
  const t = i / (rows - 1) // 0..1
  const scale = topScale * (1 - t) + bottomScale * t
  return {
    '--row-scale': scale,
  }
}
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
    icon: powerIcon,
    value: 35,
    unit: 'kW',
  },
  {
    title: 'PV Voltage',
    icon: voltageIcon,
    value: 220,
    unit: 'V',
  },
  {
    title: 'PV Current',
    icon: currentIcon,
    value: 20,
    unit: 'A',
  },
  {
    title: 'Coolant Temp',
    icon: coolantTempIcon,
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
    padding: 0.2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cards-item {
      height: 1rem;
      width: calc((100% - 1.2rem) / 4);
    }
  }

  .pv-overview__content {
    position: relative;
    width: 100%;
    height: calc(100% - 1.4rem);
    background-image: url('@/assets/images/PV-bg.png');
    // background-repeat: no-repeat;
    background-size: 90% 130%;
    background-position: 27% 60%;
    display: flex;
    justify-content: center;
    align-items: center;

    .trap-wrap {
      position: relative;
      width: 57%;
      height: 81%;
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }

    /* 每一行是 16 列网格，宽度由 --row-scale 控制形成梯形 */
    .row {
      position: relative;
      width: calc((var(--row-scale) * 100%) + 2px);
      margin-inline: auto;
      /* 居中 */
      display: grid;
      grid-template-columns: repeat(8, 1fr) 0.26rem repeat(8, 1fr);
      /* 前8列 + 大间隙(2fr) + 后8列 */
      gap: 0.06rem;
      /* 给高亮留内边距 */
      transition: width .12s ease;
    }

    /* 每两行与第三行之间有较大空隙 */
    .row:nth-child(2) {
      margin-bottom: 0.39rem;
      /* 第3、6行后有更大间距 */
    }

    .row:nth-child(4) {
      margin-bottom: 0.53rem;
      /* 第3、6行后有更大间距 */
    }

    /* 行内元素样式 */
    .cell {
      aspect-ratio: 2/3;
      // height: 0.56rem;
      /* 单元格比例，可改 */
      display: grid;
      place-items: center;
      background: #ffffff;
      overflow: hidden;
      transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
      cursor: pointer;
      position: relative;
    }

    .cell-left {
      &:nth-child(1) {
        transform: rotate(5deg);
      }

      &:nth-child(2) {
        transform: rotate(2.25deg);
      }

      &:nth-child(3) {
        transform: rotate(1.5deg);
      }

      &:nth-child(4) {
        transform: rotate(0.75deg);
      }

      &:nth-child(5) {
        transform: rotate(0deg);
      }

      &:nth-child(6) {
        transform: rotate(0deg);
      }

      &:nth-child(7) {
        transform: rotate(0deg);
      }

      &:nth-child(8) {
        transform: rotate(0deg);
      }
    }

    .cell-right {
      &:nth-child(1) {
        transform: rotate(-3deg);
      }

      &:nth-child(2) {
        transform: rotate(-2.25deg);
      }

      &:nth-child(3) {
        transform: rotate(-1.5deg);
      }

      &:nth-child(4) {
        transform: rotate(-0.75deg);
      }

      &:nth-child(5) {
        transform: rotate(0deg);
      }

      &:nth-child(6) {
        transform: rotate(0deg);
      }

      &:nth-child(7) {
        transform: rotate(0deg);
      }

      &:nth-child(8) {
        transform: rotate(0deg);
      }
    }

    // /* 元素里的示例内容（点/占位） */
    // .dot {
    //   width: 18px;
    //   height: 18px;
    //   border-radius: 999px;
    //   background: currentColor;
    //   opacity: .55;
    // }

    /* 行高亮遮罩（覆盖整行内区，不挡事件） */
    .row-highlight {
      position: absolute;
      inset: 0;
      background: rgba(255, 214, 0, .16);
      pointer-events: none;
    }
  }
}
</style>
