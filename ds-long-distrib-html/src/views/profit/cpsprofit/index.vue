<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="我的创收" name="first">
        <mine v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="下级创收" name="second">
        <child v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import mine from "./tab/mine.vue";
import child from "./tab/child.vue";

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
