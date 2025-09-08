<template>
  <div class="voltage-class devices-pv__content">
    <div class="devices-pv__tables">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Battery" name="battery">
          <DeviceMonitoringTable />
        </el-tab-pane>
        <el-tab-pane label="PCS" name="pcs">
          <DeviceMonitoringTable />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref<'battery' | 'pcs'>('battery')
</script>

<style scoped lang="scss">
.devices-pv__content {
  width: 100%;
  height: 100%;

  .devices-pv__tables {
    height: 100%;
    width: 100%;
  }
}

:deep(.el-tabs) {
  height: 100% !important;
}

// :deep(.el-tabs__content) {
//   height: calc(100% - 0.55rem) !important;
// }

:deep(.el-tab-pane) {
  height: 100% !important;
}
</style>
