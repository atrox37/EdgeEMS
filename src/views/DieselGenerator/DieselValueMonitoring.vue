<template>
  <div class="voltage-class devices-diesel__content">
    <div class="devices-diesel__tables">
      <!-- 左侧表格 -->
      <div class="devices-diesel__table devices-diesel__table--left">
        <el-table :data="leftTableData">
          <el-table-column prop="name" label="Name" min-width="120" />
          <el-table-column prop="value" label="Value" min-width="120" />
          <el-table-column prop="unit" label="Unit" min-width="100" />
        </el-table>
      </div>
      <!-- 右侧表格 -->
      <div class="devices-diesel__table devices-diesel__table--right">
        <el-table :data="rightTableData">
          <el-table-column prop="name" label="Name" min-width="120" />
          <el-table-column prop="status" label="Status" min-width="120" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 左侧表格数据
const leftTableData = ref([
  { name: 'diesel1', value: 120, unit: 'V' },
  { name: 'diesel2', value: 118, unit: 'V' },
  { name: 'Current', value: 15, unit: 'A' },
  { name: 'Power', value: 1.8, unit: 'kW' },
  { name: 'Energy', value: 12.5, unit: 'kWh' },
])

// 右侧表格数据
const rightTableData = ref([
  { name: 'Inverter', status: 'Running' },
  { name: 'Battery', status: 'Charging' },
  { name: 'Grid', status: 'Connected' },
  { name: 'Diesel Generator', status: 'Standby' },
  { name: 'Load', status: 'Normal' },
])
</script>

<style scoped lang="scss">
.voltage-class.devices-diesel__content {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  .devices-diesel__tables {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    gap: 24px;
    .devices-diesel__table {
      flex: 1;
    }
  }
}
</style>
