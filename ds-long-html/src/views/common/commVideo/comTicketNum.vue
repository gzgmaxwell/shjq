<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="form"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="观影券数量:" prop="value">
      <el-input-number
        v-model="form.value"
        :min="1"
        :precision="0"
        :step="1"
        :max="9999999999999"
        placeholder="请输入观影券数量"
      >
      </el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">确定</el-button>
      <el-button type="cancel" @click="row.callback && row.callback()"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        value: "",
      },
      rules: {
        value: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.row.callback(this.form);
        }
      });
    },
  },
};
</script>
