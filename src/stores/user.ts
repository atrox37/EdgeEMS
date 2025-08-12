import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams, UpdateUserParams } from '@/types/user'
import { mockUserApi } from '@/api/user'

// 用户状态管理
export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const token = ref<string>('')
    const userInfo = ref<UserInfo | null>(null)

    // 用户登录
    const login = async (params: LoginParams) => {
      try {
        const response = await mockUserApi.login(params)

        if (response.success) {
          const { token: newToken, user } = response.data

          // 更新状态（会自动持久化）
          token.value = newToken
          userInfo.value = user

          return { success: true, message: response.message }
        } else {
          return { success: false, message: response.message }
        }
      } catch (error: any) {
        return { success: false, message: error.message || '登录失败' }
      }
    }

    // 用户登出
    const logout = async () => {
      try {
        // 调用登出API
        if (token.value) {
          await mockUserApi.logout()
        }
      } catch (error) {
        console.error('登出API调用失败:', error)
      } finally {
        // 清除状态（会自动清除持久化数据）
        token.value = ''
        userInfo.value = null
      }
    }

    // 获取用户信息
    const getUserInfo = async () => {
      try {
        const response = await mockUserApi.getUserInfo()

        if (response.success) {
          userInfo.value = response.data
          return { success: true, message: response.message }
        } else {
          return { success: false, message: response.message }
        }
      } catch (error: any) {
        return { success: false, message: error.message || '获取用户信息失败' }
      }
    }

    // 清除用户数据（手动清除持久化数据）
    const clearUserData = () => {
      token.value = ''
      userInfo.value = null
    }

    return {
      // 状态
      token,
      userInfo,

      // 方法
      login,
      logout,
      getUserInfo,
      clearUserData,
    }
  },
  {
    persist: true,
  },
)
