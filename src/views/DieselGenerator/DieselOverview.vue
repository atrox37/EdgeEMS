<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__header">
      <div class="card-item" v-for="item in energyCardData" :key="item.title">
        <PVCard :title="item.title" :icon="item.icon" :value="item.value" :unit="item.unit" />
      </div>
    </div>
    <div class="pv-overview__content"></div>
  </div>
</template>
<script setup lang="ts">
const energyCardData = [
  {
    title: 'Power',
    icon: 'Power',
    value: '35',
    unit: 'kW',
  },

  {
    title: 'oil',
    icon: 'Oil',
    value: '56',
    unit: '%',
  },
  {
    title: 'Voltage',
    icon: 'Voltage',
    value: '220',
    unit: 'V',
  },
  {
    title: 'Coolant Temp',
    icon: 'CoolantTemp',
    value: '96',
    unit: '°F',
  },
]
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
    .card-item {
      height: 100px;
      width: calc((100% - 120px) / 4);
    }
  }
  .pv-overview__content {
    width: 100%;
    flex: 1;
    background-image: url('@/assets/images/DieselGenerator-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
