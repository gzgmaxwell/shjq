<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="200px"
    class="demo-ruleForm"
    :rules="rules"
  >
    <el-form-item label="付费视频和会员视频的免费观看时长占总时长比例">
      <el-input-number
        style="width: 65%"
        :max="100"
        :min="0"
        v-model="ruleForm.freeViewRatio"
      />
      <span class="ml10">%</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { freeViewDetail } from "@/api/admin/index";
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
        freeViewRatio: undefined,
      },
      rules: {
        freeViewRatio: [
          {
            required: true,
            message: "大小不能超过100",
            trigger: "blur",
            max: 100,
            min: 0,
          },
        ],
      },
    };
  },
  mounted() {
    freeViewDetail().then((res) => {
      this.ruleForm.freeViewRatio = res.data.data.ratio;
      // if (this.row.freeViewRatio) {
      //   this.ruleForm.freeViewRatio = this.row.freeViewRatio;
      // }
    });
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.row.callback(this.ruleForm);
        }
      });
    },
  },
};
</script>
