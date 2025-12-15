<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
      <div class="flex text-white items-center py-4 title-wrap">
        <span class="text-2xl flex-1 text-center title"> {{ $t("distribution_system_login") }} </span>
      </div>

      <el-form-item prop="username">
        <div class="p-2 text-white">
          <svg-icon icon-class="user" />
        </div>
        <el-input
          ref="username"
          v-model="loginData.username"
          class="flex-1"
          size="large"
          auto-complete="on"
          :placeholder="$t('user_name')"
          name="username"
        />
      </el-form-item>

      <el-tooltip :disabled="isCapslock === false" content="Caps lock is On" placement="right">
        <el-form-item prop="password">
          <span class="p-2 text-white">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginData.password"
            class="flex-1"
            :placeholder="$t('password')"
            :type="passwordVisible === false ? 'password' : 'input'"
            size="large"
            name="password"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
          />
          <span class="mr-2" @click="passwordVisible = !passwordVisible">
            <svg-icon :icon-class="passwordVisible === false ? 'eye' : 'eye-open'" class="text-white cursor-pointer" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item
        prop="verifyCode"
        v-if="googleAuth.googleAuthenticatorStatus && googleAuth.bindStatus"
        :rules="[{ required: true, message: '请输入谷歌验证码', trigger: 'blur' }]"
      >
        <span class="p-2 text-white">
          <svg-icon icon-class="verify_code" />
        </span>
        <el-input v-model="loginData.verifyCode" class="flex-1" placeholder="请输入谷歌验证码" size="large" />
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="verifyCode" v-else>
        <span class="p-2 text-white">
          <svg-icon icon-class="verify_code" />
        </span>
        <el-input
          v-model="loginData.verifyCode"
          auto-complete="off"
          :placeholder="$t('verify_code')"
          style="width: 60%"
          @keyup.enter="handleLogin"
        />

        <div class="captcha">
          <img :src="captchaBase64" @click="refreshCode" />
        </div>
      </el-form-item>

      <el-button size="default" :loading="loading" type="primary" class="mt3 w-full" @click.prevent="handleLogin">
        {{ $t("login") }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { authOauthToken, getCheckCode, channelUserByUserId } from "@/api/auth";
import { encryption, debounceCallBack } from "@/utils/index";
import { i18nTL } from "@/utils/i18n";

const userStore = useUserStore();
const useCommon = useCommonStore();

const loading = ref(false);
const isCapslock = ref(false);
const passwordVisible = ref(false);
const captchaBase64 = ref();
const loginFormRef = ref(ElForm);
// 18582862222 ds2023.
// 17310000000 cs&111111
const loginData = ref<any>({
  username: "",
  password: "",
  randomStr: "",
});
let googleAuth: any = reactive({
  bindStatus: false,
  googleAuthenticatorStatus: false,
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: `${i18nTL("please_enter")}${i18nTL("please_enter")}` }],
  password: [{ required: true, trigger: "blur", validator: passwordValidator }],
  verifyCode: [{ required: true, trigger: "blur", message: `${i18nTL("please_enter")}${i18nTL("verify_code")}` }],
};

function passwordValidator(rule: any, value: any, callback: any) {
  console.log(rule);
  if (value.length < 6) {
    callback(new Error(i18nTL("password_more6_digits")));
  } else {
    callback();
  }
}

function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const params = {
        username: loginData.value.username,
        password: loginData.value.password,
        code: loginData.value.verifyCode,
        randomStr: loginData.value.randomStr,
      };
      const user = encryption({
        data: params,
        key: "thanks,pig4cloud",
        param: ["password"],
      });
      authOauthToken(user.username, user.password, user.code, loginData.value.randomStr, 1)
        .then((res) => {
          const { data } = res.data;
          console.log(data);
          if (data.access_token) {
            useCommon.getDictionary({ current: 1, dictionaryKeys: [], size: 999 });
            userStore.setUserInfo(data);
            localStorage.setItem("accessToken", data.access_token);
            channelUserByUserId().then((response) => {
              if (response.data.code === 200) {
                router.push({ path: "/" });
              }
            });
          }
        })
        .catch(() => {
          refreshCode();
          loading.value = false;
        });
    }
  });
}

const refreshCode = () => {
  loginData.value.verifyCode = "";
  loginData.value.randomStr = Math.floor(Math.random() * 1000000000000);
  getCheckCode(loginData.value.randomStr).then((res) => {
    captchaBase64.value = URL.createObjectURL(res.data);
  });
};

onMounted(() => {
  refreshCode();
});
watch(
  () => loginData.value.username,
  (val, oldVal) => {
    if (val !== oldVal && val) {
      const fun = () => {
        return userStore
          .actionGetBingStatus({
            username: loginData.value.username,
          })
          .then((res: any) => {
            googleAuth.bindStatus = res.data.data.bindStatus;
            googleAuth.googleAuthenticatorStatus = res.data.data.googleAuthenticatorStatus;
            localStorage.setItem("BusPlatformId", res.data.data.busPlatformId);
            return Promise.resolve();
          });
      };
      if (loginData.value.username) {
        debounceCallBack(fun, 600)();
      }
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #2d3a4b;

  .title-wrap {
    filter: contrast(30);

    .title {
      letter-spacing: 4px;
      animation: showup 1s forwards;
    }

    @keyframes showup {
      0% {
        letter-spacing: -20px;
      }

      100% {
        letter-spacing: 4px;
      }
    }
  }

  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}

.el-form-item {
  background: rgb(0 0 0 / 10%);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 5px;
}

.el-input {
  background: transparent;

  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #fff;
      caret-color: #fff;
      background: transparent;
      border: 0;
      border-radius: 0;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition:
          color 99999s ease-out,
          background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
</style>
