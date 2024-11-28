<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import { ElConfigProvider } from "element-plus";
import { useAppStore } from "@/store/modules/app";
import googleAuth from "@/components/GoogleAuth/index.vue";
import { useUserStore } from "@/store/modules/user";
import { useRoute } from "vue-router";
const route = useRoute();

const userStore = useUserStore();
const appStore = useAppStore();

const visible = ref(false);
const row = {
  username: "",
  callback: (data: any) => {
    if (!data) {
      userStore.logout().then(() => {
        router.push({ path: "/login" });
      });
    }
    if (data) {
      visible.value = false;
    }
  },
};
onMounted(() => {});
watch(
  () => route,
  (val) => {
    if (val.path !== "/login") {
      const { userInfo } = userStore;
      const username = userInfo.user_info.username;
      row.username = username;
      userStore
        .actionGetBingStatus({
          username: username,
        })
        .then((res: any) => {
          res.data.data;
          if (res.data.data.googleAuthenticatorStatus && !res.data.data.bindStatus) {
            visible.value = true;
          }
        });
    }
  },
  { deep: true }
);
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
    <el-dialog title="谷歌验证器绑定" v-model="visible" width="50%" :show-close="false" :close-on-click-modal="false">
      <googleAuth :row="row" v-if="visible" />
    </el-dialog>
  </el-config-provider>
</template>
