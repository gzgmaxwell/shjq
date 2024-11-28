<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="140px"
    class="demo-ruleForm"
  >
    <el-form-item label="类型" prop="type">
      <el-select
        v-model="ruleForm.type"
        clearable
        placeholder="请选择类型"
        style="width: 70%"
      >
        <el-option
          v-for="item in optionsSmsType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="内容" prop="templateContent">
      <el-input
        style="width: 70%"
        placeholder="请输入内容"
        v-model="ruleForm.templateContent"
        type="textarea"
      >
      </el-input>
    </el-form-item>

    <el-form-item label="模版ID" prop="templateCode">
      <el-input
        style="width: 70%"
        placeholder="请输入模版ID"
        v-model="ruleForm.templateCode"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="地区" prop="area">
      <el-select
        v-model="ruleForm.area"
        clearable
        placeholder="请选择地区"
        style="width: 70%"
      >
        <el-option
          v-for="item in regionOptions"
          :key="item.id"
          :label="item.dictionaryTypeDesc"
          :value="item.dictionaryKey"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="签名">
      <el-input
        placeholder="请输入签名"
        v-model="ruleForm.sign"
        style="width: 70%"
      >
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="row.callback && row.callback()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { smsTemplateSave, smsTemplateEdit } from "@/api/admin/index";
import { debounce, optionsSmsType, ENUM_DIC_TYPE } from "@/util/util";
import { mapGetters } from "vuex";

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
      optionsSmsType: optionsSmsType,
      regionOptions: [],
      loading: false,
      ruleForm: {
        id: "",
        type: "",
        templateContent: "",
        templateCode: "",
        sign: "",
        area: "",
      },
      rules: {
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        area: [{ required: true, message: "请选择地区", trigger: "blur" }],
        templateContent: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
        templateCode: [
          {
            required: true,
            message: "请输入模版ID",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ dictionary: "dictionary" }),
  },
  mounted() {
    this.getRegionList().then(() => {
      if (this.row.id) {
        this.getRow();
      }
    });
  },

  methods: {
    async getRegionList() {
      this.regionOptions = await this.dictionary[ENUM_DIC_TYPE.CountryCode];
    },
    getRow() {
      this.ruleForm.id = this.row.id;
      this.ruleForm.type = this.row.type;
      this.ruleForm.templateContent = this.row.templateContent;
      this.ruleForm.templateCode = this.row.templateCode;
      this.ruleForm.sign = this.row.sign;
      this.ruleForm.area = this.regionOptions.find(
        (item) => item.dictionaryKey === this.row.area
      )?.dictionaryKey;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debounce(this.commit, 400)();
        } else {
          this.$message.error("验证不通过");
        }
      });
    },

    commit() {
      const params = {
        platformId: this.row.platformId,
        ...this.ruleForm,
      };
      if (this.row.id) {
        smsTemplateEdit(params).then(() => {
          this.$message.success("编辑成功");
          this.row.callback(true);
        });
      } else {
        smsTemplateSave(params).then(() => {
          this.$message.success("新增成功");
          this.row.callback(true);
        });
      }
    },
  },
};
</script>
