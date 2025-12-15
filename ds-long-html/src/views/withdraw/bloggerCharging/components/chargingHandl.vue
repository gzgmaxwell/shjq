<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <div style="text-align: center">
        <el-form-item style="margin-left: -150px">
          <el-radio-group v-model="ruleForm.auditType" @change="changeHandle">
            <el-radio
              v-for="item in chargingauditOption"
              :key="item.id"
              :label="item.id"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item
        label="请输入提现失败原因"
        prop="reason"
        v-if="ruleForm.auditType === ENUM_chargingAuditOpra.reject"
      >
        <el-input type="textarea" v-model="ruleForm.reason"></el-input>
      </el-form-item>
      <el-form-item v-show="ruleForm.auditType === ENUM_chargingAuditOpra.pass">
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
      <el-form-item style="text-align: center; margin-left: -150px">
        <el-button @click="handleRow.callback && handleRow.callback()"
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
import upload from "@/components/upload/index.vue";
import {
  chargingauditOption,
  debounceCallBack,
  ENUM_chargingAuditOpra,
} from "@/util/util";
import { withdrawHandle } from "@/api/admin/index";
export default {
  components: {
    upload,
  },
  props: {
    handleRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chargingauditOption: chargingauditOption,
      ENUM_chargingAuditOpra: ENUM_chargingAuditOpra,
      fileList: [],
      ruleForm: {
        auditType: ENUM_chargingAuditOpra.pass,
        reason: "",
        certificateFileName: "",
        certificateBucket: "",
      },
      rules: {
        reason: [
          {
            required: true,
            message: "请输入提现失败原因",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    onChangeFile(fileList) {
      this.ruleForm.certificateFileName = fileList[0]?.key;
      this.ruleForm.certificateBucket = fileList[0]?.bucketName;
    },
    changeHandle(val) {
      if (val) {
        this.ruleForm.reason = "";
        this.ruleForm.certificateFileName = "";
        this.ruleForm.certificateBucket = "";
        this.fileList = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            id: this.handleRow.id,
          };
          const comSubmit = () => {
            return withdrawHandle(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("操作成功");
                this.handleRow.callback(true);
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
