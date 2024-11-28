<script setup lang="ts">
import { ElMessage } from "element-plus";
import router from "@/router";
import { ref, onMounted, reactive } from "vue";
import { extUserAccoGetByUserIds, extensionWithdrawOrderAdd } from "@/api/system";
import type { FormInstance, FormRules } from "element-plus";
import { getUserId } from "@/utils";
import { optionBank, optionPayTypeWay, EnumPayTypeWay } from "@/enums";

const loading = ref(false);
const withdrawType = ref("");
const active = ref(1);
const info: any = ref({});

interface RuleForm {
  collectionBank: string;
  collectionAccountName: string;
  collectionAccount: string;
}

const ruleFormRefAndy = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  collectionBank: "",
  collectionAccountName: "",
  collectionAccount: "",
});

const rules = reactive<FormRules<RuleForm>>({
  collectionBank: [
    {
      required: true,
      message: "请选择银行",
      trigger: "change",
    },
  ],
  collectionAccount: [{ required: true, message: "请输入银行卡号", trigger: "blur" }],
  collectionAccountName: [{ required: true, message: "请输入开户姓名", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      active.value = 2;
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  withdrawType.value = "";
  formEl.resetFields();
};
const getList = () => {
  const params = [getUserId()];
  extUserAccoGetByUserIds(params)
    .then((res) => {
      const { data } = res;
      if (data.data.length) {
        info.value = data.data[0];
      }
    })
    .catch(() => {
      loading.value = false;
    });
};
const sureBtn = () => {
  const params = {
    busUserId: getUserId(),
    collectionAccount: ruleForm.collectionAccount,
    collectionAccountName: ruleForm.collectionAccountName,
    collectionBank: ruleForm.collectionBank,
    withdrawMoney: info.value.balance,
    withdrawType: withdrawType.value,
  };
  extensionWithdrawOrderAdd(params)
    .then((res) => {
      const { data } = res;
      if (data.code === 200) {
        ElMessage.success("提交成功");
        active.value = 3;
      }
    })
    .catch(() => {
      loading.value = false;
    });
};
const goBack = () => {
  active.value = 1;
};

const goOnWithdraw = () => {
  getList();
  active.value = 1;
};

const checkWithdrawOrder = () => {
  router.push({ path: "/agent-manage/individual-account/withdraw-order/index" });
};
const computedAccount = computed(() => {
  const item: any = optionPayTypeWay.find((v) => v.id === withdrawType.value) || {};
  rules.collectionAccount;
  if (EnumPayTypeWay.wxpay === withdrawType.value) {
    rules.collectionAccount = [{ required: true, message: "请输入微信账号", trigger: "blur" }];
  } else if (EnumPayTypeWay.alipay === withdrawType.value) {
    rules.collectionAccount = [{ required: true, message: "请输入支付宝账号", trigger: "blur" }];
  } else if (EnumPayTypeWay.bankPay === withdrawType.value) {
    rules.collectionAccount = [{ required: true, message: "请输入银行卡号", trigger: "blur" }];
  }
  return item.label;
});

onMounted(() => {
  getList();
});
// const compuClearingPeriodType = () =>
//   computed(() => {
//     const item: any = optionWithdraw.find((v) => v.id === info.value.clearingPeriodType) || {};
//     if (item.name) {
//       return item.name;
//     } else {
//       return "--";
//     }
//   });
</script>

<template>
  <base-card>
    <div class="container">
      <p class="font14 tip">
        你好！
        <!-- 您当前的结算周期为{{ compuClearingPeriodType() }}，显示数据为{{ compuClearingPeriodType() }}
        数据，如要修改请联系我们 -->
      </p>
      <p class="font14 mt3 money">
        发起提现后，将在<span class="tip"> 9个自然日</span> 后完成交易；历史总佣金：{{
          Number(info?.withdrawedMoney || 0) + Number(info?.balance || 0)
        }}，已提现金额：{{ info?.withdrawedMoney }}，可提现金额：{{ info?.balance }}
      </p>
      <!-- <p class="mt3 money">
        注：提现将按您的结算方式进行提现，如：当前为日结，那么次日即可操作提现并且当日只能提交一次提现
      </p> -->

      <div class="mt5">
        <span class="withdrawway">选择提现方式:</span>
        <el-select class="ml10" v-model="withdrawType" placeholder="选择提现方式" :disabled="!info?.balance">
          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in optionPayTypeWay" />
        </el-select>
      </div>
      <div class="mt20" v-if="withdrawType">
        <el-steps :active="active" align-center>
          <el-step title="填写信息" />
          <el-step title="确认信息" />
          <el-step title="提交成功" />
        </el-steps>
        <el-form
          ref="ruleFormRefAndy"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm mt20"
          size="default"
        >
          <div v-if="active === 1">
            <el-form-item label="选择银行" prop="collectionBank" v-if="withdrawType === EnumPayTypeWay.bankPay">
              <el-select v-model="ruleForm.collectionBank" placeholder="请选择选择银行" style="width: 300px">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in optionBank" />
              </el-select>
            </el-form-item>
            <el-form-item :label="computedAccount" prop="collectionAccount">
              <el-input
                v-model="ruleForm.collectionAccount"
                style="width: 300px"
                :placeholder="`请输入${computedAccount}`"
              />
            </el-form-item>
            <el-form-item label="开户姓名" prop="collectionAccountName">
              <el-input v-model="ruleForm.collectionAccountName" placeholder="请输入开户姓名" style="width: 300px" />
            </el-form-item>

            <el-form-item label="提现金额：">
              <span>￥ 可提现 {{ info?.balance }}</span>
            </el-form-item>
            <el-form-item label="提现金额：">
              <span>预计2小时内到账（免费）；提现金额每次最高值5万元，每日限3次，每日累计最高15万元</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRefAndy)"> 下一步 </el-button>
              <el-button @click="resetForm(ruleFormRefAndy)">重 置</el-button>
            </el-form-item>
          </div>
          <div v-if="active === 2">
            <el-form-item label="开户姓名">
              <span>{{ ruleForm.collectionAccountName }}</span>
            </el-form-item>
            <el-form-item label="银行卡号">
              <span>{{ ruleForm.collectionAccount }}</span>
            </el-form-item>

            <el-form-item label="提现金额：">
              <span>{{ info?.balance }}</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="sureBtn()"> 确认 </el-button>
              <el-button @click="goBack()">返回上一步</el-button>
            </el-form-item>
          </div>
          <div v-if="active === 3">
            <div class="thridBox">
              <span @click="goOnWithdraw" class="activeBule">继续提现</span
              ><span @click="checkWithdrawOrder" class="ml5 activeBule">查看提现记录</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </base-card>
</template>
<style lang="scss" scoped>
.container {
  .tip {
    font-weight: 700;
    color: #d9001b;
  }

  .money {
    font-weight: 700;
  }

  .withdrawway {
    font-size: 14px;
    font-weight: 600;
  }

  .thridBox {
    display: flex;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
