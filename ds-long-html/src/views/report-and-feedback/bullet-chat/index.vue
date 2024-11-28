<template>
  <basic-container>
    <keep-alive>
      <el-tabs v-model="activeName">
        <el-tab-pane label="弹幕举报" name="0">
          <report :queryType="queryType"></report>
        </el-tab-pane>
      </el-tabs>
    </keep-alive>
  </basic-container>
</template>

<script>
import report from "../components/report.vue";

export default {
  components: {
    report,
  },
  data() {
    return {
      activeName: "0",
      queryType: "BULLET",
    };
  },
  methods: {},
};
</script>
