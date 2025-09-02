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
  slave_id?: number
  function_code?: number
  register_address?: number
  data_type?: string
  byte_order?: string
  bit_position?: number
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
