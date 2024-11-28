<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="编码值" prop="langKey">
        <el-input v-model="ruleForm.langKey"></el-input>
      </el-form-item>
      <el-form-item label="更改后的值" prop="langValue">
        <el-input v-model="ruleForm.langValue"></el-input>
      </el-form-item>
      <el-form-item label="语言类型" prop="dictionaryId">
        <el-select
          v-model="ruleForm.dictionaryId"
          placeholder="请选择语言"
          clearable
        >
          <el-option
            v-for="item in optionLanguage"
            :label="item.dictionaryKey"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
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
import { ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";
import { langSaveConfig } from "@/api/language/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionLanguage: [],
      ruleForm: {
        id: "",
        langKey: "",
        langValue: "",
        dictionaryId: "",
      },
      rules: {
        langKey: [{ required: true, message: "请输入编码值", trigger: "blur" }],
        langValue: [
          { required: true, message: "请输入更改后的值", trigger: "blur" },
        ],
        dictionaryId: [
          { required: true, message: "请选择语言", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    this.optionLanguage = this.dictionary[ENUM_DIC_TYPE.language_select];
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm.dictionaryId = this.optionLanguage.find(
        (item) => item.dictionaryKey === this.row.dictionaryKey
      )?.id;
      this.ruleForm.id = this.row.id;
      this.ruleForm.langKey = this.row.langKey;
      this.ruleForm.langValue = this.row.langValue;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res;
          if (!this.ruleForm.id) {
            res = await langSaveConfig(this.ruleForm);
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              this.row.callback(true);
            }
          } else {
            res = await langSaveConfig(this.ruleForm);
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
