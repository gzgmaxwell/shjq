<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio :label="true">{{ auditRow.successStatus }}</el-radio>
          <el-radio :label="false">{{ auditRow.errorStatus }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="`${$t('please_enter')} ${auditRow.errorStatus} ${$t('reason')}`"
        prop="desc"
        v-if="ruleForm.resource === false"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.desc"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="auditRow.callback && auditRow.callback()">{{
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
export default {
  props: {
    auditRow: {
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
        resource: true,
        desc: "",
      },
      rules: {
        desc: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${
              this.auditRow.errorStatus
            } ${this.$t("reason")}`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commSubmit();
        } else {
          this.$message.error(this.$t("verification_failed"));
          return false;
        }
      });
    },
    commSubmit() {
      const myParams = {
        reason: this.ruleForm.resource,
        content: this.ruleForm.desc,
      };
      return this.auditRow.callback(myParams);
    },
  },
};
</script>
