import axios from 'axios'
import { showFailToast, showConfirmDialog } from 'vant'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API ? `${import.meta.env.VITE_APP_BASE_API}/api` : '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.info('token 无效')
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const { data } = response
    if (data.code === 200) {
      return response
    }
    if (response.status === 200) {
      return response // 獲取checkcode
    }
    if (data.access_token) {
      return response
    }
    if (data.code === 8888) {
      throw new Error()
    }
    throw new Error()
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data
      if (code === 8888) {
        showConfirmDialog({
          title: '提示',
          message: '当前页面已失效，请重新登录'
        })
          .then(() => {
            localStorage.clear()
            router.replace({ path: '/login' })
            window.location.reload()
          })
          .catch(() => {})
      } else {
        showFailToast(msg || '系统出错')
      }
    }
    return Promise.reject(error.message)
  }
)

export default service
