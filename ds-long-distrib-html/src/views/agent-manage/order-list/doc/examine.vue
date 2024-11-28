<template>
  <el-form label-width="200px" class="demo-ruleForm" size="default">
    <el-form-item label="当前结算共可提现金额：">
      <span>{{ props.row.withdrawMoney }}</span>
    </el-form-item>
    <el-form-item label="代理结算方式：">
      <span>{{ clearingPeriodType }}</span>
    </el-form-item>
    <el-form-item label="代理账号：">
      <span>{{ props.row.userName }}</span>
    </el-form-item>
    <el-form-item label="代理姓名：">
      <span>{{ props.row.realName }}</span>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="passBtn"> 通过 </el-button>
      <el-button type="primary" @click="rejectBtn"> 不同意 </el-button>
      <el-button @click="props.row.callback()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { optionWithdraw } from "@/enums";
import { extensionWithdrawOrderAudit } from "@/api/system";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

const clearingPeriodType = computed(() => {
  const item: any = optionWithdraw.find((v) => v.id === props.row.clearingPeriodType) || {};
  return item.name;
});

const handleAudit = (isPass: any, value?: any) => {
  const params = {
    description: value,
    id: props.row.id,
    isPass: isPass,
  };
  extensionWithdrawOrderAudit(params).then(() => {
    ElMessage.success("操作成功");
    props.row.callback(true);
  });
};
const passBtn = () => {
  handleAudit(true);
};

const rejectBtn = () => {
  ElMessageBox.prompt("不同意原因", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{1,20}$/,
    inputErrorMessage: "请输入不同意原因(1-20 字符)",
  })
    .then(({ value }) => {
      handleAudit(false, value);
    })
    .catch(() => {
      ElMessage.info("Input canceled");
    });
};
</script>
