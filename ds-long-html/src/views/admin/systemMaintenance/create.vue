<template>
  <div class="mt20">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item label="域名:" prop="domainName">
        <el-input
          v-model="form.domainName"
          placeholder="请输入域名地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="sureBtn('form')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { maintainSaveOrUpdate } from "@/api/admin/index";

export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        domainName: "",
      },
      rules: {
        domainName: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入域名地址"));
              } else if (/\s/.test(value)) {
                callback(new Error("域名地址中不能包含空格"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    getInfo() {
      this.form.id = this.row.id;
      this.form.domainName = this.row.domainName;
    },

    sureBtn(formName) {
      const params = {
        ...this.form,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          maintainSaveOrUpdate(params).then(() => {
            this.$message.success(this.row.id ? "编辑成功" : "新增成功");
            this.row.callback(true);
          });
        }
      });
    },
  },
};
</script>
