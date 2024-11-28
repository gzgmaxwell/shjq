<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
      style="margin-bottom: 20px; width: 50%"
    >
      <div class="titleBox">
        <div class="title">奖励累计超级会员上限</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitUpperLimit('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span>累计限制</span>
          <el-switch v-model="ruleForm.svipstatus"> </el-switch>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="days">
        <div style="margin-bottom: 10px">
          <span> 超级会员上限天数:</span>
          <el-input
            v-model="ruleForm.days"
            style="width: 20%; margin-left: 10px"
          >
            <template slot="append">天</template></el-input
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { updateSVIPUpperLimit, getSVIPUpperLimit } from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: {
        days: "",
        svipstatus: true,
      },

      rules: {
        days: [
          {
            required: true,
            message: "请输入超级会员上限天数",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入大于0的整数",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getVIPLimit();
  },

  methods: {
    getVIPLimit() {
      getSVIPUpperLimit().then((res) => {
        this.ruleForm.days = res.data.data.days;
        this.ruleForm.svipstatus = res.data.data.svipstatus;
      });
    },
    submitUpperLimit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            days: this.ruleForm.days,
            svipstatus: this.ruleForm.svipstatus,
          };
          const comSubmit = () => {
            return updateSVIPUpperLimit(params).then(() => {
              this.$message.success("保存成功");
              Promise.resolve();
            });
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mark {
  ::v-deep .el-radio {
    margin-right: 10px;
  }
  ::v-deep .el-form-item__content {
    margin: 0 !important;
    .permit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0;
    }
  }
}
::v-deep .el-divider--horizontal {
  margin: 0;
  margin-bottom: 20px;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
.titleBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .question {
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
