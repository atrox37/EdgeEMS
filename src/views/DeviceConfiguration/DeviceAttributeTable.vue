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
            Add attribute
          </el-button>
          <el-button type="warning" @click="cancelEdit"> Cancel </el-button>
          <el-button type="primary" @click="submitEdit"> Submit </el-button>
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

      <el-table-column prop="name" label="Attribute name" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].name" placeholder="Please enter attribute name"
              @change="updatePointData($index, 'name', editPoints[$index].name)" />
          </template>
          <template v-else>
            <span>{{ row.name }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="dataType" label="Data type" align="center">
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

      <el-table-column prop="defaultValue" label="Default value" align="center">
        <template #default="{ row, $index }">
          <template v-if="isEdit">
            <el-input v-model="editPoints[$index].defaultValue" placeholder="Default value"
              @change="updatePointData($index, 'defaultValue', editPoints[$index].defaultValue)" />
          </template>
          <template v-else>
            <span>{{ row.defaultValue }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="required" label="Required" align="center">
        <template #default="{ row, $index }">
          <el-switch :model-value="isEdit ? editPoints[$index]?.required : row.required" :disabled="!isEdit"
            @update:model-value="
              (value: boolean) => isEdit && updatePointData($index, 'required', value)
            " />
        </template>
      </el-table-column>

      <el-table-column v-if="isEdit" label="Operation" align="center" fixed="right">
        <template #default="{ $index }">
          <div class="delete-point-btn" @click="deletePoint($index)">
            <img :src="tableDeleteIcon" alt="delete" />
            <span>Delete</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DATA_TYPES } from '@/types/channelConfiguration'
import tableDeleteIcon from '@/assets/icons/table-delect.svg'

import type { Property } from '@/types/deviceConfiguration'

// 定义 props
interface Props {
  points: Property[]
  title: string
  channelId: number
  device_type: string
}

const props = defineProps<Props>()

// 定义 emits
const emit = defineEmits<{
  'submit-edit': [points: Property[]]
  'cancel-edit': []
}>()

// 编辑状�?
const isEdit = ref(false)

// 编辑时的点位数据副本
const editPoints = ref<Property[]>([])

// 生成唯一ID
let propertyIdCounter = 1
const generatePropertyId = () => propertyIdCounter++

// 创建新的属�?
const createNewPoint = (): Property => {
  return {
    id: generatePropertyId(),
    name: '',
    dataType: 'FLOAT32',
    unit: '',
    defaultValue: '',
    required: false,
    relatedPoints: [],
  }
}

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
    await ElMessageBox.confirm('Are you sure you want to delete this attribute?', 'Confirm delete', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    editPoints.value.splice(pointIndex, 1)
    ElMessage.success('Attribute deleted successfully')
  } catch {
    // 用户取消删除
  }
}

// 提交编辑
const submitEdit = () => {
  emit('submit-edit', editPoints.value)
  isEdit.value = false
  ElMessage.success('Attribute updated successfully')
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

// 更新点位数据
const updatePointData = (index: number, field: keyof Property, value: any) => {
  if (isEdit.value && editPoints.value[index]) {
    ; (editPoints.value[index] as any)[field] = value
  }
}

// 添加点位
const addPoint = () => {
  editPoints.value.push(createNewPoint())
  ElMessage.success('Attribute added successfully')
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
    :deep(.el-input-number) {
      width: 100%;
    }

    :deep(.el-select) {
      width: 100%;
    }
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

  .delete-point-btn {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      width: 0.14rem;
      height: 0.14rem;
      margin-right: 0.04rem;
      object-fit: contain;
    }
  }
}
</style>
