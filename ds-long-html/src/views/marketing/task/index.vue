<template>
  <basic-container>
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="每日任务" lazy name="first">
          <taskDay v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="兑换池" lazy name="second">
          <changePool v-if="activeName === 'second'" />
        </el-tab-pane>
        <el-tab-pane label="抽奖" lazy name="third">
          <award v-if="activeName === 'third'" />
        </el-tab-pane>
        <el-tab-pane label="积分日志" lazy name="points">
          <pointsLogs v-if="activeName === 'points'"></pointsLogs>
        </el-tab-pane>
        <el-tab-pane label="观影卡日志" lazy name="movieCard">
          <movieCardLogs v-if="activeName === 'movieCard'"></movieCardLogs>
        </el-tab-pane>
        <!-- <el-tab-pane label="金币获得日志" lazy name="gold">
          <goldDetailLogs v-if="activeName === 'gold'"></goldDetailLogs>
        </el-tab-pane> -->
        <el-tab-pane label="会员获得日志" lazy name="vipObtain">
          <vipObtainLogs v-if="activeName === 'vipObtain'"></vipObtainLogs>
        </el-tab-pane>
        <el-tab-pane label="新用户福利配置" lazy name="newUser">
          <newUser v-if="activeName === 'newUser'"></newUser>
        </el-tab-pane>
        <el-tab-pane label="任务中心配置" lazy name="tasksConfig">
          <tasksConfig v-if="activeName === 'tasksConfig'"></tasksConfig>
        </el-tab-pane>
        <el-tab-pane label="奖励累计超级会员上限" lazy name="svipUpperLimit">
          <svipUpperLimit
            v-if="activeName === 'svipUpperLimit'"
          ></svipUpperLimit>
        </el-tab-pane>
        <el-tab-pane
          label="奖励累计无限观看上限"
          lazy
          name="videoUnlimitedViewing"
        >
          <videoUnlimitedViewing
            v-if="activeName === 'videoUnlimitedViewing'"
          ></videoUnlimitedViewing>
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import taskDay from "./taskDay.vue";
import changePool from "./changePool.vue";
import award from "./award.vue";
import pointsLogs from "@/views/marketing/task/pointsLogs.vue";
import movieCardLogs from "@/views/marketing/task/movieCardLogs.vue";
// import goldDetailLogs from "@/views/marketing/task/goldDetailLogs.vue";
import vipObtainLogs from "@/views/marketing/task/vipObtainLogs.vue";
import svipUpperLimit from "@/views/common/videoSetingCofig/svipUpperLimits.vue";
import videoUnlimitedViewing from "@/views/common/videoSetingCofig/videoUnlimitedViewing.vue";
import newUser from "./newUser.vue";
import tasksConfig from "./tasksConfig.vue";
export default {
  components: {
    taskDay,
    changePool,
    award,
    pointsLogs,
    movieCardLogs,
    // goldDetailLogs,
    vipObtainLogs,
    newUser,
    tasksConfig,
    svipUpperLimit,
    videoUnlimitedViewing,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
