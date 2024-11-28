<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <span v-if="nextStep">
      <el-form-item label="产品名称" prop="name">
        <el-input
          :placeholder="$t('user_name')"
          :disabled="row.id != null"
          v-model="ruleForm.name"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('user_name')" prop="username">
        <el-input
          :placeholder="$t('user_name')"
          :disabled="row.id != null"
          v-model="ruleForm.username"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('real_name')" prop="realName">
        <el-input
          :placeholder="$t('real_name')"
          v-model="ruleForm.realName"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('phone')" prop="mobile">
        <el-input
          :placeholder="$t('phone')"
          v-model="ruleForm.mobile"
          autocomplete="off"
          clearable
        />
      </el-form-item>

      <el-form-item label="选择套餐" prop="servicePackageId">
        <el-select
          style="width: 100%"
          clearable
          v-model="ruleForm.servicePackageId"
          placeholder="请选择套餐"
        >
          <el-option
            v-for="item in MealOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('password')" prop="password" v-if="!row.id">
        <el-input
          :placeholder="`${$t('the_length_should_be')}${$t('6-20')}${$t(
            'within_bits'
          )}`"
          autocomplete="new-password"
          v-model="ruleForm.password"
          type="password"
          clearable
        />
      </el-form-item>

      <el-form-item
        :label="$t('confirm_password')"
        v-if="!row.id"
        prop="qrpassword"
      >
        <el-input
          :placeholder="$t('confirm_password')"
          v-model="ruleForm.qrpassword"
          type="password"
          clearable
        />
      </el-form-item>
      <el-form-item label="APPid" v-if="row.id">
        <el-input
          placeholder="请输入APPid"
          :disabled="row.id != null"
          v-model="ruleForm.busPlatformId"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('认证状态')" v-if="row.adminUserId">
        <span>{{
          compuAuthenticatorStatus(ruleForm.authenticatorStatus)
        }}</span>
      </el-form-item>
      <el-form-item v-if="!row.authenticatorStatus && row.adminUserId">
        <span class="priBtn" @click="handleAuth">去完成安全认证</span>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          row.adminUserId ? $t("determine") : $t("next_step")
        }}</el-button>
        <el-button @click="row.callback && row.callback()">{{
          $t("cancel")
        }}</el-button>
      </el-form-item>
    </span>
    <span v-if="!nextStep">
      <bindGoogleAuth :row="infoParams" />
    </span>
  </el-form>
</template>
<script>
import { tenantSave, tenantEdit } from "@/api/admin/user";
import { getKey } from "@/api/userList";
import { i18nATL, optionsAuthenticator } from "@/util/util";
import JSEncrypt from "jsencrypt";
import { checkUsernameType } from "@/util/validate.js";
import { userExists } from "@/api/admin/user";
import { queryPage } from "@/api/content/index";
import bindGoogleAuth from "@/views/common/bindGoogleAuth";

const validateUsername = (rule, value, callback, row) => {
  var reg = new RegExp("^[A-Za-z0-9]+$");
  if (!value) {
    return callback(
      new Error(`${i18nATL(["please_enter"])}${i18nATL(["user_name"])}`)
    );
  }
  if (!reg.test(value)) {
    return callback(
      new Error(
        `${i18nATL(["please_enter"])}${i18nATL(["numbers_and_english"])}`
      )
    );
  }
  userExists(value).then((response) => {
    const { data } = response;
    if (!row.id) {
      if (!data.data) {
        callback();
      } else {
        callback(new Error(`${i18nATL(["user_name"])}${i18nATL(["existed"])}`));
      }
    } else {
      callback();
    }
  });
};

// 设置密码校验规则
const checkPassword = (rule, value, callback) => {
  if (!value) {
    callback(
      new Error(`${i18nATL(["please_enter"])} ${i18nATL(["password"])}`)
    );
  } else if (value.length < 6 || value.length > 20) {
    callback(
      new Error(i18nATL(["the_length_should_be", "6-20", "within_bits"]))
    );
  } else {
    callback();
  }
};

const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error(i18nATL(["please_enter", "contact_info"])));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(
        new Error(i18nATL(["please_enter", "correct", "telephone"]))
      );
    }
  }
};

export default {
  components: {
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
      nextStep: true,
      key: "",
      sign: "",
      ruleForm: {
        name: "",
        username: "",
        realName: "",
        mobile: "",
        password: "",
        qrpassword: "",
        servicePackageId: [],
        busPlatformId: "",
        authenticatorStatus: false,
      },
      infoParams: {
        userId: "",
        username: "",
        callback: (data) => this.row.callback(data),
      },
      MealOptions: [],
      rules: {
        name: [
          {
            required: true,
            message: `请输入产品名称`,
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("user_name")}`,
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: i18nATL(["the_length_should_be", "3-20", "within_bits"]),
            trigger: "blur",
          },
          {
            validator: (val, data, callback) => {
              validateUsername(val, data, callback, this.row);
            },
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            message: i18nATL(["please_enter", "real_name"]),
          },
          {
            min: 1,
            max: 10,
            message: i18nATL(["the_length_should_be", "1-10", "within_bits"]),
            trigger: "blur",
          },
          { validator: checkUsernameType, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: `${this.$t("please_enter")}${this.$t("phone")}`,
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        password: [
          { required: true, validator: checkPassword, trigger: "blur" },
        ],
        qrpassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
        ],
        servicePackageId: [
          {
            required: true,
            message: `请选择套餐`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    compuAuthenticatorStatus() {
      return (authenticatorStatus) => {
        const item = optionsAuthenticator.find(
          (v) => v.id === authenticatorStatus
        );
        return item.name;
      };
    },
  },
  mounted() {
    this.getMealData();
    this.passwordEncrypt();
  },
  methods: {
    handleAuth() {
      this.nextStep = false;
    },
    // 获取加密秘钥
    passwordEncrypt() {
      getKey().then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.key = data.data.key;
          this.sign = data.data.sign;
        }
      });
    },
    getMealData() {
      const params = {
        current: 1,
        size: 99999,
      };
      queryPage(params).then((res) => {
        this.MealOptions = res.data.data.records;
        if (this.row.id) {
          this.getInfo();
        }
      });
    },
    getInfo() {
      this.ruleForm.name = this.row.name;
      this.ruleForm.username = this.row.username;
      this.ruleForm.realName = this.row.realName;
      this.ruleForm.mobile = this.row.mobile;
      this.ruleForm.servicePackageId = this.row.servicePackageId;
      this.ruleForm.busPlatformId = this.row.busPlatformId;
      this.ruleForm.authenticatorStatus = this.row.authenticatorStatus;
      this.infoParams.userId = this.row.adminUserId;
      this.infoParams.username = this.row.username;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.key);
      let params;
      if (!this.row.id) {
        params = {
          ...this.ruleForm,
          password: encrypt.encrypt(this.ruleForm.password),
          qrpassword: encrypt.encrypt(this.ruleForm.qrpassword),
          sign: this.sign,
        };
      } else {
        params = {
          id: this.row.id,
          mobile: this.ruleForm.mobile,
          realName: this.ruleForm.realName,
          servicePackageId: this.ruleForm.servicePackageId,
        };
      }
      if (!this.row.id) {
        if (this.ruleForm.password !== this.ruleForm.qrpassword) {
          return this.$message.warning(this.$t("the_two_passwords_not_match"));
        }
        tenantSave(params).then((res) => {
          this.nextStep = false;
          this.infoParams.userId = res.data.data.userId;
          this.infoParams.username = res.data.data.username;
          this.$message.success(this.$t("successfully_added"));
        });
      } else {
        tenantEdit(params).then(() => {
          this.$message.success(this.$t("successfully_edited"));
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
