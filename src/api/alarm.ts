import { alarmRequest } from '@/utils/request'
import type { AlarmRecord, AlarmFilter, AlarmQueryParams, AlarmResponse } from '@/types/alarm'
import type { RuleFormModel, RuleInfo } from '@/types/ruleManagement'
import type { ApiResponse } from '@/types/user'
export const getRuleDetail = (id: string): Promise<ApiResponse<AlarmRecord>> => {
  return alarmRequest.get(`/rules/${id}`)
}

export const createRule = (data: RuleFormModel) => {
  return alarmRequest.post('/rules', data)
}

export const updateRule = (id: string, data: any) => {
  return alarmRequest.put(`/rules/${id}`, data)
}

export const deleteRule = (id: string) => {
  return alarmRequest.delete(`/rules/${id}`)
}
export const enableRule = (id: string | number) => {
  return alarmRequest.patch(`/rules/${id}/enable`)
}
export const disableRule = (id: string | number) => {
  return alarmRequest.patch(`/rules/${id}/disable`)
}
