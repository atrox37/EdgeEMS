// 报警记录类型定义

export interface AlarmRecord {
  id: string
  name: string
  device: string
  level: 'High' | 'Medium' | 'Low'
  startTime: string
  endTime?: string // 历史记录才有结束时间
  description?: string
  status?: 'active' | 'resolved' | 'acknowledged'
}

export interface AlarmFilter {
  level?: 1 | 2 | 3
  device?: string
  dateRange?: [string, string]
  status?: 'active' | 'inactive'
}

export interface AlarmQueryParams {
  type: 'current' | 'history'
  filter: AlarmFilter
  page?: number
  pageSize?: number
}

export interface AlarmResponse {
  data: AlarmRecord[]
  total: number
  page: number
  pageSize: number
}
