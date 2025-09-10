import { describe, it, expect, vi } from 'vitest'
import {
  getRuleDetail,
  createRule,
  updateRule,
  deleteRule,
  enableRule,
  disableRule,
} from '../alarm'

vi.mock('@/utils/request', () => ({
  alarmRequest: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('Alarm API', () => {
  it('should get rule detail', async () => {
    // 修复：mock数据应符合ApiResponse类型结构
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.get).mockResolvedValue(mockData)

    const result = await getRuleDetail('1')
    expect(result).toEqual(mockData)
    expect(alarmRequest.get).toHaveBeenCalledWith('/rules/1')
  })

  it('should create rule', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.post).mockResolvedValue(mockData)

    const ruleData = { name: 'new rule', condition: 'test' }
    const result = await createRule(ruleData)
    expect(result).toEqual(mockData)
    expect(alarmRequest.post).toHaveBeenCalledWith('/rules', ruleData)
  })

  it('should update rule', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.put).mockResolvedValue(mockData)

    const ruleData = { name: 'updated rule' }
    const result = await updateRule('1', ruleData)
    expect(result).toEqual(mockData)
    expect(alarmRequest.put).toHaveBeenCalledWith('/rules/1', ruleData)
  })

  it('should delete rule', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.delete).mockResolvedValue(mockData)

    const result = await deleteRule('1')
    expect(result).toEqual(mockData)
    expect(alarmRequest.delete).toHaveBeenCalledWith('/rules/1')
  })

  it('should enable rule', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.patch).mockResolvedValue(mockData)

    const result = await enableRule('1')
    expect(result).toEqual(mockData)
    expect(alarmRequest.patch).toHaveBeenCalledWith('/rules/1/enable')
  })

  it('should disable rule', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: { id: '1', name: 'test rule' },
      success: true,
    }
    const { alarmRequest } = await import('@/utils/request')
    vi.mocked(alarmRequest.patch).mockResolvedValue(mockData)

    const result = await disableRule('1')
    expect(result).toEqual(mockData)
    expect(alarmRequest.patch).toHaveBeenCalledWith('/rules/1/disable')
  })
})
