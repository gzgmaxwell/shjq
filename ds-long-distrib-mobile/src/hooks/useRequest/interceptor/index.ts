import type { AxiosInstance } from 'axios'
import RequestInterceptor from './request'
import ResponseInterceptor from './response'

export default class AxiosInterceptor {
  /**
   * 添加拦截器
   */
  public static addInterceptor(axiosInstance: AxiosInstance) {
    RequestInterceptor.load(axiosInstance)
    ResponseInterceptor.load(axiosInstance)
  }
}
