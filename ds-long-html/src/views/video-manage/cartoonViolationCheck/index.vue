<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="已分配" lazy name="first">
          <comicDistributed v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="待分配" lazy name="second">
          <comicDistribute v-if="activeName === 'second'" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import comicDistributed from "./components/comicDistributed";
import comicDistribute from "./components/comicDistribute";
export default {
  components: {
    comicDistributed,
    comicDistribute,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
