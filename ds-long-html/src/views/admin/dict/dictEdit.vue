<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="字典 key:" prop="dictionaryKey">
        <el-input v-model="ruleForm.dictionaryKey" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典value:" prop="dictionaryValue">
        <el-input v-model="ruleForm.dictionaryValue" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典类型:" prop="dictionaryType">
        <el-select
          v-model="ruleForm.dictionaryType"
          placeholder="请选择语言"
          clearable
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典详情:" prop="dictionaryTypeDesc">
        <el-input v-model="ruleForm.dictionaryTypeDesc" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addObj, putObj } from "@/api/admin/dict";
import { ENUM_DIC_TYPE } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        id: "",
        dictionaryKey: "",
        dictionaryValue: "",
        dictionaryType: "",
        dictionaryValue: "",
        dictionaryTypeDesc: "",
        sort: "",
      },
      options: [
        {
          label: "视频推荐等级",
          value: ENUM_DIC_TYPE.recommend_level,
        },
        {
          label: "视频观看权限",
          value: ENUM_DIC_TYPE.watch_power,
        },
        {
          label: "视频下载权限",
          value: ENUM_DIC_TYPE.download_power,
        },
        {
          label: "排序等级",
          value: ENUM_DIC_TYPE.sort_level,
        },
        {
          label: "封禁时长",
          value: ENUM_DIC_TYPE.ban_duration,
        },
        {
          label: "语言切换",
          value: ENUM_DIC_TYPE.language_select,
        },
      ],
      rules: {
        dictionaryKey: [
          { required: true, message: "请输入字典key", trigger: "blur" },
        ],
        dictionaryValue: [
          { required: true, message: "请输入字典value", trigger: "blur" },
        ],
        dictionaryType: [
          { required: true, message: "请选择字典类型", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.dictionaryKey = this.row.dictionaryKey;
      this.ruleForm.dictionaryValue = this.row.dictionaryValue;
      this.ruleForm.dictionaryType = this.row.dictionaryType;
      this.ruleForm.dictionaryValue = this.row.dictionaryValue;
      this.ruleForm.dictionaryTypeDesc = this.row.dictionaryTypeDesc;
      this.ruleForm.sort = this.row.sort;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res;
          if (!this.ruleForm.id) {
            res = await addObj(this.ruleForm);
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              this.row.callback(true);
            }
          } else {
            res = await putObj(this.ruleForm);
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.row.callback(true);
            }
          }
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
