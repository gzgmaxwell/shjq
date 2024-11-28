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
        <div class="title">水印转码切片优先排序设置</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitMark()">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span> 配置状态:</span>
          <el-switch v-model="ruleForm.allowConfig"> </el-switch>
        </div>
      </el-form-item>
      <el-form-item class="mark" prop="progress">
        <div class="permit">
          <span> 选择视频:</span>
          <div style="display: flex">
            <el-radio-group v-model="ruleForm.videoType">
              <el-radio
                v-for="(item, index) in optVideoRatioType"
                :label="item.id"
                :key="index"
                :disabled="!ruleForm.allowConfig"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  videoConvertConfig,
  videoConvertSettingDetail,
} from "@/api/admin/index";
import {
  debounceCallBack,
  optVideoRatioType,
  EnumVideoRatioType,
} from "@/util/util";
export default {
  data() {
    return {
      optVideoRatioType: optVideoRatioType,
      ruleForm: {
        allowConfig: false,
        videoType: EnumVideoRatioType.all,
      },
      rules: {},
    };
  },

  mounted() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      videoConvertSettingDetail().then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.ruleForm.allowConfig = data.data.allowConfig;
          this.ruleForm.videoType = data.data.videoType;
        }
      });
    },
    submitMark() {
      const comSubmit = () => {
        return videoConvertConfig(this.ruleForm).then(() => {
          this.$message.success("保存成功");
          this.getScoreDetail();
          Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
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
  }
}
</style>
