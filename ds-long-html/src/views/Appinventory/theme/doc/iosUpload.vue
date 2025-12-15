<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="上传文件">
        <upload
          bucketType="FILE"
          accept=".apk"
          listType="text"
          ref="uploadRef"
          @onChangeFile="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          title="上传文件"
          :fileList="fileList"
          uploadFrom="singleVideo"
        />
        <span> 仅支持.apk </span>
        <el-progress
          v-if="loading"
          :stroke-width="5"
          :percentage="percentage"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="!ruleForm.apkFileName"
          >确 定</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveStylePackageDetail, versionStyle_page } from "@/api/admin/index";
import upload from "@/components/upload/index.vue";
import AppInfoParser from "app-info-parser";
import { EnumVERSIONTYPE } from "@/util/util";

export default {
  components: {
    upload,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      optTheme: [],
      fileList: [],
      percentage: 0,
      loading: false,
      versionStyleId: "",
      ruleForm: {
        versionOfficial: "",
        apkFileName: "",
        apkBucketName: "",
        packageName: "",
      },
    };
  },
  mounted() {
    const params = {
      current: 1,
      size: 999,
    };
    versionStyle_page(params).then((res) => {
      this.optTheme = res.data.data.records;
    });
  },
  methods: {
    onChangeFile(fileList) {
      this.loading = true;
      const uploadRef = this.$refs.uploadRef;
      if (fileList === "del") {
        uploadRef.clearFiles();
        uploadRef.abort();
        this.ruleForm.apkFileName = "";
        this.percentage = 0;
        this.loading = false;
        return;
      }

      const parser = new AppInfoParser(fileList.file);
      this.fileList = [fileList.file];
      parser.parse().then((res) => {
        const version = res.versionName || res.CFBundleShortVersionString;
        const packageName = res.package || res.CFBundleIdentifier;
        this.ruleForm.versionOfficial = version;

        uploadRef.sureBtnUpload(
          (data) => {
            if (this.row.platform === EnumVERSIONTYPE.android) {
              this.ruleForm.apkFileName = data.key;
              this.ruleForm.apkBucketName = data.bucketName;
              this.ruleForm.packageName = packageName;
            }
          },
          (event) => {
            this.percentage = Math.round((event.loaded / event.total) * 100);
          }
        );
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          {
            const params = {
              platform: this.row.platform,
              ...this.ruleForm,
            };
            saveStylePackageDetail(params).then(() => {
              this.$message.success("上传成功");
              this.row.callback(true);
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
