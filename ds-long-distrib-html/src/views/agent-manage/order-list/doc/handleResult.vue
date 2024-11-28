<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default">
    <el-form-item label="选择处理结果" prop="isSuccess">
      <el-radio-group v-model="ruleForm.isSuccess">
        <el-radio :label="true">成功</el-radio>
        <el-radio :label="false">失败</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="失败原因" prop="failReason" v-if="!ruleForm.isSuccess">
      <el-input clearable v-model="ruleForm.failReason" />
    </el-form-item>

    <el-form-item label="凭证">
      <Upload
        bucketType="AD"
        :onChange="handleChangeUpload"
        :maxFileSize="10"
        :W2HRate="0"
        fileType="img"
        :limit="1"
        :fileList="[]"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import Upload from "@/components/Upload/index.vue";
import { extensionWithdrawOrderHandle } from "@/api/system";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  isSuccess: boolean;
  failReason: string;
  certificateBucket: string;
  certificateUrl: string;
}

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  isSuccess: true,
  failReason: "",
  certificateBucket: "ADVERT",
  certificateUrl: "",
});

const rules = reactive<FormRules<RuleForm>>({
  isSuccess: [
    {
      required: true,
      message: "选择处理结果",
      trigger: "change",
    },
  ],
  failReason: [
    { required: true, message: "请输入失败原因", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
});

const handleChangeUpload = (data: any) => {
  if (data && data.length) {
    const [item] = data;
    ruleForm.certificateBucket = item.bucketName;
    ruleForm.certificateUrl = item.key;
  } else {
    ruleForm.certificateBucket = "";
    ruleForm.certificateUrl = "";
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!ruleForm.certificateUrl) {
        return ElMessage.warning("请上传凭证");
      }
      const params = {
        ...ruleForm,
        id: props.row.id,
      };
      extensionWithdrawOrderHandle(params).then(() => {
        props.row.callback(true);
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  props.row.callback();
  if (!formEl) return;
  formEl.resetFields();
};
</script>
