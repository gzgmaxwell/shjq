<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="邀请好友域名配置" lazy name="first">
        <invite v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="交流群域名配置" lazy name="second">
        <exchange v-if="activeName == 'second'" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import invite from "./invite.vue";
import exchange from "./exchange.vue";
export default {
  components: {
    invite,
    exchange,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
