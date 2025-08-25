<template>
  <div class="voltage-class model-configuration">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h2 class="title">设备模型配置</h2>
        <div class="stats">
          <span class="model-count">当前模型数：{{ models.length }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="addModel">
          <el-icon><Plus /></el-icon>
          添加模型
        </el-button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <el-collapse v-model="activeNames" accordion expand-icon-position="left">
        <el-collapse-item
          v-for="(model, index) in models"
          :key="model.id"
          :name="model.id"
          class="model-collapse-item"
        >
          <template #title>
            <div class="model-header">
              <div class="model-header-left">
                <span class="model-title">{{ model.name }}</span>
                <el-input
                  v-model="model.description"
                  placeholder="请输入模型描述"
                  class="model-description-input"
                />
              </div>
              <div class="model-header-right">
                <el-button type="primary">edit</el-button>
              </div>
            </div>
          </template>

          <!-- 展开内容 -->
          <div class="model-content">
            <h3 class="content-title">设备属性</h3>

            <!-- 属性标签页 -->
            <el-tabs v-model="model.activePropertyTab" type="card" class="property-tabs">
              <!-- 量测属性标签页 -->
              <el-tab-pane label="量测属性" name="measurement">
                <div class="property-section">
                  <div class="property-header">
                    <h4 class="property-title">量测属性列表</h4>
                    <el-button type="primary" @click="addMeasurementProperty(model)">
                      <el-icon><Plus /></el-icon>
                      添加量测
                    </el-button>
                  </div>
                  <el-table
                    :data="model.measurementProperties"
                    style="width: 100%"
                    class="property-table"
                  >
                    <el-table-column prop="name" label="属性名称" width="150">
                      <template #default="{ row }">
                        <el-input v-model="row.name" placeholder="属性名称" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="dataType" label="数据类型" width="120">
                      <template #default="{ row }">
                        <el-select v-model="row.dataType" placeholder="数据类型">
                          <el-option label="FLOAT32" value="FLOAT32" />
                          <el-option label="INT32" value="INT32" />
                          <el-option label="BOOLEAN" value="BOOLEAN" />
                          <el-option label="STRING" value="STRING" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" width="100">
                      <template #default="{ row }">
                        <el-input v-model="row.unit" placeholder="单位" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="defaultValue" label="默认值" width="120">
                      <template #default="{ row }">
                        <el-input v-model="row.defaultValue" placeholder="默认值" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="required" label="是否必填" width="100">
                      <template #default="{ row }">
                        <el-switch v-model="row.required" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="relatedPoints" label="关联点位" min-width="200">
                      <template #default="{ row }">
                        <div class="related-points">
                          <el-button
                            type="primary"
                            size="small"
                            @click="selectRelatedPoints(model, row, 'measurement')"
                          >
                            选择点位
                          </el-button>
                          <div class="point-tags" v-if="row.relatedPoints.length > 0">
                            <el-tag
                              v-for="point in row.relatedPoints"
                              :key="point.id"
                              closable
                              @close="removeRelatedPoint(row, point)"
                              class="point-tag"
                            >
                              {{ point.name }}
                            </el-tag>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template #default="{ $index }">
                        <el-button
                          type="danger"
                          size="small"
                          @click="deleteMeasurementProperty(model, $index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>

              <!-- 控制属性标签页 -->
              <el-tab-pane label="控制属性" name="control">
                <div class="property-section">
                  <div class="property-header">
                    <h4 class="property-title">控制属性列表</h4>
                    <el-button type="primary" @click="addControlProperty(model)">
                      <el-icon><Plus /></el-icon>
                      添加控制
                    </el-button>
                  </div>
                  <el-table
                    :data="model.controlProperties"
                    style="width: 100%"
                    class="property-table"
                  >
                    <el-table-column prop="name" label="属性名称" width="150">
                      <template #default="{ row }">
                        <el-input v-model="row.name" placeholder="属性名称" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="dataType" label="数据类型" width="120">
                      <template #default="{ row }">
                        <el-select v-model="row.dataType" placeholder="数据类型">
                          <el-option label="FLOAT32" value="FLOAT32" />
                          <el-option label="INT32" value="INT32" />
                          <el-option label="BOOLEAN" value="BOOLEAN" />
                          <el-option label="STRING" value="STRING" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="controlType" label="控制类型" width="120">
                      <template #default="{ row }">
                        <el-select v-model="row.controlType" placeholder="控制类型">
                          <el-option label="开关控制" value="switch" />
                          <el-option label="数值设定" value="value" />
                          <el-option label="状态切换" value="toggle" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="required" label="是否必填" width="100">
                      <template #default="{ row }">
                        <el-switch v-model="row.required" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="relatedPoints" label="关联点位" min-width="200">
                      <template #default="{ row }">
                        <div class="related-points">
                          <el-button
                            type="primary"
                            size="small"
                            @click="selectRelatedPoints(model, row, 'control')"
                          >
                            选择点位
                          </el-button>
                          <div class="point-tags" v-if="row.relatedPoints.length > 0">
                            <el-tag
                              v-for="point in row.relatedPoints"
                              :key="point.id"
                              closable
                              @close="removeRelatedPoint(row, point)"
                              class="point-tag"
                            >
                              {{ point.name }}
                            </el-tag>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template #default="{ $index }">
                        <el-button
                          type="danger"
                          size="small"
                          @click="deleteControlProperty(model, $index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 点位选择对话框 -->
    <el-dialog
      v-model="pointSelectionDialog.visible"
      title="选择关联点位"
      width="600px"
      class="point-selection-dialog"
    >
      <div class="point-selection-content">
        <el-tabs v-model="pointSelectionDialog.activeTab" type="card">
          <el-tab-pane label="遥测点位" name="telemetry">
            <el-table
              :data="availableTelemetryPoints"
              style="width: 100%"
              @selection-change="handlePointSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="signalName" label="信号名称" />
              <el-table-column prop="unit" label="单位" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="遥信点位" name="telesignal">
            <el-table
              :data="availableTelesignalPoints"
              style="width: 100%"
              @selection-change="handlePointSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="signalName" label="信号名称" />
              <el-table-column prop="unit" label="单位" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="pointSelectionDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="confirmPointSelection">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 类型定义
interface RelatedPoint {
  id: number
  name: string
  type: string
}

interface MeasurementProperty {
  id: number
  name: string
  dataType: string
  unit: string
  defaultValue: string
  required: boolean
  relatedPoints: RelatedPoint[]
}

interface ControlProperty {
  id: number
  name: string
  dataType: string
  controlType: string
  required: boolean
  relatedPoints: RelatedPoint[]
}

interface Model {
  id: number
  name: string
  description: string
  measurementProperties: MeasurementProperty[]
  controlProperties: ControlProperty[]
  activePropertyTab: string // 用于控制属性标签页的激活状态
}

// 生成唯一ID
let propertyIdCounter = 1
const generatePropertyId = () => propertyIdCounter++

// 创建新的量测属性
const createNewMeasurementProperty = (): MeasurementProperty => {
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

// 创建新的控制属性
const createNewControlProperty = (): ControlProperty => {
  return {
    id: generatePropertyId(),
    name: '',
    dataType: 'FLOAT32',
    controlType: 'switch',
    required: false,
    relatedPoints: [],
  }
}

// 当前激活的折叠面板
const activeNames = ref<number[]>([1])

// 模型数据
const models = ref<Model[]>([
  {
    id: 1,
    name: '智能电表',
    description: '用于测量电力系统参数的智能电表设备模型',
    measurementProperties: [
      {
        id: 1,
        name: '电压',
        dataType: 'FLOAT32',
        unit: 'V',
        defaultValue: '220.0',
        required: true,
        relatedPoints: [],
      },
      {
        id: 2,
        name: '电流',
        dataType: 'FLOAT32',
        unit: 'A',
        defaultValue: '0.0',
        required: true,
        relatedPoints: [],
      },
      {
        id: 3,
        name: '功率',
        dataType: 'FLOAT32',
        unit: 'kW',
        defaultValue: '0.0',
        required: false,
        relatedPoints: [],
      },
    ],
    controlProperties: [
      {
        id: 4,
        name: '开关控制',
        dataType: 'BOOLEAN',
        controlType: 'switch',
        required: true,
        relatedPoints: [],
      },
      {
        id: 5,
        name: '电压设定',
        dataType: 'FLOAT32',
        controlType: 'value',
        required: false,
        relatedPoints: [],
      },
    ],
    activePropertyTab: 'measurement', // 初始化激活的标签页
  },
  {
    id: 2,
    name: '智能断路器',
    description: '用于电力系统保护的智能断路器设备模型',
    measurementProperties: [
      {
        id: 6,
        name: '状态',
        dataType: 'BOOLEAN',
        unit: '',
        defaultValue: 'false',
        required: true,
        relatedPoints: [],
      },
    ],
    controlProperties: [
      {
        id: 7,
        name: '合闸控制',
        dataType: 'BOOLEAN',
        controlType: 'switch',
        required: true,
        relatedPoints: [],
      },
    ],
    activePropertyTab: 'measurement', // 初始化激活的标签页
  },
])

// 点位选择对话框状态
const pointSelectionDialog = ref({
  visible: false,
  activeTab: 'telemetry',
  currentProperty: null as MeasurementProperty | ControlProperty | null,
  currentModel: null as Model | null,
  propertyType: '' as 'measurement' | 'control',
  selectedPoints: [] as RelatedPoint[],
})

// 可用的点位数据（这里使用模拟数据，实际应该从通道配置中获取）
const availableTelemetryPoints = ref([
  { id: 1, signalName: '电压A相', unit: 'V' },
  { id: 2, signalName: '电压B相', unit: 'V' },
  { id: 3, signalName: '电压C相', unit: 'V' },
  { id: 4, signalName: '电流A相', unit: 'A' },
  { id: 5, signalName: '电流B相', unit: 'A' },
  { id: 6, signalName: '电流C相', unit: 'A' },
])

const availableTelesignalPoints = ref([
  { id: 7, signalName: '断路器状态', unit: '' },
  { id: 8, signalName: '保护动作', unit: '' },
  { id: 9, signalName: '设备在线状态', unit: '' },
])

// 添加模型
const addModel = () => {
  const newModel = {
    id: Date.now(),
    name: `设备模型${models.value.length + 1}`,
    description: '',
    measurementProperties: [createNewMeasurementProperty()],
    controlProperties: [createNewControlProperty()],
    activePropertyTab: 'measurement', // 初始化激活的标签页
  }
  models.value.push(newModel)
  activeNames.value = [newModel.id]
  ElMessage.success('模型添加成功')
}

// 添加量测属性
const addMeasurementProperty = (model: Model) => {
  model.measurementProperties.push(createNewMeasurementProperty())
  ElMessage.success('量测属性添加成功')
}

// 删除量测属性
const deleteMeasurementProperty = async (model: Model, index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个量测属性吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    model.measurementProperties.splice(index, 1)
    ElMessage.success('量测属性删除成功')
  } catch {
    // 用户取消删除
  }
}

// 添加控制属性
const addControlProperty = (model: Model) => {
  model.controlProperties.push(createNewControlProperty())
  ElMessage.success('控制属性添加成功')
}

// 删除控制属性
const deleteControlProperty = async (model: Model, index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个控制属性吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    model.controlProperties.splice(index, 1)
    ElMessage.success('控制属性删除成功')
  } catch {
    // 用户取消删除
  }
}

