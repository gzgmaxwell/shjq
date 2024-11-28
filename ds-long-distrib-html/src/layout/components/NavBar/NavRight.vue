<template>
  <!-- 导航栏设置(窄屏隐藏)-->
  <div v-if="device !== 'mobile'" class="setting-container">
    <!--全屏 -->
    <div class="setting-item" @click="toggle">
      <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" />
    </div>
    <!-- 布局大小 -->
    <el-tooltip content="布局大小" effect="dark" placement="bottom">
      <size-select class="setting-item" />
    </el-tooltip>
    <!-- 布局大小 -->
    <el-tooltip content="提现通知" effect="dark" placement="bottom">
      <info-notice class="setting-item" />
    </el-tooltip>
    <!--语言选择-->
    <lang-select class="setting-item" />
  </div>

  <!-- 用户头像 -->
  <el-dropdown trigger="click">
    <div class="avatar-container">
      <p>{{ getUserName() }}</p>
      <i-ep-caret-bottom class="w-3 h-3" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item @click="editPasswordFn"> 修改密码 </el-dropdown-item>
        <el-dropdown-item @click="logout"> 退出系统 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dialog v-model="editVisible" title="修改密码" width="35%">
    <editPassword v-if="editVisible" :row="row" />
  </el-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useUserStore } from "@/store/modules/user";
import { useFullscreen } from "@vueuse/core";
import { getUserName } from "@/utils/index";

import editPassword from "./editPassword.vue";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const { device } = storeToRefs(appStore); // 设备类型：desktop-宽屏设备 || mobile-窄屏设备

let row = reactive({});
const editVisible = ref(false);

/**
 * vueUse 全屏
 */
const { isFullscreen, toggle } = useFullscreen();
const editPasswordFn = () => {
  editVisible.value = true;
  row = {
    callback: () => {
      editVisible.value = false;
    },
  };
};

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm("确定退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>
<style lang="scss" scoped>
.setting-container {
  display: flex;
  align-items: center;

  .setting-item {
    display: inline-block;
    width: 30px;
    height: 50px;
    line-height: 50px;
    color: var(--el-text-color-regular);
    text-align: center;
    cursor: pointer;

    &:hover {
      background: var(--el-color-info-light-3);
    }
  }
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-items: center;
  margin: 0 5px;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
}
</style>
