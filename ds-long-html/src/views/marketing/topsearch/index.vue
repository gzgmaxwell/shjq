<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="热门话题" name="first" lazy>
        <hottopic />
      </el-tab-pane>
      <el-tab-pane label="热搜" name="second" lazy>
        <hotsearch />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import hottopic from "./component/hottopic.vue";
import hotsearch from "./component/hotsearch.vue";
export default {
  components: {
    hottopic,
    hotsearch,
  },

  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped></style>
