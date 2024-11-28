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
        <div class="title">视频评分设置</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitMark('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span> 视频综合评分允许显示 </span>
          <el-switch v-model="ruleForm.userOverallScoring"> </el-switch>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="userCount">
        <div class="permit">
          <span>
            自定义显示规则
            <el-popover
              placement="top-start"
              trigger="hover"
              content="设置需要多少人才可以在APP视频下方显示评分"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
          <div style="display: flex; align-items: center">
            <el-input-number
              v-model.number="ruleForm.userCount"
              controls-position="right"
              :disabled="!ruleForm.userOverallScoring"
              :min="2"
              :precision="0"
            >
            </el-input-number>
            <div style="margin: 0 10px">人</div>
            <!-- <el-switch v-model="ruleForm.peopleScore"> </el-switch> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mark">
        <div class="permit">
          <span> 视频允许用户评分 </span>
          <el-switch v-model="ruleForm.allowToScore"> </el-switch>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="progress">
        <div class="permit">
          <span>
            播放器评分弹窗出现进度
            <el-popover
              placement="top-start"
              trigger="hover"
              content="对应进度则表示视频播放到对应百分比处弹窗"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
          <div style="display: flex">
            <el-input-number
              v-model.number="ruleForm.progress"
              controls-position="right"
              :disabled="!ruleForm.allowToScore"
              :min="1"
              :max="100"
            >
            </el-input-number>
            <div style="margin-left: 5px">%</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="progress">
        <div class="permit">
          <span>
            评分范围
            <el-popover
              placement="top-start"
              trigger="hover"
              content="长视频:长短视频的详情页和长视频全屏页; 短视频:短视频全屏页"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
          <div style="display: flex">
            <el-radio-group v-model="ruleForm.scoreLocation">
              <el-radio
                v-for="(item, index) in optionVideoScoring"
                :label="item.id"
                :key="index"
                :disabled="!ruleForm.allowToScore"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="scorePopUps">
        <div class="permit">
          <span> 评分弹窗几率 </span>
          <div style="display: flex">
            <el-input-number
              v-model.number="ruleForm.scorePopUps"
              controls-position="right"
              :disabled="!ruleForm.allowToScore"
              :min="1"
              :max="100"
            >
            </el-input-number>
            <div style="margin-left: 5px">%</div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { score, scoreDetail } from "@/api/admin/index";
import {
  debounceCallBack,
  optionVideoScoring,
  Enum_VideoScoring,
} from "@/util/util";
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
      optionVideoScoring: optionVideoScoring,
      ruleForm: {
        userOverallScoring: true,
        allowToScore: true,
        progress: 1,
        scorePopUps: 1,
        userCount: 0,
        scoreLocation: Enum_VideoScoring.ALL_VIDEO,
      },

      rules: {
        userCount: [
          {
            required: true,
            message: "请输入人数",
            trigger: "blur",
          },
        ],
        progress: [
          {
            validator: (rule, value, callback) => {
              const intValue = parseInt(value);
              if (/^\d+$/.test(value) && intValue >= 1 && intValue <= 100) {
                callback();
              } else {
                callback(new Error("请输入1到100之间的整数"));
              }
            },
            trigger: "change",
          },
        ],
        scorePopUps: [
          {
            validator: (rule, value, callback) => {
              const intValue = parseInt(value);
              if (/^\d+$/.test(value) && intValue >= 1 && intValue <= 100) {
                callback();
              } else {
                callback(new Error("请输入1到100之间的整数"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },

  mounted() {
    this.getScoreDetail();
  },

  methods: {
    getScoreDetail() {
      scoreDetail().then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.ruleForm.allowToScore = data.data.allowToScore;
          this.ruleForm.progress = data.data.progress;
          this.ruleForm.userOverallScoring = data.data.userOverallScoring;
          this.ruleForm.userCount = data.data.userCount;
          this.ruleForm.scoreLocation = data.data.scoreLocation;
          this.ruleForm.scorePopUps = data.data.scorePopUps;
        }
      });
    },
    submitMark(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const comSubmit = () => {
            return score(this.ruleForm).then(() => {
              this.$message.success("保存成功");
              this.getScoreDetail();
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
