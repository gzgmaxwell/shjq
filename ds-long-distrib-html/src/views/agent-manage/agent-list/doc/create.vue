<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm" size="default">
    <span v-if="nextStep">
      <el-form-item label="渠道账号" prop="distrMobile">
        <el-input
          clearable
          v-model="ruleForm.distrMobile"
          :disabled="props.row.id != null"
          onkeyup="this.value=this.value.replace(/[^\d]/g,'') "
        />
      </el-form-item>
      <el-form-item label="密码" prop="agentPassword" v-if="!props.row.id">
        <el-input clearable v-model="ruleForm.agentPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="姓名" prop="distrName">
        <el-input clearable v-model="ruleForm.distrName" />
      </el-form-item>

      <el-form-item label="等级" prop="level">
        <el-input disabled clearable v-model="ruleForm.level" />
      </el-form-item>

      <el-form-item label="渠道商身份" prop="channelType">
        <el-radio-group
          v-model="ruleForm.channelType"
          placeholder="请选择结算周期"
          @change="
            (val: any) => {
              if (val !== EnumWebmasterType.CHANNEL) {
                ruleForm.allowCreateChild = false;
              }
            }
          "
        >
          <el-radio :label="item.id" v-for="item in compuOptWebmasterType" :key="item.id" :disabled="item.disabled">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="允许创建渠道账号" prop="allowCreateChild">
        <el-radio-group
          v-model="ruleForm.allowCreateChild"
          :disabled="ruleForm.channelType !== EnumWebmasterType.CHANNEL"
        >
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="认证状态" v-if="props.row.id">
        <span>{{ compuAuthenticatorStatus }}</span>
      </el-form-item>
      <el-form-item v-if="!props.row.authenticatorStatus && props.row.id">
        <span class="activeBule" @click="handleAuth">去完成安全认证</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          {{ props.row.id ? "确定" : "下一步" }}
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
import { getKey, currentLevel, distributorSave, distributorEdit } from "@/api/system";
import JSEncrypt from "jsencrypt";
import bindGoogleAuth from "@/views/common/bindGoogleAuth/index.vue";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  distrMobile: string;
  agentPassword: string;
  distrName: string;
  level: string;
  channelType: string;
  allowCreateChild: boolean;
}

const key = ref("");
const sign = ref("");
const nextStep = ref(true);
const infoParams = {
  userId: "",
  username: "",
  callback: (data: any) => props.row.callback(data),
};
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<any>({
  distrMobile: "",
  agentPassword: "",
  distrName: "",
  level: "",
  allowCreateChild: true,
  channelType: EnumWebmasterType.CHANNEL,
});

const rules = reactive<FormRules<RuleForm>>({
  distrMobile: [{ required: true, min: 11, max: 11, message: "请输入正确的电话号码", trigger: "blur" }],
  agentPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  distrName: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
  level: [{ required: true, message: "请输入等级", trigger: "blur" }],
  allowCreateChild: [
    {
      required: true,
      message: `请选择是否允许创建渠道账号`,
      trigger: "blur",
    },
  ],
});

const handleAuth = () => {
  nextStep.value = false;
};

const compuAuthenticatorStatus = computed(() => {
  const item = optionsAuthenticator.find((v: any) => v.id === props.row.authenticatorStatus);
  return item?.name;
});
const compuOptWebmasterType = computed(() => {
  return optWebmasterType.map((v: any) => {
    if (props.row.channelType === EnumWebmasterType.CHANNEL || (v.id === EnumWebmasterType.CHANNEL && props.row.id)) {
      v.disabled = true;
    } else {
      v.disabled = false;
    }
    return v;
  });
});

const submitForm = async (formEl: FormInstance | undefined) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(key.value);
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (!props.row.id) {
        const createParams = {
          channelType: ruleForm.channelType,
          distrMobile: ruleForm.distrMobile,
          distrName: ruleForm.distrName,
          level: ruleForm.level,
          allowCreateChild: ruleForm.allowCreateChild,
          password: encrypt.encrypt(ruleForm.agentPassword),
          sign: sign.value,
        };
        distributorSave(createParams).then((res) => {
          ElMessage.success("新增成功");
          infoParams.userId = res.data.data.userId;
          infoParams.username = res.data.data.username;
          nextStep.value = false;
        });
      } else {
        distributorEdit({
          id: props.row.distrChannelId,
          distrName: ruleForm.distrName,
          channelType: ruleForm.channelType,
          allowCreateChild: ruleForm.allowCreateChild,
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
  if (props.row?.id) {
    ruleForm.distrMobile = props.row.distrMobile;
    ruleForm.agentPassword = props.row.agentPassword;
    ruleForm.distrName = props.row.distrName;
    ruleForm.channelType = props.row.channelType;
    ruleForm.level = props.row.level;
    ruleForm.allowCreateChild = props.row.allowCreateChild;
    ruleForm.authenticatorStatus = props.row.authenticatorStatus;
    infoParams.userId = props.row.id;
    infoParams.username = props.row.distrMobile;
  }

  if (!props.row?.id) {
    getKey().then((res) => {
      key.value = res.data.data.key;
      sign.value = res.data.data.sign;
    });
    currentLevel().then((res) => {
      ruleForm.level = res.data.data + 1;
    });
  }
});
</script>
