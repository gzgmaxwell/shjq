<template>
  <div class="virtual">
    <VirtualList :data="dataSource">
      <template #default="{ item, index }">
        <div class="virtual__box">
          <div class="virtual__box__cell virtual__box__index">
            {{ index + 1 }}
          </div>
          <div class="virtual__box__cell">{{ item.name }}</div>
          <div class="virtual__box__cell">{{ item.email }}</div>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts" setup>
import { VirtualList } from 'vue3-virtual-list'

const dataSource = Array.from({ length: 10000 }, (v, i) => ({
  index: i,
  name: i,
  email: i
}))
</script>

<style scoped lang="less">
.virtual {
  width: 100%;
  height: 600px;
  border: 2px solid #4caf50;
  margin: 0 auto;
  &__box {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #ccc;
    &__cell {
      margin: 0 8px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
    }
    &__cell-index {
      flex: none;
      min-width: 100px;
    }
  }
}
</style>
