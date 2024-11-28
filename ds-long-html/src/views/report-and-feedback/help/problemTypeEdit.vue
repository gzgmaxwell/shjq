<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="85px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类名称:" prop="classifyName">
        <el-input
          v-model="ruleForm.classifyName"
          placeholder="请输入分类名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="排序位置:" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          placeholder="请输入排序位置"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="启用状态:" prop="classifyStatus">
        <el-radio-group v-model="ruleForm.classifyStatus">
          <el-radio label="1">启用</el-radio>
          <el-radio label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTypeObj, editTypeObj } from "@/api/report-and-feedback/help.js";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      options: [],
      ruleForm: {
        classifyName: "",
        sort: "",
        classifyStatus: "",
      },
      rules: {
        classifyName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序位置", trigger: "blur" }],
      },
    };
  },

  mounted() {
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm.classifyName = this.row.classifyName;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.classifyStatus = this.row.classifyStatus;
      this.ruleForm.classifyId = this.row.classifyId;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.row.isId) {
            addTypeObj(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
              }
            });
          } else {
            editTypeObj(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("编辑成功");
                this.row.callback(true);
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
