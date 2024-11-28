<template>
  <div class="mt20">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="地址:" prop="url">
        <el-input v-model="form.url" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取 消</el-button>
        <el-button type="primary" @click="sureBtn('form')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "@/components/upload/index.vue";
import { configSaveOrUpdate } from "@/api/nationalagent/index";

export default {
  components: {
    upload,
  },
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
        url: "",
      },
      rules: {
        url: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    // 编辑活动数据
    getInfo() {
      this.form.url = this.row.url;
    },

    sureBtn(formName) {
      const params = {
        ...this.form,
        id: this.row.id,
        type:this.row.type
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          configSaveOrUpdate(params).then(() => {
            this.$message.success("保存成功");
            this.row.callback(true);
          });
        }
      });
    },
  },
};
</script>
