<template>
  <base-card>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
    >
      <el-form-item label="原密码" prop="prePassword">
        <el-input style="width: 30%" placeholder="请输入原密码" v-model="ruleForm.prePassword" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          style="width: 30%"
          v-model="ruleForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="surePassword">
        <el-input
          style="width: 30%"
          v-model="ruleForm.surePassword"
          type="password"
          placeholder="请输入确认密码"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </base-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getKey } from "@/api/system";
import { updatePassword } from "@/api/common";
import JSEncrypt from "jsencrypt";
import { useUserStore } from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";

const userStore = useUserStore();
const tagsViewStore = useTagsViewStore();
const route = useRoute();
const router = useRouter();

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  prePassword: string;
  password: string;
  surePassword: string;
}

const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  prePassword: "",
  password: "",
  surePassword: "",
});
const key = ref("");
const sign = ref("");

const rules = reactive<FormRules<RuleForm>>({
  prePassword: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
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
  await formEl.validate((valid) => {
    if (ruleForm.password !== ruleForm.surePassword) {
      return ElMessage.warning("两次输入的密码不一致");
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(key.value);
    const params = {
      password: encrypt.encrypt(ruleForm.password),
      prePassword: encrypt.encrypt(ruleForm.prePassword),
      sign: sign.value,
    };
    if (valid) {
      updatePassword(params).then(() => {
        ElMessage.success("修改成功");
        userStore
          .logout()
          .then(() => {
            tagsViewStore.delAllViews();
          })
          .then(() => {
            router.push(`/login?redirect=${route.fullPath}`);
          });
        return;
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
    const { data } = res;
    if (data.code == 200) {
      key.value = data.data.key;
      sign.value = data.data.sign;
    }
  });
});
</script>
