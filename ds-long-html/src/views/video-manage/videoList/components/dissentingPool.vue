<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item prop="disputeReason">
        <div style="text-align: center; margin-bottom: 20px">
          您确认移入内容到异议池吗？
        </div>
        <el-input
          type="text"
          v-model="ruleForm.disputeReason"
          placeholder="请输入异议内容"
          maxlength="20"
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
        disputeReason: "",
      },
      rules: {
        disputeReason: [
          { required: true, message: "请输入异议内容", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const comSubmit = () => {
            const params = {
              preIds: this.row.idsArr,
              disputeReason: this.ruleForm.disputeReason,
            };
            return dispute(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("移入成功");
                this.row.callback(true);
                Promise.resolve();
              }
            });
          };
          debounceCallBack(comSubmit)();
        } else {
          return false;
        }
      });
    },
  },
};
</script>