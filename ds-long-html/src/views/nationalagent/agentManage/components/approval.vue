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
          <el-radio-group v-model="ruleForm.status" @change="changeHandle">
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
        prop="reason"
        v-if="ruleForm.status === ENUM_bloggerAuditOpra.REJECT"
      >
        <el-input type="textarea" v-model="ruleForm.reason"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center; margin-left: -120px">
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
import { userAgentAudit } from "@/api/admin/index";
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
        status: ENUM_bloggerAuditOpra.APPROVE,
        reason: "",
      },
      rules: {
        reason: [
          { required: true, message: "请输入拒绝原因", trigger: "change" },
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
            id: this.row.id,
          };
          const comSubmit = () => {
            return userAgentAudit(params).then((res) => {
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
