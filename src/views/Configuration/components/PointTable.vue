<template>
  <div class="voltage-class point-table">
    <!-- Header -->
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <div class="table-actions">
        <template v-if="!isEdit">
          <el-button type="primary" @click="enterEdit">
            <el-icon><Plus /></el-icon>
            修改
          </el-button>
        </template>
        <template v-else>
          <el-button type="warning" @click="cancelEdit"> 取消 </el-button>
          <el-button type="primary" @click="submitEdit"> 提交 </el-button>
          <el-button type="primary" @click="$emit('add-point')">
            <el-icon><Plus /></el-icon>
            添加点位
          </el-button>
        </template>
      </div>
    </div>

    <!-- Table -->
    <el-table
      :data="isEdit ? editPoints : points"
      style="width: 100%"
      class="point-table-content"
      align="center"
      header-align="center"
    >
      <el-table-column prop="id" label="ID" width="80" align="center">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="signalName" label="信号名称" min-width="150" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input
              v-model="editPoints[$index].signalName"
              placeholder="请输入信号名称"
              @change="updatePointData($index, 'signalName', editPoints[$index].signalName)"
            />
          </template>
          <template v-else>
            <span>{{ row.signalName }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="实时数据" align="center"></el-table-column>
      <el-table-column prop="unit" label="单位" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input
              v-model="editPoints[$index].unit"
              placeholder="单位"
              @change="updatePointData($index, 'unit', editPoints[$index].unit)"
            />
          </template>
          <template v-else>
            <span>{{ row.unit }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="scaleFactor"
        label="比例系数"
        align="center"
        v-if="props.points[0].scaleFactor !== undefined"
      >
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input
              v-model="editPoints[$index].scaleFactor"
              @change="updatePointData($index, 'scaleFactor', editPoints[$index].scaleFactor)"
            />
          </template>
          <template v-else>
            <span>{{ row.scaleFactor }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        prop="offset"
        label="偏移量"
        align="center"
        v-if="props.points[0].offset !== undefined"
      >
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input
              v-model="editPoints[$index].offset"
              @change="updatePointData($index, 'offset', editPoints[$index].offset)"
            />
          </template>
          <template v-else>
            <span>{{ row.offset }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        prop="reverse"
        label="反向"
        align="center"
        v-if="props.points[0].reverse !== undefined"
      >
        <template #default="{ row, $index }">
          <el-switch
            :model-value="isEdit ? editPoints[$index]?.reverse : row.reverse"
            :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'reverse', value)
            "
          />
        </template>
      </el-table-column>

      <el-table-column prop="dataType" label="数据类型" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-select
              v-model="editPoints[$index].dataType"
              placeholder="选择数据类型"
              @change="updatePointData($index, 'dataType', editPoints[$index].dataType)"
            >
              <el-option
                v-for="type in DATA_TYPES"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </template>
          <template v-else>
            <span>
              {{
                (DATA_TYPES.find((type) => type.value === row.dataType) || {}).label || row.dataType
              }}
            </span>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="protocolConfig" label="协议配置" align="center">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            @click="openProtocolConfig(isEdit ? editPoints[$index] : row, $index)"
          >
            配置
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="enabled" label="启用" align="center">
        <template #default="{ row, $index }">
          <el-switch
            :model-value="isEdit ? editPoints[$index]?.enabled : row.enabled"
            :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'enabled', value)
            "
          />
        </template>
      </el-table-column>

      <el-table-column v-if="isEdit" label="操作" align="center" fixed="right">
        <template #default="{ $index }">
          <el-button type="warning" @click="$emit('delete-point', $index)" :icon="Delete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ProtocolDialog ref="protocolDialogRef" :currentProtocolConfig="currentProtocolConfig" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { Point, ProtocolConfig } from '../../../types/channel'
import { DATA_TYPES, REGISTER_TYPES, BYTE_ORDERS } from '../../../types/channel'
import ProtocolDialog from './ProtocolDialog.vue'

// 定义 props
interface Props {
  points: Point[]
  title: string
  channelId: number
}

const props = defineProps<Props>()
const protocolDialogRef = ref()
// 定义 emits
const emit = defineEmits<{
  'add-point': []
  'delete-point': [index: number]
  'update-point': [data: { index: number; point: Partial<Point> }]
  'submit-edit': [points: Point[]]
  'cancel-edit': []
}>()

// 编辑状态
const isEdit = ref(false)

// 编辑时的点位数据副本
const editPoints = ref<Point[]>([])

// 进入编辑状态
const enterEdit = () => {
  editPoints.value = props.points.map((point) => ({ ...point }))
  isEdit.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEdit.value = false
  emit('cancel-edit')
}

// 提交编辑
const submitEdit = () => {
  emit(
    'submit-edit',
    editPoints.value.map((point) => ({ ...point })),
  )
  isEdit.value = false
}

// 监听 props.points 变化，若未处于编辑状态则同步 editPoints
watch(
  () => props.points,
  (newPoints) => {
    if (!isEdit.value) {
      editPoints.value = newPoints.map((point) => ({ ...point }))
    }
  },
  { immediate: true, deep: true },
)

// 协议配置对话框
const currentProtocolConfig = reactive<ProtocolConfig>({
  registerAddress: '',
  registerType: 'holding',
  byteOrder: 'big',
  readInterval: 5,
})
const currentPointIndex = ref(-1)

// 更新点位数据
const updatePointData = (index: number, field: keyof Point, value: any) => {
  if (isEdit.value && editPoints.value[index]) {
    ;(editPoints.value[index] as any)[field] = value
  }
}

// 打开协议配置对话框
const openProtocolConfig = (row: Point, index: number) => {
  console.log(protocolDialogRef.value)
  protocolDialogRef.value.open()
  currentPointIndex.value = index
  // 加载现有配置
  Object.assign(currentProtocolConfig, {
    registerAddress: row.protocolConfig?.registerAddress || '',
    registerType: row.protocolConfig?.registerType || 'holding',
    byteOrder: row.protocolConfig?.byteOrder || 'big',
    readInterval: row.protocolConfig?.readInterval || 5,
  })
}
</script>

<style scoped lang="scss">
.point-table {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .table-title {
      margin: 0;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .point-table-content {
    .point-id {
      font-weight: 600;
      color: #fff;
    }

    :deep(.el-input-number) {
      width: 100%;
    }

    :deep(.el-select) {
      width: 100%;
    }
  }

  .protocol-config {
    padding: 20px 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  // 确保表格内容居中对齐
  :deep(.el-table) {
    .el-table__header-wrapper {
      th {
        text-align: center !important;
        .cell {
          text-align: center !important;
          justify-content: center;
          display: flex;
          align-items: center;
        }
      }
    }

    .el-table__body-wrapper {
      td {
        text-align: center !important;
        .cell {
          text-align: center !important;
          justify-content: center;
          display: flex;
          align-items: center;
          height: 32px;
        }
      }
    }
  }
}
</style>
