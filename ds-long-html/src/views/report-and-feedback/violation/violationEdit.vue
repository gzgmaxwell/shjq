<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="违规原因" prop="classifyName">
        <el-input
          v-model="ruleForm.classifyName"
          placeholder="请填写违规原因"
        ></el-input>
      </el-form-item>
      <!-- 5.9 需求屏蔽 -->
      <!-- <el-form-item label="分类" prop="classifyType">
        <el-select v-model="ruleForm.classifyType" placeholder="请选择分类">
          <el-option
            :label="item.name"
            :value="item.id"
            :key="item.id"
            v-for="item in optionsClassifyType"
          ></el-option>
        </el-select>
      </el-form-item> -->
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
import { addObj, editObj } from "@/api/report-and-feedback/violation.js";
import { optionsClassifyType } from "@/util/util";
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
        classifyName: "",
      },
      optionsClassifyType: optionsClassifyType,
      rules: {
        classifyName: [
          { required: true, message: "请输入违规原因", trigger: "blur" },
        ],
        // 5.9 需求屏蔽
        // classifyType: [
        //   { required: true, message: "请选择分类", trigger: "blur" },
        // ],
      },
    };
  },
  mounted() {
    if (this.row.classifyId) {
      this.getRow();
    }
  },
  methods: {
    getRow() {
      this.ruleForm = {
        ...this.row,
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.row.isShow) {
            const params = {
              classifyName: this.ruleForm.classifyName,
              classifyType: "1",
            };
            addObj(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
              }
            });
          } else {
            const params = {
              ...this.ruleForm,
              classifyType: this.ruleForm.classifyType,
            };
            editObj(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("编辑成功");
                this.row.callback(true);
              }
            });
          }
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped></style>
