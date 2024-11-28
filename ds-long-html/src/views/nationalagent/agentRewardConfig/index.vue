<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="邀请人奖励" lazy name="first">
        <inviterReward v-if="activeName == 'first'"></inviterReward>
      </el-tab-pane>
      <el-tab-pane label="被邀请人奖励" lazy name="second">
        <beInviterReward v-if="activeName == 'second'"></beInviterReward>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import inviterReward from "./components/inviterReward.vue";
import beInviterReward from "./components/beInviterReward.vue";
export default {
  components: {
    inviterReward,
    beInviterReward,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
