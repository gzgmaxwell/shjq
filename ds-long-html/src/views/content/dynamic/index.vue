<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频管理" lazy name="first">
        <videoManage v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="合集管理" lazy name="second">
        <collect v-if="activeName == 'second'" />
      </el-tab-pane>
      <!-- <el-tab-pane label="h265 easyPlayer test" lazy name="third">
        <easyPlayer v-if="activeName == 'third'" />
      </el-tab-pane>
      <el-tab-pane label="h265 dplayer test" lazy name="four">
        <dplayer v-if="activeName == 'four'" />
      </el-tab-pane> -->
    </el-tabs>
  </basic-container>
</template>

<script>
import videoManage from "@/views/content/dynamic/videoManage.vue";
import collect from "@/views/content/dynamic/collect.vue";
import easyPlayer from "@/views/content/dynamic/easyPlayer.vue";
import dplayer from "@/views/content/dynamic/dplayer.vue";
export default {
  components: {
    videoManage,
    collect,
    easyPlayer,
    dplayer,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
