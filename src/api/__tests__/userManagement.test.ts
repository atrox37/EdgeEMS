import { describe, it, expect, vi } from 'vitest'
import { userManagementApi } from '../userManagement'

vi.mock('@/utils/request', () => ({
  defaultRequest: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('User Management API', () => {
  it('should get user list', async () => {
    const mockData = { users: [], total: 0 }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.get).mockResolvedValue(mockData)

    const params = { page: 1, pageSize: 10 }
    const result = await userManagementApi.getUserList(params)
    expect(result).toEqual(mockData)
    expect(defaultRequest.get).toHaveBeenCalledWith('v1/user/list', { params })
  })

  it('should add user', async () => {
    const mockData = { success: true, user: { id: 1 } }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.post).mockResolvedValue(mockData)

    const userData = { name: 'new user', email: 'new@example.com' }
    const result = await userManagementApi.addUser(userData)
    expect(result).toEqual(mockData)
    expect(defaultRequest.post).toHaveBeenCalledWith('v1/user/add', userData)
  })

  it('should update user', async () => {
    const mockData = { success: true }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.put).mockResolvedValue(mockData)

    const userData = { id: 1, name: 'updated user' }
    const result = await userManagementApi.updateUser(userData)
    expect(result).toEqual(mockData)
    expect(defaultRequest.put).toHaveBeenCalledWith('v1/user/update', userData)
  })

  it('should delete user', async () => {
    const mockData = { success: true }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.delete).mockResolvedValue(mockData)

    const params = { id: 1 }
    const result = await userManagementApi.deleteUser(params)
    expect(result).toEqual(mockData)
    expect(defaultRequest.delete).toHaveBeenCalledWith('v1/user/delete', { params })
  })
})
