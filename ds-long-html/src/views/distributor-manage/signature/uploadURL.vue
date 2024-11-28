<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item prop="uploadUrl">
        <el-input
          type="text"
          v-model="ruleForm.uploadUrl"
          placeholder="请输入URL"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="text-align: right">
          <el-button @click="row.callback && row.callback()">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dispute } from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        uploadUrl: "",
      },
      rules: {
        uploadUrl: [{ required: true, message: "请输入URL", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.ruleForm.uploadUrl = this.row.uploadUrl;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.row.callback(this.ruleForm);
        }
      });
    },
  },
};
</script>
