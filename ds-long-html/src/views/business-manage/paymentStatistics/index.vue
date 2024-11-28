<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="跳转购买会员统计" lazy name="first">
        <buyMember v-if="activeName == 'first'"></buyMember>
      </el-tab-pane>
      <el-tab-pane label="付费视频统计" lazy name="second">
        <paymentVideo v-if="activeName == 'second'"></paymentVideo>
      </el-tab-pane>
      <el-tab-pane label="观影卡消耗统计" lazy name="three">
        <watchCard v-if="activeName == 'three'" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import buyMember from "./components/buyMember.vue";
import paymentVideo from "./components/paymentVideo.vue";
import watchCard from "./components/watchCard.vue";
export default {
  components: {
    buyMember,
    paymentVideo,
    watchCard,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
