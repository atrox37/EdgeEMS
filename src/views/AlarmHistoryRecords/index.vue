<template>
  <div class="voltage-class alarm-records">
    <!-- <LoadingBg :loading="loading"> -->
    <!-- 表格工具�?-->
    <div class="alarm-records__toolbar">
      <div class="alarm-records__toolbar-left" ref="toolbarLeftRef">
        <el-form :model="filters" inline>
          <el-form-item label="Warning Level:">
            <el-select v-model="filters.warning_level" :append-to="toolbarLeftRef" clearable
              placeholder="select warning level">
              <el-option label="L1" :value="1" />
              <el-option label="L2" :value="2" />
              <el-option label="L3" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="Start Time:">
            <el-date-picker v-model="filters.start_time" type="datetime" placeholder="Select start time"
              format="YYYY-MM-DD HH:mm:ss" :disabled-date="disableStartDate" :disabled-time="disableStartTime"
              @change="handleStartTimeChange" :teleported="false" clearable />
          </el-form-item>
          <el-form-item label="End Time:">
            <el-date-picker v-model="filters.end_time" type="datetime" placeholder="Select end time"
              format="YYYY-MM-DD HH:mm:ss" :disabled-date="disableEndDate" :disabled-time="disableEndTime"
              @change="handleEndTimeChange" :teleported="false" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div class="alarm-records__toolbar-right">
        <IconButton type="warning" :icon="reloadIcon" text="reload" custom-class="alarm-records__export-btn"
          @click="refreshData" />
        <IconButton type="primary" :icon="searchIcon" text="search" custom-class="alarm-records__export-btn"
          @click="fetchTableData" />
        <IconButton type="primary" :icon="alarmExportIcon" text="Export" custom-class="alarm-records__export-btn"
          @click="exportData(`Alarm_History_${Date.now().toString()}.csv`)" />
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
        <el-table-column prop="recovered_at" label="End Time" min-width="1.6rem" />
      </el-table>

      <!-- 分页组件 -->
      <div class="alarm-records__pagination">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next"
          @size-change="fetchTableData" @current-change="handlePageChange" />
      </div>
    </div>
    <!-- </LoadingBg> -->
  </div>
</template>

<script setup lang="ts">
import type { AlarmRecord } from '@/types/alarm'
import { useTableData, type TableConfig } from '@/composables/useTableData'

import alarmExportIcon from '@/assets/icons/alarm-export.svg'
import searchIcon from '@/assets/icons/table-search.svg'
import reloadIcon from '@/assets/icons/table-refresh.svg'

const toolbarLeftRef = ref<HTMLElement | null>(null)
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
// 使用 useTableData composable
const { loading, tableData, pagination, handlePageChange, fetchTableData, filters, exportData } =
  useTableData<AlarmRecord>({
    listUrl: '/alert-events',
    exportUrl: '/alert-events/export',
    enableExport: true,
    defaultPageSize: 20,
    serverType: 'alarm',
  })

// 初始化filters
filters.warning_level = null
filters.start_time = null
filters.end_time = null

// 处理开始时间变�?
const handleStartTimeChange = (value: Date | null) => {
  // 如果开始时间晚于结束时间，清空结束时间
  if (value && filters.endTime && new Date(value) > new Date(filters.endTime)) {
    filters.endTime = null
  }
  // 转换为ISO 8601格式
  filters.start_time = value?.toLocaleString('sv-SE').replace(' ', 'T')
}

// 处理结束时间变化
const handleEndTimeChange = (value: Date | null) => {
  // 如果结束时间早于开始时间，清空开始时�?
  if (value && filters.startTime && new Date(value) < new Date(filters.startTime)) {
    filters.startTime = null
  }
  // 转换为ISO 8601格式
  console.log('value', value)
  filters.end_time = value?.toLocaleString('sv-SE').replace(' ', 'T')
}

// 禁用开始时间的日期选择
const disableStartDate = (time: Date) => {
  if (!filters.endTime) return false
  return time.getTime() > new Date(filters.endTime).getTime()
}

// 禁用开始时间的时间选择
const disableStartTime = (date: Date, type: string) => {
  if (!filters.endTime || type !== 'minute') return {}
  const endTime = new Date(filters.endTime)
  if (date.getDate() === endTime.getDate()) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter((h) => h > endTime.getHours()),
      disabledMinutes: () =>
        Array.from({ length: 60 }, (_, i) => i).filter((m) => m > endTime.getMinutes()),
    }
  }
  return {}
}

// 禁用结束时间的日期选择
const disableEndDate = (time: Date) => {
  if (!filters.startTime) return false
  return time.getTime() < new Date(filters.startTime).getTime()
}

// 禁用结束时间的时间选择
const disableEndTime = (date: Date, type: string) => {
  if (!filters.startTime || type !== 'minute') return {}
  const startTime = new Date(filters.startTime)
  if (date.getDate() === startTime.getDate()) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter((h) => h < startTime.getHours()),
      disabledMinutes: () =>
        Array.from({ length: 60 }, (_, i) => i).filter((m) => m < startTime.getMinutes()),
    }
  }
  return {}
}
const refreshData = () => {
  filters.warning_level = null
  filters.start_time = null
  filters.end_time = null
  filters.startTime = null
  filters.endTime = null
  fetchTableData(true)
}
// 处理导出
</script>

<style scoped lang="scss">
.voltage-class.alarm-records {
  height: 100%;
  display: flex;
  flex-direction: column;

  .alarm-records__toolbar {
    padding-bottom: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .alarm-records__toolbar-left {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.16rem;
    }

    .alarm-records__toolbar-right {
      display: flex;
      align-items: center;

      .alarm-records__export-btn {
        display: flex;
        align-items: center;
        gap: 0.1rem;

        .alarm-records__export-icon {
          width: 0.16rem;
          height: 0.16rem;
          margin-right: 0.08rem;
        }
      }
    }
  }

  .alarm-records__table {
    height: calc(100% - 0.52rem);
    width: 100%;
    display: flex;
    flex-direction: column;

    .alarm-records__table-content {
      width: 100%;
      height: calc(100% - 0.92rem);
      overflow-y: auto;
    }

    .alarm-records__pagination {
      padding: 0.2rem 0;
      display: flex;
      justify-content: flex-end;
    }
  }

  :deep(.el-form.el-form--inline .el-form-item) {
    margin-bottom: 0;
  }
}

:deep(.el-select__popper.el-popper) {
  top: 0.44rem !important;
}
</style>

