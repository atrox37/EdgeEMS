/**
 * WebSocket 报文类型定义
 * 基于提供的WebSocket数据交互结构
 */

// 基础报文结构
export interface WebSocketMessage {
  type: string
  timestamp: string
  data?: any
}

// 客户端发送报文类型
export type ClientMessageType = 'subscribe' | 'unsubscribe' | 'control' | 'ping'

// 服务端推送报文类型
export type ServerMessageType =
  | 'data_update'
  | 'data_batch'
  | 'alarm'
  | 'subscribe_ack'
  | 'control_ack'
  | 'error'
  | 'pong'
  | 'connection_established'
  | 'alarm_num'

// 数据类型枚举
export type DataType = 'T' | 'S' | 'C' | 'A' // T=遥测, S=遥信, C=遥控, A=遥调

// 告警级别枚举
export type AlarmLevel = 0 | 1 | 2 | 3 // 0=低, 1=中, 2=高, 3=紧急

// 告警状态枚举
export type AlarmStatus = 0 | 1 // 0=恢复, 1=触发

// 控制命令类型
export type CommandType = 'set_value' | 'get_value' | 'execute'

// 客户端发送报文接口

// 订阅数据
export interface SubscribeMessage extends WebSocketMessage {
  type: 'subscribe'
  data: {
    channels: number[]
    data_types: DataType[]
    interval: number // 推送间隔(ms)
  }
}

// 取消订阅
export interface UnsubscribeMessage extends WebSocketMessage {
  type: 'unsubscribe'
  data: {
    channels: number[]
  }
}

// 控制命令
export interface ControlMessage extends WebSocketMessage {
  type: 'control'
  data: {
    channel_id: number
    point_id: number
    command_type: CommandType
    value?: number
    operator: string
    reason?: string
  }
}

// 心跳
export interface PingMessage extends WebSocketMessage {
  type: 'ping'
}

// 服务端推送报文接口

// 连接成功
export interface ConnectionEstablishedMessage extends WebSocketMessage {
  type: 'connection_established'
}

// 实时数据更新
export interface DataUpdateMessage extends WebSocketMessage {
  type: 'data_update'
  data: {
    channel_id: number
    data_type: DataType
    values: Record<string, number>
  }
}

// 批量数据更新
export interface DataBatchMessage extends WebSocketMessage {
  type: 'data_batch'
  data: {
    updates: Array<{
      channel_id: number
      data_type: DataType
      values: Record<string, number>
    }>
  }
}

// 告警事件
export interface AlarmMessage extends WebSocketMessage {
  type: 'alarm'
  data: {
    alarm_id: string
    channel_id: number
    point_id: number
    status: AlarmStatus
    level: AlarmLevel
    value: number
    message: string
  }
}

// 订阅确认
export interface SubscribeAckMessage extends WebSocketMessage {
  type: 'subscribe_ack'
  data: {
    request_id: string
    subscribed: number[]
    failed: number[]
    total: number
  }
}

// 控制命令确认
export interface ControlAckMessage extends WebSocketMessage {
  type: 'control_ack'
  data: {
    request_id: string
    command_id: string
    status: 'executed' | 'failed' | 'pending'
    result: {
      success: boolean
      actual_value?: number
      error_message?: string
    }
  }
}

// 错误消息
export interface ErrorMessage extends WebSocketMessage {
  type: 'error'
  data: {
    code: string
    message: string
    details?: string
    request_id?: string
  }
}

// 心跳响应
export interface PongMessage extends WebSocketMessage {
  type: 'pong'
  data: {
    server_time: string
    latency: number
  }
}
export interface AlarmNumMessage extends WebSocketMessage {
  type: 'alarm_num'
  data: {
    current_alarms: number
    server_id: string
    update_time: string
  }
}
// 联合类型
export type ClientMessage = SubscribeMessage | UnsubscribeMessage | ControlMessage | PingMessage
export type ServerMessage =
  | ConnectionEstablishedMessage
  | DataUpdateMessage
  | DataBatchMessage
  | AlarmMessage
  | SubscribeAckMessage
  | ControlAckMessage
  | ErrorMessage
  | PongMessage
  | AlarmNumMessage
// WebSocket连接状态
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// 订阅配置
export interface SubscriptionConfig {
  channels: number[]
  dataTypes: DataType[]
  interval: number
}

// 数据监听器类型
export type DataListener = (data: DataUpdateMessage['data']) => void
export type BatchDataListener = (data: DataBatchMessage['data']) => void
export type AlarmListener = (alarm: AlarmMessage['data']) => void
export type ErrorListener = (error: ErrorMessage['data']) => void
export type AlarmNumListener = (alarmNum: AlarmNumMessage['data']) => void
// 监听器配置
export interface ListenerConfig {
  onDataUpdate?: DataListener
  onBatchDataUpdate?: BatchDataListener
  onAlarm?: AlarmListener
  onError?: ErrorListener
  onAlarmNum?: AlarmNumListener
  onConnect?: () => void
  onDisconnect?: () => void
  onReconnect?: () => void
}
