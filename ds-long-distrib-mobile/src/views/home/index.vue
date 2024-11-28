<script setup lang="ts" name="HomeView">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="home-view">
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/vantLang')"
    >
      vant 语言切换
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/mock')"
    >
      mock 数据
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/vantTheme')"
    >
      vant 黑暗模式
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/autoFlex')"
    >
      高度自适应
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/fullScreen')"
    >
      刘海屏
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/virtualList')"
    >
      虚拟列表
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/swiper')"
    >
      vant 轮播
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/tab')"
    >
      tab 标签
    </van-button>
    <van-button
      class="home-view__button"
      type="primary"
      block
      @click="() => router.push('/list')"
    >
      list 列表
    </van-button>
  </div>
</template>

<style lang="less">
.home-view {
  padding: 10px;
  &__button {
    margin-bottom: 10px;
  }
}
</style>

<route lang="yaml">
name: home
meta:
  requiresAuth: true
</route>
