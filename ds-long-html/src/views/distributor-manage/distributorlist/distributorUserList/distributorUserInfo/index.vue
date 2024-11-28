<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础信息" lazy name="first">
        <basicsInfo></basicsInfo>
      </el-tab-pane>

      <el-tab-pane lazy name="second">
        <span slot="label">作品信息({{ worksTotal }})</span>
        <worksInfo @getTotal="getTotal"></worksInfo>
      </el-tab-pane>

      <el-tab-pane label="金币明细" lazy name="third">
        <goldDetail></goldDetail>
      </el-tab-pane>

      <el-tab-pane label="订单详情" lazy name="fourth">
        <orderDetails></orderDetails>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import basicsInfo from "@/views/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/components/basicsInfo.vue";
import worksInfo from "@/views/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/components/worksInfo.vue";
import goldDetail from "@/views/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/components/goldDetail.vue";
import orderDetails from "@/views/distributor-manage/distributorlist/distributorUserList/distributorUserInfo/components/orderDetails.vue";
export default {
  components: {
    basicsInfo,
    worksInfo,
    goldDetail,
    orderDetails,
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
  },
};
</script>

<style lang="scss" scoped>
.el-card.is-always-shadow {
  margin: 10px;
}
::v-deep .el-tabs__header {
  margin: 0;
}
.backClass {
  margin: 10px;
}
</style>
