<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="风格名称:" prop="name">
        <el-input
          style="width: 70%"
          v-model="ruleForm.name"
          placeholder="风格名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="android替换资源:">
        <span slot="label"><span class="must">*</span>android替换资源:</span>
        <upload
          bucketType="FILE"
          accept=".zip"
          listType="text"
          ref="uploadRef"
          @onChangeFile="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          title="上传文件"
          :fileList="fileListGift"
          :isFileNameToKey="true"
          uploadFrom="singleVideo"
        />
        <span> 仅支持zip格式 </span>
        <ul class="upload-progress" v-if="loading">
          <el-progress :stroke-width="5" :percentage="percentage" />
        </ul>
      </el-form-item>
      <el-form-item label="IOS替换资源:">
        <span slot="label"><span class="must">*</span>IOS替换资源:</span>
        <upload
          bucketType="FILE"
          accept=".zip"
          listType="text"
          ref="iosUploadRef"
          @onChangeFile="iosOnChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          title="上传文件"
          :fileList="iosFileListGift"
          :isFileNameToKey="true"
          uploadFrom="singleVideo"
        />
        <span> 仅支持zip格式 </span>
        <ul class="upload-progress" v-if="iosLoading">
          <el-progress :stroke-width="5" :percentage="iosPercentage" />
        </ul>
      </el-form-item>

      <el-form-item label="图片示例:">
        <span slot="label"><span class="must">*</span>图片示例:</span>
        <upload
          bucketType="AD"
          accept="image/png,image/jpg,image/jpeg,image/svg,image/bmp,image/webp,image/gif"
          @onChange="onChangeEffect"
          :W2HRate="0"
          :maxFileSize="20"
          :limit="1"
          title="图片示例"
          :fileList="fileListEffect"
        />
        <span>格式为png,jpg,jpeg,svg,bmp,webp,gif </span>
      </el-form-item>

      <el-form-item label="是否启用:" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio v-for="item in optTheme" :key="item.id" :label="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveVersionStyle, updateVersionStyle } from "@/api/admin/index";
import { optTheme, EnumTheme } from "@/util/util";
import upload from "@/components/upload/index.vue";

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
      optTheme: optTheme,
      fileListGift: [],
      iosFileListGift: [],
      fileListEffect: [],
      percentage: 0,
      iosPercentage: 0,
      loading: false,
      iosLoading: false,
      ruleForm: {
        name: "",
        resourceAddressFileName: "",
        resourceAddressBucketName: "",
        iosResourceAddressFileName: "",
        iosResourceAddressBucketName: "",
        imgFileName: "",
        imgBucketName: "",
        status: EnumTheme.start,
      },
      rules: {
        name: [{ required: true, message: "请输入风格名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择是否启用", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.ruleForm.name = this.row.name;
      this.ruleForm.resourceAddressFileName = this.row.resourceAddressFileName;
      this.ruleForm.resourceAddressBucketName =
        this.row.resourceAddressBucketName;
      this.ruleForm.iosResourceAddressFileName =
        this.row.iosResourceAddressFileName;
      this.ruleForm.iosResourceAddressBucketName =
        this.row.iosResourceAddressBucketName;
      this.ruleForm.imgFileName = this.row.imgFileName;
      this.ruleForm.imgBucketName = this.row.imgBucketName;
      this.ruleForm.status = this.row.status;
      if (this.row.resourceAddressFileName) {
        setTimeout(() => {
          this.fileListGift = [
            {
              url: this.row.resourceAddressUrl,
              key: this.row.resourceAddressFileName,
              bucketName: this.row.resourceAddressBucketName,
            },
          ];
        });
      }
      if (this.row.iosResourceAddressFileName) {
        setTimeout(() => {
          this.iosFileListGift = [
            {
              url: this.row.iosResourceAddressUrl,
              key: this.row.iosResourceAddressFileName,
              bucketName: this.row.iosResourceAddressBucketName,
            },
          ];
        });
      }
      if (this.row.imgFileName) {
        setTimeout(() => {
          this.fileListEffect = [
            {
              url: this.row.imgUrl,
              key: this.row.imgFileName,
              bucketName: this.row.imgBucketName,
            },
          ];
        });
      }
    }
  },
  methods: {
    //android资源上传
    onChangeFile(fileList) {
      this.loading = true;
      const uploadRef = this.$refs.uploadRef;
      if (fileList === "del") {
        uploadRef.clearFiles();
        this.loading = false;
        this.percentage = 0;
        this.ruleForm.resourceAddressFileName = "";
        this.ruleForm.resourceAddressBucketName = "";
        return;
      }

      uploadRef.sureBtnUpload(
        (data) => {
          this.ruleForm.resourceAddressFileName = data.key;
          this.ruleForm.resourceAddressBucketName = data.bucketName;
          this.loading = false;
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          this.percentage = progress;
        }
      );
    },
    //ios资源上传
    iosOnChangeFile(fileList) {
      this.iosLoading = true;
      const iosUploadRef = this.$refs.iosUploadRef;
      if (fileList === "del") {
        iosUploadRef.clearFiles();
        this.iosLoading = false;
        this.iosPercentage = 0;
        this.ruleForm.iosResourceAddressFileName = "";
        this.ruleForm.iosResourceAddressBucketName = "";
        return;
      }

      iosUploadRef.sureBtnUpload(
        (data) => {
          this.ruleForm.iosResourceAddressFileName = data.key;
          this.ruleForm.iosResourceAddressBucketName = data.bucketName;
          this.iosLoading = false;
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          this.iosPercentage = progress;
        }
      );
    },
    onChangeEffect(data) {
      if (data.length) {
        this.ruleForm.imgFileName = data[0].key;
        this.ruleForm.imgBucketName = data[0].bucketName;
      } else {
        this.ruleForm.imgFileName = "";
        this.ruleForm.imgBucketName = "";
        this.fileListEffect = [];
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.resourceAddressFileName) {
            return this.$message.error("请上传android替换资源");
          }
          if (!this.ruleForm.iosResourceAddressFileName) {
            return this.$message.error("请上传IOS替换资源");
          }
          if (!this.ruleForm.imgFileName) {
            return this.$message.error("请上传图片示例");
          }
          if (this.row.id) {
            updateVersionStyle({
              id: this.row.id,
              ...this.ruleForm,
            }).then(() => {
              this.$message.success("编辑成功");
              this.row.callback(true);
            });
          } else {
            saveVersionStyle(this.ruleForm).then(() => {
              this.$message.success("新增成功");
              this.row.callback(true);
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-progress {
  margin: 0;
  padding: 0;
}
::v-deep .el-upload-dragger {
  width: 175%;
}
</style>
