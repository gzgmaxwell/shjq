<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="140px"
    class="demo-ruleForm"
  >
    <el-form-item label="平台名称" prop="platformName">
      <el-input
        placeholder="请输入平台名称"
        v-model="ruleForm.platformName"
        clearable
      >
      </el-input>
    </el-form-item>

    <el-form-item label="AccessKeyID" prop="accessKey" v-if="!row.id">
      <el-input placeholder="请输入AccessKeyID" v-model="ruleForm.accessKey">
      </el-input>
    </el-form-item>

    <el-form-item label="AccessKeySecret" prop="accessSecret" v-if="!row.id">
      <el-input
        placeholder="请输入AccessKeySecret"
        v-model="ruleForm.accessSecret"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="平台类型" prop="type" v-if="!row.id">
      <el-select
        v-model="ruleForm.type"
        clearable
        placeholder="请选择平台类型"
        @change="changeType"
        style="width: 70%"
      >
        <el-option
          v-for="item in optionsPlatformType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label="sdkAppId"
      prop="sdkAppId"
      v-if="ruleForm.type === 'TENCENT'"
    >
      <el-input placeholder="请输入sdkAppId" v-model="ruleForm.sdkAppId">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { smsPlatformSave, smsPlatformEdit } from "@/api/admin/index";
import { debounce, optionsPlatformType, EnumPLATFORMTYPE } from "@/util/util";
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
      optionsPlatformType: optionsPlatformType,
      loading: false,
      ruleForm: {
        platformName: "",
        accessKey: "",
        accessSecret: "",
        type: "",
        sdkAppId: "",
      },
      optionUserId: [],
      rules: {
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
        ],
        accessKey: [
          {
            required: true,
            message: "请输入accessKey",
            trigger: "blur",
          },
        ],
        accessSecret: [
          {
            required: true,
            message: "请输入accessSecret",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择平台类型",
            trigger: "blur",
          },
        ],
        sdkAppId: [
          {
            required: true,
            message: "请输入sdkAppId",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },

  methods: {
    getRow() {
      this.ruleForm.platformName = this.row.platformName;
      this.ruleForm.accessKey = this.row.accessKey;
      this.ruleForm.accessSecret = this.row.accessSecret;
      this.ruleForm.type = this.row.type;
    },
    changeType(val) {
      if (val != EnumPLATFORMTYPE.tencent) {
        this.ruleForm.sdkAppId = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debounce(this.commit, 400)();
        }
      });
    },

    commit() {
      const params = {
        id: this.row.id,
        ...this.ruleForm,
      };
      if (this.row.id) {
        smsPlatformEdit(params).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      } else {
        smsPlatformSave(params).then(() => {
          this.$message.success("新增成功");
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
