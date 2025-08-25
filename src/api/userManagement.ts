import { defaultRequest } from '@/utils/request'

export const userManagementApi = {
  getUserList(params: any): Promise<any> {
    return defaultRequest.get('v1/user/list', { params })
  },
  addUser(params: any): Promise<any> {
    return defaultRequest.post('v1/user/add', params)
  },
  updateUser(params: any): Promise<any> {
    return defaultRequest.put('v1/user/update', params)
  },
  deleteUser(params: any): Promise<any> {
    return defaultRequest.delete('v1/user/delete', { params })
  },
}
