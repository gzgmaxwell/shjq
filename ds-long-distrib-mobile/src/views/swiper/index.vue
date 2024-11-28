<template>
  <div class="virtual">
    <van-swipe
      v-if="isShow"
      ref="swipe"
      class="my-swipe"
      :loop="true"
      :vertical="true"
      :landscape="landscape"
      indicator-color="white"
    >
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type VNodeRef } from 'vue'
import { useAppStore } from '../../stores/app'

const isShow = ref(true)

const appStore = useAppStore()
const landscape = computed(() => appStore.landscape)
const swipe = ref<VNodeRef>('')
watch(
  () => landscape.value,
  () => {
    swipe.value.resize()
    isShow.value = false
    setTimeout(() => {
      isShow.value = true
    }, 1)
  }
)
</script>

<style scoped lang="less">
.virtual {
  width: 100%;
  height: 100%;
  border: 2px solid #4caf50;
  margin: 0 auto;
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 300px;
    text-align: center;
    background-color: #39a9ed;
  }
}
</style>
