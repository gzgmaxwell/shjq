<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item :label="$t('scheme_name')" prop="schemeName">
      <el-input
        :placeholder="`${$t('please_enter')} ${$t('scheme_name')}`"
        style="width: 80%"
        v-model="ruleForm.schemeName"
        clearable
        maxlength="20"
        show-word-limit
      />
    </el-form-item>
    <el-form-item :label="$t('rule')" prop="num">
      <el-input-number
        v-model="formattedNum"
        :min="0"
        :max="99.99"
        :precision="2"
      ></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { debounceCallBack } from "@/util/util";
import { saveClearingScheme, updateClearingScheme } from "@/api/admin/index";
import upload from "@/components/upload";
export default {
  components: {
    upload,
  },
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
      fileList: [],
      ruleForm: {
        platformType: "1",
        schemeType: "CPA",
        id: "",
        schemeName: "",
        subsidyMoney: "0",
      },
      rules: {
        schemeName: [
          {
            required: true,
            message: `${this.$t("please_enter")} ${this.$t("scheme_name")}`,
            trigger: "blur",
          },
        ],
        num: [
          {
            min: 0,
            max: 99.99,
            message: `${this.$t("please_enter")} 0-99.99`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    formattedNum: {
      get() {
        if (this.ruleForm.subsidyMoney % 1 === 0) {
          return parseInt(this.ruleForm.subsidyMoney, 10);
        } else {
          return parseFloat(this.ruleForm.subsidyMoney.toFixed(2));
        }
      },
      set(value) {
        if (value < 0) {
          this.ruleForm.subsidyMoney = 0;
        } else {
          this.ruleForm.subsidyMoney = value;
        }
      },
    },
  },
  watch: {},
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.schemeName = this.row.schemeName;
      this.ruleForm.subsidyMoney = this.row.subsidyMoney;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        } else {
          this.$message.error(this.$t("verification_failed"));
          return false;
        }
      });
    },
    commit() {
      if (this.row.id) {
        const comSubmit = () => {
          return updateClearingScheme(this.ruleForm)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(this.$t("successfully_edited"));
                this.row.callback(true);
                return Promise.resolve();
              }
            })
            .catch((err) => {});
        };
        debounceCallBack(comSubmit)();
      } else {
        const comSubmit = () => {
          return saveClearingScheme(this.ruleForm)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(this.$t("successfully_added"));
                this.row.callback(true);
                return Promise.resolve();
              }
            })
            .catch((err) => {});
        };
        debounceCallBack(comSubmit)();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
