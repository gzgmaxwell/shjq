import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  /**
   * 当前用户Token
   */
  const token = ref('')

  /**
   * 用户信息
   */
  const userInfo = reactive({
    userName: '',
    userId: '',
    gender: 0
  })

  /**
   * 清除token
   */
  const clearToken = () => {
    token.value = ''
  }

  return {
    token,
    userInfo,
    clearToken
  }
})
