<script setup lang="ts" name="WithdrawIndex">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="container">
    <p class="tip">您的提现方式为周结，可提现金额为周数据如要修改请联系渠道商</p>
    <p class="tipIncome">为了您的权益，请及时根据您的结算方式按时提现</p>
    <div class="statistics">
      <p>累计获得佣金：<span>3672.13</span></p>
      <p>累计提现金额：<span>3672.13</span></p>
      <p>可提现余额：<span>3672.13</span></p>
    </div>
    <div class="btn">
      <van-button
        type="primary"
        @click="router.push('/withdrawApplication')"
        >去提现</van-button
      >
    </div>
  </div>
</template>

<style lang="less">
.container {
  .tip {
    text-align: center;
    font-size: 12px;
    margin-top: 20px;
  }
  .tipIncome {
    margin-top: 20px;
    color: #d9001b;
    text-align: center;
  }
  .statistics {
    margin-top: 20px;
    p {
      text-align: center;
      span {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  .btn {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<route lang="yaml">
name: withdrawIndex
meta:
  requiresAuth: true
</route>
