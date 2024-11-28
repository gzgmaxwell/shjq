<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default">
    <el-form-item label="方案名称" prop="schemeName">
      <el-input v-model="ruleForm.schemeName" placeholder="自定义输入，最多20字符" />
    </el-form-item>
    <el-form-item label="规则" prop="subsidyMoney">
      <el-input-number v-model="ruleForm.subsidyMoney" :precision="2" :min="1" :max="1000000000000000000000" />
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
import { saveClearingScheme, updateClearingScheme } from "@/api/system";
import { getUserId } from "@/utils/index";
const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

interface RuleForm {
  schemeName: string;
  subsidyMoney: number;
}

const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  schemeName: "",
  subsidyMoney: 0,
});

const rules = reactive<FormRules<RuleForm>>({
  schemeName: [
    { required: true, message: "方案名称", trigger: "blur" },
    { min: 1, max: 20, message: "最多20字符", trigger: "blur" },
  ],
  subsidyMoney: [{ required: true, message: "请输入代理比例", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  const params = {
    ...ruleForm,
    busUserId: getUserId(),
    platformType: 2,
    schemeType: "CPA",
    id: props.row.id,
  };
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
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
    ruleForm.subsidyMoney = props.row.subsidyMoney;
  }
});
</script>
