<template>
  <div class="flex h-full w-full flex-col fixed">
    <div class="flex-shrink-0">
      <!-- top 部分 -->
      <slot name="top"></slot>
    </div>

    <div class="h-full overflow-y-scroll">
      <!-- cotent 部分 -->
      <slot></slot>
    </div>

    <div class="flex-shrink-0">
      <!-- bottom 部分 -->
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
