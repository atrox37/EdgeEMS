<template>
  <div class="voltage-class pv-overview">
    <div class="pv-overview__header">
      <PVCard
        v-for="item in energyCardData"
        :key="item.title"
        :title="item.title"
        :icon="item.icon"
        :value="item.value"
        :unit="item.unit"
        bgColor="rgba(84, 98, 140, 0.2)"
        width="4rem"
        height="1rem"
        padding="0px 0px 0px 20px"
      />
    </div>
    <div class="pv-overview__content"></div>
  </div>
</template>
<script setup lang="ts">
const energyCardData = [
  {
    title: 'Power',
    icon: 'Power',
    value: '1000',
    unit: 'kW',
  },

  {
    title: 'oil',
    icon: 'Oil',
    value: '1000',
    unit: 'V',
  },
  {
    title: 'Voltage',
    icon: 'Voltage',
    value: '1000',
    unit: 'V',
  },
  {
    title: 'Coolant Temp',
    icon: 'CoolantTemp',
    value: '1000',
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
