<template>
  <div>
    <el-form :model="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="展示样式" required="">
        <el-radio-group
          v-model="ruleForm.recommendType"
          :disabled="!isBusPlatform"
        >
          <el-radio
            v-for="item in optionsShowStyle"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
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
import { getConfig, updateConfig } from "@/api/admin/index";
import { optionsShowStyle, debounceCallBack, isBusPlatform } from "@/util/util";
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
      isBusPlatform: isBusPlatform(),
      optionsShowStyle: optionsShowStyle,
      ruleForm: {
        recommendType: "",
      },
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getConfig().then((res) => {
        this.ruleForm.recommendType = res.data.data.recommendType;
        this.ruleForm.id = res.data.data.id;
      });
    },
    submitForm(formName) {
      const comSubmit = () => {
        return updateConfig(this.ruleForm).then((res) => {
          this.$message.success("保存成功");
          this.row.callback(true);
          return Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>

<style lang="scss" scoped></style>
