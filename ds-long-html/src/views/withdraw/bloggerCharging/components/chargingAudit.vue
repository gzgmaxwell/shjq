<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div style="text-align: center">
        <el-form-item style="margin-left: -120px">
          <el-radio-group v-model="ruleForm.auditType" @change="changeHandle">
            <el-radio
              v-for="item in chargingauditOption"
              :key="item.id"
              :label="item.id"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item
        label="请输入驳回原因"
        prop="reason"
        v-if="ruleForm.auditType === ENUM_chargingAuditOpra.reject"
      >
        <el-input type="textarea" v-model="ruleForm.reason"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center; margin-left: -120px">
        <el-button @click="auditRow.callback && auditRow.callback()"
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  chargingauditOption,
  debounceCallBack,
  ENUM_chargingAuditOpra,
} from "@/util/util";
import { withdrawAudit } from "@/api/admin/index";
export default {
  props: {
    auditRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chargingauditOption: chargingauditOption,
      ENUM_chargingAuditOpra: ENUM_chargingAuditOpra,
      ruleForm: {
        auditType: ENUM_chargingAuditOpra.pass,
        reason: "",
      },
      rules: {
        reason: [
          { required: true, message: "请输入驳回原因", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    changeHandle(val) {
      if (val) {
        this.ruleForm.reason = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            id: this.auditRow.id,
          };
          const comSubmit = () => {
            return withdrawAudit(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("操作成功");
                this.auditRow.callback(true);
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

<style lang="sass" scoped></style>
