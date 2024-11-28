<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="广告管理" lazy name="first">
          <advertiseList />
        </el-tab-pane>
        <el-tab-pane label="广告位管理" lazy name="second">
          <advertisePos />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import advertiseList from "./component/advertiseList.vue";
import advertisePos from "./component/advertisePos.vue";
export default {
  components: {
    advertiseList,
    advertisePos,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped></style>
