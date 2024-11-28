<template>
  <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm" :inline="false">
    <el-form-item>
      <el-row style="width: 100%">
        <el-col :span="12">
          <span class="el-icon-info primary"></span>
          <span> 绑定 google Authenticator</span>
        </el-col>
        <el-col :span="12">
          <span class="activeBule" @click="noneBind">暂不绑定</span>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <div>
        <div>打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌</div>
        <div class="must">秘钥用于手机更换或遗失找回谷歌验证器，绑定前请务必将下述秘钥备份</div>
      </div>
    </el-form-item>
    <el-form-item>
      <img id="captchaImg" alt="二维码" width="120" height="120" />
      <span class="activeBule ml20 pointer" @click="getQrcodeInfo">刷新</span>
    </el-form-item>
    <el-form-item>
      <textarea style="width: 70%; border: 1px solid #d8d8d8" id="copyContent" :rows="3" v-model="secretKey" readonly />
      <span class="activeBule ml10 pointer" @click="copy">复制</span>
    </el-form-item>
    <el-form-item>
      <el-input
        oninput="value=value.replace(/[^\d]/g,'')"
        placeholder="请输入手机上的Google验证码"
        v-model="code"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleBindGoogleAuthenticator">绑 定</el-button>
      <el-button @click="props.row.callback && props.row.callback()"> 取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getQrcode, getSecret, bindGoogleAuthenticator } from "@/api/system";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

const secretKey = ref("");
const code = ref("");

const getQrcodeInfo = () => {
  const captchaImg: any = document.getElementById("captchaImg");
  captchaImg.style.visibility = "hidden";
  getQrcode({
    secretKey: secretKey.value,
    userName: props.row.username,
  }).then((res: any) => {
    const blob = new Blob([res.data], { type: "img/jpeg" });
    const url = URL.createObjectURL(blob);
    if (captchaImg) {
      captchaImg.src = url;
      captchaImg.style.visibility = "visible";
      captchaImg.onload = function () {
        URL.revokeObjectURL(url);
      };
    }
  });
};

const getSecretInfo = () => {
  getSecret().then((res: any) => {
    secretKey.value = res.data.data;
    getQrcodeInfo();
  });
};

const handleBindGoogleAuthenticator = () => {
  if (!code.value) {
    return ElMessage.warning("请输入手机上的 google 验证码");
  }
  const params = {
    code: code.value,
    secretKey: secretKey.value,
    userId: props.row.userId,
    username: props.row.username,
  };
  bindGoogleAuthenticator(params).then(() => {
    ElMessage.success("绑定成功");
    props.row.callback(true);
  });
};

const copy = () => {
  const inputElement: any = document.querySelector("#copyContent"); // 获取复制内容Element = document.querySelector("#copyContent");
  inputElement.select();
  document.execCommand("copy");
};

const noneBind = () => {
  ElMessage.warning("账户未完成google authenticator认证，请及时完成。");
  props.row.callback(true);
};

onMounted(() => {
  getSecretInfo();
});
</script>
