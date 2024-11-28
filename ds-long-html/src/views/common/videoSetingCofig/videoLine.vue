<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <div class="titleBox">
        <div class="title">视频播放线路优化</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submitCapture">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
      <el-divider style="margin-bottom: 30px !important"></el-divider>
      <el-form-item class="mark">
        <div class="permit">
          <span>允许APP在视频播放页网络加载超时进行播放线路优化</span>
          <el-switch
            v-model="ruleForm.status"
            active-value="0"
            inactive-value="1"
          >
          </el-switch>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getVideoPlayOptimize,
  updateVideoPlayOptimize,
} from "@/api/admin/index";

import { debounceCallBack } from "@/util/util";
export default {
  data() {
    return {
      ruleForm: {
        status: "0",
      },
    };
  },

  mounted() {
    this.getLineDetail();
  },

  methods: {
    getLineDetail() {
      getVideoPlayOptimize().then((res) => {
        this.ruleForm.status = res.data.data;
      });
    },
    submitCapture() {
      const comSubmit = () => {
        return updateVideoPlayOptimize(this.ruleForm.status).then(() => {
          this.$message.success("保存成功");
          this.getLineDetail();
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
