<template>
  <div class="mt10">
    <basic-container>
      <div class="backBtn">
        <div class="backClass">
          <el-button type="primary" @click="goback">返 回</el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" lazy name="first">
            <basicsInfo v-if="activeName === 'first'"></basicsInfo>
          </el-tab-pane>
          <el-tab-pane lazy name="second">
            <span slot="label">作品信息({{ worksTotal }})</span>
            <worksInfo
              @getTotal="getTotal"
              v-if="activeName === 'second'"
            ></worksInfo>
          </el-tab-pane>

          <el-tab-pane label="金币明细" lazy name="trird">
            <goldDetail v-if="activeName === 'trird'"></goldDetail>
          </el-tab-pane>
          <el-tab-pane label="积分明细" lazy name="points">
            <points v-if="activeName === 'points'"></points>
          </el-tab-pane>
          <el-tab-pane label="观影卡明细" lazy name="movieCard">
            <movieCard v-if="activeName === 'movieCard'"></movieCard>
          </el-tab-pane>
          <el-tab-pane label="会员获得明细" lazy name="vipObtain">
            <vipObtain v-if="activeName === 'vipObtain'"></vipObtain>
          </el-tab-pane>

          <el-tab-pane label="订单详情" lazy name="fourth">
            <orderDetails></orderDetails>
          </el-tab-pane>
          <el-tab-pane label="代理信息" lazy name="five">
            <proxyInfo></proxyInfo>
          </el-tab-pane>
          <el-tab-pane label="用户层级关系" lazy name="six">
            <userHierarchy></userHierarchy>
          </el-tab-pane>
          <el-tab-pane label="粉丝数据" lazy name="seven">
            <fansData></fansData>
          </el-tab-pane>
        </el-tabs>
      </div>
    </basic-container>
  </div>
</template>

<script>
import basicsInfo from "@/views/user/details/basicsInfo.vue";
import worksInfo from "@/views/user/details/worksInfo.vue";
import goldDetail from "@/views/user/details/goldDetail.vue";
import orderDetails from "@/views/user/details/orderDetails.vue";
import proxyInfo from "@/views/user/details/proxyInfo.vue";
import points from "@/views/user/details/points.vue";
import movieCard from "@/views/user/details/movieCard.vue";
import vipObtain from "@/views/user/details/vipObtain.vue";
import userHierarchy from "@/views/user/details/userHierarchy.vue";
import fansData from "@/views/user/details/fansData.vue";
// import orderDetails from "@/views/user/details/orderDetails.vue";
export default {
  components: {
    basicsInfo,
    worksInfo,
    goldDetail,
    orderDetails,
    points,
    movieCard,
    vipObtain,
    proxyInfo,
    userHierarchy,
    fansData,
  },
  data() {
    return {
      activeName: "first",
      worksTotal: "",
    };
  },
  mounted() {
    this.getTotal();
  },
  methods: {
    getTotal(val) {
      this.worksTotal = val || 0;
    },
    goback() {
      // this.$router.push("/user/userList/index");
      this.$router.go(-1);
    },
  },
};
</script>
