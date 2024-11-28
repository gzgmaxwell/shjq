<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'

import { useAppStore } from '@/stores/app'

const { locale: i18NLocale } = useI18n({ useScope: 'global' })
const appStore = useAppStore()

const removeGlobalLoading = () => document.getElementById('global-loading')?.remove()

watch(
  () => appStore.locale,
  newLocale => {
    i18NLocale.value = newLocale
    if (newLocale === 'enUS') {
      Locale.use('en-US', enUS)
    } else {
      Locale.use('en-CN', zhCN)
    }
  }
)

onMounted(() => {
  removeGlobalLoading()
})
</script>

<template>
  <AppRouterView />
</template>
