<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="切片优先级" prop="convertSort">
        <el-select v-model="ruleForm.convertSort">
          <el-option
            v-for="item in optSliceLevel"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
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
import { editConvertSort } from "@/api/admin/index";
import { optSliceLevel } from "@/util/util";
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
      optSliceLevel: optSliceLevel,
      ruleForm: {
        convertSort: "",
      },
      rules: {
        convertSort: [
          { required: true, message: "请选择切片优先级", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.ruleForm.convertSort = this.row.convertSort;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            preId: this.row.preId,
          };
          editConvertSort(params).then(() => {
            this.$message.success("修改成功");
            this.row.callback(true);
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
