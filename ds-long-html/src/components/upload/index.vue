<template>
  <div class="uploadBtn">
    <el-upload
      name="file"
      action="/"
      :multiple="multiple"
      :accept="accept"
      :on-remove="handleRemove"
      :list-type="listType"
      :on-change="fileChangeMultiple"
      :http-request="httpRequest"
      ref="upload"
      :before-upload="beforeUpload"
      :file-list="uploadFileList"
      :limit="limit"
      :drag="drag"
      :disabled="disabled"
      :on-exceed="onExceed"
    >
      <template>
        <el-button
          v-if="listType === 'text' && !drag"
          size="small"
          type="primary"
          >点击上传</el-button
        >

        <i class="el-icon-plus" v-if="listType === 'picture-card'"></i>
        <span class="title" v-if="listType === 'picture-card'">{{
          title
        }}</span>

        <i class="el-icon-upload" v-if="drag"></i>
        <div class="el-upload__text" v-if="drag">
          <em>点击上传</em>
        </div>
      </template>
      <div slot="file" slot-scope="{ file }" v-if="isShowVideo">
        <video
          v-if="accept.includes('video')"
          class="el-upload-list__item-thumbnail uploadUrl"
          :src="file.url"
          alt=""
        />
        <span class="el-upload-list__item-actions" v-if="!isDetailsShow">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <span v-if="isW2HRateTip" class="W2HRateTip"
      >请上传宽高比为{{ getOriginWH().width }} :
      {{ getOriginWH().height }}的文件</span
    >
    <span v-if="fileFormat" class="W2HRateTip"
      >请上传{{ accept }} 格式的文件</span
    >
  </div>
</template>

<script>
import { getBucketInfo } from "@/api/video-manage/video-audit";
import { dowlodSensitiv } from "@/api/sensitiv/sensitiv";
import { uploadSettingGetDetail } from "@/api/admin/index";

var AWS = require("aws-sdk/global");
var S3 = require("aws-sdk/clients/s3");

