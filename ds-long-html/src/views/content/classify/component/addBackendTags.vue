<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="标签名称" prop="classifyName">
        <el-input
          v-model="ruleForm.classifyName"
          placeholder="请输入标签名称"
          maxlength="20"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="启用状态" prop="classifyStatus">
        <el-radio-group v-model="ruleForm.classifyStatus">
          <el-radio
            v-for="item in optionStatus"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { optionStatus } from "@/util/util";
import { saveOrUpdate } from "@/api/content/classify";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      optionStatus: optionStatus,
      ruleForm: {
        classifyName: "",
      },
      rules: {
        classifyName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    getRow() {
      this.ruleForm = {
        classifyName: this.row.classifyName,
        id: this.row.id,
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdate(this.ruleForm).then((res) => {
            if (res.data.code === 200) {
              const message = !this.row.id ? "新增成功" : "编辑成功";
              this.$message.success(message);
              this.row.callback(true);
            }
          });
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
