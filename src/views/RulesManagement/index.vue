<template>
  <div class="voltage-class rule-management">
    <!-- <LoadingBg :loading="loading" style="display: flex; flex-direction: column"> -->
    <div class="rule-management__header">
      <div class="rule-management__search-form" ref="levelSelectRef">
        <el-form :model="filters" :inline="true">
          <el-form-item label="Keyword">
            <el-input v-model="filters.keyword" placeholder="Please enter keyword" />
          </el-form-item>
          <el-form-item label="Level">
            <el-select
              v-model="filters.warning_level"
              placeholder="Please select level"
              clearable
              :append-to="levelSelectRef"
            >
              <el-option label="L1" :value="1" />
              <el-option label="L2" :value="2" />
              <el-option label="L3" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="Switch">
            <el-select
              v-model="filters.enabled"
              placeholder="Please select switch"
              clearable
              :append-to="levelSelectRef"
            >
              <el-option label="On" :value="true" />
              <el-option label="Off" :value="false" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="form-oprations">
          <IconButton
            type="warning"
            :icon="tableRefreshIcon"
            text="reload"
            custom-class="rule-management__btn"
            @click="handleRefresh"
          />
          <IconButton
            type="primary"
            :icon="tableSearchIcon"
            text="search"
            custom-class="rule-management__btn"
            @click="handleSearch"
          />
        </div>
      </div>
      <div class="rule-management__table-operations" v-permission="['Admin']">
        <IconButton
          type="primary"
          :icon="userAddIcon"
          text="New a Rule"
          custom-class="rule-management__btn"
          @click="handleAddUser"
        />
      </div>
    </div>
    <div class="rule-management__table">
      <el-table
        :data="tableData"
        class="rule-management__table-content"
        align="left"
        table-layout="fixed"
      >
        <el-table-column prop="id" label="Rule ID" show-overflow-tooltip />
        <el-table-column prop="rule_name" label="Rule Name" show-overflow-tooltip />
        <el-table-column prop="warning_level" label="Warning Level" show-overflow-tooltip>
          <template #default="{ row }"> L{{ row.warning_level }} </template>
        </el-table-column>
        <el-table-column prop="monitor_data" label="Monitor Data" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatMonitorData(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="Condition" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatCondition(row) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="notification" label="Notification" show-overflow-tooltip>
          <template #default="{ row }">
            {{ Array.isArray(row.notification) ? row.notification.join(', ') : row.notification }}
          </template>
        </el-table-column> -->
        <el-table-column prop="created_at" label="Created At" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enabled" label="Switch" show-overflow-tooltip>
          <template #default="{ row }">
            <el-switch :model-value="row.enabled" @change="handleSwitchChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="Operation" fixed="right" v-permission="['Admin']">
          <template #default="{ row }">
            <div class="rule-management__operation">
              <div class="rule-management__operation-item" @click="handleEdit(row)">
                <img :src="tableEditIcon" />
                <span class="rule-management__operation-text">Edit</span>
              </div>
              <div class="rule-management__operation-item" @click="handleDelete(row)">
                <img :src="tableDeleteIcon" />
                <span class="rule-management__operation-text">Delete</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="rule-management__pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <!-- </LoadingBg> -->
    <RulesOperationForm
      ref="rulesOperationFormRef"
      @submit="handleRuleSubmit"
      @cancel="handleRuleCancel"
    />
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出来
import tableRefreshIcon from '@/assets/icons/table-refresh.svg'
import tableSearchIcon from '@/assets/icons/table-search.svg'
import userAddIcon from '@/assets/icons/user-add.svg'
import tableEditIcon from '@/assets/icons/table-edit.svg'
import tableDeleteIcon from '@/assets/icons/table-delect.svg'

import RulesOperationForm from './RulesOperationForm.vue'
// RuleInfo 结构参考 RuleFormModel
type Operator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq'

type RuleInfo = {
  id: number
  rule_name: string
  service_type: string | number | null
  point_id: string | number | null
  data_type: string | number | null
  warning_level: string | number | null
  operator: Operator | null
  value: number | null

  notification?: string[]
  enabled: boolean
  created_at: string
}

import { useTableData, type TableConfig } from '@/composables/useTableData'
import { enableRule, disableRule } from '@/api/alarm'

const tableConfig: TableConfig = {
  listUrl: '/rules',
  deleteUrl: '/rules/{id}',
  enableDelete: true,
  defaultPageSize: 20,
  serverType: 'alarm',
}

const { loading, tableData, pagination, handlePageChange, fetchTableData, filters } =
  useTableData<RuleInfo>(tableConfig)

filters.keyword = ''
filters.warning_level = null
filters.enabled = null

const levelSelectRef = ref<HTMLElement | null>(null)

const rulesOperationFormRef = ref()

// 格式化 MonitorData
const formatMonitorData = (row: RuleInfo) => {
  if (!row) return '-'
  return [row.service_type, row.point_id, row.data_type]
    .filter((v) => v !== null && v !== undefined && v !== '')
    .join(' / ')
}

const formatCondition = (row: RuleInfo) => {
  if (!row || !row.operator || row.value === null || row.value === undefined) return '-'
  return `${row.operator} ${row.value}`
}

// 添加规则
const handleAddUser = () => {
  rulesOperationFormRef.value?.open(undefined, 'create')
}

// 编辑规则
const handleEdit = (row: RuleInfo) => {
  rulesOperationFormRef.value?.open(row.id, 'edit')
}

// 删除规则
const handleDelete = async (row: RuleInfo) => {
  await ElMessageBox.confirm(
    `Are you sure you want to delete rule "${row.rule_name}"?`,
    'Delete Rule',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )

  const index = tableData.value.findIndex((item: RuleInfo) => item.id === row.id)
  if (index > -1) {
    tableData.value.splice(index, 1)
  }
}
const handleSwitchChange = async (row: RuleInfo) => {
  if (!row.enabled) {
    const res = await enableRule(row.id)
    if (res.message) {
      fetchTableData()
    }
  } else {
    const res = await disableRule(row.id)
    if (res.message) {
      fetchTableData()
    }
  }
}
// 处理规则表单提交
const handleRuleSubmit = async () => {
  await fetchTableData()
}

// 处理规则表单取消
const handleRuleCancel = () => {
  console.log('Rule form cancelled')
}
const handleRefresh = () => {
  filters.keyword = ''
  filters.warning_level = null
  filters.enabled = null
  fetchTableData(true)
}
const handleSearch = () => {
  fetchTableData(true)
}
</script>

<style scoped lang="scss">
.voltage-class .rule-management {
  position: relative; // 为对话框提供定位上下文
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .rule-management__header {
    margin-bottom: 20px;
    .rule-management__search-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .form-oprations {
        height: 52px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
    }
    .rule-management__table-operations {
      width: 100%;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .rule-management__btn {
      display: flex;
      align-items: center;
      gap: 8px;
      .rule-management__btn-icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }

  .rule-management__table {
    height: calc(100% - 145px);
    // max-width: 1660px;
    display: flex;
    flex-direction: column;
    .rule-management__table-content {
      height: calc(100% - 92px);
      overflow-y: auto;
      .rule-management__operation {
        display: flex;
        align-items: center;
        gap: 20px;
        .rule-management__operation-item {
          cursor: pointer;
          display: flex;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
            margin-right: 4px;
            object-fit: contain;
          }
        }
      }
    }

    .rule-management__pagination {
      display: flex;
      justify-content: flex-end;
      margin: 20px 0;
    }
  }
  :deep(.el-switch) {
    height: 22px;
  }
  :deep(.el-select__popper.el-popper) {
    top: 44px !important;
  }
  :deep(.el-form--inline .el-form-item) {
    margin-bottom: 40px !important;
  }
}
</style>
