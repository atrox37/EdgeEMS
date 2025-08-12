import { useUserStore } from '@/stores/user'

// Token 管理工具类
export class TokenManager {
  private static instance: TokenManager
  private refreshPromise: Promise<any> | null = null

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  /**
   * 获取当前Token
   */
  getToken(): string {
    const userStore = useUserStore()
    return userStore.token
  }

  /**
   * 设置Token
   */
  setToken(token: string): void {
    const userStore = useUserStore()
    userStore.token = token
  }

  /**
   * 检查Token是否即将过期（提前5分钟刷新）
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      // 解析JWT Token（这里假设Token包含过期时间）
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000 // 转换为毫秒
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000

      return exp - now < fiveMinutes
    } catch (error) {
      console.error('Token解析失败:', error)
      return false
    }
  }

  /**
   * 刷新Token（防止重复请求）
   */
  async refreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.doRefreshToken()
    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * 执行Token刷新
   */
  private async doRefreshToken(): Promise<boolean> {
    const userStore = useUserStore()
    const result = await userStore.refreshUserToken()
    return result.success
  }

  /**
   * 清除Token
   */
  clearToken(): void {
    const userStore = useUserStore()
    userStore.clearStorage()
  }
}

// 认证工具函数
export const authUtils = {
  /**
   * 检查用户是否已登录
   */
  isLoggedIn(): boolean {
    const userStore = useUserStore()
    return userStore.isLoggedIn && userStore.checkTokenValidity()
  },

  /**
   * 检查用户是否为管理员
   */
  isAdmin(): boolean {
    const userStore = useUserStore()
    return userStore.isAdmin
  },

  /**
   * 获取用户显示名称
   */
  getDisplayName(): string {
    const userStore = useUserStore()
    return userStore.displayName
  },

  /**
   * 获取用户头像
   */
  getAvatar(): string {
    const userStore = useUserStore()
    return userStore.avatar
  },

  /**
   * 用户登录
   */
  async login(username: string, password: string, remember = false) {
    const userStore = useUserStore()
    return await userStore.login({ username, password, remember })
  },

  /**
   * 用户登出
   */
  async logout() {
    const userStore = useUserStore()
    await userStore.logout()
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const userStore = useUserStore()
    return await userStore.fetchUserInfo()
  },
}

// 权限检查工具
export const permissionUtils = {
  /**
   * 检查是否有指定权限
   * @param permission 权限名称
   */
  hasPermission(permission: string): boolean {
    const userStore = useUserStore()
    if (!userStore.userInfo) return false

    // 这里可以根据实际需求实现权限检查逻辑
    // 例如：检查用户角色、权限列表等
    return userStore.isAdmin || userStore.userInfo.role === permission
  },

  /**
   * 检查是否有任意一个权限
   * @param permissions 权限列表
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  },

  /**
   * 检查是否有所有权限
   * @param permissions 权限列表
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  },
}

// 导出单例
export const tokenManager = TokenManager.getInstance()
