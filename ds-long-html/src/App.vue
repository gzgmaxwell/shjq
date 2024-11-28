<template>
  <div id="app">
    <router-view />
    <el-dialog
      title="谷歌验证器绑定"
      :visible.sync="visible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <googleAuth :row="row" v-if="visible" />
    </el-dialog>
  </div>
</template>

<script>
import googleAuth from "@/components/google-auth/index.vue";
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {
    googleAuth,
  },
  data() {
    return {
      visible: false,
      row: {
        callback: (data) => {
          if (!data) {
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push({ path: "/login" });
            });
          }
          if (data) {
            this.visible = false;
          }
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path !== "/login") {
          this.$store
            .dispatch("actionGetBingStatus", {
              username: this.userInfo.username,
            })
            .then((res) => {
              if (
                res.data.data.googleAuthenticatorStatus &&
                !res.data.data.bindStatus
              ) {
                this.visible = true;
              }
            });
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
