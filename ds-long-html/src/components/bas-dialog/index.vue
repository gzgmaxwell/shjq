<template>
  <div>
    <el-dialog
      class="comn_dialog"
      :title="dialogTitle"
      :visible.sync="visible"
      :width="popupWidth"
      :top="popupTop"
      :before-close="Cancel"
      :close-on-click-modal="false"
    >
      <slot>
        <p>弹窗内容自定义</p>
      </slot>
      <span v-if="btnShow" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Save">确定</el-button>
        <el-button @click="Cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: "标题",
    },
    centerDialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    popupWidth: {
      type: String,
      default() {
        return "430px";
      },
    },
    popupTop: {
      type: String,
      default() {
        return "9vh";
      },
    },
    btnShow: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  computed: {
    visible: {
      get() {
        return this.centerDialogVisible;
      },
      set(val) {
        this.$emit("updateVisible", val);
      },
    },
  },
  methods: {
    Cancel() {
      this.$emit("resetPopupData");
    },
    Save() {
      this.$emit("submitPopupData");
    },
  },
};
</script>
<style lang="scss">
.comn_dialog {
  .el-dialog__header {
    padding: 8px 0px 3px 8px;
    border-bottom: 1px solid #ebe8e8;
  }
  .el-dialog__title {
    font-size: 16px;
    letter-spacing: 1px;
    color: #464646;
    line-height: 24px;
  }
  .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
  .el-dialog__headerbtn {
    position: static; // 兼容IE11 ,取消原有的position定位
  }
  .el-dialog__close {
    color: #aaa;
    font-size: 16px;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  .el-dialog__body {
    padding: 20px;
  }
}
</style>
