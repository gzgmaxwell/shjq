<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="供应商" lazy name="first">
          <tabs
            v-if="activeName === 'first'"
            :webPageMenu="menuEnum.BK_VIDEO_LIST"
          />
        </el-tab-pane>
        <el-tab-pane label="三方" lazy name="second">
          <tabs
            v-if="activeName === 'second'"
            :webPageMenu="menuEnum.triateralVideoList"
          />
        </el-tab-pane>
        <el-tab-pane label="用户" lazy name="third">
          <tabs
            v-if="activeName === 'third'"
            :webPageMenu="menuEnum.consumerVideoList"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { menuEnum } from "@/util/util";
import tabs from "@/views/video-manage/dissentingPool/tabs.vue";
export default {
  components: {
    tabs,
  },
  data() {
    return {
      activeName: "first",
      menuEnum: menuEnum,
    };
  },
};
</script>
