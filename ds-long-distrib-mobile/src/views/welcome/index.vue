<script setup lang="ts" name="Welcome">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="welcome">
    <p>欢迎您，代理商</p>
    <p class="statistics">您于2023-07-01加入佣金活动，截至今天已经80天了！</p>
    <div>
      <van-button
        type="primary"
        size="mini"
        class="mt10"
        @click="() => router.push('/incomeRecording')"
        >收益查询</van-button
      >
    </div>
    <div>
      <van-button
        type="primary"
        size="mini"
        class="mt10"
        @click="() => router.push('/withdrawIndex')"
        >我要提现</van-button
      >
    </div>
    <div>
      <van-button
        type="primary"
        size="mini"
        class="mt10"
        @click="() => router.push('/withdrawRecording')"
        >查看我的历史提现记录</van-button
      >
    </div>
  </div>
</template>

<style lang="less">
.welcome {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .statistics {
    font-size: 12px;
  }
}
</style>

<route lang="yaml">
name: welcome
meta:
  requiresAuth: true
</route>
