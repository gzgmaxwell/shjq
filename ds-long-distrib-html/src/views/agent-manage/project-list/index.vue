<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="项目统计" name="first">
        <projectstatistics v-if="activeName === 'first'" />
      </el-tab-pane>
      <!-- <el-tab-pane label="收益统计" name="second">
        <incomestatistics v-if="activeName === 'second'" />
      </el-tab-pane> -->
    </el-tabs>
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import projectstatistics from "./tab/projectstatistics.vue";
// import incomestatistics from "./tab/incomestatistics.vue";

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
