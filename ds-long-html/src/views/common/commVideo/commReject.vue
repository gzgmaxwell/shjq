<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <div v-if="row.num" style="text-align: center">
      <p class="mt20">确定下架 {{ row.num }} 个视频?</p>
    </div>
    <div style="text-align: center" class="must mb10" v-if="webPageMenu == ''">
      <i class="el-icon-warning"></i>
      已存在推荐池，推荐管理，动态管理的视频会同步下架
    </div>
    <el-form-item
      :label="pageInfo.reason"
      prop="region"
      v-if="pageInfo.isOutHandle"
    >
      <el-select
        v-model="ruleForm.region"
        :placeholder="`请选择${pageInfo.reason}`"
      >
        <el-option
          v-for="item in optRefuseReason"
          :key="item.refuseCode"
          :label="item.refuseReason"
          :value="item.refuseCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="region" v-else class="clearMargin">
      <div style="margin-bottom: 10px">
        <el-radio-group v-model="ruleForm.refuseType" @change="selectChange">
          <el-radio
            v-for="item in optionsDismiss"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </div>
      <div>
        <el-select
          style="width: 70%"
          v-model="ruleForm.region"
          placeholder="请选择回退原因"
          @change="selectRegionChange"
        >
          <el-option
            v-for="item in optRefuseReason"
            :key="item.refuseCode"
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
      v-if="ruleForm.region == 'OTHER'"
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
    <!-- <el-form-item label="违规内容时段:" prop="text">
      <el-input
        v-model="ruleForm.text"
        style="width: 215px"
        placeholder="请输入内容违规时段"
      ></el-input>
    </el-form-item> -->
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
        :disabled="isButtonDisabled"
        >提交</el-button
      >
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getVidViolationList } from "@/api/common.js";
import { debounce, optionsDismiss, EnumDismiss } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
    pageInfo: {
      type: Object,
      required: false,
      default: () => {
        return {
          isOutHandle: false,
          reason: "驳回原因",
        };
      },
    },
    webPageMenu: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      optionsDismiss: optionsDismiss,
      isButtonDisabled: false,
      rules: {
        region: [
          {
            required: true,
            message: `请选择${this.pageInfo.reason}`,
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
      },
      ruleForm: {
        region: "",
        refuseType: this.pageInfo.isOutHandle ? "" : EnumDismiss.VIDEO_INFO,
        refuseDesc: "",
      },
      optRefuseReason: [],
    };
  },
  mounted() {
    this.gitOpt();
  },
  methods: {
    gitOpt() {
      let params = { current: 1, size: 10000, refuseType: "VIDEO_CONTENT" };
      if (this.webPageMenu === "violationCheck") {
        params = {};
      }
      getVidViolationList(params).then((res) => {
        if (this.ruleForm.refuseType == EnumDismiss.VIDEO_INFO) {
          this.optRefuseReason = res.data.data.filter(
            (v) => v.refuseType == EnumDismiss.VIDEO_INFO
          );
        } else if (this.ruleForm.refuseType == EnumDismiss.VIDEO_CONTENT) {
          this.optRefuseReason = res.data.data.filter(
            (v) => v.refuseType == EnumDismiss.VIDEO_CONTENT
          );
        } else {
          this.optRefuseReason = res.data.data;
        }
      });
    },
    selectChange(val) {
      if (val) {
        this.ruleForm.region = "";
      }
      this.gitOpt();
    },
    selectRegionChange(val) {
      console.log(val);
      if (val != "OTHER") {
        this.ruleForm.refuseDesc = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isButtonDisabled = true;
          debounce(() => {
            this.commSubmit();
          }, 400)();
        } else {
          return false;
        }
      });
    },
    commSubmit() {
      const item = this.optRefuseReason.find(
        (v) => v.refuseCode === this.ruleForm.region
      );
      const myParams = {
        ...item,
      };
      if (item && item.refuseCode === "OTHER") {
        myParams.refuseDesc = this.ruleForm.refuseDesc;
      }
      return this.row.callback(myParams);
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
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
