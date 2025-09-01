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
          <el-icon>
            <Plus />
          </el-icon>
          添加模型
        </el-button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <el-collapse v-model="activeNames" accordion expand-icon-position="left">
        <el-collapse-item v-for="(model, index) in models" :key="model.id" :name="model.id" class="model-collapse-item">
          <template #title>
            <div class="model-header">
              <div class="model-header-left">
                <span class="model-title">{{ model.name }}</span>
                <span class="model-description-input">
                  {{ model.description }}
                </span>
              </div>
              <div class="model-header-right"></div>
            </div>
          </template>

          <!-- 展开内容 -->
          <div class="model-content">
            <!-- 属性标签页 -->
            <el-tabs v-model="model.activePropertyTab" type="card" class="property-tabs">
              <!-- 量测属性标签页 -->
              <el-tab-pane label="量测" name="measurement">
                <DeviceAttributeTable device_type="measurementProperties" :points="model.measurementProperties"
                  title="量测属性" :channelId="model.id" @submit-edit="
                    (points: MeasurementProperty[]) => handleMeasurementSubmit(model, points)
                  " @cancel-edit="() => handleMeasurementCancel(model)" />
              </el-tab-pane>
              <el-tab-pane label="控制" name="control">
                <DeviceAttributeTable device_type="controlProperties" :points="model.controlProperties" title="控制属性"
                  :channelId="model.id" @submit-edit="(points: any) => handleControlSubmit(model, points)"
                  @cancel-edit="() => handleControlCancel(model)" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <AddDeviceDialog ref="addDeviceDialogRef" @submit="submitAddModel" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddDeviceDialog from './AddDeviceDialog.vue'
import DeviceAttributeTable from './DeviceAttributeTable.vue'
import type {
  RelatedPoint,
  MeasurementProperty,
  ControlProperty,
  Model,
} from '@/types/deviceConfiguration'

// 生成唯一ID
let propertyIdCounter = 1
const generatePropertyId = () => propertyIdCounter++

// 创建新的量测属�?
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

// 创建新的控制属�?
const createNewControlProperty = (): ControlProperty => {
  return {
    id: generatePropertyId(),
    name: '',
    dataType: 'FLOAT32',
    controlType: 'switch',
    unit: '',
    defaultValue: '',
    required: false,
    relatedPoints: [],
  }
}

const addDeviceDialogRef = ref()
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
        name: '开关控',
        dataType: 'BOOLEAN',
        controlType: 'switch',
        unit: '',
        defaultValue: 'false',
        required: true,
        relatedPoints: [],
      },
      {
        id: 5,
        name: '电压设定',
        dataType: 'FLOAT32',
        controlType: 'value',
        unit: 'V',
        defaultValue: '220.0',
        required: false,
        relatedPoints: [],
      },
    ],
    activePropertyTab: 'measurement', // 初始化激活的标签   
  },
  {
    id: 2,
    name: '智能断路器',
    description: '用于电力系统保护的智能断路器设备模型',
    measurementProperties: [
      {
        id: 6,
        name: '状',
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
        unit: '',
        defaultValue: 'false',
        required: true,
        relatedPoints: [],
      },
    ],
    activePropertyTab: 'measurement', // 初始化激活的标签    isEditingMeasurement: false,
    isEditingControl: false,
  },
])

// 添加模型
const addModel = () => {
  addDeviceDialogRef.value.open()
  // const newModel = {
  //   id: Date.now(),
  //   name: `设备模型${models.value.length + 1}`,
  //   description: '',
  //   measurementProperties: [],
  //   controlProperties: [],
  //   activePropertyTab: 'measurement', // 初始化激活的标签  // }
  // models.value.push(newModel)
  // activeNames.value = [newModel.id]
  // ElMessage.success('模型添加成功')
}

