<template>
  <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-form-item>
      <el-row>
        <el-col :span="12">
          <span class="el-icon-info primary"></span>
          <span> 绑定 google Authenticator</span>
        </el-col>
        <el-col :span="12">
          <span class="curPrimary" @click="noneBind">暂不绑定</span>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <div>打开谷歌验证器，扫描下方二维码或手动输入下述秘钥添加验证令牌</div>
      <div class="must">
        秘钥用于手机更换或遗失找回谷歌验证器，绑定前请务必将下述秘钥备份
      </div>
    </el-form-item>
    <el-form-item>
      <img id="captchaImg" alt="二维码" width="120" height="120" />
      <span class="primary ml20 pointer" @click="getQrcodeInfo">刷新</span>
    </el-form-item>
    <el-form-item>
      <textarea
        style="width: 70%; border: 1px solid #d8d8d8"
        id="copyContent"
        :rows="3"
        v-model="secretKey"
        readonly
      />
      <span class="primary ml10 pointer" @click="copy">复制</span>
    </el-form-item>
    <el-form-item>
      <el-row>
        <el-col :span="12">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            :placeholder="$t('请输入手机上的Google验证码')"
            v-model="code"
            clearable
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleBindGoogleAuthenticator"
        >绑 定</el-button
      >
      <el-button @click="row.callback && row.callback()">
        {{ $t("cancel") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  bindGoogleAuthenticator,
  getQrcode,
  getSecret,
} from "@/api/admin/index";

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
      secretKey: "",
      code: "",
    };
  },
  mounted() {
    this.getSecretInfo();
  },

  methods: {
    getQrcodeInfo() {
      const captchaImg = document.getElementById("captchaImg");
      captchaImg.style.visibility = "hidden";
      getQrcode({
        secretKey: this.secretKey,
        userName: this.row.username,
      }).then((res) => {
        const blob = new Blob([res.data], { type: "img/jpeg" });
        const url = (URL || webkitURL).createObjectURL(blob);
        if (captchaImg) {
          captchaImg.src = url;
          captchaImg.style.visibility = "visible";
          captchaImg.onload = function () {
            URL.revokeObjectURL(url);
          };
        }
      });
    },
    getSecretInfo() {
      getSecret().then((res) => {
        this.secretKey = res.data.data;
        this.getQrcodeInfo();
      });
    },
    handleBindGoogleAuthenticator() {
      if (!this.code) {
        return this.$message.warning("请输入手机上的 google 验证码");
      }
      const params = {
        code: this.code,
        secretKey: this.secretKey,
        userId: this.row.userId,
        username: this.row.username,
      };
      bindGoogleAuthenticator(params).then(() => {
        this.$message.success("绑定成功");
        this.row.callback(true);
      });
    },
    copy() {
      const inputElement = document.querySelector("#copyContent");
      inputElement.select();
      document.execCommand("copy");
    },
    noneBind() {
      this.$message.warning("账户未完成google authenticator认证，请及时完成。");
      this.row.callback(true);
    },
  },
};
</script>
