<template>
  <RouterView v-slot="{ Component }">
    <transition :name="transition">
      <KeepAlive :include="routeNameStack">
        <component
          :is="Component"
          class="router-view"
        />
      </KeepAlive>
    </transition>
  </RouterView>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const routeNameStack = computed(() => appStore.routeNameStack)
const transition = ref('')
watch(
  () => routeNameStack.value,
  (newValue, oldValue) => {
    const IS_PUSHED_ROUTER = newValue.length > oldValue.length
    if (IS_PUSHED_ROUTER) {
      transition.value = 'page-left'
    } else {
      transition.value = 'page-right'
    }
  }
)
</script>

<style lang="less">
@page-animation-time: 0.3s;

.page-right-enter-active,
.page-right-leave-active,
.page-left-enter-active,
.page-left-leave-active {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  transition: all @page-animation-time;
  backface-visibility: hidden;
}

.page-right-enter-active {
  animation: right-in @page-animation-time;
}

.page-right-leave-active {
  animation: left-out @page-animation-time;
}

.page-left-enter-active {
  animation: left-in @page-animation-time;
}

.page-left-leave-active {
  animation: right-out @page-animation-time;
}

@keyframes left-in {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0%, 0, 0);
  }
}

@keyframes left-out {
  from {
    opacity: 1;
    transform: translate3d(0%, 0, 0);
  }

  to {
    opacity: 0.4;
    transform: translate3d(100%, 0, 0);
  }
}

@keyframes right-in {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0%, 0, 0);
  }
}

@keyframes right-out {
  from {
    opacity: 1;
    transform: translate3d(0%, 0, 0);
  }

  to {
    opacity: 0.4;
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
