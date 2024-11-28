<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="video-audit">
    <div class="cause">
      <div>举报原因: {{ row.accusationClassifyName }}</div>
      <div>举报说明: {{ row.accusationContent }}</div>
      <div style="display: flex">
        <span>附件:</span>
        <span
          class="image-container"
          v-for="(item, index) in row.accusationAttachmentList"
          :key="index"
        >
          <img
            @click="searchBigImage(item.attachmentUrl)"
            :src="item.attachmentUrl"
            alt=""
          />
        </span>
      </div>
    </div>
    <div style="margin-top: 20px">
      <commVideoCheck
        :row="propSelVidData"
        :webPageMenu="webPageMenu"
      ></commVideoCheck>
    </div>
    <el-form
      :inline="true"
      :model="row"
      class="demo-form-inline details"
      label-position="left"
      label-width="120px"
      :rules="rules"
      ref="ruleForm"
    >
      <div style="display: flex; flex-direction: column">
        <el-form-item label="是否违规:" prop="violated">
          <el-radio-group v-model="row.violated" @change="handleIllegalChange">
            <el-radio
              :disabled="propSelVidData.handleResult"
              v-for="item in videoViolation"
              :key="item.id"
              :label="item.id"
              :value="item.name"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="row.violated == ENUM_VIDEO_VIOLATION.yes"
          label="违规原因:"
          prop="handleClassifyId"
        >
          <el-select
            :disabled="propSelVidData.handleResult"
            v-model="row.handleClassifyId"
            style="width: 100%"
            clearable
          >
            <template v-for="item in refuseReason">
              <el-option
                :label="item.classifyName"
                :value="item.classifyId"
                :key="item.classifyId"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="row.violated == ENUM_VIDEO_VIOLATION.yes"
          label="违规说明:"
          prop="handleContent"
        >
          <el-input
            style="width: 100%"
            :disabled="propSelVidData.handleResult"
            class="textareaInput"
            type="textarea"
            v-model="row.handleContent"
            placeholder="请输入违规内容"
            :autosize="{ minRows: 10, maxRows: 10 }"
            show-word-limit
            maxlength="200"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item class="right-align">
        <el-button
          type="primary"
          v-if="!propSelVidData.handleResult"
          @click="handleSubmit('ruleForm')"
          >提 交</el-button
        >
        <el-button @click="propSelVidData.callback && propSelVidData.callback()"
          >取 消</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog
      title="图片预览"
      :visible.sync="visible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" height="100%" :src="bigImage" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import "@/styles/video-audit.scss";
import { accusationDoHandle } from "@/api/accusationList";
import { queryViolationTypeList } from "@/api/common.js";
import { menuEnum, videoViolation, ENUM_VIDEO_VIOLATION } from "@/util/util";
export default {
  components: {
    commVideoCheck,
  },
  props: {
    propSelVidData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ENUM_VIDEO_VIOLATION: ENUM_VIDEO_VIOLATION,
      videoViolation: videoViolation,
      webPageMenu: menuEnum.videoAccusation,
      bigImage: "",
      visible: false,
      refuseReason: [],
      row: {},
      rules: {
        violated: [
          { required: true, message: "请选择是否违规", trigger: "blur" },
        ],
        handleClassifyId: [
          { required: true, message: "请选择违规原因", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getViolationTypeList();
    this.dealData();
  },
  methods: {
    getViolationTypeList() {
      queryViolationTypeList(Object.assign({ current: 1, size: 10000 })).then(
        (res) => {
          this.refuseReason = res.data.data.records;
        }
      );
    },
    searchBigImage(url) {
      this.visible = true;
      this.bigImage = url;
    },
    // 切换为“否”时重置下拉选择框的选中内容
    handleIllegalChange() {
      if (this.row.violated == ENUM_VIDEO_VIOLATION.no) {
        this.row.handleClassifyId = "";
        this.row.handleContent = "";
      } else {
        this.row.handleClassifyId = this.propSelVidData.handleClassifyId;
        this.row.handleContent = this.propSelVidData.handleContent;
      }
    },
    // 处理父组件传递过来的参数
    dealData() {
      this.row = {
        ...this.propSelVidData,
        violated: this.propSelVidData.violated,
        handleClassifyId: this.propSelVidData.handleClassifyId,
        handleContent: this.propSelVidData.handleContent,
        accusationId: this.propSelVidData.accusationId,
        accusationAttachmentList: this.propSelVidData.accusationAttachmentList,
      };
    },
    handleSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const _form = {
            handleClassifyId: this.row.handleClassifyId,
            handleType:
              this.row.violated == ENUM_VIDEO_VIOLATION.yes
                ? "UNDERCARRIAGE"
                : "NONE",
            accusationAttachmentList: this.row.accusationAttachmentList,
            accusationId: this.row.accusationId,
            handleContent: this.row.handleContent,
            violated: this.row.violated,
          };
          accusationDoHandle(_form).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.propSelVidData.callback();
            }
          });
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 5px;
}
::v-deep .textareaInput {
  .el-textarea__inner {
    width: 217px;
  }
}
.cause {
  border: 1px solid #eee;
  margin-bottom: 2px;
  div {
    margin: 10px;
  }
  .image-container {
    width: 78px;
    height: 78px;
    margin-left: 10px;
    cursor: pointer;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
::v-deep .el-textarea__inner {
  // min-height: 100px !important;
  max-height: 230px;
}

.el-form--inline .el-form-item {
  padding-left: 30px;
}
.right-align {
  display: block;
  text-align: right;
  margin-top: 30px;
  .el-button--small {
    margin-right: 30px;
  }
}
.details {
  margin-top: 20px;
}
</style>
