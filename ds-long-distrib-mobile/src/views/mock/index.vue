<template>
  <div class="mock">
    <van-row justify="center">
      <van-col span="7">
        <van-button
          size="mini"
          type="primary"
          @click="fetchData"
          >mock 数据</van-button
        >
      </van-col>
    </van-row>

    <div class="mock__main">
      {{ users.length ? JSON.stringify(users) : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const users = ref([])

const fetchData = () => {
  axios.get('/api/user').then(res => {
    users.value = res.data.data
  })
}
</script>

<style lang="less" scoped>
.mock {
  &__main {
    text-align: center;
    line-height: 40px;
  }
}
</style>
<route lang="yaml">
name: mock
meta:
  requiresAuth: true
</route>
