<template>
  <div class="voltage-class point-table">
    <!-- Header -->
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <div class="table-actions">
        <template v-if="!isEdit">
          <el-button type="warning" @click="enterEdit">
            <el-icon>
              <Plus />
            </el-icon>
            Edit
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="addPoint">
            <el-icon>
              <Plus />
            </el-icon>
            Add Point
          </el-button>
          <el-button type="warning" @click="cancelEdit"> Cancel </el-button>
          <el-button type="primary" @click="submitEdit"> Submit </el-button>
        </template>
      </div>
    </div>

    <!-- Table -->
    <el-table :data="isEdit ? editPoints : points" class="point-table-content" align="center" header-align="center">
      <el-table-column prop="id" label="ID" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="signalName" label="Signal Name" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].signalName" placeholder="Please enter signal name"
              @change="updatePointData($index, 'signalName', editPoints[$index].signalName)" />
          </template>
          <template v-else>
            <span>{{ row.signalName }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Real-time Data" align="center">
        <template #default="{ row, $index }">
          <span style="cursor: pointer" v-if="!isEdit" @click="openPublishDialog(row, $index)">{{
            row.value
          }}</span>
          <span v-else>
            {{ row.value }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="Unit" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].unit" placeholder="Unit"
              @change="updatePointData($index, 'unit', editPoints[$index].unit)" />
          </template>
          <template v-else>
            <span>{{ row.unit }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="scaleFactor" label="Scale Factor" align="center"
        v-if="props.points.length > 0 && props.points[0].scaleFactor !== undefined">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].scaleFactor"
              @change="updatePointData($index, 'scaleFactor', editPoints[$index].scaleFactor)" />
          </template>
          <template v-else>
            <span>{{ row.scaleFactor }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="offset" label="Offset" align="center"
        v-if="props.points.length > 0 && props.points[0].offset !== undefined">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].offset"
              @change="updatePointData($index, 'offset', editPoints[$index].offset)" />
          </template>
          <template v-else>
            <span>{{ row.offset }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="reverse" label="Reverse" align="center"
        v-if="props.points.length > 0 && props.points[0].reverse !== undefined">
        <template #default="{ row, $index }">
          <el-switch :model-value="isEdit ? editPoints[$index]?.reverse : row.reverse" :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'reverse', value)
            " />
        </template>
      </el-table-column>

      <el-table-column prop="dataType" label="Data Type" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-select v-model="editPoints[$index].dataType" placeholder="Select data type"
              @change="updatePointData($index, 'dataType', editPoints[$index].dataType)">
              <el-option v-for="type in DATA_TYPES" :key="type.value" :label="type.label" :value="type.value" />
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
      <el-table-column prop="enabled" label="Enabled" align="center">
        <template #default="{ row, $index }">
          <el-switch :model-value="isEdit ? editPoints[$index]?.enabled : row.enabled" :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'enabled', value)
            " />
        </template>
      </el-table-column>

      <el-table-column v-if="isEdit" label="Operation" align="center" fixed="right" width="220">
        <template #default="{ row, $index }">
          <div class="table-actions">
            <div class="delete-point-btn" @click="deletePoint($index)">
              <el-icon>
                <Delete />
              </el-icon>
              <span>Delete</span>
            </div>
            <div class="protocol-config-btn" @click="openProtocolConfig(row, $index)">
              <el-icon>
                <Setting />
              </el-icon>
              <span>Configure</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ProtocolDialog ref="protocolDialogRef" :currentProtocolConfig="currentProtocolConfig" />
  <PublishChannelValue ref="publishChannelValueRef" @publish="publishValue" />
</template>

<script setup lang="ts">
import { Plus, Delete, Setting } from '@element-plus/icons-vue'
import type { Point, ProtocolConfig, Channel, Props } from '@/types/channelConfiguration'
import { DATA_TYPES } from '@/types/channelConfiguration'
import ProtocolDialog from './ProtocolDialog.vue'
import PublishChannelValue from './PublishChannelValue.vue'

const props = defineProps<Props>()
const protocolDialogRef = ref()
const publishChannelValueRef = ref()
// 定义 emits

