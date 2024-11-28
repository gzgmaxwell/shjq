<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default">
    <el-form-item>
      <div class="tip" style="width: 100%">
        你的账号密码以及认证状态都将重置, 请知悉! 完成密码重置后,请前往编辑完成认证!
      </div>
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
import { getKey, resetStatus } from "@/api/system";
import JSEncrypt from "jsencrypt";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  password: string;
  surePassword: string;
}

const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  password: "",
  surePassword: "",
});
const key = ref("");
const sign = ref("");

const rules = reactive<FormRules<RuleForm>>({
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
    // {
    //   pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?`~|]).*$/,
    //   message: "密码必须由字母、数字和特殊字符组成",
    //   trigger: "blur",
    // },
  ],
  surePassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (ruleForm.password !== ruleForm.surePassword) {
      return ElMessage.warning("两次输入的密码不一致");
    }
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(key.value);
    const params = {
      // encrypt.encrypt(ruleForm.password),
      password: ruleForm.password,
      // sign: sign.value,
      qrpassword: ruleForm.surePassword,
      userId: props.row.userId,
    };
    if (valid) {
      resetStatus(params).then(() => {
        props.row.callback(true);
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  props.row.callback();
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  getKey().then((res) => {
    key.value = res.data.data.key;
    sign.value = res.data.data.sign;
  });
});
</script>

<style lang="scss" scoped>
.tip {
  display: block;
  padding: 6px;
  margin-bottom: 20px;
  text-align: center;
  background-color: #f5dcdc;
  border: 1px solid #f0b8b8;
  border-radius: 5px;
}
</style>
