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
    <el-form
      :model="row"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-row class="p10 border">
        <div>
          <el-col
            :span="14"
            v-if="propSelVidData.videoOriginalUrl"
            style="height: 380px; margin-top: 50px"
          >
            <sid-video-player
              ref="videoPlay"
              :visible="true"
              :single="{
                videoOriginalFileUrl: propSelVidData.videoOriginalUrl,
                coverFileUrl: propSelVidData.coverUrl,
              }"
              title="视频预览"
            ></sid-video-player>
          </el-col>
          <el-col :span="14" style="height: 380px; margin-top: 50px" v-else>
            <div>
              <img width="100%" :src="propSelVidData.coverUrl" alt="" />
            </div>
          </el-col>
        </div>
        <div>
          <el-col :span="10">
            <el-form-item label="广告标题:" prop="advertTitle">
              <el-input
                disabled
                placeholder="请输入广告标题..."
                v-model="row.advertTitle"
                maxlength="80"
                minlength="1"
                show-word-limit
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="广告位名称:" prop="advertTitle">
              <el-input disabled v-model="row.advertTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="类型:" prop="location">
              <el-radio-group v-model="row.location" disabled>
                <el-radio
                  v-for="item in optionAdType"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态:" prop="status">
              <el-radio-group v-model="row.status" disabled>
                <el-radio
                  v-for="item in optionComStatus"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="跳转类型:" prop="jumpType">
              <el-radio-group v-model="row.jumpType" disabled>
                <el-radio
                  v-for="item in optionJumpType"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="跳转地址:" prop="jumpAdress">
              <el-input
                disabled
                v-model="row.jumpAdress"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否下架:" prop="status">
              <el-radio-group v-model="row.status">
                <el-radio
                  v-for="item in optionUpDownStatus"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-form-item class="right-align">
        <el-button type="primary" @click="handleSubmit('ruleForm')"
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
      v-if="visible"
      :close-on-click-modal="false"
    >
      <img width="100%" :src="bigImage" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { EnumComStatus, ENUM_AD_COMPLAINTYPE } from "@/util/util";
import sidVideoPlayer from "@/components/video-player/index.vue";
import commVideoCheck from "@/views/common/commVideo/commVideoCheck.vue";
import "@/styles/video-audit.scss";
import { accusationDoHandle } from "@/api/accusationList";
import { queryViolationTypeList } from "@/api/common.js";
import {
  optionAdType,
  optionComStatus,
  optionJumpType,
  optionUpDownStatus,
} from "@/util/util";
export default {
  components: {
    commVideoCheck,
    sidVideoPlayer,
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
      bigImage: "",
      visible: false,
      refuseReason: [],
      row: {},
      optionAdType: optionAdType,
      optionComStatus: optionComStatus,
      optionJumpType: optionJumpType,
      optionUpDownStatus: optionUpDownStatus,
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
    // 处理父组件传递过来的参数
    dealData() {
      this.row = {
        ...this.propSelVidData,
        violated: this.propSelVidData.violated,
        handleClassifyId: this.propSelVidData.handleClassifyId,
        handleContent: this.propSelVidData.handleContent,
        accusationId: this.propSelVidData.accusationId,
        accusationAttachmentList: this.propSelVidData.accusationAttachmentList,
        location: this.propSelVidData.location,
        status: this.propSelVidData.status,
      };
    },
    handleSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const handleType =
            EnumComStatus.ON === this.row.status
              ? ENUM_AD_COMPLAINTYPE.none
              : ENUM_AD_COMPLAINTYPE.undercarriage;
          const _form = {
            accusationId: this.row.accusationId,
            status: this.row.status,
            handleClassifyId: this.row.accusationClassifyId,
            handleType: handleType,
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
</style>
