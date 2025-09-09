import { netRequest } from '@/utils/request'

export const getMqttConfig = () => {
  return netRequest.get('/mqtt/config')
}

export const updateMqttConfig = (params: any) => {
  return netRequest.post('/mqtt/config', params)
}

export const disconnectMqtt = () => {
  return netRequest.post('/mqtt/disconnect')
}

export const reconnectMqtt = () => {
  return netRequest.post('/mqtt/reconnect')
}
export const getMqttStatus = () => {
  return netRequest.get('/mqtt/status')
}
