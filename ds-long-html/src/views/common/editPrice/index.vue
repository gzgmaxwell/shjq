<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    :rules="rules"
    label-width="150px"
    class="demo-ruleForm"
  >
    <el-form-item label="金币" prop="price">
      <el-input-number
        placeholder="请输入金币"
        :min="1"
        :step="1"
        style="width: 65%"
        v-model="ruleForm.price"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="row.callback(ruleForm.price)">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
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
        price: 1,
      },
      rules: {
        price: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error("请输入正整数价格"));
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
};
</script>
