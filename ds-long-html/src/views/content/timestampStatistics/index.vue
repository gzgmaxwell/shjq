<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="视频统计"
          lazy
          name="first"
          v-if="permissions.sys_video_statistics"
        >
          <videoStatistics v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane
          label="会员统计"
          lazy
          name="second"
          v-if="permissions.sys_vip_statistics"
        >
          <vipStatistics v-if="activeName === 'second'" />
        </el-tab-pane>
        <el-tab-pane
          label="时间戳统计"
          lazy
          name="third"
          v-if="permissions.sys_timestamp_statistics"
        >
          <timestampStatistics v-if="activeName === 'third'" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import videoStatistics from "./components/videoStatistics.vue";
import vipStatistics from "./components/vipStatistics.vue";
import timestampStatistics from "./components/timestampStatistics.vue";
export default {
  components: { videoStatistics, vipStatistics, timestampStatistics },
  data() {
    return {
      activeName: "first",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
};
</script>
