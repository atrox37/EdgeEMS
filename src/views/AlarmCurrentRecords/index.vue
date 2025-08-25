<template>
  <div class="voltage-class alarm-records">
    <!-- <LoadingBg :loading="loading"> -->
    <!-- 表格工具栏 -->
    <div class="alarm-records__toolbar">
      <div class="alarm-records__toolbar-left" ref="toolbarLeftRef">
        <!-- 选择框 -->
        <el-select
          v-model="filters.warning_level"
          @change="fetchTableData(true)"
          :append-to="toolbarLeftRef"
          placeholder="select warning level"
          clearable
        >
          <el-option label="L1" :value="1" />
          <el-option label="L2" :value="2" />
          <el-option label="L3" :value="3" />
        </el-select>
      </div>
    </div>

    <!-- 表格 -->
    <div class="alarm-records__table">
      <el-table :data="tableData" class="alarm-records__table-content">
        <el-table-column prop="rule_name" label="Name" min-width="1.2rem" />
        <el-table-column prop="channel_id" label="Channel ID" min-width="1.2rem" />
        <el-table-column prop="warning_level" label="Level" min-width="1rem">
          <template #default="scope">
            {{ warningLevelList[scope.row.warning_level - 1].label }}
          </template>
        </el-table-column>
        <el-table-column prop="triggered_at" label="Start Time" min-width="1.6rem" />
      </el-table>

      <!-- 分页组件 -->
      <div class="alarm-records__pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="handlePageChange"
          @current-change="fetchTableData"
        />
      </div>
    </div>
    <!-- </LoadingBg> -->
  </div>
</template>

<script setup lang="ts">
import type { AlarmRecord } from '@/types/alarm'
import { useTableData, type TableConfig } from '@/composables/useTableData'

import alarmExportIcon from '@/assets/icons/alarm-export.svg'

// 响应式数据
const activeTab = ref<'current' | 'history'>('current')
const toolbarLeftRef = ref<HTMLElement | null>(null)
// 表格配置
const tableConfig: TableConfig = {
  listUrl: 'alerts',
  defaultPageSize: 20,
  serverType: 'alarm',
}

// 使用 useTableData composable
const { loading, tableData, pagination, handlePageChange, fetchTableData, filters } =
  useTableData<AlarmRecord>(tableConfig)

filters.warning_level = undefined
const warningLevelList = [
  {
    label: 'L1',
    value: 1,
  },

  {
    label: 'L2',
    value: 2,
  },
  {
    label: 'L3',
    value: 3,
  },
]

// 处理导出
const handleExport = () => {
  ElMessage.success('导出功能已触发')
  // 这里可以添加实际的导出逻辑
  console.log('导出数据:', tableData.value)
}
</script>

<style scoped lang="scss">
.voltage-class.alarm-records {
  height: 100%;
  display: flex;
  flex-direction: column;

  .alarm-records__toolbar {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .alarm-records__toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .alarm-records__toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .alarm-records__export-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        .alarm-records__export-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .alarm-records__table {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;

    .alarm-records__table-content {
      width: 100%;
      flex: 1;
      overflow-y: auto;
    }

    .alarm-records__pagination {
      padding: 20px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
:deep(.el-switch) {
  height: 20px !important;
}
:deep(.el-pagination) {
  height: 20px !important;
}
:deep(.el-select__popper.el-popper) {
  top: 64px !important;
}
</style>
