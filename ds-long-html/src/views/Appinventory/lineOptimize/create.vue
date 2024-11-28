<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="域名类型:" prop="type">
        <el-select
          v-model="ruleForm.type"
          placeholder="请选择域名类型"
          style="width: 87%"
        >
          <el-option
            v-for="item in optDomainType"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="域名:" prop="domain" style="width: 90%">
        <el-input v-model="ruleForm.domain" clearable></el-input>
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
import { optDomainType, EnumDomainType, debounceCallBack } from "@/util/util";
import { linesSave } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optDomainType: optDomainType,

      ruleForm: {
        domain: "",
        type: EnumDomainType.API,
      },
      rules: {
        domain: [
          { required: true, message: "请输入域名", trigger: "blur" },
          {
            pattern: /^[^\u4e00-\u9fa5\s]+$/,
            message: "域名不能包含中文字符和空格",
            trigger: "blur",
          },
        ],
        type: [{ required: true, message: "请选择域名类型", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const comSubmit = () => {
            return linesSave(this.ruleForm).then(() => {
              this.$message.success("新增成功");
              this.row.callback(true);
              Promise.resolve();
            });
          };
          debounceCallBack(comSubmit)();
        } else {
          return false;
        }
      });
    },
  },
};
</script>
