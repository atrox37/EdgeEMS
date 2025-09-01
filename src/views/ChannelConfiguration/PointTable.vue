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
            修改
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="addPoint">
            <el-icon>
              <Plus />
            </el-icon>
            添加点位
          </el-button>
          <el-button type="warning" @click="cancelEdit"> 取消 </el-button>
          <el-button type="primary" @click="submitEdit"> 提交 </el-button>
        </template>
      </div>
    </div>

    <!-- Table -->
    <el-table :data="isEdit ? editPoints : points" style="width: 100%" class="point-table-content" align="center"
      header-align="center" table-layout="fixed">
      <el-table-column prop="id" label="ID" align="center">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="signalName" label="信号名称" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].signalName" placeholder="请输入信号名"
              @change="updatePointData($index, 'signalName', editPoints[$index].signalName)" />
          </template>
          <template v-else>
            <span>{{ row.signalName }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="实时数据" align="center">
        <template #default="{ row, $index }">
          <span style="cursor: pointer" v-if="!isEdit" @click="openPublishDialog(row, $index)">{{
            row.value
          }}</span>
          <span v-else>
            {{ row.value }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].unit" placeholder="单位"
              @change="updatePointData($index, 'unit', editPoints[$index].unit)" />
          </template>
          <template v-else>
            <span>{{ row.unit }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="scaleFactor" label="比例系数" align="center"
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

      <el-table-column prop="offset" label="偏移" align="center"
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

      <el-table-column prop="reverse" label="反向" align="center"
        v-if="props.points.length > 0 && props.points[0].reverse !== undefined">
        <template #default="{ row, $index }">
          <el-switch :model-value="isEdit ? editPoints[$index]?.reverse : row.reverse" :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'reverse', value)
            " />
        </template>
      </el-table-column>

      <el-table-column prop="dataType" label="数据类型" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-select v-model="editPoints[$index].dataType" placeholder="选择数据类型"
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
      <el-table-column prop="enabled" label="启用" align="center">
        <template #default="{ row, $index }">
          <el-switch :model-value="isEdit ? editPoints[$index]?.enabled : row.enabled" :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'enabled', value)
            " />
        </template>
      </el-table-column>

      <el-table-column v-if="isEdit" label="操作" align="center" fixed="right">
        <template #default="{ row, $index }">
          <div class="table-actions">
            <div class="delete-point-btn" @click="deletePoint($index)">
              <el-icon>
                <Delete />
              </el-icon>
              <span>删除</span>
            </div>
            <div class="protocol-config-btn" @click="openProtocolConfig(row, $index)">
              <el-icon>
                <Setting />
              </el-icon>
              <span>配置</span>
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
      protocolConfig: {},
      enabled: true,
    }
  } else {
    // telesignal, telecontrol, teleadjust 不包�?scaleFactor, offset, reverse
    return {
      id: generatePointId(),
      signalName: '',
      unit: '',
      value: 0,
      dataType:
        props.channel_type === 'telesignal' || props.channel_type === 'telecontrol'
          ? 'BOOLEAN'
          : 'FLOAT32',
      protocolConfig: {},
      enabled: true,
    } as Point
  }
}
const emit = defineEmits<{
  'submit-edit': [points: Point[]]
  'cancel-edit': []
}>()

// 编辑状�?
const isEdit = ref(false)

// 编辑时的点位数据副本
const editPoints = ref<Point[]>([])

// 进入编辑状�?
const enterEdit = () => {
  editPoints.value = props.points.map((point) => ({ ...point }))
  isEdit.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEdit.value = false
  emit('cancel-edit')
}

// 删除点位
const deletePoint = async (pointIndex: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个点位吗?', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    editPoints.value.splice(pointIndex, 1)
    ElMessage.success('点位删除成功')
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
  registerAddress: '',
  registerType: 'holding',
  byteOrder: 'big',
  readInterval: 5,
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
    registerAddress: row.protocolConfig?.registerAddress || '',
    registerType: row.protocolConfig?.registerType || 'holding',
    byteOrder: row.protocolConfig?.byteOrder || 'big',
    readInterval: row.protocolConfig?.readInterval || 5,
  })
}
// 添加点位
const addPoint = () => {
  editPoints.value.push(createNewPoint())

  ElMessage.success('点位添加成功')
}
const openPublishDialog = (row: Point, index: number) => {
  publishChannelValueRef.value.open()
}
const publishValue = (value: any) => {
  ElMessage.success('发布成功')
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
