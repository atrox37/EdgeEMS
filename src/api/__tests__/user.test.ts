import { describe, it, expect, vi } from 'vitest'
import { userApi } from '../user'

vi.mock('@/utils/request', () => ({
  defaultRequest: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('crypto-js/md5', () => ({
  default: vi.fn((str) => `md5_${str}`),
}))

describe('User API', () => {
  it('should login user', async () => {
    const mockData = {
      success: true,
      data: { access_token: 'test-token', refresh_token: 'refresh-token' },
    }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.post).mockResolvedValue(mockData)

    const credentials = { username: 'test', password: 'password' }
    const result = await userApi.login(credentials)
    expect(result).toEqual(mockData)
    expect(defaultRequest.post).toHaveBeenCalledWith('auth/login', {
      username: 'test',
      password: expect.any(String),
    })
  })

  it('should logout user', async () => {
    const mockData = { success: true }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.post).mockResolvedValue(mockData)

    const result = await userApi.logout('refresh-token')
    expect(result).toEqual(mockData)
    expect(defaultRequest.post).toHaveBeenCalledWith('auth/logout', {
      refresh_token: 'refresh-token',
    })
  })

  it('should get user info', async () => {
    const mockData = { success: true, data: { id: 1, username: 'test', email: 'test@example.com' } }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.get).mockResolvedValue(mockData)

    const result = await userApi.getUserInfo()
    expect(result).toEqual(mockData)
    expect(defaultRequest.get).toHaveBeenCalledWith('auth/me')
  })

  it('should refresh token', async () => {
    const mockData = {
      success: true,
      data: { token: 'new-token', refreshToken: 'new-refresh-token' },
    }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.post).mockResolvedValue(mockData)

    const result = await userApi.refreshToken('refresh-token')
    expect(result).toEqual(mockData)
    expect(defaultRequest.post).toHaveBeenCalledWith('auth/refresh', {
      refresh_token: 'refresh-token',
    })
  })

  it('should add user', async () => {
    const mockData = { success: true, data: { id: 1, username: 'newuser' } }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.post).mockResolvedValue(mockData)

    const userData = { username: 'newuser', password: 'password', email: 'new@example.com' }
    const result = await userApi.addUser(userData)
    expect(result).toEqual(mockData)
    expect(defaultRequest.post).toHaveBeenCalledWith('auth/register', {
      username: 'newuser',
      password: expect.any(String),
      email: 'new@example.com',
    })
  })

  it('should update user', async () => {
    const mockData = { success: true, data: { id: 1, username: 'updated' } }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.put).mockResolvedValue(mockData)

    const userData = { username: 'updated' }
    const result = await userApi.updateUser(1, userData)
    expect(result).toEqual(mockData)
    expect(defaultRequest.put).toHaveBeenCalledWith('auth/users/1', userData)
  })

  it('should delete user', async () => {
    const mockData = { success: true }
    const { defaultRequest } = await import('@/utils/request')
    vi.mocked(defaultRequest.delete).mockResolvedValue(mockData)

    const result = await userApi.deleteUser(1)
    expect(result).toEqual(mockData)
    expect(defaultRequest.delete).toHaveBeenCalledWith('auth/users/1')
  })
})
