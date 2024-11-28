import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { useLogOut } from '@/hooks'

export default class ResponseInterceptor {
  /**
   * 添加响应拦截器
   * @param axiosInstance Axios 实例
   */
  public static load(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.response.use(
      ResponseInterceptor.onSuccess,
      ResponseInterceptor.onFail
    )
  }

  /**
   * 添加响应成功拦截器
   * @param response Axios响应
   * @returns Promise
   */
  private static onSuccess(response: AxiosResponse) {
    const IS_REAL_SUCCESS = response.status === 200

    if (IS_REAL_SUCCESS) {
      return Promise.resolve(response)
    }
    return Promise.reject(new Error(ResponseInterceptor.errorCodeToText(response)))
  }

  /**
   * 添加响应失败拦截器
   * @param error Axios错误
   * @returns Promise
   */
  private static onFail(error: AxiosError) {
    /**
     * HTTP状态码
     */
    const httpStatusCode = error?.response?.status as number

    /**
     * 后端返回的错误信息
     */
    const serviceErrorMessage: string | undefined = (error?.response?.data as any)?.message

    /**
     * Axios内部错误信息，该字段主要做请求超时判断用
     */
    const axiosErrorMessage = error.message

    let errorMessage: string = serviceErrorMessage || '服务器内部错误'

    const IS_TIMEOUT = axiosErrorMessage.indexOf('timeout') !== -1
    const IS_UNAUTHORIZED = httpStatusCode === 401 || httpStatusCode === 403

    if (IS_TIMEOUT) {
      errorMessage = '请求超时，请稍后重试'
    }

    if (IS_UNAUTHORIZED) {
      if (serviceErrorMessage === undefined) {
        errorMessage = '未预料的登录失败，请联系网络管理员'
      }
      useLogOut()
    }

    return Promise.reject(new Error(errorMessage))
  }

  /**
   * HTTP错误码转错误提示文本
   * @param response Axios响应
   * @returns 错误文本
   */
  private static errorCodeToText(response: AxiosResponse) {
    /** http status code */
    const code = response.status
    /** notice text */
    let message = 'Request Error'
    switch (code) {
      case 400:
        message = 'Request Error'
        break
      case 401:
        message = 'Unauthorized, please login'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '访问资源不存在'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '位置错误'
        break
      case 501:
        message = '承载服务未实现'
        break
      case 502:
        message = '网关错误'
        break
      case 503:
        message = '服务暂不可用'
        break
      case 504:
        message = '网关超时'
        break
      case 505:
        message = '暂不支持的 HTTP 版本'
        break
      default:
        message = '位置错误'
    }
    return message
  }
}
