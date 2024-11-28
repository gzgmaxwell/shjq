<template>
  <div>
    <span class="tost"
      >您的账号密码以及认证状态都将重置，请知悉！完成密码重置后，请前往编辑完成认证！</span
    >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('password')" prop="password">
        <el-input
          :placeholder="`${$t('the_length_should_be')}${$t('6-20')}${$t(
            'within_bits'
          )}`"
          autocomplete="new-password"
          v-model="ruleForm.password"
          type="password"
          clearable
          show-password
        />
      </el-form-item>

      <el-form-item :label="$t('confirm_password')" prop="qrpassword">
        <el-input
          :placeholder="$t('confirm_password')"
          v-model="ruleForm.qrpassword"
          type="password"
          clearable
          show-password
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
  </div>
</template>
<script>
import { resetStatus } from "@/api/admin/index";
import { i18nATL } from "@/util/util";

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
        password: "",
        qrpassword: "",
      },
      rules: {
        password: [
          { required: true, validator: checkPassword, trigger: "blur" },
        ],
        qrpassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
        userId: this.row.userId,
      };
      if (this.row.userId) {
        if (this.ruleForm.password !== this.ruleForm.qrpassword) {
          return this.$message.warning(this.$t("the_two_passwords_not_match"));
        }
        resetStatus(params).then(() => {
          this.$notify.success(this.$t("重置成功"));
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tost {
  display: block;
  margin-bottom: 20px;
  text-align: center;
  padding: 6px;
  border: 1px solid #f0b8b8;
  border-radius: 5px;
  background-color: #f5dcdc;
}
</style>
