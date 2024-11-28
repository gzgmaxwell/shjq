<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="resetTipsStyle">
        你的账号密码以及认证状态都将重置, 请知悉!
        完成密码重置后,请前往编辑完成认证!
      </div>
      <el-form-item :label="$t('password')" prop="password">
        <el-input
          type="password"
          style="width: 70%"
          v-model="ruleForm.password"
          :placeholder="$t('set_password')"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('confirm_password')" prop="verifyPassword">
        <el-input
          type="password"
          style="width: 70%"
          v-model="ruleForm.verifyPassword"
          :placeholder="$t('set_password')"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="passwordRow.callback && passwordRow.callback()">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("determine")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { debounceCallBack } from "@/util/util";
import { distributorResetPassword } from "@/api/admin/index";
import JSEncrypt from "jsencrypt";
import { getKey } from "@/api/userList";
export default {
  props: {
    passwordRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      accountBtn: true,
      key: "",
      sign: "",
      ruleForm: {
        password: "",
        verifyPassword: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("password")}`,
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: this.$t("password_length"),
            trigger: "blur",
          },
          {
            pattern:
              /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|]).*$/,
            // message: this.$t("password_format"),
            message: "密码必须由字母、数字和特殊字符组成",
            trigger: "blur",
          },
        ],
        verifyPassword: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t(
              "confirm_password"
            )}`,
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: this.$t("password_length"),
            trigger: "blur",
          },
          {
            pattern:
              /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|]).*$/,
            // message: this.$t("password_format"),
            message: "密码必须由字母、数字和特殊字符组成",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.passwordEncrypt();
    });
  },
  methods: {
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
    submitForm(formName) {
      if (!this.ruleForm.password || !this.ruleForm.verifyPassword) {
        this.$message.error(
          `${this.$t("please_enter")} ${this.$t("password")}`
        );
        return;
      }
      if (this.ruleForm.password != this.ruleForm.verifyPassword) {
        this.$message.error(this.$t("verify_password"));
        return;
      }
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
      // 密码加密
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.key);
      let params = {
        userId: this.passwordRow.stationmasterId,
        password: encrypt.encrypt(this.ruleForm.password),
        sign: this.sign,
      };
      const comSubmit = () => {
        return distributorResetPassword(params)
          .then((res) => {
            const { data } = res;
            if (data.code == 200) {
              this.$message.success("编辑成功");
              this.passwordRow.callback(true);
              return Promise.resolve();
            }
          })
          .catch(() => {
            this.ruleForm.password = "";
            this.ruleForm.verifyPassword = "";
          });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>

<style lang="scss" scoped>
.resetTipsStyle {
  border: 1px solid #ffc6c3;
  background: #fff2f1;
  border-radius: 5px;
  padding: 6px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
