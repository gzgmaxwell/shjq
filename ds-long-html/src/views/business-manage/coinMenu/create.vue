<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item :label="$t('amount')" prop="amountYuan">
      <el-input-number
        :placeholder="$t('amount')"
        :min="1"
        :step="1"
        style="width: 30%"
        v-model="ruleForm.amountYuan"
      />
    </el-form-item>

    <el-form-item :label="$t('obtaining_gold_coins')" prop="goldAmountYuan">
      <el-input-number
        :placeholder="$t('obtaining_gold_coins')"
        :min="1"
        :step="1"
        style="width: 30%"
        v-model="ruleForm.goldAmountYuan"
      />
    </el-form-item>

    <el-form-item
      :label="$t('single_account_purchase_restrictions')"
      prop="isBuyLimitEnabled"
    >
      <el-radio-group
        v-model="ruleForm.isBuyLimitEnabled"
        @change="changeIsBuyLimitEnabled"
      >
        <el-radio
          :key="item.id"
          :label="item.id"
          v-for="item in optionBuyLimit"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('number_purchases')"
      prop="buyLimitCount"
      v-if="computeBuyLimitCount(ruleForm.isBuyLimitEnabled)"
    >
      <el-input-number
        :placeholder="$t('buyLimitCount')"
        style="width: 30%"
        v-model="ruleForm.buyLimitCount"
        :max="999999"
        :step="1"
        :min="0"
        clearable
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { amountExchangeRateSaveOrUpdate } from "@/api/business-manage/index";
import { optionBuyLimit, EnumBuyLimit } from "@/util/util";

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
        id: "",
        amountYuan: undefined,
        goldAmountYuan: undefined,
        isBuyLimitEnabled: EnumBuyLimit.limit,
        buyLimitCount: "",
      },
      optionBuyLimit: optionBuyLimit,
      rules: {
        amountYuan: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("amount")}`,
            trigger: "blur",
          },
        ],
        goldAmountYuan: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t(
              "obtaining_gold_coins"
            )}`,
            trigger: "blur",
          },
        ],
        isBuyLimitEnabled: [
          {
            required: true,
            message: `${this.$t("please_select")} ${this.$t(
              "single_account_purchase_restrictions"
            )}`,
            trigger: "change",
          },
        ],
        buyLimitCount: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t(
              "number_purchases"
            )}`,
            trigger: "change",
          },
        ],
      },
    };
  },

  computed: {
    computeBuyLimitCount() {
      return (isBuyLimitEnabled) => {
        return isBuyLimitEnabled === EnumBuyLimit.limit;
      };
    },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.amountYuan = this.row.amountYuan;
      this.ruleForm.goldAmountYuan = this.row.goldAmountYuan;
      this.ruleForm.isBuyLimitEnabled = this.row.isBuyLimitEnabled;
      this.ruleForm.buyLimitCount = this.row.buyLimitCount;
    },

    changeIsBuyLimitEnabled(val) {
      if (val === EnumBuyLimit.noLimit) {
        this.ruleForm.buyLimitCount = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
      };
      amountExchangeRateSaveOrUpdate(params).then((res) => {
        const { data } = res;
        if (data.code === 200) {
          this.$message.success(
            this.ruleForm.id
              ? this.$t("successfully_added")
              : this.$t("successfully_added")
          );
        }
        this.row.callback(true);
      });
    },
  },
};
</script>
