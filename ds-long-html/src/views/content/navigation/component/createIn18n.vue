<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="简体中文" prop="zh_CN">
        <el-input
          v-model="ruleForm.zh_CN"
          placeholder="请输入"
          type="text"
          maxlength="20"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="繁体中文" prop="zh_MO">
        <el-input
          v-model="ruleForm.zh_MO"
          placeholder="请输入"
          type="text"
          maxlength="20"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="英语" prop="en_US">
        <el-input
          v-model="ruleForm.en_US"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { langSaveBatch } from "@/api/content/navigation";
import { ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";
import { langPageConfig } from "@/api/language/index";

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
        zh_CN: "",
        zh_MO: "",
        en_US: "",
      },

      rules: {
        zh_CN: [{ required: true, message: "请输入简体中文", trigger: "blur" }],
        zh_MO: [{ required: true, message: "请输入繁体中文", trigger: "blur" }],
        en_US: [{ required: true, message: "请输入英语", trigger: "blur" }],
      },
    };
  },

  computed: {
    ...mapGetters({
      dictionary: "dictionary",
    }),
  },
  mounted() {
    const params = {
      langKey: this.row.languageKey,
      current: 1,
      size: 20,
    };
    langPageConfig(params).then((res) => {
      const data = res.data.data.records;
      this.ruleForm.zh_CN = data.find(
        (v) => v.dictionaryValue === "zh_CN"
      )?.langValue;
      this.ruleForm.zh_MO = data.find(
        (v) => v.dictionaryValue === "zh_MO"
      )?.langValue;
      this.ruleForm.en_US = data.find(
        (v) => v.dictionaryValue === "en_US"
      )?.langValue;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const langArr = this.dictionary[ENUM_DIC_TYPE.language_select];
          const params = {
            langConfigList: [
              {
                dictionaryId: langArr.find((v) => v.dictionaryValue === "zh_CN")
                  ?.id,
                langValue: this.ruleForm.zh_CN,
              },
              {
                dictionaryId: langArr.find((v) => v.dictionaryValue === "zh_MO")
                  ?.id,
                langValue: this.ruleForm.zh_MO,
              },
              {
                dictionaryId: langArr.find((v) => v.dictionaryValue === "en_US")
                  ?.id,
                langValue: this.ruleForm.en_US,
              },
            ],
            langKey: this.row.languageKey,
          };
          langSaveBatch(params).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("保存成功");
              this.row.callback(true);
            }
          });
        }
      });
    },
  },
};
</script>
