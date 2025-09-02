<template>
  <div class="voltage-class control-property-table-component">
    <el-table :data="properties" style="width: 100%" class="property-table" table-layout="fixed">
      <el-table-column prop="name" label="Attribute name">
        <template #default="{ row }">
          <el-input v-if="isEditing" v-model="row.name" placeholder="Attribute name" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataType" label="Data type">
        <template #default="{ row }">
          <el-select v-if="isEditing" v-model="row.dataType" placeholder="Data type">
            <el-option label="FLOAT32" value="FLOAT32" />
            <el-option label="INT32" value="INT32" />
            <el-option label="BOOLEAN" value="BOOLEAN" />
            <el-option label="STRING" value="STRING" />
          </el-select>
          <span v-else>{{ row.dataType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="controlType" label="Control type">
        <template #default="{ row }">
          <el-select v-if="isEditing" v-model="row.controlType" placeholder="Control type">
            <el-option label="Switch control" value="switch" />
            <el-option label="Value control" value="value" />
            <el-option label="Toggle control" value="toggle" />
          </el-select>
          <span v-else>{{ row.controlType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="Unit">
        <template #default="{ row }">
          <el-input v-if="isEditing" v-model="row.unit" placeholder="Unit" />
          <span v-else>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" label="Default value">
        <template #default="{ row }">
          <el-input v-if="isEditing" v-model="row.defaultValue" placeholder="Default value" />
          <span v-else>{{ row.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="required" label="Required">
        <template #default="{ row }">
          <el-switch v-if="isEditing" v-model="row.required" />
          <span v-else>{{ row.required ? 'Yes' : 'No' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="relatedPoints" label="Related points">
        <template #default="{ row }">
          <div class="related-points">
            <el-button type="primary" :disabled="!isEditing" @click="handleSelectPoints(row)">
              Select points
            </el-button>
            <div class="point-tags" v-if="row.relatedPoints.length > 0">
              <el-tag v-for="point in row.relatedPoints" :key="point.id" :closable="isEditing"
                @close="isEditing && handleRemovePoint(row, point)" class="point-tag">
                {{ point.name }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="isEditing" label="Operation" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" size="small" @click="handleDelete($index)"> Delete </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

import type { RelatedPoint, ControlProperty } from '@/types/deviceConfiguration'

// Props
interface Props {
  properties: ControlProperty[]
  isEditing: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  delete: [index: number]
  selectPoints: [property: ControlProperty]
  removePoint: [property: ControlProperty, point: RelatedPoint]
}>()

// 处理删除
const handleDelete = (index: number) => {
  emit('delete', index)
}

// 处理选择点位
const handleSelectPoints = (property: ControlProperty) => {
  emit('selectPoints', property)
}

// 处理移除点位
const handleRemovePoint = (property: ControlProperty, point: RelatedPoint) => {
  emit('removePoint', property, point)
}
</script>

<style scoped lang="scss">
.control-property-table-component {
  .property-table {
    background: rgba(84, 98, 140, 0.2);
    border-radius: 0.08rem;
    overflow: hidden;
  }

  .related-points {
    display: flex;
    flex-direction: column;
    gap: 0.08rem;

    .point-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.04rem;

      .point-tag {
        margin: 0;
      }
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
}
</style>
