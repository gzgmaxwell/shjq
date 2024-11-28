<template>
  <base-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="ANDROID" name="first">
        <androidtab tab="ANDROID" v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="IOS" name="second">
        <iostab tab="IOS" v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
  </base-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import androidtab from "./androidtab.vue";
import iostab from "./iostab.vue";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<style lang="scss">
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>
