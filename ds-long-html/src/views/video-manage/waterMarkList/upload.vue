<template>
  <el-form label-width="10px" class="demo-ruleForm">
    <el-form-item>
      <div class="mt10">
        <upload
          bucketType="AD"
          accept="image/png,image/jpg,image/jpeg"
          @onChange="onChange"
          :W2HRate="0"
          :maxFileSize="20"
          :limit="3"
          title="上传水印"
          :fileList="fileList"
        />
        请上传image/png,image/jpg, image/jpeg 格式的文件,最大20MB
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm()">确定</el-button>
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { watermarkSaveOrUpdate } from "@/api/video-manage/index";
import upload from "@/components/upload/index.vue";
import { watermarkCurrent } from "@/api/video-manage/index";
import { debounce } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {
    upload,
  },
  data() {
    return {
      bucketName: "",
      key: "",
      fileList: [],
      uploadList: [],
    };
  },
  mounted() {
    watermarkCurrent().then((res) => {
      const data = res.data?.data || [];
      this.fileList = data.map((v) => {
        return {
          url: v.watermarkDownloadUrl,
          key: v.watermarkFileName,
          bucketName: v.watermarkBucketName,
        };
      });
      this.uploadList = this.fileList;
    });
  },

  methods: {
    onChange(data) {
      this.uploadList = data;
    },

    submitForm() {
      debounce(this.commit, 400)();
    },
    commit() {
      if (!this.uploadList.length) {
        return this.$message.warning("请上传水印图片");
      }
      const params = this.uploadList.map((v) => {
        return {
          watermarkFileName: v.key,
        };
      });

      watermarkSaveOrUpdate(params).then(() => {
        this.$message.success("上传成功");
        this.row.callback(true);
      });
    },
  },
};
</script>
