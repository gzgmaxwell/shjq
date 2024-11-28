<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="请输入评分">
      <el-input-number
        placeholder="请输入评分"
        :min="0"
        :precision="1"
        :step="0.5"
        :max="10"
        style="width: 65%"
        v-model="ruleForm.amountYuan"
      />
      <el-popover
        placement="top"
        trigger="hover"
        content="支持输入1-10分，支持一位小数点"
        class="ml5"
      >
        <span slot="reference" class="el-icon-question question"></span>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="row.callback(ruleForm)">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ruleForm: {
        amountYuan: 0,
      },
    };
  },
  mounted() {
    this.ruleForm.amountYuan = this.row.videoScore;
  },
};
</script>
