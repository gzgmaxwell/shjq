<template>
  <el-form ref="ruleFormRef" label-width="120px" class="demo-ruleForm" size="default">
    <div class="tipBox mb5">
      <el-icon class="activeBule icon"><InfoFilled /></el-icon> 可双击复制链接或扫码下载
    </div>
    <el-form-item label="安装包二维码">
      <img :src="qrCodeData" width="200" height="200" />
    </el-form-item>
    <el-form-item label="安装包链接">
      <div class="pr20 width-package">{{ props.row.distrPackageUrl }}</div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()"> 确定 </el-button>
      <el-button @click="resetForm()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import QRCode from "qrcode";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});
const qrCodeData = ref("");

const submitForm = () => {
  window.location.href = props.row.distrPackageUrl;
  props.row.callback(true);
};

const resetForm = () => {
  props.row.callback();
};

onMounted(() => {
  QRCode.toDataURL(props.row.distrPackageUrl)
    .then((url) => {
      qrCodeData.value = url;
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>
<style lang="scss" scoped>
.tipBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #337ab7;
  border-radius: 2px;

  .icon {
    margin-top: -1px;
    margin-right: 5px;
    color: #337ab7;
  }
}

.width-package {
  width: 560px;
  text-align: center;
  word-wrap: break-word;
}
</style>