// 选择关联点位
const selectRelatedPoints = (
  model: Model,
  property: MeasurementProperty | ControlProperty,
  type: 'measurement' | 'control',
) => {
  pointSelectionDialog.value = {
    visible: true,
    activeTab: 'telemetry',
    currentProperty: property,
    currentModel: model,
    propertyType: type,
    selectedPoints: [...property.relatedPoints],
  }
}

// 处理点位选择变化
const handlePointSelectionChange = (selection: any[]) => {
  pointSelectionDialog.value.selectedPoints = selection.map((item) => ({
    id: item.id,
    name: item.signalName,
    type: pointSelectionDialog.value.activeTab,
  }))
}

// 确认点位选择
const confirmPointSelection = () => {
  if (pointSelectionDialog.value.currentProperty) {
    pointSelectionDialog.value.currentProperty.relatedPoints = [
      ...pointSelectionDialog.value.selectedPoints,
    ]
  }
  pointSelectionDialog.value.visible = false
  ElMessage.success('关联点位设置成功')
}

// 移除关联点位
const removeRelatedPoint = (
  property: MeasurementProperty | ControlProperty,
  point: RelatedPoint,
) => {
  const index = property.relatedPoints.findIndex((p) => p.id === point.id)
  if (index > -1) {
    property.relatedPoints.splice(index, 1)
    ElMessage.success('关联点位移除成功')
  }
}
</script>

