<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="代理账号:" prop="platformName">
      <el-input
        placeholder="请输入手机号"
        style="width: 30%"
        v-model="ruleForm.platformName"
        clearable
        disabled
      />
    </el-form-item>
    <el-form-item label="登录密码:" prop="password">
      <el-input
        type="password"
        placeholder="设置6-20位密码"
        style="width: 30%"
        v-model="ruleForm.password"
        clearable
      />
    </el-form-item>
    <el-form-item label="姓名:" prop="userName">
      <el-input
        placeholder="输入姓名"
        style="width: 30%"
        v-model="ruleForm.userName"
        clearable
        maxlength="20"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="设置方案权限:">
      <el-switch v-model="ruleForm.permissions"></el-switch>
    </el-form-item>
    <el-form-item label="cpa方案:" prop="cpa">
      <el-select v-model="ruleForm.cpa" placeholder="请选择方案">
        <el-option
          v-for="item in optionsOne"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          clearable
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="cps方案:" prop="cps">
      <el-select v-model="ruleForm.cps" placeholder="请选择方案">
        <el-option
          v-for="item in optionsTwo"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          clearable
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="row.callback && row.callback()">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { platformSave } from "@/api/admin/index";
import upload from "@/components/upload";
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
      fileList: [],
      ruleForm: {
        id: "",
        password: "",
        platformName: "",
        cpa: "",
        cps: "",
        permissions: false,
      },
      optionsOne: [
        {
          value: "LONG_VIDEO",
          label: "长视频平台",
        },
        {
          value: "SHORT_VIDEO",
          label: "短视频平台",
        },
      ],
      optionsTwo: [
        {
          value: "LONG_VIDEO",
          label: "长视频平台",
        },
        {
          value: "SHORT_VIDEO",
          label: "短视频平台",
        },
      ],
      assets: [],
      rules: {
        platformName: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度6-20位", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "密码只能包含字母和数字",
            trigger: "blur",
          },
        ],
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        cpa: [{ required: true, message: "请选择方案", trigger: "change" }],
        cps: [{ required: true, message: "请选择方案", trigger: "change" }],
      },
    };
  },
  computed: {},
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.platformName = this.row.platformName;
      this.ruleForm.platform = this.row.platform;
    },
    submitForm(formName) {
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
      platformSave(this.ruleForm).then(() => {
        this.$message.success(this.ruleForm.id ? "编辑成功" : "新增成功");
        this.row.callback(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
