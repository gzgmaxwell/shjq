<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item :label="$t('menu_name')" prop="goodName" v-if="!ruleForm.id">
      <el-input
        :placeholder="$t('menu_name')"
        style="width: 30%"
        v-model="ruleForm.goodName"
        clearable
      />
    </el-form-item>
    <el-form-item
      :label="$t('member_validity_period')"
      prop="lastTime"
      v-if="computeMenuTypeShow(ruleForm.goodType)"
    >
      <el-input-number
        :placeholder="$t('member_validity_period_day')"
        style="width: 30%"
        v-model="ruleForm.lastTime"
        :min="1"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('fact_price')" prop="discountPriceYuan">
      <el-input-number
        :placeholder="$t('fact_price')"
        v-model="ruleForm.discountPriceYuan"
        style="width: 30%"
      />
    </el-form-item>

    <el-form-item :label="$t('original_price')" prop="priceYuan">
      <el-input-number
        :placeholder="$t('original_price')"
        v-model="ruleForm.priceYuan"
        style="width: 30%"
      />
    </el-form-item>

    <el-form-item :label="$t('sort')" prop="sort">
      <el-input-number
        :placeholder="$t('sort')"
        style="width: 30%"
        v-model="ruleForm.sort"
        :max="999999"
        :step="1"
        :min="1"
        clearable
      />
    </el-form-item>

    <el-form-item label="是否活动" prop="hasActivity">
      <el-radio-group
        v-model="ruleForm.hasActivity"
        :disabled="ruleForm.id !== ''"
        @change="changeHasActivity"
      >
        <el-radio :label="false">无活动</el-radio>
        <el-radio :label="true">有活动</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择日期" prop="date" v-if="ruleForm.hasActivity">
      <el-date-picker
        :disabled="ruleForm.id !== ''"
        v-model="ruleForm.date"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        }"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('subscription_type')" prop="goodType">
      <el-radio-group v-model="ruleForm.goodType" @change="changeGoodType">
        <el-radio
          :disabled="ruleForm.id !== ''"
          :key="item.id"
          :label="item.id"
          v-for="item in optionSubscribe"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('single_account_purchase_restrictions')"
      prop="isBuyLimitEnabled"
      v-if="computeMenuTypeShow(ruleForm.goodType)"
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
      v-if="computeBuyLimitCount(ruleForm.goodType, ruleForm.isBuyLimitEnabled)"
    >
      <el-input-number
        :placeholder="$t('number_purchases')"
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
import { verificationTime } from "@/util/validate.js";
import { userVipSave, userVipUpdateOrDel } from "@/api/business-manage/index";
import {
  optionBuyLimit,
  EnumBuyLimit,
  optionSubscribe,
  EnumSubscribe,
} from "@/util/util";

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
        goodName: "",
        lastTime: undefined,
        priceYuan: undefined,
        discountPriceYuan: undefined,
        sort: 0,
        isBuyLimitEnabled: "",
        buyLimitCount: "",
        goodType: EnumSubscribe.year,
        vipType: this.row.vipLevel === "VIP" ? "OPEN_VIP" : "OPEN_SVIP",
        hasActivity: true,
        date: [],
      },
      options: [],
      optionBuyLimit: optionBuyLimit,
      optionSubscribe: optionSubscribe,
      assets: [],
      rules: {
        goodName: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("menu_name")}`,
            trigger: "blur",
          },
          {
            min: 2,
            max: 6,
            message: this.$t("rules_menu_name"),
            trigger: "blur",
          },
        ],
        lastTime: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t(
              "member_validity_period"
            )}`,
            trigger: "blur",
          },
        ],
        priceYuan: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("fact_price")}`,
            trigger: "blur",
          },
        ],
        discountPriceYuan: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("original_price")}`,
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("sort")}`,
            trigger: "change",
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
            message: "请选择请输入限制次数",
            trigger: "change",
          },
        ],
        goodType: [
          {
            required: true,
            message: "请选择连订阅类型",
            trigger: "change",
          },
        ],
        hasActivity: [
          {
            required: true,
            message: "请选择连活动类型",
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
          },
          {
            validator: verificationTime,
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    computeMenuTypeShow() {
      return (goodType) => {
        return goodType === EnumSubscribe.noSubscribe;
      };
    },
    computeBuyLimitCount() {
      return (goodType, isBuyLimitEnabled) => {
        if (
          goodType === EnumSubscribe.noSubscribe &&
          isBuyLimitEnabled === EnumBuyLimit.limit
        ) {
          return true;
        }
        return false;
      };
    },
    // pickerOptions() {
    //   const yesterday = new Date();
    //   yesterday.setDate(yesterday.getDate() - 1);
    //   const disabledDate = (time) => {
    //     return time.getTime() < yesterday.getTime();
    //   };
    //   return {
    //     disabledDate,
    //   };
    // },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.goodName = this.row.goodName;
      this.ruleForm.lastTime = this.row.lastTime;
      this.ruleForm.priceYuan = this.row.priceYuan;
      this.ruleForm.discountPriceYuan = this.row.discountPriceYuan;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.isBuyLimitEnabled = this.row.isBuyLimitEnabled;
      this.ruleForm.buyLimitCount = this.row.buyLimitCount;
      this.ruleForm.goodType = this.row.goodType;
      if (this.row.startTimeOfActivity) {
        this.ruleForm.date = [
          this.row.startTimeOfActivity,
          this.row.endTimeOfActivity,
        ];
      }
      this.ruleForm.hasActivity =
        this.row.activityStatus === "NORMAL" ? true : false;
    },
    changeGoodType(val) {
      if (val === EnumSubscribe.noSubscribe) {
        this.ruleForm.isBuyLimitEnabled = EnumBuyLimit.limit;
        this.ruleForm.buyLimitCount = "";
      } else {
        this.ruleForm.isBuyLimitEnabled = "";
        this.ruleForm.buyLimitCount = "";
        this.ruleForm.lastTime = "";
      }
    },
    changeIsBuyLimitEnabled(val) {
      if (val === EnumBuyLimit.noLimit) {
        this.ruleForm.buyLimitCount = "";
      }
    },
    changeHasActivity() {
      this.ruleForm.date = [];
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
        startTimeOfActivity: this.ruleForm.date[0],
        endTimeOfActivity: this.ruleForm.date[1],
      };
      if (!this.ruleForm.id) {
        userVipSave(params).then(() => {
          this.row.callback(true);
          this.$message.success("新增成功");
        });
      } else {
        userVipUpdateOrDel(params).then(() => {
          this.row.callback(true);
          this.$message.success("编辑成功");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
