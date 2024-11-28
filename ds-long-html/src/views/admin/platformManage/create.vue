<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="名称:" prop="platformName">
      <el-input
        placeholder="请输入名称"
        style="width: 30%"
        v-model="ruleForm.platformName"
        clearable
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { platformSave } from "@/api/admin/index";
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
        id: "",
        platformName: "",
        platform: "",
      },
      options: [
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
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        platform: [
          { required: true, message: "请选择平台", trigger: "change" },
        ],
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    commit() {
      platformSave(this.ruleForm).then(() => {
        this.$message.success(this.ruleForm.id ? "修改成功" : "新增成功");
        this.row.callback(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
