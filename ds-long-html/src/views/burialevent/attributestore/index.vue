<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础属性" name="first">
          <baseList v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="自有属性" name="second">
          <selfList v-if="activeName === 'second'" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import baseList from "./tab/baseList.vue";
import selfList from "./tab/selfList.vue";
export default {
  components: {
    baseList,
    selfList,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
