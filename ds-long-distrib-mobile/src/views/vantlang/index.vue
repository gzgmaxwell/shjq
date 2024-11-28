<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const change = (lang: string) => {
  appStore.changeLocale(lang)
}
const currentDate = ref(['2021', '01', '01'])
</script>

<template>
  <div class="p-5">
    <van-button
      block
      @click="change('zhCN')"
      >切换中文</van-button
    >
    <van-button
      block
      @click="change('enUS')"
      >切换英文</van-button
    >
    <van-button
      class="home-view__button"
      block
      @click="() => router.push('/')"
    >
      跳转首页
    </van-button>

    <van-button
      class="home-view__button"
      block
      @click="() => router.push('/mock')"
    >
      跳转mock
    </van-button>
    <div class="p-3 bg-white rounded">
      {{ $t('Change Language') }}
    </div>
    <van-date-picker
      v-model="currentDate"
      title="选择日期"
    />
  </div>
</template>

<style lang="less"></style>
<route lang="yaml">
name: vantLang
meta:
  requiresAuth: true
</route>
