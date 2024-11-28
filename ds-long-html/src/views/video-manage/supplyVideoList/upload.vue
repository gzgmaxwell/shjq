<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      style="margin-top: 20px"
    >
      <el-form-item label="视频上传:">
        <upload
          bucketType="PRE_VIDEO"
          accept="video/*;video/x-mpeg2"
          listType="text"
          ref="uploadRef"
          @onChangeFile="onChangeFile"
          :W2HRate="0"
          :maxFileSize="1000000"
          :limit="1"
          title="上传视频"
          :fileList="videoFileList"
          :drag="true"
          uploadFrom="singleVideo"
          uploadPage="videoUploadList"
        />

        <ul class="upload-progress" v-if="loading">
          <el-progress :stroke-width="5" :percentage="percentage" />
        </ul>
      </el-form-item>

      <el-form-item label="备 注:">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>

      <div style="margin-top: 10px; margin-bottom: 20px">
        <!-- <video
          controls
          ref="videoRef"
          style="width: 100%; height: 200px"
        ></video> -->
        <videojsPlay />
        <canvas id="mycanvas" style="display: none"></canvas>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          :disabled="!isCaptureing"
          @click="handleCapture"
          >抓 拍</el-button
        >
        <el-button type="primary" :disabled="!submitBtn" @click="submitUpload"
          >上 传</el-button
        >
        <el-button @click="row.callback && row.callback()">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { substancePreSubmitDraft } from "@/api/video-manage/index";
import upload from "@/components/upload";
import videojsPlay from "@/components/videojsPlay";

const ENUMS_CHANGE = {
  del: "del",
};
export default {
  components: {
    upload,
    videojsPlay,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      file: "",
      form: {
        desc: "",
        duration: "",
        coverFileName: "",
        coverBucketName: "",
      },
      percentage: 0,
      isCaptureing: false,
      submitBtn: false,
      loading: false,
      videoFileList: [],
    };
  },
  methods: {
    onChangeFile(file) {
      // const videoRef = this.$refs.videoRef;
      const videoRef = document.getElementById("videoRef");
      if (file === ENUMS_CHANGE.del) {
        this.reset();
        return;
      }
      let url = window.webkitURL.createObjectURL(file.file);
      videoRef.src = url;
      videoRef.addEventListener("loadedmetadata", () => {
        this.form.duration = videoRef.duration;
        this.isCaptureing = true;
      });
    },
    handleCapture() {
      const uploadRef = this.$refs.uploadRef;
      // const videoRef = this.$refs.videoRef;
      const videoRef = document.getElementById("videoRef");
      const canvas = document.getElementById("mycanvas");
      const ctx = canvas.getContext("2d");

      videoRef.crossOrigin = "anonymous";
      videoRef.currentTime = 0.2;
      videoRef.play();

      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;

      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "andy.png", { type: "image/jpeg" });
        uploadRef.awsUpload(file, (data) => {
          this.isCaptureing = false;
          this.submitBtn = true;
          this.form.coverFileName = data.key;
          this.form.coverBucketName = data.bucketName;
          this.$message.success("抓拍成功");
        });
      });
    },
    submitUpload() {
      this.loading = true;
      this.submitBtn = false;
      const uploadRef = this.$refs.uploadRef;
      uploadRef.sureBtnUpload(
        (data) => {
          const params = [
            {
              coverBucketName: this.form.coverBucketName,
              coverFileName: this.form.coverFileName,
              remark: this.form.desc,
              videoBucketNameOriginal: data.bucketName,
              videoFileNameOriginal: data.key,
              videoLength: this.form.duration * 1000,
              videoWidth: data?.videoWidth,
              videoHeight: data?.videoHeight,
              videoTitle: data?.name.substr(0, data.name.lastIndexOf(".")),
            },
          ];
          substancePreSubmitDraft(params).then((res) => {
            const { data } = res;
            if (data.code == "200") {
              this.$message.success("上传成功");
              this.close();
            }
          });
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          this.percentage = progress;
          if (event.loaded === event.total) {
            this.loading = false;
          }
        }
      );
    },
    close() {
      this.row.callback(true);
    },
    reset() {
      // const videoRef = this.$refs.videoRef;
      const videoRef = document.getElementById("videoRef");
      videoRef.src = "";
      this.isCaptureing = false; // 抓拍中
      this.submitBtn = false; // 上传
      this.loading = false;
      this.$refs.uploadRef.clearFiles();
    },
  },
};
</script>
<style lang="scss" scoped></style>
