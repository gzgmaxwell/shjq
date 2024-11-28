<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="85px"
      class="demo-ruleForm"
      :disabled="row.isShow"
    >
      <el-form-item label="内容:" prop="problemTitle">
        <el-input
          v-model="ruleForm.problemTitle"
          placeholder="请输入内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="回复内容:" prop="problemContent">
        <el-input
          type="textarea"
          v-model="ruleForm.problemContent"
          placeholder="请输入回复内容"
          maxlength="300"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="分类:" prop="classifyId">
        <el-select
          v-model="ruleForm.classifyId"
          placeholder="请选择分类"
          clearable
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.classifyName"
            :value="item.classifyId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否常见:" prop="problemType">
        <el-radio-group v-model="ruleForm.problemType">
          <el-radio label="NORMAL">是</el-radio>
          <el-radio label="OTHER">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="row.isShow">
        <el-form-item label="常见问题:" prop="problemType">
          {{ row.problemType == "NORMAL" ? "是" : "否" }}
        </el-form-item>
        <el-form-item label="已解决:" prop="solveCount">{{
          row.solveCount
        }}</el-form-item>
        <el-form-item label="未解决:" prop="unsolveCount">{{
          row.unsolveCount
        }}</el-form-item>
        <el-form-item label="更新人:" prop="createUserName">
          {{ row.createUserName }}</el-form-item
        >
        <el-form-item label="更新时间:" prop="createTime">
          {{ row.createTime }}</el-form-item
        >
      </div>
      <el-form-item v-if="!row.isShow">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addObj,
  editObj,
  queryTypeList,
} from "@/api/report-and-feedback/help.js";
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
        problemTitle: "",
        problemContent: "",
        classifyId: "",
        problemType: "",
      },
      rules: {
        problemTitle: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        problemContent: [
          { required: true, message: "请输入回复内容", trigger: "blur" },
        ],
        classifyId: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    queryTypeList({ current: 1, size: 10000 }).then((res) => {
      this.options = res.data.data.records;
    });
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm.problemTitle = this.row.problemTitle;
      this.ruleForm.problemContent = this.row.problemContent;
      this.ruleForm.classifyId = this.row.classifyId;
      this.ruleForm.problemType = this.row.problemType;
      this.ruleForm.classifyId = this.row.classifyId;
      this.ruleForm.problemId = this.row.problemId;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.row.isId) {
            addObj(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
              }
            });
          } else {
            editObj(this.ruleForm).then((res) => {
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