const ENUMS_FROM = {
  singleVideo: "singleVideo",
  multipleVideo: "multipleVideo",
};
const ENUMS_LIST_TYPE = {
  picture: "picture",
  pictureCard: "picture-card",
  text: "text",
};
const ENUMS_CHANGE = {
  del: "del",
};
export default {
  props: {
    accept: {
      type: String,
      required: false,
      default:
        "image/png,image/jpeg,image/gif,image/bmp,image/jpg,image/svg,image/webp",
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    bucketType: {
      type: String,
      required: false,
      default: "AD",
    },
    W2HRate: {
      type: Number,
      required: false,
      default: () => {
        return 0;
      },
    },
    W2HRateOrigin: {
      type: Object,
      required: false,
      default: () => {
        return {
          width: 16,
          height: 9,
        };
      },
    },
    // 单位为 mb
    maxFileSize: {
      type: Number,
      required: false,
      default: 10,
    },
    limit: {
      type: Number,
      required: false,
      default: 1,
    },
    fileList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    onChange: {
      type: Function,
      required: false,
    },
    onChangeFile: {
      type: Function,
      required: false,
    },
    listType: {
      type: String,
      required: false,
      default: ENUMS_LIST_TYPE.pictureCard, // picture || picture-card || text
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    drag: {
      type: Boolean,
      required: false,
      default: false,
    },
    uploadFrom: {
      type: String,
      required: false,
      default: "", // Eum==> singleVideo || multipleVideo
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDetailsShow: {
      type: Boolean,
      required: false,
      default: false,
    },
    isW2HRateTip: {
      type: Boolean,
      required: false,
      default: false,
    },
    fileFormat: {
      type: Boolean,
      required: false,
      default: false,
    },
    uploadPage: {
      type: String,
      required: false,
      default: "", // Eum==> videoUploadList
    },
    isShowVideo: {
      type: Boolean,
      required: false,
      default: false,
    },
    widthHeightLimit: {
      type: Object,
      required: false,
      default: () => {
        return {
          width: 0,
          height: 0,
          tip: "上传文件比列不对",
        };
      },
    },
    videoTimeRange: {
      type: Object,
      required: false,
      default: () => {
        return {
          min: 15, // s
          max: 0, // s
        };
      },
    },
  },
  data() {
    return {
      file: null,
      instanceAWS: null,
      bucketInfo: null,
      uploadFileList: [],
      origin: "",
      fileAndy: null,
      timer: null,
      timerS3: null,
      delFileList: [],
      uploadSize: [],
    };
  },
  mounted() {
    this.getS3Info();
    dowlodSensitiv().then((res) => {
      const { data } = res;
      this.origin = data.data;
    });
    const params = {
      enumList: [
        "VIDEO_UPLOAD_UPPER_LIMIT_B",
        "VIDEO_UPLOAD_UPPER_LIMIT_C",
        "VIDEO_UPLOAD_DURATION_UPPER_LIMIT",
      ],
    };
    uploadSettingGetDetail(params).then((res) => {
      const data = res.data?.data || [];
      this.uploadSize = data;
    });
  },
  methods: {
    async getS3Info() {
      const res = await getBucketInfo(this.bucketType);
      this.bucketInfo = res.data.data;
      const {
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
        sessionToken,
        region,
      } = res.data.data;
      let cred = new AWS.Credentials(
        accessKeyId,
        secretAccessKey,
        sessionToken
      );
      //  this.instanceAWS = new AWS.S3({
      this.instanceAWS = new S3({
        region: region,
        credentials: cred,
      });
      if (res.data.data.expire) {
        if (this.timerS3) {
          clearInterval(this.timerS3);
        }
        let time =
          Number(res.data.data.getTokenTimestamp) +
          (res.data.data.expire - 60) * 1000 -
          new Date().getTime();
        this.timerS3 = setInterval(
          () => {
            this.getS3Info();
          },
          time > 0 ? time : 60 * 1000
        );
      }
    },
    videoUploadTip(isVideoMB) {
      const itemForB = this.uploadSize.find(
        (v) => v.videoUploadSettingKey === "VIDEO_UPLOAD_UPPER_LIMIT_B"
      );
      const videoUploadSettingValue = itemForB.videoUploadSettingValue; // gb
      const isMbLimit = videoUploadSettingValue * 1024;
      if (isVideoMB > isMbLimit) {
        const fun = (ms) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.$message.warning(
              `视频文件过大，请上传小于${videoUploadSettingValue}GB`
            );
          }, ms);
        };
        fun(500);

        return true;
      }
      return false;
    },
    beforeUpload(file, fileList, onExceed) {
      const isMB = file.size / 1024 / 1024;
      if (this.uploadPage === "videoUploadList" && this.videoUploadTip(isMB)) {
        return false;
      }
      if (isMB > this.maxFileSize) {
        this.$message.warning(`上传文件不能超过${this.maxFileSize}MB`);
        return false;
      }
      if (this.accept.includes("video")) {
        const arr = ["mp4", "mov", "m4v", "webm", "mkv"];
        // mp4==>mp4;mov==>quicktime;m4v==>mp4;webm==>webm;mkv==>x-matroska
        const ori = ["mp4", "quicktime", "webm", "x-matroska", "mkv"];
        let videoType = file.type.split("/")[1];
        if (!file.type && file.name) {
          const str = file.name.split(".")[1];
          videoType = str.toLowerCase();
        }
        if (!ori.includes(videoType)) {
          this.$message.warning(`上传文件只能是${arr.toString()}格式的视频`);
          return false;
        }
        return this.checkVideo(file, onExceed);
      }
      if (this.accept.includes("image")) {
        if (!this.accept.includes(file.type)) {
          this.$message.warning(`只能上传 ${this.accept} 格式图片文件`);
          return false;
        }
        return this.checkImage(file, onExceed);
      }
      if (this.accept.includes(".apk,.ipa")) {
        const packageArray = ["apk", "ipa"];
        const fileExtension = file.name.substr(file.name.lastIndexOf(".") + 1);
        if (!packageArray.includes(fileExtension)) {
          this.$message.warning(`只能上传 ${packageArray} 格式文件`);
          return false;
        }
      }
    },
    onExceed(files, fileList) {
      this.$message.warning(
        `只能传入${this.limit}个文件,请删除已上传的文件后再上传`
      );
      if (this.limit === 1) {
        // this.beforeUpload(files[0], fileList, "onExceed");
      }
    },
    getOriginWH() {
      let widthRate = 0;
      let heightRate = 0;
      if (this.W2HRate > 1) {
        widthRate = Math.floor(this.W2HRate * this.W2HRateOrigin.height);
        heightRate = Math.floor(this.W2HRateOrigin.width / this.W2HRate);
      } else {
        widthRate = Math.floor(this.W2HRate * this.W2HRateOrigin.height);
        heightRate = Math.floor(this.W2HRateOrigin.width / this.W2HRate);
      }
      return {
        width: widthRate,
        height: heightRate,
      };
    },
    checkVideo(file, onExceed) {
      return new Promise((resolve, reject) => {
        const videoDom = document.createElement("video");
        videoDom.src = window.URL.createObjectURL(file);
        videoDom.addEventListener("loadedmetadata", () => {
          const { videoWidth, videoHeight, duration } = videoDom;
          file.videoWidth = videoWidth;
          file.videoHeight = videoHeight;
          file.duration = duration;
          const isW2H = videoWidth / videoHeight;
          const inRandom = Math.abs(isW2H - this.W2HRate);

          if (this.widthHeightLimit.width && this.widthHeightLimit.height) {
            if (
              this.widthHeightLimit.width > this.widthHeightLimit.height &&
              videoWidth < videoHeight
            ) {
              this.$message.warning(this.widthHeightLimit.tip);
              reject(file);
              return;
            }
            if (
              this.widthHeightLimit.height > this.widthHeightLimit.width &&
              videoHeight < videoWidth
            ) {
              this.$message.warning(this.widthHeightLimit.tip);
              reject(file);
              return;
            }
          }
          if (inRandom > 0.1 && this.W2HRate) {
            this.$message.warning(
              `请上传宽高比为${this.getOriginWH().width}:${
                this.getOriginWH().height
              }的文件`
            );
            reject(file);
            return;
          }
          if (onExceed === "onExceed") {
            return this.awsUpload(file);
          }
          const itemForB = this.uploadSize.find(
            (v) =>
              v.videoUploadSettingKey === "VIDEO_UPLOAD_DURATION_UPPER_LIMIT"
          );

          let isConfigSeconds = itemForB.videoUploadSettingValue * 60;
          if (this.videoTimeRange.max) {
            isConfigSeconds = this.videoTimeRange.max;
          }
          if (videoDom.duration > isConfigSeconds) {
            const fun = (ms) => {
              if (this.timer) {
                clearTimeout(this.timer);
              }
              this.timer = setTimeout(() => {
                this.$message.warning(
                  `大于${isConfigSeconds}秒的视频将不会上传`
                );
              }, ms);
            };
            fun(500);
            this.delFileList.push(file);
            reject(file);
            return;
          }

          if (videoDom.duration < this.videoTimeRange.min) {
            const fun = (ms) => {
              if (this.timer) {
                clearTimeout(this.timer);
              }
              this.timer = setTimeout(() => {
                this.$message.warning(
                  `小于${this.videoTimeRange.min}秒的视频将不会上传`
                );
              }, ms);
            };
            fun(500);
            this.delFileList.push(file);
            reject(file);
            return;
          }
          resolve(file);
        });
      });
    },

    checkImage(file, onExceed) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          let img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const { width, height } = img;
            const isW2H = width / height;
            const inRandom = Math.abs(isW2H - this.W2HRate);
            if (this.widthHeightLimit.width && this.widthHeightLimit.height) {
              if (
                this.widthHeightLimit.width > this.widthHeightLimit.height &&
                width < height
              ) {
                this.$message.warning(this.widthHeightLimit.tip);
                reject(file);
                return;
              }
              if (
                this.widthHeightLimit.height > this.widthHeightLimit.width &&
                height < width
              ) {
                this.$message.warning(this.widthHeightLimit.tip);
                reject(file);
                return;
              }
            }

            if (inRandom > 0.1 && this.W2HRate) {
              this.$message.warning(
                `请上传宽高比为${this.getOriginWH().width}:${
                  this.getOriginWH().height
                }的文件`
              );
              reject(file);
            } else {
              if (onExceed === "onExceed") {
                return this.awsUpload(file);
              }
              resolve(file);
            }
          };
        };
      });
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    abort() {
      this.$refs.upload.abort();
    },
    handleRemove(file) {
      if (this.uploadFrom === ENUMS_FROM.singleVideo) {
        this.$emit("onChangeFile", ENUMS_CHANGE.del);
        return;
      } else if (this.uploadFrom === ENUMS_FROM.multipleVideo) {
        if (this.delFileList.length) {
          this.uploadFileList.forEach((v, i) => {
            this.delFileList.forEach((m, n) => {
              if (v.uid === m.uid) {
                this.uploadFileList.splice(i, 1);
                this.delFileList.splice(n, 1);
              }
            });
          });
        } else {
          this.uploadFileList.forEach((v, i) => {
            if (v.uid == file.uid) {
              this.uploadFileList.splice(i, 1);
            }
          });
        }
        this.$emit("onChange", this.uploadFileList);
      } else {
        this.uploadFileList.forEach((v, i) => {
          if (v.key == file.key) {
            this.uploadFileList.splice(i, 1);
          }
        });
        this.$emit("onChange", this.uploadFileList);
      }
    },
    fileChangeMultiple(file, fileList) {
      if (this.uploadFrom === ENUMS_FROM.multipleVideo) {
        this.file = file;
        const isMB = file.size / 1024 / 1024;
        if (
          this.uploadPage === "videoUploadList" &&
          this.videoUploadTip(isMB)
        ) {
          return false;
        }
        this.$emit("onChangeFile", fileList);
      }
    },
    httpRequest(file) {
      this.fileAndy = file;
      if (this.uploadFrom === ENUMS_FROM.multipleVideo) return;
      if (this.uploadFrom === ENUMS_FROM.singleVideo) {
        this.file = file;
        this.$emit("onChangeFile", file);
      } else {
        this.awsUpload(file.file);
      }
    },
    sureBtnUpload(callback, cbProgress) {
      this.awsUpload(this.file.file, callback, cbProgress);
    },
    getOnlyUid(file, bucketInfo) {
      let suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const time = new Date().getTime();
      const random = Math.floor(Math.random() * 100);
      let comDir = "";
      if (file.type.includes("video")) {
        comDir = bucketInfo.videoDir;
      } else {
        comDir = bucketInfo.pictureDir;
      }
      let str = `${comDir}${time}-${random}.${suffix}`;
      return str;
    },
    awsUpload(file, callback, cbProgress) {
      if (file) {
        const uploadParams = {
          Bucket: this.bucketInfo.bucketName,
          Key: this.getOnlyUid(file, this.bucketInfo),
          Body: file,
        };
        this.instanceAWS
          .upload(uploadParams, async (err, data) => {
            if (err) {
              console.log("上传 code S3 err==>", err?.code);
              if (err?.code === "ExpiredToken") {
                await this.getS3Info();
                this.awsUpload(file, callback, cbProgress);
              } else {
                this.$message.warning(err);
                this.clearFiles();
              }
            }
            if (data) {
              const item = {
                key: data.Key,
                bucketName: this.bucketInfo.bucketEnum,
                location: data.Location,
                url: `${this.origin}/${data.Key}`,
                bucketEnum: this.bucketInfo.bucketEnum,
                name: file.name,
                videoWidth: file?.videoWidth,
                videoHeight: file?.videoHeight,
                duration: file?.duration,
              };
              console.log("upload callback data", item);
              if (typeof callback === "function") {
                return callback(item);
              }

              if (this.limit === 1 && !this.uploadFileList.length) {
                return this.$emit("onChange", [item]);
              }

              if (this.limit === 1 && this.uploadFileList.length) {
                this.uploadFileList[0].key = item.key;
                this.uploadFileList[0].bucketName = item.bucketName;
                this.uploadFileList[0].location = item.location;
                this.uploadFileList[0].url = item.url;
                this.uploadFileList[0].bucketEnum = item.bucketEnum;
                this.uploadFileList[0].name = item.name;
                return this.$emit("onChange", this.uploadFileList);
              }
              this.uploadFileList.push(item);
              this.$emit("onChange", this.uploadFileList);
            }
          })
          .on("httpUploadProgress", (event) => {
            if (typeof cbProgress === "function") {
              cbProgress(event);
            }
          });
      }
    },
  },
  watch: {
    fileList: {
      handler(val) {
        this.uploadFileList = val;
      },
      deep: true,
    },
  },
  beforeDestroy() {
    if (this.timerS3) {
      clearInterval(this.timerS3);
    }
  },
};
</script>

<style lang="scss" scoped>
.uploadBtn {
  position: relative;
  ::v-deep .el-upload {
    position: relative !important;
    .title {
      position: absolute;
      width: 148px !important;
      left: 50%;
      transform: translateX(-50%);
      top: 19%;
    }
  }
  ::v-deep.el-upload-list__item-thumbnail {
    width: auto;
    height: auto;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    max-width: 100%;
    max-height: 100%;
  }
  ::v-deep.el-upload--picture-card {
    margin-bottom: 15px;
  }
  .uploadUrl {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .el-upload-list--picture .el-upload-list__item-thumbnail {
    margin: 0;
  }
  .W2HRateTip {
    color: #080707;
    font-size: 12px;
  }
}
</style>
