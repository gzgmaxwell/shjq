import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ConfigProviderTheme } from 'vant'

export const useAppStore = defineStore('app', () => {
  const locale = ref('zhCN')
  const routeNameStack = ref<string[]>([])
  const landscape = ref(false)
  const theme = ref<ConfigProviderTheme>('light')

  const changeLocale = (newLocale: string) => {
    locale.value = newLocale
  }

  const changeLandscape = (state: boolean) => {
    landscape.value = state
  }

  const changeVantTheme = (themeParams: ConfigProviderTheme) => {
    theme.value = themeParams
  }

  return {
    locale,
    routeNameStack,
    changeLocale,
    landscape,
    changeLandscape,
    theme,
    changeVantTheme
  }
})
