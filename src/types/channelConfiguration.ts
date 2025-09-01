// 通道配置相关类型定义

// 点位数据类型
export interface Point {
  id: number
  signalName: string
  scaleFactor?: number
  offset?: number
  value: number
  unit: string
  reverse?: boolean
  dataType: string
  protocolConfig: ProtocolConfig
  enabled: boolean
}

// 协议配置类型
export interface ProtocolConfig {
  registerAddress?: string
  registerType?: 'holding' | 'input' | 'coil' | 'discrete'
  byteOrder?: 'big' | 'little'
  readInterval?: number
}

// 通道类型
export interface Channel {
  id: number
  name: string
  activeTab: 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust'
  protocol: string
  is_active: boolean
  telemetry: Point[]
  telesignal: Point[]
  telecontrol: Point[]
  teleadjust: Point[]
}

// 通道表单类型
export interface ChannelForm {
  name: string
  protocol: string
  description?: string
  is_active: boolean
  ip_address: string
  port: number | null
  timeout: number | null
  unit_id: number | null
}

// 对话框暴露类型
export interface DialogExpose {
  dialogVisible: boolean
}

// 组件Props类型
export interface Props {
  points: Point[]
  title: string
  channelId: number
  channel_type: keyof Pick<Channel, 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust'>
}

// 数据类型选项
export const DATA_TYPES = [
  { label: 'INT16', value: 'INT16' },
  { label: 'INT32', value: 'INT32' },
  { label: 'FLOAT32', value: 'FLOAT32' },
  { label: 'FLOAT64', value: 'FLOAT64' },
  { label: 'STRING', value: 'STRING' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
] as const

// 寄存器类型选项
export const REGISTER_TYPES = [
  { label: '保持寄存器', value: 'holding' },
  { label: '输入寄存器', value: 'input' },
  { label: '线圈', value: 'coil' },
  { label: '离散输入', value: 'discrete' },
] as const

// 字节序选项
export const BYTE_ORDERS = [
  { label: '大端序', value: 'big' },
  { label: '小端序', value: 'little' },
] as const
