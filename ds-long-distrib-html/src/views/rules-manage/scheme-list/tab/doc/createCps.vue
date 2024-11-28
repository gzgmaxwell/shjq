<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default">
    <el-form-item label="方案名称" prop="schemeName">
      <el-input v-model="ruleForm.schemeName" placeholder="自定义输入，最多20字符" />
    </el-form-item>
    <el-form-item label="平台" prop="platformRatio">
      <el-input-number disabled :min="0" :max="100" v-model.number="ruleForm.platformRatio" placeholder="平台">
        <template #append>%</template>
      </el-input-number>
    </el-form-item>
    <el-form-item label="渠道" prop="distrBrokerageRatio">
      <el-input-number v-model="ruleForm.distrBrokerageRatio" :precision="0" :step="1" :min="0" :max="100" />
    </el-form-item>
    <el-form-item label="代理" prop="agentBrokerageRatio">
      <el-input-number v-model="ruleForm.agentBrokerageRatio" :precision="0" :step="1" :min="0" :max="100" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { saveClearingScheme, updateClearingScheme } from "@/api/system";
import { getUserId } from "@/utils/index";
import { useCommonStore } from "@/store/modules/common";

const useCommon = useCommonStore();
const dictionary: any = useCommon.dictionary;
const platformRatio = dictionary["platform_ratio"][0].dictionaryValue;

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  schemeName: string;
  platformRatio: number;
  agentBrokerageRatio: number;
  distrBrokerageRatio: number;
}

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  schemeName: "",
  platformRatio: Number(platformRatio),
  agentBrokerageRatio: 0,
  distrBrokerageRatio: 0,
});

const rules = reactive<FormRules<RuleForm>>({
  schemeName: [
    { required: true, message: "方案名称", trigger: "blur" },
    { min: 1, max: 20, message: "最多20字符", trigger: "blur" },
  ],
  platformRatio: [
    {
      required: true,
      message: "请输入平台比例",
      trigger: "change",
    },
  ],
  agentBrokerageRatio: [
    {
      required: true,
      message: "请输入渠成比例",
      trigger: "change",
    },
  ],
  distrBrokerageRatio: [{ required: true, message: "请输入代理比例", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  const params = {
    ...ruleForm,
    busUserId: getUserId(),
    platformType: 2,
    schemeType: "CPS",
    id: props.row.id,
  };
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const sum = params.platformRatio + params.agentBrokerageRatio + params.distrBrokerageRatio;
      console.log(sum);
      if (sum !== 100) {
        return ElMessage.warning("平台+渠成+代理只能等于100");
      }
      if (props.row.id) {
        updateClearingScheme(params).then(() => {
          ElMessage.success("编辑成功");

          props.row.callback(true);
        });
      } else {
        saveClearingScheme(params).then(() => {
          ElMessage.success("新增成功");
          props.row.callback(true);
        });
      }
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
    ruleForm.schemeName = props.row.schemeName;
    ruleForm.agentBrokerageRatio = props.row.agentBrokerageRatio;
    ruleForm.distrBrokerageRatio = props.row.distrBrokerageRatio;
  }
});
</script>
