<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        id="username"
        auto-complete="off"
        placeholder="请输入用户名"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="请输入密码"
      >
        <i
          class="el-icon-view el-input__icon"
          slot="suffix"
          @click="showPassword"
        ></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>

    <el-form-item
      prop="code"
      :rules="[
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
      ]"
      v-if="googleAuth.googleAuthenticatorStatus && googleAuth.bindStatus"
    >
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :maxlength="6"
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="请输入谷歌验证码"
      >
        <i slot="prefix" class="icon-yanzhengma"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" v-else>
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            size="small"
            @keyup.enter.native="handleLogin"
            :maxlength="code.len"
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
          >
            <i slot="prefix" class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="code.src" class="login-code-img" @click="refreshCode" />
          </div>
        </el-col>
      </el-row>
    </el-form-item>

    <div class="forget" v-if="!googleAuth.googleAuthenticatorStatus">
      <el-popover
        placement="bottom"
        title="提示"
        width="300"
        trigger="click"
        content="请联系管理员，重置您的密码，同时会重置安全认证，请重新完成绑定"
      >
        <span class="primary" slot="reference" style="cursor: pointer"
          >忘记密码</span
        >
      </el-popover>
    </div>
    <el-form-item>
      <el-button
        type="primary"
        @click.native.prevent="handleLogin"
        class="login-submit"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { debounceCallBack } from "@/util/util";
import { userValid } from "@/api/login";

export default {
  name: "userlogin",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        code: "",
        redomStr: "",
        useGoogleValid: "",
      },
      googleAuth: {
        bindStatus: false,
        googleAuthenticatorStatus: false,
      },
      checked: false,
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text",
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      passwordType: "password",
    };
  },
  created() {
    this.refreshCode();
  },
  mounted() {
    this.$nextTick(() => {
      const inputElement = document.querySelector("#username");
      inputElement.select();
      document.execCommand("copy");
    });
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },

  methods: {
    refreshCode() {
      this.loginForm.randomStr = Math.floor(Math.random() * 1000000000000);
      this.axios({
        url: "/code?randomStr=" + this.loginForm.randomStr,
        method: "post",
        responseType: "blob",
      }).then((res) => {
        this.code.src = URL.createObjectURL(res.data);
      });
      this.loginForm.code = "";
    },
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      this.$store
        .dispatch("LoginByUsername", this.loginForm)
        .then(() => {
          this.$store.dispatch("actionGetByUser").then(() => {
            userValid().then(() => {
              this.$router.push("/wel/index");
            });
          });
        })
        .catch(() => {
          this.refreshCode();
        });
    },
  },
  watch: {
    "loginForm.username": {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          const fun = () => {
            return this.$store
              .dispatch("actionGetBingStatus", {
                username: this.loginForm.username,
              })
              .then((res) => {
                this.googleAuth = res.data.data;
                return Promise.resolve();
              });
          };
          if (this.loginForm.username) {
            debounceCallBack(fun, 600)();
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.forget {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
}
</style>
