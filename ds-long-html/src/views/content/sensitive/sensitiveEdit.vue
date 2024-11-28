<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      style="margin: 100px 0"
    >
      <el-form-item
        label="敏感词内容:"
        label-width="150px"
        prop="sensitiveWords"
      >
        <div style="width: 70%">
          <el-input
            v-model="form.sensitiveWords"
            placeholder="请输入敏感词内容"
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="row.callback && row.callback()">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </div>
</template>

<script>
import { updateSensitiv, addSensitiv } from "@/api/sensitiv/sensitiv";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        id: "",
        sensitiveWords: "",
      },
      rules: {
        sensitiveWords: [
          { required: true, message: "请填写敏感词内容", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getRow();
  },
  methods: {
    getRow() {
      this.form.sensitiveWords = this.row.sensitiveWords;
      this.form.id = this.row.id;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.form.id) {
            res = await updateSensitiv(this.form);
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.row.callback(true);
            }
          } else {
            res = await addSensitiv(this.form);
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              this.row.callback(true);
            }
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

<style lang="scss" scoped>
.dialog-footer {
  display: block;
  text-align: right;
}
</style>
