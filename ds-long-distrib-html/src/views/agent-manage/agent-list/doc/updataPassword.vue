<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default">
    <el-form-item label="账号" prop="distrMobile">
      <el-input style="width: 30%" v-model="ruleForm.distrMobile" :disabled="disabledBtn" />
      <el-button
        type="primary"
        class="ml5"
        @click="
          () => {
            disabledBtn = !disabledBtn;
          }
        "
        >修改</el-button
      >
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="surePassword">
      <el-input v-model="ruleForm.surePassword" type="password" placeholder="请输入确认密码" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getKey, editAgentInfo } from "@/api/system";
import JSEncrypt from "jsencrypt";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  distrMobile: string;
  password: string;
  surePassword: string;
}

const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  distrMobile: "",
  password: "",
  surePassword: "",
});
const disabledBtn = ref(true);
const key = ref("");
const sign = ref("");

const rules = reactive<FormRules<RuleForm>>({
  distrMobile: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  surePassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (ruleForm.password !== ruleForm.surePassword) {
      return ElMessage.warning("两次输入的密码不一致");
    }
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(key.value);
    const params = {
      password: encrypt.encrypt(ruleForm.password),
      sign: sign.value,
      userId: props.row.distrId,
    };
    if (valid) {
      editAgentInfo(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          props.row.callback(true);
        }
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
onMounted(() => {
  if (props.row.id) {
    ruleForm.distrMobile = props.row.distrMobile;
  }
  getKey().then((res) => {
    const { data } = res;
    if (data.code == 200) {
      key.value = data.data.key;
      sign.value = data.data.sign;
    }
  });
});
</script>
