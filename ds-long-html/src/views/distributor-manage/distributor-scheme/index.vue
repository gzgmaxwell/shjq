<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('cps_programme')" lazy name="first">
        <cps v-if="activeName === 'first'" :key="'first'"></cps>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('cpa_programme')" lazy name="second">
        <cpa v-if="activeName === 'second'" :key="'second'"></cpa>
      </el-tab-pane> -->
      <!-- 3.4日需求变动  移植到营销中心 -->
      <!-- <el-tab-pane label="C端方案" lazy name="third">
        <appScheme v-if="activeName === 'third'" :key="'third'"></appScheme>
      </el-tab-pane> -->
    </el-tabs>
  </basic-container>
</template>

<script>
import cps from "@/views/distributor-manage/distributor-scheme/components/cps.vue";
// import cpa from "@/views/distributor-manage/distributor-scheme/components/cpa.vue";
// import appScheme from "@/views/distributor-manage/distributor-scheme/components/appScheme.vue";
export default {
  components: {
    cps,
    // cpa,
    // appScheme,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
}
</style>
