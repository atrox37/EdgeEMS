<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__left"></div>
    <div class="pv-overview__right">
      <BatteryCard
        class="battery-card"
        v-for="item in batteryCardData"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :unit="item.unit"
      ></BatteryCard>
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
  justify-content: space-between;
  .pv-overview__left {
    width: 48.2%;
    background-image: url('@/assets/images/battery-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 102%;
    background-position: center;
  }
  .pv-overview__right {
    width: 48.2%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    .battery-card {
      height: 18%;
      width: calc((100% - 32px) / 3);
      margin-bottom: 1px;
    }
  }
}
</style>