// 处理量测属性编
const handleMeasurementEdit = (model: Model, action: 'submit' | 'cancel') => {
  if (action === 'submit') {
    model.isEditingMeasurement = false
    model.originalMeasurementData = undefined
    ElMessage.success('量测属性更新成')
  } else {
    if (model.originalMeasurementData) {
      model.measurementProperties = model.originalMeasurementData.map((prop) => ({
        ...prop,
        relatedPoints: [...prop.relatedPoints],
      }))
    }
    model.isEditingMeasurement = false
    model.originalMeasurementData = undefined
    ElMessage.info('已取消编')
  }
}

// 处理控制属性编
const handleControlEdit = (model: Model, action: 'submit' | 'cancel') => {
  if (action === 'submit') {
    model.isEditingControl = false
    model.originalControlData = undefined
    ElMessage.success('控制属性更新成')
  } else {
    if (model.originalControlData) {
      model.controlProperties = model.originalControlData.map((prop) => ({
        ...prop,
        relatedPoints: [...prop.relatedPoints],
      }))
    }
    model.isEditingControl = false
    model.originalControlData = undefined
    ElMessage.info('已取消编')
  }
}

// 处理量测属性提�?
const handleMeasurementSubmit = (model: Model, points: MeasurementProperty[]) => {
  model.measurementProperties = points
  ElMessage.success('量测属性更新成')
}

// 处理量测属性取�?
const handleMeasurementCancel = (model: Model) => {
  ElMessage.info('已取消编')
}

// 处理控制属性提�
const handleControlSubmit = (model: Model, points: ControlProperty[]) => {
  model.controlProperties = points
  ElMessage.success('控制属性更新成')
}

// 处理控制属性取�?
const handleControlCancel = (model: Model) => {
  ElMessage.info('已取消编')
}

// 编辑相关方法

const submitAddModel = (model: any) => {
  Object.assign(model, {
    id: Date.now(),
    measurementProperties: [],
    controlProperties: [],
    activePropertyTab: 'measurement',
    isEditingMeasurement: false,
    isEditingControl: false,
  })
  models.value.push(model)
  ElMessage.success('模型添加成功')
}
</script>

<style scoped lang="scss">
.model-configuration {
  padding: 0.2rem;
  height: 100%;
  overflow: auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.08rem;
    box-shadow: 0rem 0.04rem 0.1rem 0rem rgba(0, 0, 0, 0.25);
    border: 0.01rem solid;
    border-image: linear-gradient(117.64deg,
        rgba(148, 166, 197, 0.3) 2.73%,
        rgba(148, 166, 197, 0) 25.27%,
        rgba(148, 166, 197, 0.3) 41.05%,
        rgba(148, 166, 197, 0.103266) 61.63%,
        rgba(148, 166, 197, 0.3) 97.67%) 1;
    backdrop-filter: blur(0.2rem);

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.2rem;

      .title {
        margin: 0;
        color: #fff;
        font-size: 0.2rem;
        font-weight: 600;
      }

      .stats {
        display: flex;
        gap: 0.12rem;

        .model-count {
          color: #fff;
          font-size: 0.14rem;
          background: #3a5279;
          padding: 0.04rem 0.12rem;
          border-radius: 0.16rem;
          border: 0.01rem solid #3a5279;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 0.12rem;
    }
  }

  .content {
    .model-collapse-item {
      margin-bottom: 0.16rem;

      .model-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .model-header-left {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          flex: 1;

          .model-title {
            font-weight: 600;
            color: #fff;
            font-size: 0.2rem;
            min-width: 1.2rem;
          }

          .model-description-input {
            font-weight: 600;
            color: #fff;
            font-size: 0.16rem;
            min-width: 1.2rem;
          }
        }

        .model-header-right {
          display: flex;
          align-items: center;
          gap: 0.12rem;
          margin-right: 0.2rem;
          color: #fff;

          .model-header-right-item {
            font-size: 0.14rem;
            background: rgba(58, 82, 121, 0.5);
            padding: 0.04rem 0.08rem;
            border-radius: 0.04rem;
          }
        }
      }

      .model-content {
        padding: 0.2rem;

        .content-title {
          color: #fff;
          font-size: 0.18rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
      }
    }
  }

  :deep(.el-tabs__content) {
    position: static;
  }
}
</style>
