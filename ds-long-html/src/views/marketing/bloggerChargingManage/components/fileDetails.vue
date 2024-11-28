<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12" class="clm">姓名: {{ dataObj.userName }}</el-col>
      <el-col :span="12" class="clm">姓别: {{ cmpGender }}</el-col>
      <el-col :span="12" class="clm">联系方式: {{ dataObj.mobile }}</el-col>
      <el-col :span="12" class="clm"
        >分成占比: {{ dataObj.commissionRatio }}%</el-col
      >
      <el-col :span="12" class="clm"
        >充电人数: {{ dataObj.chargeUserCount }}</el-col
      >
      <el-col :span="12" class="clm"
        >充电量: {{ dataObj.chargeMoneyCount }}$</el-col
      >
      <el-col :span="12" class="clm">作品量: {{ dataObj.videoCount }}</el-col>
      <el-col :span="12" class="clm"
        >充电套餐一: {{ dataObj.packageOne }}$</el-col
      >
      <el-col :span="12" class="clm"
        >充电套餐二: {{ dataObj.packageTwo }}$</el-col
      >
      <el-col :span="12" class="clm"
        >充电套餐三: {{ dataObj.packageThree }}$</el-col
      >
    </el-row>
  </div>
</template>

<script>
import { userGender } from "@/util/util";
import { chargeInfoDetail } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dataObj: {},
    };
  },
  computed: {
    cmpGender() {
      const genderObj = userGender.find(
        (item) => item.id === this.dataObj.gender
      );
      return genderObj?.name;
    },
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      chargeInfoDetail({ id: this.row.id }).then((res) => {
        if (res.data.code === 200) {
          this.dataObj = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.clm {
  margin: 10px 0;
}
</style>
