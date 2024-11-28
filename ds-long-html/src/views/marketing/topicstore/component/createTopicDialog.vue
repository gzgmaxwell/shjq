<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="话题: " prop="topicName">
        <el-input
          placeholder="请输入话题"
          v-model="ruleForm.topicName"
          resize="none"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio
            v-for="item in optionStatus"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  substanceTopicUpdate,
  substanceTopicSave,
} from "@/api/marketing/topic-store";
import { optionStatus, debounce } from "@/util/util";

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
      ruleForm: {
        id: "",
        topicName: "",
        status: 1,
      },
      optionStatus: optionStatus,
      rules: {
        topicName: [
          { required: true, message: "请输入话题", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        status: [{ required: true, message: "请选择状态：", trigger: "blur" }],
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
      this.ruleForm.id = this.row.id;
      this.ruleForm.topicName = this.row.topicName;
      this.ruleForm.status = this.row.status;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debounce(this.commit, 400)();
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },

    commit() {
      const params = {
        ...this.ruleForm,
      };
      if (!this.ruleForm.id) {
        substanceTopicSave(params).then((res) => {
          if (res.data.code == 200) {
            this.row.callback(true);
            this.$message.success("新增成功");
          }
        });
      } else {
        substanceTopicUpdate(params).then((res) => {
          if (res.data.code == 200) {
            this.row.callback(true);
            this.$message.success("编辑成功");
          }
        });
      }
    },
  },
};
</script>
