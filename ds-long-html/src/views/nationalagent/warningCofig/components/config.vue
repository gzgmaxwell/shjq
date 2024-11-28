<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="预警时间" prop="warningTime">
        <el-input
          style="width: 60%"
          v-model="ruleForm.warningTime"
          placeholder="请输入"
          clearable
        >
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="预警统计周期" prop="warningCycleTime">
        <el-input
          style="width: 60%"
          v-model="ruleForm.warningCycleTime"
          placeholder="请输入"
          clearable
        >
          <template slot="append">小时</template>
        </el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { debounceCallBack } from "@/util/util";
import { extSettingModify } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        warningTime: "",
        warningCycleTime: "",
      },
      rules: {
        warningTime: [
          { required: true, message: "预警时间不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入的正整数",
            trigger: "blur",
          },
        ],
        warningCycleTime: [
          { required: true, message: "预警统计周期不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入的正整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRow();
  },
  methods: {
    getRow() {
      this.ruleForm = {
        warningTime: this.row.warningTime / 60,
        warningCycleTime: this.row.warningCycleTime / 3600,
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const comSubmit = () => {
            const params = {
              warningTime: this.ruleForm.warningTime * 60,
              warningCycleTime: this.ruleForm.warningCycleTime * 3600,
            };
            return extSettingModify(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
                Promise.resolve();
              }
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

<style lang="scss" scoped></style>
