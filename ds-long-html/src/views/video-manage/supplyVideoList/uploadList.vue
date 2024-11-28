<template>
  <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px">
    <el-form-item label="上 传:">
      <div class="videoBox">
        <video controls ref="videoRef" style="width: 1px; height: 1px"></video>
        <canvas id="mycanvas" style="display: none"></canvas>
      </div>
      <upload
        bucketType="PRE_VIDEO"
        accept="video/*;video/x-mpeg2"
        listType="text"
        ref="uploadRef"
        @onChangeFile="onChangeFile"
        :W2HRate="0"
        :maxFileSize="1000000"
        :limit="10"
        title="上传视频"
        :multiple="true"
        :drag="true"
        :fileList="fileList"
        uploadFrom="multipleVideo"
        uploadPage="videoUploadList"
      />
      <ul class="upload-progress" v-if="isUploading">
        <li v-for="(file, index) in fileList" :key="index">
          <span>{{ file.name }}</span>
          <!-- <button
            :disabled="isUploading"
            class="el-icon-close"
            @click="handleFileRemove(index)"
          ></button> -->
          <el-progress :stroke-width="5" :percentage="file.progress" />
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="备 注:">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="close" :disabled="isUploading">取 消</el-button>
      <el-button :disabled="submitBtn" type="primary" @click="submitUploadList"
        >上 传</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { substancePreSubmitDraft } from "@/api/video-manage/index";
import upload from "@/components/upload";
export default {
  components: {
    upload,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    getVideo: {
      type: Function,
      default: () => {},
    },
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
      form: {
        desc: "",
      },
      submitBtn: true,
      isUploading: false,
      fileList: [],
    };
  },
  mounted() {},
  methods: {
    onChangeFile(fileList) {
      if (fileList.length) {
        fileList.forEach((v) => {
          v.progress = 0;
        });
        this.fileList = fileList;
        this.submitBtn = false;
      } else {
        this.fileList = [];
        this.submitBtn = true;
      }
    },
    handleUploadList(index) {
      const uploadRef = this.$refs.uploadRef;
      const file = this.fileList[index];
      const video = this.$refs.videoRef;
      const canvas = document.getElementById("mycanvas");
      const ctx = canvas.getContext("2d");
      let url = window.webkitURL.createObjectURL(file.raw);
      video.src = url;
      video.crossOrigin = "anonymous";
      uploadRef.awsUpload(
        file.raw,
        async (data) => {
          await new Promise((resolve) => {
            video.currentTime = 2;
            video.addEventListener("canplay", () => {
              setTimeout(() => {
                resolve();
              }, 500);
            });
          });
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            const fileCover = new File([blob], "andy.png", {
              type: "image/jpeg",
            });
            uploadRef.awsUpload(fileCover, (dataCover) => {
              let params = [
                {
                  coverBucketName: dataCover.bucketName,
                  coverFileName: dataCover.key,
                  remark: this.form.desc,
                  videoBucketNameOriginal: data.bucketName,
                  videoFileNameOriginal: data.key,
                  videoLength: video.duration * 1000,
                  videoWidth: data?.videoWidth,
                  videoHeight: data?.videoHeight,
                  videoTitle: data?.name.substr(0, data.name.lastIndexOf(".")),
                },
              ];
              substancePreSubmitDraft(params).then((res) => {
                const { data } = res;
                if (data.code == "200") {
                  this.$message.success(`视频${file.name}上传成功`);
                  index++;
                  if (index < this.fileList.length) {
                    video.src = url;
                    this.handleUploadList(index);
                  } else {
                    this.close();
                  }
                }
              });
            });
          });
        },
        (event) => {
          let progress = Math.round((event.loaded / event.total) * 100);
          const newvalue = this.fileList[index];
          this.fileList[index].progress = progress;
          this.$set(this.fileList, index, newvalue);
        }
      );
    },
    async submitUploadList() {
      this.submitBtn = true;
      this.isUploading = true;
      const index = 0;
      this.handleUploadList(index);
    },

    close() {
      this.row.callback(true);
    },
    reset() {
      this.submitBtn = true;
      this.isUploading = false;
      this.fileList = [];
      const video = this.$refs.videoRef;
      video.src = "";
      this.$refs.uploadRef.clearFiles();
    },
    handleFileRemove(index) {
      const uploadRef = this.$refs.uploadRef;
      this.fileList.splice(index, 1);
      uploadRef.abort();
      if (!this.fileList.length) {
        this.reset();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.videoBox {
  position: absolute;
  right: 0;
  top: 0;
}
.upload-progress {
  list-style: none;
  padding: 0;
  li {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px 10px;
    margin-top: 5px;
    .el-icon-close {
      border: none;
      outline: none;
      background: none;
      display: block;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      opacity: 0.75;
      color: #606266;
    }
  }
}
</style>
