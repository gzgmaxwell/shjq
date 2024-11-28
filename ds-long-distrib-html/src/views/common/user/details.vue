<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基础信息" name="first">
        <baseinfo v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="作品信息" name="second">
        <workinfo v-if="activeName == 'second'" />
      </el-tab-pane>
      <el-tab-pane label="金币信息" name="third">
        <goldinfo v-if="activeName == 'third'" />
      </el-tab-pane>
      <el-tab-pane label="订单详情" name="four">
        <orderinfo v-if="activeName == 'four'" />
      </el-tab-pane>
    </el-tabs>
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import baseinfo from "./tab/baseinfo.vue";
import workinfo from "./tab/workinfo.vue";
import goldinfo from "./tab/goldinfo.vue";
import orderinfo from "./tab/orderinfo.vue";

const activeName = ref("first");
</script>
<style lang="scss" scoped>
.demo-tabs {
  .el-tabs__content {
    padding: 32px;
    font-size: 32px;
    font-weight: 600;
    color: #6b778c;
  }
}
</style>
