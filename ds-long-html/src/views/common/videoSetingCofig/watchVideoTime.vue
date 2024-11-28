<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <div class="titleBox">
        <div class="title">视频免费观看时长</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitFreeTime('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark" prop="ratio">
        <div class="permit">
          <span> 付费视频和会员视频的免费观看时长占比总时长比例 </span>
          <div style="display: flex">
            <el-input-number
              v-model.number="ruleForm.ratio"
              controls-position="right"
              :min="0"
              :max="100"
            >
            </el-input-number>
            <div style="margin-left: 5px">%</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="minimum">
        <div class="permit">
          <span> 视频最低免费观看时长（秒） </span>
          <el-input-number v-model="ruleForm.minimum" :min="0" :step="1" />
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="maximum">
        <div class="permit">
          <span> 视频最大免费观看时长（秒） </span>
          <el-input-number :min="0" :step="1" v-model="ruleForm.maximum" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { freeView, freeViewDetail } from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: {
        ratio: 0,
        minimum: "0",
        maximum: "0",
      },

      rules: {
        ratio: [
          {
            required: true,
            message: "请输入占比总时长比例",
            trigger: "blur",
          },
          // {
          //   validator: (rule, value, callback) => {
          //     const intValue = parseInt(value);
          //     // intValue >= 10 && intValue <= 20
          //     if (/^\d+$/.test(value) && intValue <= 100) {
          //       callback();
          //     } else {
          //       callback(new Error("请输入0到100之间的整数"));
          //     }
          //   },
          //   trigger: "blur",
          // },
          {
            pattern: /^([1-9]?\d|100)$/,
            message: "请输入0到100之间的整数",
            trigger: "blur",
          },
        ],
        minimum: [
          {
            required: true,
            message: "视频最低免费观看时长（秒）",
            trigger: "blur",
          },
          {
            pattern: /^\d+$/,
            message: "请输入的整数",
            trigger: "blur",
          },
        ],
        maximum: [
          {
            required: true,
            message: "视频最大免费观看时长（秒）",
            trigger: "blur",
          },
          {
            pattern: /^\d+$/,
            message: "请输入的整数",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getFreeViewDetail();
  },

  methods: {
    getFreeViewDetail() {
      freeViewDetail().then((res) => {
        this.ruleForm.ratio = res.data.data.ratio;
        this.ruleForm.minimum = res.data.data.minimum;
        this.ruleForm.maximum = res.data.data.maximum;
      });
    },

    submitFreeTime(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ratio: this.ruleForm.ratio,
            minimum: this.ruleForm.minimum,
            maximum: this.ruleForm.maximum,
          };
          const comSubmit = () => {
            return freeView(params).then(() => {
              this.$message.success("保存成功");
              this.getFreeViewDetail();
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
