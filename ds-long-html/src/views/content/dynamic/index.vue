<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频管理" lazy name="first">
        <videoManage v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="合集管理" lazy name="second">
        <collect v-if="activeName == 'second'" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import videoManage from "@/views/content/dynamic/videoManage.vue";
import collect from "@/views/content/dynamic/collect.vue";
export default {
  components: {
    videoManage,
    collect,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
