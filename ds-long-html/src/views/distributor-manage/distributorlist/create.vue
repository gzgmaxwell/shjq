<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <span v-if="nextStep">
      <el-form-item :label="$t('channel_merchant_account')" prop="distrMobile">
        <el-input
          :placeholder="`${$t('please_enter')} ${$t('phone')}`"
          style="width: 70%"
          v-model="ruleForm.distrMobile"
          clearable
          :disabled="row.id != null"
        />
      </el-form-item>
      <el-form-item
        :label="$t('login_password')"
        prop="password"
        v-if="!row.id"
      >
        <el-input
          type="password"
          placeholder="设置6-20位密码"
          autocomplete="new-password"
          style="width: 70%"
          v-model="ruleForm.password"
          clearable
          show-password
        />
      </el-form-item>
      <el-form-item :label="$t('full_name')" prop="distrName">
        <el-input
          :placeholder="`${$t('please_enter')} ${$t('full_name')}`"
          style="width: 70%"
          v-model="ruleForm.distrName"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="渠道等级" prop="level">
        <el-input
          placeholder="1级"
          style="width: 70%"
          v-model="ruleForm.level"
          clearable
          disabled
        >
          <template slot="append">级</template>
        </el-input>
      </el-form-item>

      <!-- <el-form-item label="渠道商身份">
        <el-radio-group
          v-model="ruleForm.channelType"
          :disabled="row.id != null"
        >
          <el-radio
            v-for="item in optWebmasterType"
            :key="item.id"
            :label="item.id"
            :name="item.name"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="允许创建下级" prop="allowCreateChild">
        <el-radio-group v-model="ruleForm.allowCreateChild">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('认证状态')" v-if="row.id">
        <span>{{
          compuAuthenticatorStatus(ruleForm.authenticatorStatus)
        }}</span>
      </el-form-item>
      <!-- <el-form-item v-if="!row.authenticatorStatus && row.distrMobile">
        <span class="priBtn" @click="handleAuth">去完成安全认证</span>
      </el-form-item> -->

      <el-form-item>
        <el-button @click="row.callback && row.callback()">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("determine")
        }}</el-button>
      </el-form-item>
    </span>
    <span v-if="!nextStep">
      <bindGoogleAuth :row="infoParams" />
    </span>
  </el-form>
</template>
<script>
import {
  optionSettlementMethod,
  debounceCallBack,
  EnumChannelType,
  optionsAuthenticator,
  optWebmasterType,
  EnumWebmasterType,
} from "@/util/util";
import { distributorSave, distributorEdit } from "@/api/admin/index";
import upload from "@/components/upload";
import JSEncrypt from "jsencrypt";
import { getKey } from "@/api/userList";
import bindGoogleAuth from "@/views/common/bindGoogleAuth";

export default {
  components: {
    upload,
    bindGoogleAuth,
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
      optWebmasterType: optWebmasterType,
      nextStep: true,
      infoParams: {
        userId: "",
        username: "",
        callback: (data) => this.row.callback(data),
      },
      sign: "",
      key: "",
      fileList: [],
      ruleForm: {
        id: "",
        password: "",
        distrMobile: "",
        distrName: "",
        incomeAttribution: EnumChannelType.CHANNEL,
        channelType: EnumWebmasterType.CHANNEL,
        level: "1",
        allowCreateChild: true,
        authenticatorStatus: false,
      },
      optionsThree: [],
      rules: {
        distrMobile: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("phone")}`,
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: `${this.$t("please_enter")}${this.$t("correct")} ${this.$t(
              "phone"
            )}`,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("password")}`,
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: this.$t("password_length"),
            trigger: "blur",
          },
          // {
          //   pattern:
          //     /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|]).*$/,
          //   message: "密码必须由字母、数字和特殊字符组成",
          //   trigger: "blur",
          // },
        ],
        distrName: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("full_name")}`,
            trigger: "blur",
          },
        ],
        level: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("settlement")}`,
            trigger: "blur",
          },
        ],
        allowCreateChild: [
          {
            required: true,
            message: `请选择是否允许创建下级账号`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  // watch: {
  //   "ruleForm.channelType"(newVal) {
  //     if (newVal !== EnumWebmasterType.CHANNEL) {
  //       this.ruleForm.allowCreateChild = false;
  //     } else {
  //       this.ruleForm.allowCreateChild = true;
  //     }
  //   },
  // },
  computed: {
    compuAuthenticatorStatus() {
      return (authenticatorStatus) => {
        const item = optionsAuthenticator.find(
          (v) => v.id === authenticatorStatus
        );
        return item?.name;
      };
    },
    // compuDisabledAddSub() {
    //   return (type) => {
    //     if (type !== EnumWebmasterType.CHANNEL) {
    //       return true;
    //     }
    //     return false;
    //   };
    // },
  },
  mounted() {
    this.optionsThree = optionSettlementMethod;
    this.$nextTick(() => {
      this.passwordEncrypt();
    });
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    passwordEncrypt() {
      getKey().then((res) => {
        this.key = res.data.data.key;
        this.sign = res.data.data.sign;
      });
    },
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.distrMobile = this.row.distrMobile;
      this.ruleForm.distrName = this.row.distrName;
      this.ruleForm.allowCreateChild = this.row.allowCreateChild;
      this.ruleForm.channelType = this.row.channelType;
      this.ruleForm.authenticatorStatus = this.row.authenticatorStatus;
      this.infoParams.userId = this.row.distrId;
      this.infoParams.username = this.row.distrMobile;
    },
    handleAuth() {
      this.nextStep = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          return false;
        }
      });
    },
    commit() {
      if (this.row.id) {
        let params = {
          id: this.row.id,
          clearingPeriodType: "DAY",
          distrName: this.ruleForm.distrName,
          incomeAttribution: this.ruleForm.incomeAttribution,
          allowCreateChild: this.ruleForm.allowCreateChild,
          channelType: this.ruleForm.channelType,
        };
        const comSubmit = () => {
          return distributorEdit(params).then(() => {
            this.$message.success(this.$t("successfully_edited"));
            this.row.callback(params);
            return Promise.resolve();
          });
        };
        debounceCallBack(comSubmit)();
      } else {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.key);
        let params = {
          ...this.ruleForm,
          clearingPeriodType: "DAY",
          password: encrypt.encrypt(this.ruleForm.password),
          sign: this.sign,
        };
        const comSubmit = () => {
          return distributorSave(params).then((res) => {
            this.$message.success(this.$t("successfully_added"));
            this.row.callback(true);
            // this.nextStep = false;
            // this.infoParams.userId = res.data.data.userId;
            // this.infoParams.username = res.data.data.username;
            return Promise.resolve();
          });
        };
        debounceCallBack(comSubmit)();
      }
    },
  },
};
</script>
