<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="代理申请表" lazy name="first">
        <agentAppli v-if="activeName == 'first'"></agentAppli>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import agentAppli from "./components/agentAppli.vue";
export default {
  components: {
    agentAppli,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
