<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="cps方案" name="first">
        <cps />
      </el-tab-pane>
      <el-tab-pane label="cpa方案" name="second">
        <cpa />
      </el-tab-pane>
    </el-tabs>
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import cps from "./tab/cps.vue";
import cpa from "./tab/cpa.vue";
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
