<template>
  <div class="list">
    <van-list
      ref="listRef"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type VNodeRef } from 'vue'

const listRef = ref<VNodeRef>('')

const list = ref<number[]>([])
const loading = ref(false)
const finished = ref(false)

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    for (let i = 0; i < 10; i += 1) {
      list.value.push(list.value.length + 1)
    }

    // 加载状态结束
    loading.value = false

    // 数据全部加载完成
    if (list.value.length >= 1000) {
      finished.value = true
    }
  }, 1000)
}
onMounted(() => {
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'auto'
})
onUnmounted(() => {
  document.documentElement.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
})
</script>
<style scoped lang="less">
.list {
  padding: 20px;
}
</style>
