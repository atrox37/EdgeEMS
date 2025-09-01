// 设备配置相关类型定义

// 关联点类型
export interface RelatedPoint {
  id: number
  name: string
  type: string
}

// 量测属性类型
export interface MeasurementProperty {
  id: number
  name: string
  dataType: string
  unit: string
  defaultValue: string
  required: boolean
  relatedPoints: RelatedPoint[]
}

// 控制属性类型
export interface ControlProperty {
  id: number
  name: string
  dataType: string
  controlType: string
  unit: string
  defaultValue: string
  required: boolean
  relatedPoints: RelatedPoint[]
}

// 设备模型类型
export interface Model {
  id: number
  name: string
  description: string
  measurementProperties: MeasurementProperty[]
  controlProperties: ControlProperty[]
  activePropertyTab: string // 用于控制属性标签页的激活状态
  originalMeasurementData?: MeasurementProperty[] // 量测属性原始数据备份
  originalControlData?: ControlProperty[] // 控制属性原始数据备份
  isEditingMeasurement?: boolean
  isEditingControl?: boolean
}

// 模型表单类型
export interface ModelForm {
  name: string
  description: string
}

// 对话框暴露类型
export interface DialogExpose {
  dialogVisible: boolean
}

// 属性类型
export interface Property {
  id: number
  name: string
  dataType: string
  unit: string
  defaultValue: string
  required: boolean
  controlType?: string
  relatedPoints: RelatedPoint[]
}

// 组件Props类型
export interface Props {
  properties: Property[]
  isEditing: boolean
  onUpdate: (properties: Property[]) => void
}
