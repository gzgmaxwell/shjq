<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <!-- 1.31号需求隐藏 -->
    <!-- <el-form-item label="方案类型" prop="schemeType">
      <el-radio-group
        v-model="ruleForm.schemeType"
        @change="handleSchemeTypeChange"
      >
        <el-radio
          v-for="item in optionsSchemeType"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
    </el-form-item> -->
    <el-form-item :label="$t('scheme_name')" prop="schemeName">
      <el-input
        :placeholder="`${$t('please_enter')} ${$t('scheme_name')}`"
        style="width: 70%"
        v-model="ruleForm.schemeName"
        clearable
        maxlength="20"
        show-word-limit
      />
    </el-form-item>
    <!-- 1.31号需求隐藏 -->
    <!-- <el-form-item
      label="发行方分成"
      prop="gamePublishersRatio"
      v-if="ruleForm.schemeType === EnumSCHEMETYPE.game_cps"
    >
      <el-input
        :placeholder="$t('set_percentage_value')"
        style="width: 70%"
        v-model="ruleForm.gamePublishersRatio"
        clearable
      >
        <template slot="append">%</template>
      </el-input>
    </el-form-item> -->
    <!-- <el-form-item
      :label="$t('platform_division')"
      prop="platformRatio"
      v-if="ruleForm.schemeType === EnumSCHEMETYPE.game_cps"
    >
      <el-input
        :placeholder="$t('set_percentage_value')"
        style="width: 70%"
        v-model="ruleForm.platformRatio"
        clearable
      >
        <template slot="append">%</template>
      </el-input>
    </el-form-item> -->
    <el-form-item :label="$t('channel_merchant_sharing')" prop="distrRatio">
      <el-input
        :placeholder="$t('set_percentage_value')"
        style="width: 70%"
        v-model="ruleForm.distrRatio"
        clearable
      >
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <!-- <template v-if="ruleForm.schemeType === EnumSCHEMETYPE.cps">
      <el-form-item
        v-for="(domain, index) in ruleForm.commissionRatioSaveDTOList"
        :label="`${'c端'}${index + 1}${$t('level_commission')}`"
        :key="index"
      >
        <el-input v-model="domain.ratio" style="width: 70%">
          <template slot="append">%</template>
        </el-input>
        <i
          v-if="index > 2"
          class="el-icon-remove btn"
          @click.prevent="removeDomain(domain)"
        ></i>
        <i
          v-if="
            index >= 2 &&
            index === ruleForm.commissionRatioSaveDTOList.length - 1
          "
          class="el-icon-circle-plus btn"
          @click="addDomain"
        ></i>
      </el-form-item>
    </template> -->
    <!-- <el-form-item
      style="color: red"
      v-if="ruleForm.schemeType === EnumSCHEMETYPE.cps"
    >
      <label slot="label" style="color: red">{{ $t("illustrate") }}:</label>
      <span style="display: inline-block; width: 72%; line-height: 30px"
        >1~5级佣金将用于渠道名下的c端用户佣金分成</span
      >
    </el-form-item> -->
    <el-form-item>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  optionsSchemeType,
  EnumSCHEMETYPE,
  debounceCallBack,
} from "@/util/util";
import { mapGetters } from "vuex";
import { saveClearingScheme, updateClearingScheme } from "@/api/admin/index";
import upload from "@/components/upload";
// const init = [
//   {
//     level: 1,
//     ratio: "",
//     index: 0,
//   },
//   {
//     level: 2,
//     ratio: "",
//     index: 1,
//   },
//   {
//     level: 3,
//     ratio: "",
//     index: 2,
//   },
// ];
export default {
  components: {
    upload,
  },
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
      EnumSCHEMETYPE: EnumSCHEMETYPE,
      optionsSchemeType: [],
      fileList: [],
      platformRatio: [],
      ruleForm: {
        // id: "",
        schemeName: "",
        // platformRatio: "",
        distrRatio: "",
        // gamePublishersRatio: "",
        platformType: "1",
        schemeType: EnumSCHEMETYPE.cps,
        // commissionRatioSaveDTOList: [],
      },
      rules: {
        schemeName: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("scheme_name")}`,
            trigger: "blur",
          },
        ],
        // platformRatio: [
        //   {
        //     required: true,
        //     message: this.$t("set_percentage_value"),
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[0-9]\d*$/,
        //     message: this.$t("positive_integer"),
        //     trigger: "blur",
        //   },
        // ],
        distrRatio: [
          {
            required: true,
            message: this.$t("set_percentage_value"),
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: this.$t("positive_integer"),
            trigger: "blur",
          },
        ],
        // agentBrokerageRatio: [
        //   {
        //     required: true,
        //     message: this.$t("set_percentage_value"),
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[0-9]\d*$/,
        //     message: this.$t("positive_integer"),
        //     trigger: "blur",
        //   },
        // ],
        // gamePublishersRatio: [
        //   {
        //     required: true,
        //     message: this.$t("set_percentage_value"),
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[0-9]\d*$/,
        //     message: this.$t("positive_integer"),
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
    // total() {
    //   const platformRatio = parseInt(this.ruleForm.platformRatio);
    //   const distrRatio = parseInt(this.ruleForm.distrRatio);
    //   // const gamePublishersRatio = parseInt(this.ruleForm.gamePublishersRatio);
    //   // const totalRatio = this.ruleForm.commissionRatioSaveDTOList.reduce(
    //   //   (acc, item) => {
    //   //     return acc + (item.ratio ? Number(item.ratio) : 0);
    //   //   },
    //   //   0
    //   // );
    //   let result;
    //   if (this.ruleForm.schemeType === EnumSCHEMETYPE.game_cps) {
    //     result = platformRatio + distrRatio;
    //   }
    //   // else {
    //   //   result = platformRatio + distrRatio;
    //   // }
    //   // if (this.ruleForm.schemeType === EnumSCHEMETYPE.cps) {
    //   //   result = platformRatio + distrRatio + totalRatio;
    //   // } else {
    //   //   result = platformRatio + gamePublishersRatio + distrRatio;
    //   // }
    //   return result;
    // },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
    // else {
    //   this.ruleForm.commissionRatioSaveDTOList = [...init];
    // }
    // this.optionsSchemeType = optionsSchemeType.filter((v) => {
    //   const arr = [EnumSCHEMETYPE.cps, EnumSCHEMETYPE.game_cps];
    //   if (arr.includes(v.id)) {
    //     return v;
    //   }
    // });
  },

  methods: {
    // 1.31需求隐藏
    // handleSchemeTypeChange(val) {
    //   this.ruleForm.schemeName = "";
    //   this.ruleForm.platformRatio = "";
    //   this.ruleForm.distrRatio = "";

    //   // if (val === EnumSCHEMETYPE.cps) {
    //   //   this.ruleForm.gamePublishersRatio = "";
    //   //   // this.ruleForm.commissionRatioSaveDTOList = [
    //   //   //   {
    //   //   //     level: 1,
    //   //   //     ratio: "",
    //   //   //     index: 0,
    //   //   //   },
    //   //   //   {
    //   //   //     level: 2,
    //   //   //     ratio: "",
    //   //   //     index: 1,
    //   //   //   },
    //   //   //   {
    //   //   //     level: 3,
    //   //   //     ratio: "",
    //   //   //     index: 2,
    //   //   //   },
    //   //   // ];
    //   // }
    //   // else {
    //   //   this.ruleForm.commissionRatioSaveDTOList = [];
    //   // }
    // },
    // 佣金的单独验证方法
    // validSome() {
    //   const regex = /^[1-9]\d*$/;
    //   const hasEmptyRatio = this.ruleForm.commissionRatioSaveDTOList.some(
    //     (item) => !item.ratio
    //   );
    //   const hasInvalidRatio = this.ruleForm.commissionRatioSaveDTOList.some(
    //     (item) => item.ratio && !regex.test(item.ratio)
    //   );
    //   if (hasInvalidRatio) {
    //     this.$message.warning(this.$t("commission_type"));
    //     return false;
    //   }

    //   if (hasEmptyRatio) {
    //     this.$message.error(
    //       `${this.$t("please_enter")} ${this.$t("commission_rate")}`
    //     );
    //     return false;
    //   }
    //   return true;
    // },
    // addDomain() {
    //   if (this.ruleForm.commissionRatioSaveDTOList.length > 4) {
    //     return this.$message.warning(this.$t("add_commission"));
    //   }
    //   this.ruleForm.commissionRatioSaveDTOList.push({
    //     level: this.ruleForm.commissionRatioSaveDTOList.length + 1,
    //     ratio: "",
    //     index: this.ruleForm.commissionRatioSaveDTOList.length,
    //   });
    // },
    // removeDomain(domain) {
    //   const index = this.ruleForm.commissionRatioSaveDTOList.indexOf(domain);
    //   if (index > -1) {
    //     this.ruleForm.commissionRatioSaveDTOList.splice(index, 1);
    //   }
    // },
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.schemeName = this.row.schemeName;
      this.ruleForm.distrRatio = this.row.distrRatio;
      // this.ruleForm.agentBrokerageRatio = this.row.agentBrokerageRatio;
      // this.ruleForm.platformRatio = this.row.platformRatio;
      // this.ruleForm.commissionRatioSaveDTOList = this.row.commissionRatioList
      //   ? this.row.commissionRatioList
      //   : [...init];
      // this.ruleForm.schemeType = this.row.schemeType;
      // this.ruleForm.gamePublishersRatio = this.row.gamePublishersRatio;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // let someCondition;
        // if (this.ruleForm.schemeType == EnumSCHEMETYPE.cps) {
        //   someCondition = this.validSome();
        //   if (!someCondition) {
        //     return;
        //   }
        // } else {
        //   someCondition = true;
        // }
        // 1.31日需求隐藏
        // if (this.total > 100) {
        //   this.$message.error(`${this.$t("input_total")} 100%`);
        //   return;
        // }
        // if (this.total < 100) {
        //   this.$message.error(`${this.$t("three_input_total")} 100%`);
        //   return;
        // }
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      // 1.31日需求隐藏
      // let params = {
      //   ...this.ruleForm,
      // };
      // if (this.ruleForm.schemeType !== EnumSCHEMETYPE.game_cps) {
      //   params = {
      //     id: this.ruleForm.id,
      //     schemeName: this.ruleForm.schemeName,
      //     distrRatio: this.ruleForm.distrRatio,
      //     schemeType: this.ruleForm.schemeType,
      //     platformType: "1",
      //   };
      // }
      if (this.row.id) {
        const comSubmit = () => {
          return updateClearingScheme(this.ruleForm)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(this.$t("successfully_edited"));
                this.row.callback(true);
                return Promise.resolve();
              }
            })
            .catch((err) => {});
        };
        debounceCallBack(comSubmit)();
      } else {
        const comSubmit = () => {
          return saveClearingScheme(this.ruleForm)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(this.$t("successfully_added"));
                this.row.callback(true);
                return Promise.resolve();
              }
            })
            .catch((err) => {});
        };
        debounceCallBack(comSubmit)();
      }
    },
  },
};
</script>
