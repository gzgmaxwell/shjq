<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <span slot="label">用户头像:</span>
        <upload
          bucketType="PRE_VIDEO"
          accept="image/png,image/jpg,image/jpeg"
          @onChange="handleChange"
          :W2HRate="1 / 1"
          :maxFileSize="10"
          :limit="1"
          title="上传"
          :isW2HRateTip="true"
          :W2HRateOrigin="{
            width: 1,
            height: 1,
          }"
          :fileList="fileList"
        />
      </el-form-item>
      <el-form-item label="选择区号:" prop="countryCode" v-if="row.id">
        <el-select v-model="ruleForm.countryCode" placeholder="选择区号">
          <el-option
            v-for="(item, i) in optRegion"
            :key="i"
            :label="item.countryName + item.mobileCountryCode"
            :value="item.countryCode"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="!ruleForm.id ? '账号名:' : '手机号码:'"
        prop="mobile"
      >
        <el-input
          v-model="ruleForm.mobile"
          placeholder="请输入登录手机号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码:" prop="password" v-if="!ruleForm.id">
        <el-input
          v-model="ruleForm.password"
          placeholder="请输入登录密码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码:" v-else>
        <el-button @click="resetPasswords" type="primary">重置密码</el-button>
      </el-form-item>
      <el-form-item v-if="restSuccess">
        <span style="margin-right: 5px; color: #409eff">{{ restSuccess }}</span>
        <span>重置密码为:</span>
        <input
          style="width: 40%; border: none; color: red"
          id="copyContent"
          v-model="secretKey"
          readonly
        />
        <span class="primary ml20 pointer" @click="copy">复制</span>
      </el-form-item>
      <el-form-item label="昵称:" prop="nickName">
        <el-input
          v-model="ruleForm.nickName"
          :minlength="2"
          :maxlength="8"
          :show-word-limit="true"
          placeholder="请输入昵称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="账号状态:" prop="status">
        <el-radio-group v-model="ruleForm.status" @change="handleStatusChange">
          <el-radio :label="'ENABLE'">正常</el-radio>
          <el-radio :label="'DISABLE'">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item
        label="绑定账户:"
        prop="webUserId"
        v-if="!row.userType || row.userType == 2"
      >
        <el-select
          v-model="ruleForm.webUserId"
          remote
          filterable
          reserve-keyword
          placeholder="账户名称"
          clearable
        >
          <el-option
            v-for="(item, i) in accountList"
            :key="i"
            :label="item.username"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="isSubmitting"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  dsUserSave,
  dsUserUpdate,
  dsUserResetPassword,
  getKey,
} from "@/api/userList";
import { fetchList, ds_user_countryCode } from "@/api/admin/user";
import JSEncrypt from "jsencrypt";
import upload from "@/components/upload/index.vue";
export default {
  components: {
    upload,
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
      restSuccess: "",
      secretKey: "",
      isSubmitting: false,
      key: "",
      sign: "",
      // accountList: [],
      optRegion: [],
      fileList: [],
      ruleForm: {
        id: "",
        mobile: "",
        countryCode: "CN",
        status: "",
        vipType: "",
        // webUserId: "",
        password: "",
        nickName: "",
        avatar: "",
        avatarBucket: "",
      },
      rules: {
        mobile: [
          { required: true, message: "请输入登录手机号", trigger: "change" },
          {
            pattern: /^\d{7,15}$/,
            message: "手机号格式不正确",
            max: 15,
            min: 7,
            trigger: "blur",
          },
        ],
        countryCode: [
          { required: true, message: "请选择区号", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择账号状态", trigger: "change" },
        ],
        // webUserId: [
        //   { required: true, message: "请输入账户名称", trigger: "blur" },
        // ],
        nickName: [
          { min: 2, message: "昵称长度不能少于2个字符", trigger: "blur" },
          { max: 8, message: "昵称长度不能大于8个字符", trigger: "blur" },
        ],
        password: [
          {
            min: 6,
            max: 18,
            message: "密码长度不能少于6位且不能大于18位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // this.getFetchList();
    this.getId();
    this.$nextTick(() => {
      this.passwordEncrypt();
    });
    ds_user_countryCode().then((res) => {
      this.optRegion = res.data.data;
    });
  },
  methods: {
    handleChange(data) {
      if (data.length) {
        this.ruleForm.avatar = data[0].key;
        this.ruleForm.avatarBucket = data[0].bucketName;
      } else {
        this.ruleForm.avatar = "";
        this.ruleForm.avatarBucket = "";
      }
    },
    copy() {
      const inputElement = document.querySelector("#copyContent");
      inputElement.select();
      document.execCommand("copy");
      this.$message.success("复制成功");
    },
    handleStatusChange(value) {
      if (value === "DISABLE") {
        this.$confirm("确定要禁用账号吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.ruleForm.status = value;
          })
          .catch(() => {
            this.ruleForm.status = "ENABLE";
          });
      }
    },
    passwordEncrypt() {
      getKey().then((res) => {
        this.key = res.data.data.key;
        this.sign = res.data.data.sign;
      });
    },
    getId() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.mobile = this.row.mobile;
      this.ruleForm.countryCode = this.row.countryCode || "CN";
      this.ruleForm.status = this.row.status;
      this.ruleForm.vipType = this.row.vipType;
      this.ruleForm.password = this.row.password;
      this.ruleForm.nickName = this.row.nickName;
      this.ruleForm.avatar = this.row.avatar;
      this.ruleForm.avatarBucket = this.row.avatarBucket;

      if (this.row.avatarFileUrl) {
        this.fileList = [{ url: this.row.avatarFileUrl }];
      }

      if (!this.ruleForm.vipType) {
        this.ruleForm.vipType = "no";
      }
      // this.accountList.forEach((v) => {
      //   if (this.row.bindUserNick) {
      //     if (v.userId == this.row.webUserId) {
      //       this.ruleForm.webUserId = v.userId;
      //     }
      //   }
      // });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          setTimeout(() => {
            this.isSubmitting = false;
          }, 2000);
          if (!this.ruleForm.avatar) {
            // return this.$message.warning("请上传用户头像");
          }
          this.commit();
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
    commit() {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.key);
      let encryptedPassword = encrypt.encrypt(this.ruleForm.password);
      let sign = this.sign;
      let params = {};
      if (!this.ruleForm.status) {
        params.status = "ENABLE";
      }
      if (!this.ruleForm.id) {
        params = {
          ...this.ruleForm,
          password: encryptedPassword,
          sign,
        };
        dsUserSave(params).then(() => {
          this.$message.success("新增成功");
          this.row.callback(true);
        });
      } else {
        dsUserUpdate({
          ...this.ruleForm,
        }).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      }
    },
    // getFetchList() {
    //   fetchList({
    //     current: 1,
    //     size: 10000,
    //     validRole: true,
    //   }).then((res) => {
    //     // this.accountList = res.data.data.records;
    //     this.getId();
    //   });
    // },
    resetPasswords() {
      dsUserResetPassword(this.ruleForm.id).then((res) => {
        this.secretKey = res.data.data;
        this.restSuccess = "重置成功!";
      });
    },
  },
};
</script>
