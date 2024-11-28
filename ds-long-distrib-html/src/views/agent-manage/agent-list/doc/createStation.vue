<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm" size="default">
    <span v-if="nextStep">
      <el-form-item label="创建站长账号" prop="stationmasterMobile" v-if="!props.row.stationmasterId">
        <el-input
          clearable
          v-model="ruleForm.stationmasterMobile"
          onkeyup="this.value=this.value.replace(/[^\d]/g,'') "
        />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!props.row.stationmasterId">
        <el-input clearable v-model="ruleForm.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="姓名" prop="stationmasterName">
        <el-input clearable v-model="ruleForm.stationmasterName" />
      </el-form-item>
      <el-form-item label="站长类型" prop="stationmasterType" v-if="!props.row.stationmasterId">
        <el-radio-group v-model="ruleForm.stationmasterType">
          <el-radio :label="item.id" v-for="item in optWebmasterType" :key="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('认证状态')" v-if="props.row.stationmasterId">
        <span>{{ compuAuthenticatorStatus }}</span>
      </el-form-item>
      <el-form-item v-if="!props.row.authenticatorStatus && props.row.stationmasterId">
        <span class="activeBule" @click="handleAuth">去完成安全认证</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          {{ props.row.stationmasterId ? "确定" : "下一步" }}
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </span>
    <span v-if="!nextStep">
      <bindGoogleAuth :row="infoParams" />
    </span>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { optWebmasterType, EnumWebmasterType, optionsAuthenticator } from "@/enums";
import { stationmaster_edit, stationmaster_save, getKey } from "@/api/system";
import JSEncrypt from "jsencrypt";
import bindGoogleAuth from "@/views/common/bindGoogleAuth/index.vue";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  stationmasterMobile: string;
  password: string;
  stationmasterName: string;
  stationmasterType: string;
}

const key = ref("");
const sign = ref("");
const nextStep = ref(true);
const infoParams = {
  userId: "",
  username: "",
  callback: (data: any) => props.row.callback(data),
};

const compuAuthenticatorStatus = computed(() => {
  const item = optionsAuthenticator.find((v: any) => v.id === props.row.authenticatorStatus);
  return item?.name;
});

const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<any>({
  stationmasterMobile: "",
  password: "",
  stationmasterName: "",
  stationmasterType: EnumWebmasterType.CPA_STATIONMASTER,
});

const rules = reactive<FormRules<RuleForm>>({
  stationmasterMobile: [{ required: true, min: 11, max: 11, message: "请输入正确的电话号码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  stationmasterName: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
  stationmasterType: [
    {
      required: true,
      message: `请选择站长类型`,
      trigger: "blur",
    },
  ],
});

const handleAuth = () => {
  nextStep.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(key.value);
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (!props.row.stationmasterId) {
        const createParams = {
          stationmasterMobile: ruleForm.stationmasterMobile,
          stationmasterName: ruleForm.stationmasterName,
          stationmasterType: ruleForm.stationmasterType,
          password: encrypt.encrypt(ruleForm.password),
          sign: sign.value,
        };
        stationmaster_save(createParams).then((res) => {
          ElMessage.success("新增成功");
          infoParams.userId = res.data.data.userId;
          infoParams.username = res.data.data.username;
          nextStep.value = false;
        });
      } else {
        stationmaster_edit({
          stationmasterId: props.row.stationmasterId,
          stationmasterName: ruleForm.stationmasterName,
        }).then(() => {
          ElMessage.success("编辑成功");
          props.row.callback(true);
        });
      }
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  props.row.callback();
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  if (props.row?.stationmasterId) {
    ruleForm.stationmasterMobile = props.row.stationmasterMobile;
    ruleForm.stationmasterName = props.row.stationmasterName;
    ruleForm.stationmasterType = props.row.stationmasterType;
    infoParams.userId = props.row.stationmasterId;
    infoParams.username = props.row.stationmasterMobile;
  }

  if (!props.row?.stationmasterId) {
    getKey().then((res) => {
      key.value = res.data.data.key;
      sign.value = res.data.data.sign;
    });
  }
});
</script>