<style scoped lang="scss">
.model-configuration {
  padding: 20px;
  height: 100%;
  overflow: auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
    border: 1px solid;
    border-image: linear-gradient(
        117.64deg,
        rgba(148, 166, 197, 0.3) 2.73%,
        rgba(148, 166, 197, 0) 25.27%,
        rgba(148, 166, 197, 0.3) 41.05%,
        rgba(148, 166, 197, 0.103266) 61.63%,
        rgba(148, 166, 197, 0.3) 97.67%
      )
      1;
    backdrop-filter: blur(20px);

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .title {
        margin: 0;
        color: #fff;
        font-size: 20px;
        font-weight: 600;
      }

      .stats {
        display: flex;
        gap: 12px;

        .model-count {
          color: #fff;
          font-size: 14px;
          background: #3a5279;
          padding: 4px 12px;
          border-radius: 16px;
          border: 1px solid #3a5279;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .content {
    .model-collapse-item {
      margin-bottom: 16px;

      .model-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .model-header-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;

          .model-title {
            font-weight: 600;
            color: #fff;
            font-size: 16px;
            min-width: 120px;
          }

          .model-description-input {
            flex: 1;
            max-width: 400px;
          }
        }

        .model-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-right: 20px;
          color: #fff;

          .model-header-right-item {
            font-size: 14px;
            background: rgba(58, 82, 121, 0.5);
            padding: 4px 8px;
            border-radius: 4px;
          }
        }
      }

      .model-content {
        padding: 20px;

        .content-title {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .property-tabs {
          :deep(.el-tabs__header) {
            margin-bottom: 20px;

            .el-tabs__nav-wrap {
              .el-tabs__nav {
                .el-tabs__item {
                  color: #fff;
                  font-weight: 500;

                  &.is-active {
                    color: #409eff;
                    background: rgba(64, 158, 255, 0.1);
                  }

                  &:hover {
                    color: #409eff;
                  }
                }
              }
            }
          }

          :deep(.el-tabs__content) {
            .property-section {
              margin-bottom: 30px;

              .property-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;

                .property-title {
                  color: #fff;
                  font-size: 16px;
                  font-weight: 600;
                  margin: 0;
                }
              }

              .property-table {
                background: rgba(84, 98, 140, 0.2);
                border-radius: 8px;
                overflow: hidden;
              }
            }
          }
        }

        .related-points {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .point-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;

            .point-tag {
              margin: 0;
            }
          }
        }
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
          height: 32px;
        }
      }
    }
  }
  .point-selection-dialog {
    :deep(.el-dialog) {
      background: rgba(84, 98, 140, 0.95);
      border: 1px solid rgba(148, 166, 197, 0.3);
      border-radius: 8px;
    }

    :deep(.el-dialog__header) {
      color: #fff;
    }

    :deep(.el-dialog__body) {
      color: #fff;
    }
  }

  :deep(.el-tabs__content) {
    position: static;
  }
}
</style>
