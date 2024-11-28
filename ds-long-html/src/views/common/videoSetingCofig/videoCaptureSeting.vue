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
        <div class="title">视频防捕获</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitCapture('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span>允许移动设备在播放页进行截图或者录屏</span>
          <el-switch v-model="ruleForm.allowToRecord"> </el-switch>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  recordingSettingsSaveOrUpdate,
  recordingSettingsGetDetail,
} from "@/api/admin/index";

import { debounceCallBack } from "@/util/util";
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
        allowToRecord: true,
      },

      rules: {},
    };
  },

  mounted() {
    this.getRecordingDetail();
  },

  methods: {
    getRecordingDetail() {
      recordingSettingsGetDetail().then((res) => {
        this.ruleForm.allowToRecord = res.data.data[0].allowToRecord;
      });
    },
    submitCapture(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            allowToRecord: this.ruleForm.allowToRecord,
          };
          const comSubmit = () => {
            return recordingSettingsSaveOrUpdate(params).then(() => {
              this.$message.success("保存成功");
              this.getRecordingDetail();
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
  margin-bottom: 15px;
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
