<script setup lang="ts" name="HomeView">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authOauthToken, getCheckCode } from '@/api/auth'
import { encryption } from '@/utils/index'

const router = useRouter()

const captchaBase64 = ref('')
const username = ref('')
const password = ref('')
const code = ref('')
const onSubmit = (values: any) => {
  const params = {
    username: values.username,
    password: values.password,
    code: values.code,
    randomStr: Math.floor(Math.random() * 1000000000000)
  }
  const user = encryption({
    data: params,
    key: 'thanks,pig4cloud',
    param: ['password']
  })
  authOauthToken(user.username, user.password, user.code, user.randomStr).then(res => {
    const { data } = res
    if (data.access_token) {
      // userStore.setUserInfo(data)
      localStorage.setItem('accessToken', data.access_token)
      router.push({ path: '/' })
    }
  })
}

const refreshCode = () => {
  getCheckCode().then(res => {
    captchaBase64.value = URL.createObjectURL(res.data)
  })
}

onMounted(() => {
  refreshCode()
})
</script>

<template>
  <div class="home-view">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="captchaBase64">
          <van-field
            v-model="code"
            name="code"
            label="验证码"
            placeholder="请填写验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <div class="captcha"></div>
          </van-field>
          <img
            :src="captchaBase64"
            @click="refreshCode"
          />
        </div>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="less">
.home-view {
  height: 100vh;
  display: flex;
  justify-content: center;
  .captchaBase64 {
    position: relative;
    img {
      position: absolute;
      width: 80px;
      height: 40px;
      right: 0;
      top: 0;
    }
  }
  &__button {
    margin-bottom: 10px;
  }
}
</style>

<route lang="yaml">
name: login
meta:
  requiresAuth: true
</route>
