<template>
  <el-dialog
    :title="doubleSelect ? '驳回原因' : '下架原因'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :before-close="beforeClose"
    width="400px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item v-if="tip">
        <div>{{ tip }}</div>
      </el-form-item>
      <el-form-item label="下架原因" prop="reason" v-if="!doubleSelect">
        <el-select
          v-model="ruleForm.reason"
          placeholder="请选择下架原因"
          clearable
        >
          <el-option
            v-for="item in optRefuseReason"
            :key="item.id"
            :label="item.refuseReason"
            :value="item.refuseCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="reason" v-if="doubleSelect" class="clearMargin">
        <div style="margin-bottom: 10px">
          <el-radio-group v-model="ruleForm.refuseType" @change="selectChange">
            <el-radio
              v-for="item in optionsDismissComic"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </div>
        <div>
          <el-select
            style="width: 70%"
            v-model="ruleForm.reason"
            placeholder="请选择驳回原因"
            clearable
            @change="selectRegionChange"
          >
            <el-option
              v-for="item in computOptRefuseReason"
              :key="item.id"
              :label="item.refuseReason"
              :value="item.refuseCode"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        label="原因详细:"
        prop="refuseDesc"
        v-if="ruleForm.reason == 'OTHER'"
      >
        <el-input
          v-model="ruleForm.refuseDesc"
          type="textarea"
          style="width: 187px"
          placeholder="请输入"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="beforeClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { optionsDismissComic, EnumDismissComic } from "@/util/util";
import { getVidViolationList } from "@/api/common.js";
export default {
  data() {
    return {
      optionsDismissComic: optionsDismissComic,
      visible: false,
      doubleSelect: false,
      callback: null,
      optRefuseReason: [],
      tip: "",
      ruleForm: {
        reason: "",
        refuseType: EnumDismissComic.VIDEO_INFO,
        refuseDesc: "",
      },
    };
  },
  computed: {
    rules() {
      return {
        reason: [
          {
            required: true,
            message: this.doubleSelect ? "请选择驳回原因" : "请选择下架原因",
            trigger: "change",
          },
        ],
        refuseDesc: [
          {
            required: true,
            message: "请输入原因详情",
            trigger: "blur",
          },
        ],
      };
    },
    computOptRefuseReason() {
      if (this.ruleForm.refuseType == EnumDismissComic.VIDEO_INFO) {
        return this.optRefuseReason.filter(
          (v) => v.refuseType == EnumDismissComic.VIDEO_INFO
        );
      }
      if (this.ruleForm.refuseType == EnumDismissComic.VIDEO_CONTENT) {
        return this.optRefuseReason.filter(
          (v) => v.refuseType == EnumDismissComic.VIDEO_CONTENT
        );
      }
    },
  },
  methods: {
    beforeClose() {
      this.tip = "";
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
      this.ruleForm.refuseType = EnumDismissComic.VIDEO_INFO;
    },
    getInfo(refuseType) {
      let params = { current: 1, size: 10000, refuseType: refuseType };
      if (this.doubleSelect) {
        params = { contentType: "INK_LORE" };
      }
      getVidViolationList(params).then((res) => {
        this.optRefuseReason = res.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commSubmit();
        }
      });
    },
    commSubmit() {
      const item = this.optRefuseReason.find(
        (v) => v.refuseCode === this.ruleForm.reason
      );
      const myParams = {
        ...item,
      };
      if (item && item.refuseCode === "OTHER") {
        myParams.refuseDesc = this.ruleForm.refuseDesc;
      }
      if (this.callback) {
        this.callback(myParams);
        this.beforeClose();
      }
    },

    selectChange(val) {
      if (val) {
        this.ruleForm.reason = "";
      }
      this.getInfo();
    },
    selectRegionChange(val) {
      if (val != "OTHER") {
        this.ruleForm.refuseDesc = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clearMargin {
  ::v-deep.el-form-item__content {
    margin-left: 0 !important;
    text-align: center;
    .el-form-item__error {
      left: 55px;
    }
  }
}
::v-deep .el-textarea .el-input__count {
  color: #909399;
  /* background: #FFF; */
  position: absolute;
  font-size: 12px;
  bottom: -12px;
  right: 10px;
}
</style>
