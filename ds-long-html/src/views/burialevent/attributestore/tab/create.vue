<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="属性名称" prop="propertyName">
        <el-input
          v-model="ruleForm.propertyName"
          placeholder="请输入属性名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="属性中文名称" prop="propertyDesc">
        <el-input
          v-model="ruleForm.propertyDesc"
          placeholder="请输入属性中文名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrUpdateProperty } from "@/api/burialevent";

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
        propertyName: "",
        propertyDesc: "",
      },

      rules: {
        propertyName: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
        ],
        propertyDesc: [
          { required: true, message: "请输入属性中文名称", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    if (this.row.id) {
      this.ruleForm.propertyName = this.row.propertyName;
      this.ruleForm.propertyDesc = this.row.propertyDesc;
    }
  },
  methods: {
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
        publicProperty: this.row.publicProperty,
      };
      saveOrUpdateProperty(params).then((res) => {
        const tip = this.row.id ? "编辑成功" : "保存成功";
        this.$message.success(tip);
        this.row.callback(true);
      });
    },
  },
};
</script>
