<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item prop="resource">
        <el-radio-group v-model="ruleForm.isSuccess">
          <el-radio :label="true">{{ $t("success") }}</el-radio>
          <el-radio :label="false">{{ $t("fail") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('failure_reason')"
        prop="failReason"
        v-if="ruleForm.isSuccess === false"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.failReason"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!handleRow.certificateUrl">
        <upload
          bucketType="FILE"
          accept=""
          listType="text"
          ref="uploadRef"
          @onChange="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          title="上传凭证"
          :drag="false"
          :fileList="fileList"
        ></upload>
      </el-form-item>
      <el-form-item v-if="handleRow.fullUrl">
        <div>
          <img :src="handleRow.fullUrl" alt="" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleRow.callback && handleRow.callback()">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("determine")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "@/components/upload/index.vue";
export default {
  components: {
    upload,
  },
  props: {
    handleRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      fileList: [],
      ruleForm: {
        isSuccess: true,
        failReason: "",
        certificateUrl: "",
        certificateBucket: "",
      },
      rules: {
        failReason: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("failure_reason")}`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onChangeFile(fileList) {
      this.ruleForm.certificateUrl = fileList[0].key;
      this.ruleForm.certificateBucket = fileList[0].bucketName;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            isSuccess: this.ruleForm.isSuccess,
            failReason: this.ruleForm.failReason,
            certificateUrl: this.ruleForm.certificateUrl,
            certificateBucket: this.ruleForm.certificateBucket,
          };
          this.handleRow.callback(data);
        } else {
          this.$message.error(this.$t("verification_failed"));
          return false;
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(fileList);
    },
  },
};
</script>

<style lang="scss" scoped></style>
