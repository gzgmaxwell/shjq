<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="推荐池" lazy name="first">
        <referralPool v-if="activeName == 'first'"></referralPool>
      </el-tab-pane>
      <el-tab-pane label="推荐等级设置" lazy name="second">
        <referralLevel v-if="activeName == 'second'"></referralLevel>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import referralPool from "@/views/content/referralPool/component/referralPool.vue";
import referralLevel from "@/views/content/referralPool/component/referralLevel.vue";
export default {
  components: {
    referralPool,
    referralLevel,
  },
  data() {
    return {
      activeName: "first",
    };
  },

  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
