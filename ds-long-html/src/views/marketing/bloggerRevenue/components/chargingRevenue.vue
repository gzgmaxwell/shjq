<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="UP数据:">
        <div style="display: flex; justify-content: space-between">
          <span>充电人数:{{ row.chargeUserCount }}</span>
          <span>充电量:{{ row.chargeMoneyCount }}$</span>
          <span>作品量:{{ row.videoCount }}</span>
        </div>
      </el-form-item>
      <div v-if="!row.isShow">
        <div style="text-align: center">
          <el-form-item style="margin-left: -120px">
            <el-radio-group
              v-model="ruleForm.auditResult"
              @change="changeHandle"
            >
              <el-radio
                v-for="item in bloggerAuditOption"
                :key="item.id"
                :label="item.id"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item
          label="请输入拒绝原因"
          prop="refuseReason"
          v-if="ruleForm.auditResult === ENUM_bloggerAuditOpra.REJECT"
        >
          <el-input type="textarea" v-model="ruleForm.refuseReason"></el-input>
        </el-form-item>
      </div>
      <el-form-item
        style="text-align: center; margin-left: -120px"
        v-if="!row.isShow"
      >
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  bloggerAuditOption,
  debounceCallBack,
  ENUM_bloggerAuditOpra,
} from "@/util/util";
import { commissionAudit } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      bloggerAuditOption: bloggerAuditOption.filter(
        (item) => item.id !== ENUM_bloggerAuditOpra.UNAUDITED
      ),
      ENUM_bloggerAuditOpra: ENUM_bloggerAuditOpra,
      ruleForm: {
        auditResult: ENUM_bloggerAuditOpra.APPROVE,
        refuseReason: "",
      },
      rules: {
        refuseReason: [
          { required: true, message: "请输入拒绝原因", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    changeHandle(val) {
      if (val) {
        this.ruleForm.refuseReason = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            applyId: this.row.applyId,
          };
          const comSubmit = () => {
            return commissionAudit(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("操作成功");
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

<style lang="sass" scoped></style>
