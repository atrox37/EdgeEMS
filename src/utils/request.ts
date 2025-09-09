/**
 * Axios 请求封装
 * 提供统一的HTTP请求配置、拦截器和错误处理
 */

import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 存储所有pending的请求
const pendingRequests = new Map()

// 定义响应数据的通用接口
export interface ApiResponse<T = any> {
  code: number // 响应状态码
  message: string // 响应消息
  data: T // 响应数据
  success: boolean // 请求是否成功
}

// 定义请求配置的扩展接口
export interface RequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean // 是否显示错误消息，默认true
  showSuccessMessage?: boolean // 是否显示成功消息，默认false
  loading?: boolean // 是否显示loading，默认false
}

/**
 * 创建axios实例
 * 设置基础配置项
 */
const service = axios.create({
  // API的base_url，可以通过环境变量配置
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_DEFAULT_VERSION}`,
  // 请求超时时间 (毫秒)
  timeout: 15000,
  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // 跨域请求时是否需要使用凭证
  withCredentials: false,
})

/**
 * 创建端口6002的axios实例
 */
const alarmService = axios.create({
  baseURL: import.meta.env.VITE_API_ALARM_URL || '/alarmApi',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: false,
})

/**
 * 请求拦截器
 * 在发送请求之前做一些统一处理
 */
const requestInterceptor = (config: any) => {
  // 生成请求的唯一标识
  const requestKey = `${config.method}-${config.url}`

  // 如果存在相同的pending请求，取消它
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey)
    cancelToken.cancel('请求被取消')
    pendingRequests.delete(requestKey)
  }

  // 创建新的cancelToken
  const cancelToken = axios.CancelToken.source()
  config.cancelToken = cancelToken.token
  pendingRequests.set(requestKey, cancelToken)

  // 从localStorage获取token并添加到请求头
  const userStore = useUserStore()
  const token = userStore.token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 如果是POST/PUT/PATCH请求且没有设置Content-Type，设置为json
  if (['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
  }

  // 添加时间戳防止缓存 (GET请求)
  if (config.method?.toLowerCase() === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    }
  }

  console.log(`[请求] ${config.method?.toUpperCase()} ${config.url}`, config)
  return config
}

const requestErrorInterceptor = (error: any) => {
  console.error('[请求错误]', error)
  ElMessage.error('Request configuration error')
  return Promise.reject(error)
}

service.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
alarmService.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

// 用于防止重复刷新token的标志
let isRefreshing = false
// 存储等待token刷新的请求队列
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

/**
 * 响应拦截器工厂函数
 * 创建统一的响应拦截器，避免代码重复
 */
const createResponseInterceptor = (serviceInstance: any, logPrefix: string = '') => {
  // 响应成功时的处理
  const responseSuccessHandler = (response: any) => {
    // 请求完成后，从pendingRequests中移除
    const requestKey = `${response.config.method}-${response.config.url}`
    pendingRequests.delete(requestKey)

    console.log(
      `${logPrefix}[响应] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response,
    )

    const { data } = response
    const customConfig = response.config as any

    // 检查业务状态码
    // 如果返回的是blob类型，直接认为请求成功，否则判断业务code或success
    if (
      response.request?.responseType === 'blob' ||
      (data && (data.code === 200 || data.success))
    ) {
      // 请求成功
      if (customConfig.showSuccessMessage && data.message) {
        ElMessage.success(data.message)
      }
      return response
    } else {
      // 业务逻辑错误
      let errorMessage = data.message || 'Request failed'

      // 根据不同的业务状态码进行处理
      switch (data.code) {
        case 401:
          // 未授权，清除token并跳转到登录页
          const userStore = useUserStore()
          userStore.clearUserData()
          errorMessage = 'Login expired, please log in again'
          // 跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          errorMessage = 'No permission to access this resource'
          break
        case 404:
          errorMessage = 'Requested resource not found'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        default:
          break
      }
      ElMessage.error(response.data.message || errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  }

  // 响应失败时的处理
  const responseErrorHandler = async (error: any) => {
    // 如果是取消请求的错误，不显示错误信息
    if (axios.isCancel(error)) {
      console.log(`${logPrefix}[请求已取消] ${error.message}`)
      return Promise.reject(error)
    }

    // 请求完成后，从pendingRequests中移除
    const requestKey = `${error.config?.method}-${error.config?.url}`
    if (requestKey) {
      pendingRequests.delete(requestKey)
    }

    console.error(`${logPrefix}[响应错误]`, error)

    const originalRequest = error.config

    // 处理401错误 - 自动刷新token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新token，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return serviceInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const userStore = useUserStore()
        const refreshToken = userStore.refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // 调用刷新token的API
        const response = await service.post('auth/refresh', {
          refresh_token: refreshToken,
        })
        console.log('response', response)

        if (response.data.success) {
          // 更新store中的token
          userStore.token = response.data.data.access_token
          userStore.refreshToken = response.data.data.refresh_token

          // 更新当前请求的Authorization头
          originalRequest.headers['Authorization'] = `Bearer ${response.data.data.access_token}`

          // 处理队列中的请求
          processQueue(null, response.data.data.access_token)

          // 重试原请求
          return serviceInstance(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // 刷新token失败，清除用户数据并跳转到登录页
        const userStore = useUserStore()
        userStore.clearUserData()

        // 处理队列中的请求
        processQueue(refreshError, null)

        ElMessage.error('Login expired, please log in again')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误
    let errorMessage = 'Network request failed'

    if (error.response) {
      // 服务器返回错误状态码
      const { status, statusText } = error.response

      switch (status) {
        case 400:
          errorMessage = 'Bad request'
          break
        case 403:
          errorMessage = 'Access denied'
          break
        case 404:
          errorMessage = 'Request URL not found'
          break
        case 408:
          errorMessage = 'Request timeout'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        case 502:
          errorMessage = 'Bad gateway'
          break
        case 503:
          errorMessage = 'Service unavailable'
          break
        case 504:
          errorMessage = 'Gateway timeout'
          break
        default:
          errorMessage = `Connection error ${status}: ${statusText}`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout'
      } else {
        errorMessage = 'Network connection error'
      }
    } else {
      // 请求配置出错
      errorMessage = error.message || 'Request configuration error'
    }
    ElMessage.error(error.response?.data?.message || errorMessage)
    return Promise.reject(error)
  }

  return [responseSuccessHandler, responseErrorHandler]
}

// 为两个服务实例添加响应拦截器
service.interceptors.response.use(...createResponseInterceptor(service))
alarmService.interceptors.response.use(...createResponseInterceptor(alarmService, '[6002]'))

/**
 * 封装的请求方法类
 */
class Request {
  private axiosInstance: any

  constructor(axiosInstance: any) {
    this.axiosInstance = axiosInstance
  }

  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  async get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params, ...config })
    return response.data
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config)
    return response.data
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config)
    return response.data
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param config 请求配置
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config)
    return response.data
  }

  /**
   * PATCH请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config)
    return response.data
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param file 文件对象
   * @param data 额外数据
   * @param config 请求配置
   */
  async upload<T = any>(
    url: string,
    file: File,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    // 添加额外数据
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
    }

    const response = await this.axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  /**
   * 下载文件
   * @param url 下载地址
   * @param params 请求参数
   * @param filename 文件名
   */
  async download(url: string, params?: any, filename?: string): Promise<void> {
    try {
      const response = await this.axiosInstance.get(url, {
        params,
        responseType: 'blob',
      })
      console.log('response', response)
      // 创建blob链接
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      console.log('downloadUrl', downloadUrl)
      debugger
      // 创建下载链接
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || `download_${Date.now()}`

      // 触发下载
      document.body.appendChild(link)
      link.click()

      // 清理
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      ElMessage.success('File downloaded successfully')
    } catch (error) {
      console.error('File download failed:', error)
      ElMessage.error('File download failed')
    }
  }
}

// 创建默认的请求实例（使用默认service）
const defaultRequest = new Request(service)

// 创建端口6002的请求实例
const alarmRequest = new Request(alarmService)

// 取消所有pending请求的方法
export const cancelAllPendingRequests = () => {
  pendingRequests.forEach((cancelToken) => {
    cancelToken.cancel('路由切换，请求被取消')
  })
  pendingRequests.clear()
}

// 导出请求实例和封装的方法
export { service, alarmService, defaultRequest, alarmRequest }
export default Request
