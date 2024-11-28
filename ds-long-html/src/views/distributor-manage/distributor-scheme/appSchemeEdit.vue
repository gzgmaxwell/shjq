<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <!-- 1.31号需求隐藏 -->
    <!-- <el-form-item :label="$t('scheme_name')" prop="appSchemeName">
      <el-input
        :placeholder="`${$t('please_enter')} ${$t('scheme_name')}`"
        style="width: 70%"
        v-model="ruleForm.appSchemeName"
        clearable
        maxlength="20"
        show-word-limit
      />
    </el-form-item> -->
    <!-- 3.8日 4.2.3需求删除 -->
    <!--     <template>
      <el-form-item label="消费">
        <el-switch
          v-model="ruleForm.commissionStatus"
          @change="changeCommissionStatus"
        ></el-switch>
      </el-form-item>
      <div v-if="ruleForm.commissionStatus">
        <el-form-item
          v-for="(domain, index) in ruleForm.commissionRatioList"
          :label="`下${index + 1}${$t('level_commission')}`"
          :key="index"
        >
          <el-input
            v-model="domain.ratio"
            style="width: 70%"
            placeholder="请输入金币比例"
          >
            <template slot="append">%</template>
          </el-input>
          <i
            v-if="index > 2"
            class="el-icon-remove btn"
            @click.prevent="removeDomain(domain)"
          ></i>
          <i
            v-if="
              index >= 2 && index === ruleForm.commissionRatioList.length - 1
            "
            class="el-icon-circle-plus btn"
            @click="addDomain"
          ></i>
        </el-form-item>
      </div>
    </template> -->
    <!-- 2.18日需求删除 -->
    <!-- <el-form-item style="color: red">
      <label slot="label" style="color: red">{{ $t("illustrate") }}:</label>
      <span style="display: inline-block; width: 72%; line-height: 30px"
        >1~5级佣金将用于渠道名下的c端用户佣金分成</span
      >
    </el-form-item> -->

    <template>
      <div>
        <!-- 3.8日 4.2.3需求删除 -->
        <!-- <el-form-item label="道具">
          <el-switch
            v-model="ruleForm.toolStatus"
            @change="changetoolStatus"
          ></el-switch>
        </el-form-item> -->
        <div>
          <el-form-item
            v-for="(item, index) in ruleForm.schemeDetailList"
            label="每邀请"
            :key="item.id"
          >
            <el-input
              v-model="item.userNum"
              style="width: 25%"
              placeholder="请输入人数"
            >
            </el-input>
            人,获得
            <el-select
              v-model="item.type"
              placeholder="请选择类型"
              style="width: 25%"
            >
              <el-option
                v-for="item in propsOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="item.num"
              style="width: 25%; margin-left: 5px"
              placeholder="请输入"
            >
            </el-input>
            <span v-if="item.type === 'SVIP'"> 天</span>
            <span v-else> 个</span>
            <i
              class="el-icon-remove btn"
              @click.prevent="removeProps(index)"
              v-if="index > 0 || ruleForm.schemeDetailList.length > 1"
            ></i>
            <i
              class="el-icon-circle-plus btn"
              @click="addProps"
              v-if="
                index >= 0 && index === ruleForm.schemeDetailList.length - 1
              "
            ></i>
          </el-form-item>
        </div>
      </div>
    </template>
    <el-form-item style="text-align: right; margin-top: 40px">
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
  debounceCallBack,
  optProps,
  EnumProps,
  EnumChannelStatus,
} from "@/util/util";
import {
  saveClearingAppScheme,
  updateClearingAppScheme,
} from "@/api/admin/index";
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
  components: {},
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
        // appSchemeName: "",
        // commissionStatus: true,
        // toolStatus: true,
        // 3.8日 4.2.3需求删除
        // commissionRatioList: [
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
        // ],
        schemeDetailList: [{ userNum: "", type: "", num: "" }],
      },
      rules: {
        // appSchemeName: [
        //   {
        //     required: true,
        //     message: `${this.$t("please_enter")} ${this.$t("scheme_name")}`,
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  computed: {
    // 3.8日 4.2.3需求删除
    // total() {
    //   // const platformRatio = parseInt(this.ruleForm.platformRatio);
    //   // const distrRatio = parseInt(this.ruleForm.distrRatio);
    //   // const gamePublishersRatio = parseInt(this.ruleForm.gamePublishersRatio);
    //   let totalRatio = this.ruleForm.commissionRatioList.reduce((acc, item) => {
    //     return acc + (item.ratio ? Number(item.ratio) : 0);
    //   }, 0);
    //   // let result;
    //   // if (this.ruleForm.schemeType === EnumSCHEMETYPE.cps) {
    //   //   result = platformRatio + distrRatio + totalRatio;
    //   // } else {
    //   //   result = platformRatio + gamePublishersRatio + distrRatio;
    //   // }
    //   // return result;
    //   return totalRatio;
    // },
    propsOpt() {
      return optProps.filter((v) => {
        return v.id === EnumProps.SVIP || v.id === EnumProps.GOLD;
      });
    },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
    // 3.8日 4.2.3需求删除
    // else {
    //   this.ruleForm.commissionRatioList = this.ruleForm.commissionRatioList;
    // }
  },

  methods: {
    // 3.8日 4.2.3需求删除
    // changeCommissionStatus(val) {
    //   if (val) {
    //     // 如果有新增时 这样使用
    //     // this.ruleForm.commissionRatioList = this.row.id
    //     //   ? this.row.commissionRatioList && this.row.commissionRatioList.length
    //     //     ? [...this.row.commissionRatioList]
    //     //     : init
    //     //   : init;
    //     this.ruleForm.commissionRatioList = [...this.row.commissionRatioList];
    //   }
    // },
    /*     3.8日 4.2.3需求删除
    changetoolStatus(val) {
      if (val) {
        // 使用展开运算符创建原始数组的副本
        // this.ruleForm.schemeDetailList = this.row.id
        //   ? this.row.schemeDetailList && this.row.schemeDetailList.length
        //     ? [...this.row.schemeDetailList]
        //     : [{ userNum: "", type: "", num: "" }]
        //   : [{ userNum: "", type: "", num: "" }];
        this.ruleForm.schemeDetailList = [...this.row.schemeDetailList];
      }
    }, */
    /*     3.8日 4.2.3需求删除
    // 佣金的单独验证方法
    validSome() {
      const regex = /^[1-9]\d*$/;
      const hasEmptyRatio = this.ruleForm.commissionRatioList.some(
        (item) => !item.ratio
      );
      const hasInvalidRatio = this.ruleForm.commissionRatioList.some(
        (item) => item.ratio && !regex.test(item.ratio)
      );
      if (hasInvalidRatio) {
        this.$message.warning(this.$t("commission_type"));
        return false;
      }

      if (hasEmptyRatio) {
        this.$message.error(
          `${this.$t("please_enter")} ${this.$t("commission_rate")}`
        );
        return false;
      }
      return true;
    }, */
    // 道具校验
    validProps() {
      const regex = /^[1-9]\d*$/;
      const peopleNum = this.ruleForm.schemeDetailList.some(
        (item) => !item.userNum || !item.type || !item.num
      );
      const peopleValidNum = this.ruleForm.schemeDetailList.some(
        (item) => !regex.test(item.userNum) || !regex.test(item.num)
      );

      if (peopleNum) {
        this.$message.error(`请填写道具`);
        return false;
      }
      if (peopleValidNum) {
        this.$message.warning("请填写正整数");
        return false;
      }
      return true;
    },
    /*     3.8日 4.2.3需求删除
        addDomain() {
      if (this.ruleForm.commissionRatioList.length > 4) {
        return this.$message.warning(this.$t("add_commission"));
      }
      this.ruleForm.commissionRatioList.push({
        level: this.ruleForm.commissionRatioList.length + 1,
        ratio: "",
        index: this.ruleForm.commissionRatioList.length,
      });
    }, */
    addProps() {
      this.ruleForm.schemeDetailList.push({ userNum: "", type: "", num: "" });
    },
    removeProps(index) {
      if (index >= 0) {
        this.ruleForm.schemeDetailList.splice(index, 1);
      }
    },
    /*     3.8日 4.2.3需求删除
    removeDomain(domain) {
      const index = this.ruleForm.commissionRatioList.indexOf(domain);
      if (index > 0) {
        this.ruleForm.commissionRatioList.splice(index, 1);
      }
    }, */
    getInfo() {
      this.ruleForm.id = this.row.id;
      //1.31日需求隐藏
      // this.ruleForm.appSchemeName = this.row.appSchemeName;

      /*     3.8日 4.2.3需求删除
      if (this.row.commissionRatioList.length) {
        this.ruleForm.commissionRatioList = JSON.parse(
          JSON.stringify(this.row.commissionRatioList)
        );
      } */

      if (this.row.schemeDetailList && this.row.schemeDetailList.length > 0) {
        this.ruleForm.schemeDetailList = JSON.parse(
          JSON.stringify(this.row.schemeDetailList)
        );
      }
      /*       3.8日 4.2.3需求删除
      this.ruleForm.commissionStatus =
        this.row.commissionStatus === EnumChannelStatus.normal; 
      this.ruleForm.toolStatus =
        this.row.toolStatus === EnumChannelStatus.normal; */
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        /*       3.8日 4.2.3需求删除
        let someCondition; */
        // let PropsCondition;
        /*         3.8日 4.2.3需求删除
        if (this.ruleForm.commissionStatus) {
          someCondition = this.validSome();
          if (!someCondition) {
            return;
          }
        } else {
          this.ruleForm.commissionRatioList = [];
          someCondition = true;
        } */
        let PropsCondition = this.validProps();
        if (!PropsCondition) {
          return false;
        }
        // if (this.ruleForm.toolStatus) {
        // } else {
        //   this.ruleForm.schemeDetailList = [];
        //   PropsCondition = true;
        // }
        // 3.8日 4.2.3需求删除
        // if (this.total > 100) {
        //   this.$message.error(`${this.$t("input_total")} 100%`);
        //   return;
        // }
        // if (this.total < 100) {
        //   this.$message.error(`${this.$t("three_input_total")} 100%`);
        //   return;
        // }
        if (valid && PropsCondition) {
          this.commit();
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
        /*              3.8日 4.2.3需求删除
        commissionStatus: this.ruleForm.commissionStatus
          ? "NORMAL"
          : "DISABLED", 
        toolStatus: this.ruleForm.toolStatus ? "NORMAL" : "DISABLED", */
        createId: this.$store.getters.userInfo.id,
      };
      if (this.row.id) {
        const comSubmit = () => {
          return updateClearingAppScheme(params)
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
          return saveClearingAppScheme(params)
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
<style lang="scss" scoped>
.btn {
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
