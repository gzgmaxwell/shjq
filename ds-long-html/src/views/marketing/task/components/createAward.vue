<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="方案名称" prop="schemeName">
      <el-input
        placeholder="请输入方案名称"
        v-model="ruleForm.schemeName"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { schemeSave } from "@/api/marketing/index";

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
      ruleForm: {
        schemeName: undefined,
      },
      rules: {
        schemeName: [
          {
            required: true,
            message: "请输入方案名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.schemeName = this.row.schemeName;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      const params = {
        ...this.ruleForm,
        id: this.row.id,
      };
      schemeSave(params).then(() => {
        this.row.callback(true);
        this.$message.success(this.row.id ? "编辑成功" : "新增成功");
      });
    },
  },
};
</script>