// 生成唯一ID
let pointIdCounter = 20
const generatePointId = () => pointIdCounter++

// 创建新的点位
const createNewPoint = (): Point => {
  if (props.channel_type === 'telemetry') {
    return {
      id: generatePointId(),
      signalName: '',
      scaleFactor: 1.0,
      offset: 0.0,
      unit: '',
      value: 0,
      reverse: false,
      dataType: 'FLOAT32',
      protocolConfig: {
        slave_id: 1,
        function_code: 3,
        register_address: 40001,
        data_type: 'FLOAT32',
        byte_order: 'ABCD',
        bit_position: undefined,
      },
      enabled: true,
    }
  } else {
    // telesignal, telecontrol, teleadjust 不包含scaleFactor, offset, reverse
    return {
      id: generatePointId(),
      signalName: '',
      unit: '',
      value: 0,
      dataType:
        props.channel_type === 'telesignal' || props.channel_type === 'telecontrol'
          ? 'BOOLEAN'
          : 'FLOAT32',
      protocolConfig: {
        slave_id: 1,
        function_code: 3,
        register_address: 1,
        data_type: props.channel_type === 'telesignal' || props.channel_type === 'telecontrol' ? 'BOOLEAN' : 'FLOAT32',
        byte_order: props.channel_type === 'telesignal' || props.channel_type === 'telecontrol' ? 'AB' : 'ABCD',
        bit_position: props.channel_type === 'telesignal' || props.channel_type === 'telecontrol' ? 0 : undefined,
      },
      enabled: true,
    } as Point
  }
}
const emit = defineEmits<{
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

// 取消编辑状态
const cancelEdit = () => {
  isEdit.value = false
  emit('cancel-edit')
}

// 删除点位状态
const deletePoint = async (pointIndex: number) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this point?', 'Confirm Delete', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    editPoints.value.splice(pointIndex, 1)
    ElMessage.success('Point deleted successfully')
  } catch {
    // 用户取消删除
  }
}
// 更新点位
const submitEdit = (data: { index: number; point: Partial<Point> }) => {
  editPoints.value[data.index] = { ...editPoints.value[data.index], ...data.point }
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

// 协议配置对话
const currentProtocolConfig = reactive<ProtocolConfig>({
  slave_id: 1,
  function_code: 3,
  register_address: 40001,
  data_type: 'FLOAT32',
  byte_order: 'ABCD',
  bit_position: undefined,
})
const currentPointIndex = ref(-1)

// 更新点位数据
const updatePointData = (index: number, field: keyof Point, value: any) => {
  if (isEdit.value && editPoints.value[index]) {
    ; (editPoints.value[index] as any)[field] = value
  }
}

// 打开协议配置对话
const openProtocolConfig = (row: Point, index: number) => {
  console.log(protocolDialogRef.value)
  protocolDialogRef.value.open()
  currentPointIndex.value = index
  // 加载现有配置
  Object.assign(currentProtocolConfig, {
    slave_id: row.protocolConfig?.slave_id || 1,
    function_code: row.protocolConfig?.function_code || 3,
    register_address: row.protocolConfig?.register_address || 40001,
    data_type: row.protocolConfig?.data_type || 'FLOAT32',
    byte_order: row.protocolConfig?.byte_order || 'ABCD',
    bit_position: row.protocolConfig?.bit_position || undefined,
  })
}
// 添加点位
const addPoint = () => {
  editPoints.value.push(createNewPoint())

  ElMessage.success('Point added successfully')
}
const openPublishDialog = (row: Point, index: number) => {
  publishChannelValueRef.value.open()
}
const publishValue = (value: any) => {
  ElMessage.success('Publish successfully')
  console.log(value)
}
</script>

<style scoped lang="scss">
.point-table {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.16rem;

    .table-title {
      margin: 0;
      color: #fff;
      font-size: 0.16rem;
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

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.12rem;
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
          height: 0.32rem;
        }
      }
    }
  }

  .table-actions {
    display: flex;
    align-items: center;
    gap: 0.12rem;

    .delete-point-btn,
    .protocol-config-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.04rem;
      color: #fff;
    }
  }
}
</style>
