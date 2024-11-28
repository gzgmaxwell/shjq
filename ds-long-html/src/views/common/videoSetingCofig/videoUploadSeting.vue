<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="165px"
    >
      <div class="titleBox">
        <div class="title">视频上传设置</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitForm('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item label="B端视频上传大小上限" prop="uploadUpperLimitForB">
        <el-input-number
          style="width: 40%"
          :min="0"
          :max="10"
          :step="0.1"
          step-strictly
          v-model="ruleForm.uploadUpperLimitForB"
        />
        <span class="ml10">GB</span>
      </el-form-item>
      <el-form-item
        label="C端视频上传大小上限"
        prop="uploadUpperLimitForC"
        style="margin: 20px 0"
      >
        <el-input-number
          style="width: 40%"
          :min="0"
          :max="5"
          :step="0.1"
          step-strictly
          v-model="ruleForm.uploadUpperLimitForC"
        />
        <span class="ml10">GB</span>
      </el-form-item>
      <el-form-item label="上传视频最大时长限制" prop="durationUpperLimit">
        <el-input-number
          style="width: 40%"
          :min="0"
          :max="999999"
          :step="1"
          step-strictly
          v-model="ruleForm.durationUpperLimit"
        />
        <span class="ml10">分钟</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  uploadSettingGetDetail,
  uploadSettingSaveOrUpdate,
} from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: {
        uploadUpperLimitForB: "",
        uploadUpperLimitForC: "",
        durationUpperLimit: "",
      },

      rules: {
        uploadUpperLimitForB: [
          {
            required: true,
            message: "请输入0.1~9.9区间折扣数值",
            trigger: "blur",
          },
        ],
        uploadUpperLimitForC: [
          {
            required: true,
            message: "请输入0.1~9.9区间折扣数值",
            trigger: "blur",
          },
        ],
        durationUpperLimit: [
          {
            required: true,
            message: "请输入请输入大于0的整数",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const params = {
        enumList: [
          "VIDEO_UPLOAD_UPPER_LIMIT_B",
          "VIDEO_UPLOAD_UPPER_LIMIT_C",
          "VIDEO_UPLOAD_DURATION_UPPER_LIMIT",
          "RECORDING_UPPER_LIMIT",
        ],
      };
      uploadSettingGetDetail(params).then((res) => {
        const data = res.data.data || {};
        const itemForB = data.find(
          (v) => v.videoUploadSettingKey === "VIDEO_UPLOAD_UPPER_LIMIT_B"
        );
        const itemForC = data.find(
          (v) => v.videoUploadSettingKey === "VIDEO_UPLOAD_UPPER_LIMIT_C"
        );
        const itemDuration = data.find(
          (v) => v.videoUploadSettingKey === "VIDEO_UPLOAD_DURATION_UPPER_LIMIT"
        );
        const AppDuration = data.find(
          (v) => v.videoUploadSettingKey === "RECORDING_UPPER_LIMIT"
        );
        this.ruleForm.uploadUpperLimitForB = itemForB.videoUploadSettingValue;
        this.ruleForm.uploadUpperLimitForC = itemForC.videoUploadSettingValue;
        this.ruleForm.durationUpperLimit = itemDuration.videoUploadSettingValue;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit();
        }
      });
    },

    commit() {
      const params = {
        // ...this.ruleForm,
        uploadUpperLimitForB: this.ruleForm.uploadUpperLimitForB,
        uploadUpperLimitForC: this.ruleForm.uploadUpperLimitForC,
        durationUpperLimit: this.ruleForm.durationUpperLimit,
        // recordingUpperLimit: this.ruleForm.durationAppLimit,
      };
      const comSubmit = () => {
        return uploadSettingSaveOrUpdate(params).then(() => {
          this.$message.success("保存成功");
          this.init();
          Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
<style lang="scss" scoped>
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
