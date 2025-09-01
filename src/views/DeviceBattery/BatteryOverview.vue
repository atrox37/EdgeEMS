<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__right">
      <BatteryCard class="battery-card" v-for="item in batteryCardData" :key="item.title" :title="item.title"
        :value="item.value" :unit="item.unit"></BatteryCard>
    </div>
  </div>
</template>
<script setup lang="ts">
const batteryCardData = [
  {
    id: 1,
    title: 'Off Grid',
  },
  {
    id: 2,
    title: 'Cell Count',
    value: '96',
  },
  {
    id: 3,
    title: 'SoH',
    value: '99',
    unit: '%',
  },
  {
    id: 4,
    title: 'SoC',
    value: '72',
    unit: '%',
  },
  {
    id: 5,
    title: 'Energy',
    value: '180',
    unit: 'kWh',
  },
  {
    id: 6,
    title: 'Cycle',
    value: '1212',
  },
  {
    id: 7,
    title: 'Voltage',
    value: '690',
    unit: 'V',
  },
  {
    id: 8,
    title: 'Running Status',
    value: 'DisCharge',
  },
  {
    id: 9,
    title: 'Cooling',
    value: 'Air',
  },
  {
    id: 10,
    title: 'Current',
    value: '-32',
    unit: 'A',
  },
  {
    id: 11,
    title: 'Max Temp',
    value: '100.4',
    unit: '°F',
  },
  {
    id: 11,
    title: 'Alarms',
    value: 'normal',
  },
  {
    id: 12,
    title: 'Power',
    value: '-24',
    unit: 'kw',
  },
  {
    id: 13,
    title: 'Min Temp',
    value: '86.4',
    unit: '°F',
  },
]
</script>
<style scoped lang="scss">
.voltage-class.pv-overview {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative; // 确保z-index生效
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: -0.72rem;
    left: -0.2rem;
    width: 100%;
    height: calc(100vh - 0.85rem); // 减去header高度
    background-image: url('@/assets/images/battery-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    z-index: 0;
    pointer-events: none; // 防止背景阻挡用户交互
  }

  .pv-overview__right {
    width: 48.2%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.16rem;
    position: relative;
    z-index: 2; // 确保内容在背景之上

    .battery-card {
      height: 18%;
      width: calc((100% - 0.32rem) / 3);
      margin-bottom: 0.01rem;
    }
  }
}
</style>
