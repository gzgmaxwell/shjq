<template>
  <div>
    <h2>
      {{ $t("current_withdrawal") }}:{{ auditRow.withdrawMoney.toFixed(2) }}
    </h2>
    <ul>
      <li>
        <span>{{ withdrawData.settlement }}</span>
        {{ auditRow.clearingPeriodType }}
      </li>
      <li>
        <span>{{ withdrawData.account }}</span>
        {{ auditRow.userName }}
      </li>
      <li>
        <span>{{ withdrawData.name }}</span> {{ auditRow.realName }}
      </li>
    </ul>
    <el-dialog
      width="30%"
      :title="$t('reason_for_failure')"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('reason_for_failure')" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose">{{ $t("cancel") }}</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">{{
            $t("determine")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div style="text-align: center">
      <el-button size="normal" type="primary" @click="pass">{{
        $t("pass")
      }}</el-button>
      <el-button size="normal" type="danger" @click="innerVisible = true">{{
        $t("noPass")
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    withdrawData: {
      type: Object,
      default: () => {},
    },
    auditRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      innerVisible: false,
      ruleForm: {
        description: "",
      },
      rules: {
        description: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t(
              "reason_for_failure"
            )}`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    pass() {
      const data = {
        isPass: true,
      };
      this.auditRow.callback(data);
    },
    handleClose() {
      this.innerVisible = false;
      this.ruleForm = {};
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            isPass: false,
            description: this.ruleForm.description,
          };
          this.auditRow.callback(data);
        } else {
          this.$message.error(this.$t("verification_failed"));
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  li {
    font-size: 18px;
    padding: 8px 0;
    width: 250px;
  }
}
</style>
