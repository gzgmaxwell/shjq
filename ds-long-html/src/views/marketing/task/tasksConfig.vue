<template>
  <div class="mt20" style="width: 50%">
    <div style="display: flex; justify-content: space-between">
      <div>每日任务自动领取</div>
      <el-switch v-model="taskAutoReceive" @input="tasksChange"> </el-switch>
    </div>
    <el-divider></el-divider>
    <div style="display: flex; justify-content: space-between">
      <div>每日签到自动签到</div>
      <el-switch v-model="signAutoReceive" @input="signInChange"> </el-switch>
    </div>
  </div>
</template>

<script>
import { autoReceiveDetail, autoReceiveSetting } from "@/api/marketing/index";

export default {
  name: "tasksConfig",
  data() {
    return {
      taskAutoReceive: true,
      signAutoReceive: true,
    };
  },

  mounted() {
    autoReceiveDetail().then((res) => {
      this.taskAutoReceive = res.data.data.taskAutoReceive;
      this.signAutoReceive = res.data.data.signAutoReceive;
    });
  },

  methods: {
    tasksChange(val) {
      this.taskAutoReceive = val;
      const params = {
        taskAutoReceive: val,
        signAutoReceive: this.signAutoReceive,
      };
      autoReceiveSetting(params).then(() => {
        this.$message.success("操作成功");
      });
    },
    signInChange(val) {
      this.signAutoReceive = val;
      const params = {
        signAutoReceive: val,
        taskAutoReceive: this.taskAutoReceive,
      };
      autoReceiveSetting(params).then(() => {
        this.$message.success("操作成功");
      });
    },
  },
};
</script>
