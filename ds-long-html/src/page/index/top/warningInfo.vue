<template>
  <el-tooltip content="预警通知" effect="dark" placement="bottom">
    <div style="margin-right: 20px; cursor: pointer">
      <el-badge :value="messageCount > 0 ? messageCount : ''" :max="99">
        <i
          class="el-icon-bell"
          style="font-size: 24px; line-height: 0px"
          @click="goMessage"
        ></i>
      </el-badge>
    </div>
  </el-tooltip>
</template>
<script>
import { mapGetters } from "vuex";
import { unReadCount } from "@/api/admin/index";

export default {
  data() {
    return {
      messageCount: "",
      timer: null,
    };
  },
  mounted() {
    this.$store.dispatch("actionWarningInfo");
    this.$store.dispatch("actionWarningTime");
    if (this.permissions.sys_warningMsg_request) {
      this.timer = setInterval(() => {
        this.getMessageCount();
      }, 30000);
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getMessageCount() {
      unReadCount().then((res) => {
        this.messageCount = res.data.data;
      });
    },
    goMessage() {
      this.$store.dispatch("actionWarningInfo");
      this.$store.dispatch("actionWarningTime");
      this.messageCount = "";
      this.$router.push("/nationalagent/warningNotice/index");
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
<style lang="scss" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
::v-deep .el-badge__content.is-fixed {
  top: 3px;
  right: 10px;
}
::v-deep .el-badge__content {
  height: 16px;
  line-height: 16px;
}
</style>
