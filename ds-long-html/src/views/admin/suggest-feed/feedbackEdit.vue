<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="反馈用户:"> {{ row.createUserName }}</el-form-item>
      <el-form-item label="反馈内容:"> {{ row.feedbackContent }}</el-form-item>
      <el-form-item label="回复内容:" prop="replyContent">
        <el-input
          type="textarea"
          v-model="ruleForm.replyContent"
          maxlength="300"
          show-word-limit
          :disabled="row.replyStatus == '2'"
        ></el-input>
      </el-form-item>
      <div v-if="row.replyStatus == '2'">
        <el-form-item label="附件:">
          <span v-for="(item, index) in row.attachmentList" :key="index">
            <img :src="item.attachmentUrl" alt="" />
          </span>
        </el-form-item>
        <el-form-item label="联系方式:"> {{ row.contactInfo }}</el-form-item>
        <el-form-item label="反馈时间:"> {{ row.createTime }}</el-form-item>
      </div>
      <el-form-item v-if="row.replyStatus == '1'">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reply } from "@/api/admin/suggest-feed.js";
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
        replyContent: "",
      },
      rules: {
        replyContent: [
          {
            required: true,
            message: "请输入回复内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm.replyContent = this.row.replyContent;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            feedbackId: this.row.feedbackId,
            replyContent: this.ruleForm.replyContent,
          };
          reply(params).then(() => {
            this.$message.success("编辑成功");
            this.row.callback(true);
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
