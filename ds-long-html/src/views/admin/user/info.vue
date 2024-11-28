<template>
  <basic-container>
    <template>
      <el-tabs @tab-click="switchTab" v-model="activeName">
        <el-tab-pane label="信息管理" name="userManager">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form
                :model="ruleForm2"
                ref="ruleForm2"
                :rules="rules"
                label-width="100px"
                v-if="switchStatus === 'userManager'"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input
                    type="text"
                    v-model="ruleForm2.username"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="ruleForm2.phone"
                    placeholder="验证码登录使用"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm2')"
                    >提交
                  </el-button>
                  <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="密码管理" name="passwordManager">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form
                :model="ruleForm2"
                :rules="rules2"
                ref="ruleForm2"
                label-width="100px"
                v-if="switchStatus === 'passwordManager'"
                class="demo-ruleForm"
              >
                <el-form-item label="原密码" prop="password">
                  <el-input
                    type="password"
                    v-model="ruleForm2.password"
                    auto-complete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="newpassword1">
                  <el-input
                    type="password"
                    v-model="ruleForm2.newpassword1"
                    :placeholder="`${$t('the_length_should_be')} ${$t(
                      '6-20'
                    )} ${$t('within_bits')}`"
                    auto-complete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newpassword2">
                  <el-input
                    type="password"
                    v-model="ruleForm2.newpassword2"
                    auto-complete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm2')"
                    >提交
                  </el-button>
                  <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </template>
  </basic-container>
</template>

<script>
import { handleDown } from "@/api/admin/user";
import { mapState } from "vuex";
import store from "@/store";
import request from "@/api/axios";

export default {
  data() {
    return {
      activeName: "userManager",
      switchStatus: "",
      avatarUrl: "",
      show: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      ruleForm2: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: "",
        avatar: "",
        phone: "",
      },
      rules: {
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
      rules2: {
        password: [
          {
            required: true,
            message: "原密码不能为空",
            trigger: "blur",
          },
          {
            required: true,
            min: 6,
            message: "原密码不能少于6位",
            trigger: "blur",
          },
        ],
        newpassword1: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur",
          },
          {
            required: true,
            min: 6,
            message: "新密码不能不少于6位",
            trigger: "blur",
          },
        ],
        newpassword2: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.ruleForm2.username = this.userInfo.username;
    this.ruleForm2.phone = this.userInfo.phone;
    this.switchStatus = "userManager";
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    updatedPhone() {
      return this.userInfo.phone;
    },
  },
  methods: {
    switchTab(tab, event) {
      this.$refs.ruleForm2.resetFields();
      this.switchStatus = tab.name;
      this.ruleForm2.phone = this.userInfo.phone;
      this.ruleForm2.password = "";
      this.ruleForm2.newpassword1 = "";
      this.ruleForm2.newpassword2 = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.activeName === "passwordManager") {
          if (
            !this.ruleForm2.password ||
            !this.ruleForm2.newpassword1 ||
            !this.ruleForm2.newpassword2
          ) {
            return;
          }
          if (this.ruleForm2.newpassword1 == this.ruleForm2.password) {
            this.$message.error("新密码不能和原密码一样");
            return;
          }
          if (this.ruleForm2.newpassword1 != this.ruleForm2.newpassword2) {
            this.$message.error("两次输入密码不一致");
            return;
          }
        }
        if (valid) {
          request({
            url: "/prm/web/user/userInfo/edit",
            method: "post",
            data: this.ruleForm2,
          }).then((response) => {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            this.userInfo.phone = this.ruleForm2.phone;
            if (this.switchStatus === "passwordManager") {
              this.$store.dispatch("LogOut").then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.switchStatus === "passwordManager") {
        this.ruleForm2.password = "";
        this.ruleForm2.newpassword1 = "";
        this.ruleForm2.newpassword2 = "";
      } else {
        this.ruleForm2.phone = "";
      }
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
