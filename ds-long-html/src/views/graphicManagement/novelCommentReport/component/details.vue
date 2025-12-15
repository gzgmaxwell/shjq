<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="video-audit">
    <div class="cause">
      <div>举报原因: {{ ruleForm.accusationClassifyName }}</div>
      <div>举报说明: {{ ruleForm.accusationContent }}</div>
      <div style="display: flex">
        <span>附件:</span>
        <span
          class="image-container"
          v-for="(item, index) in ruleForm.accusationAttachmentList"
          :key="index"
        >
          <img
            @click="searchBigImage(item.coverImageUrl)"
            :src="item.coverImageUrl"
            alt=""
          />
        </span>
      </div>
    </div>

    <el-form
      :inline="false"
      :model="ruleForm"
      class="demo-form-inline details"
      label-position="left"
      label-width="85px"
      :rules="rules"
      ref="ruleForm"
    >
      <div>
        <el-form-item label="是否违规:" prop="illegal">
          <el-radio-group
            v-model="ruleForm.violated"
            :disabled="propSelVidData.handleResult !== null"
            @change="handleIllegalChange"
          >
            <el-radio
              v-for="item in videoViolation"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.violated == 1"
          label="违规原因:"
          prop="handleClassifyId"
        >
          <el-select
            v-model="ruleForm.handleClassifyId"
            style="width: 100%"
            :disabled="propSelVidData.handleResult !== null"
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
          v-if="ruleForm.violated == 1"
          label="违规说明:"
          prop="handleContent"
        >
          <el-input
            class="textareaInput"
            :disabled="propSelVidData.handleResult !== null"
            type="textarea"
            v-model="ruleForm.handleContent"
            placeholder="请输入违规内容"
            :autosize="{ minRows: 2, maxRows: 10 }"
            show-word-limit
            maxlength="200"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item class="right-align">
        <el-button
          type="primary"
          @click="handleSubmit('ruleForm')"
          v-if="!propSelVidData.handleResult"
          >提 交</el-button
        >
        <el-button @click="propSelVidData.callback && propSelVidData.callback()"
          >取 消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { accusationDoHandle } from "@/api/accusationList";
import { queryViolationTypeList } from "@/api/common.js";
import { videoViolation } from "@/util/util";

export default {
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
      refuseReason: [],
      ruleForm: {},
      videoViolation: videoViolation,
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
    this.dealData();
    this.getIllegal();
  },
  methods: {
    searchBigImage(url) {
      this.$modalImage({
        imageURL: url,
      });
    },
    // 切换为“否”时重置下拉选择框的选中内容
    handleIllegalChange() {
      if (this.ruleForm.violated == "0") {
        this.ruleForm.handleClassifyId = "";
        this.ruleForm.handleContent = "";
      }
    },
    getIllegal() {
      queryViolationTypeList(Object.assign({ current: 1, size: 10000 })).then(
        (res) => {
          this.refuseReason = res.data.data.records;
        }
      );
    },
    dealData() {
      this.ruleForm = {
        ...this.propSelVidData,
        violated: this.propSelVidData.violated,
        handleClassifyId: this.propSelVidData.handleClassifyId,
        handleContent: this.propSelVidData.handleContent,
        accusationId: this.propSelVidData.accusationId,
      };
    },
    handleSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let handleType = this.ruleForm.violated == 1 ? "REMOVE" : "NONE";
          const params = {
            handleType: handleType,
            handleClassifyId: this.ruleForm.handleClassifyId,
            accusationAttachmentList: this.ruleForm.accusationAttachmentList,
            violated: this.ruleForm.violated,
            handleContent: this.ruleForm.handleContent,
            accusationId: this.ruleForm.accusationId,
          };
          accusationDoHandle(params).then((res) => {
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
    height: 48px;
    margin-left: 10px;
    cursor: pointer;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  margin: 20px;
}
</style>
