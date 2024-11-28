<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="上级部门" prop="parentName" v-if="row.isAddChild">
      <el-input
        disabled
        placeholder="请输入上级部门"
        style="width: 30%"
        v-model="ruleForm.parentName"
        clearable
      />
    </el-form-item>
    <el-form-item label="部门名称" prop="name">
      <el-input
        placeholder="请输入部门名称"
        style="width: 30%"
        v-model="ruleForm.name"
        clearable
        :maxlength="8"
      />
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        type="textarea"
        placeholder="请输入描述（最多20个字）"
        style="width: 30%"
        :rows="3"
        :maxlength="20"
        v-model="ruleForm.deptDesc"
        clearable
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { deptSave, deptUpdate } from "@/api/admin/index";
import { optProps, EnumProps, debounceCallBack } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      optProps: optProps.filter((v) => v.id !== EnumProps.INTEGRAL),
      ruleForm: {
        parentName: "",
        name: undefined,
        deptDesc: undefined,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    compuOptProps() {
      return (params) => {
        return optProps.find((v) => v.id === params)?.unit;
      };
    },
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      if (this.row.isAddChild) {
        this.ruleForm.parentName = this.row.name;
      }
      if (!this.row.isAddChild) {
        this.ruleForm.name = this.row.name;
        this.ruleForm.deptDesc = this.row.deptDesc;
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },
    commit() {
      if (!this.row.id || this.row.isAddChild) {
        const params = {
          parentId: this.row.id || 0,
          ...this.ruleForm,
        };
        const debounceAPI = () => {
          return deptSave(params).then(() => {
            this.$message.success("保存成功");
            this.row.callback(true);
            return Promise.resolve();
          });
        };
        debounceCallBack(debounceAPI)();
      } else {
        const params = {
          ...this.ruleForm,
          deptId: this.row.id,
        };
        deptUpdate(params).then(() => {
          this.row.callback(true);
          this.$message.success("编辑成功");
        });
      }
    },
  },
};
</script>
