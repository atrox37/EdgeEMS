import { alarmRequest } from '@/utils/request'

export const getRuleDetail = (id: string) => {
  return alarmRequest.get(`/rules/${id}`)
}

export const createRule = (data: any) => {
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
