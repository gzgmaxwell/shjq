<template>
  <div class="chapter">
    <el-row>
      <el-col :span="15">
        <div class="wrap">
          <videoPlayer
            ref="video"
            :single="{
              videoOriginalFileUrl: row.videoOriginalUrl,
              coverFileUrl: row.coverUrl,
            }"
            title="视频预览"
          />
        </div>
        <div class="showBox">
          <div class="btnList">
            <el-button
              @click="createPart"
              :disabled="isPlaying || isCapturing || isDisabled"
              >创建片段</el-button
            >
            <el-button @click="clear" :disabled="!data.length">清空</el-button>
            <el-button @click="deletePart" :disabled="!data.length"
              >删除片段</el-button
            >
            <el-button @click="handleCapture(false)" :disabled="!data.length"
              >截取封面</el-button
            >
          </div>
          <upload
            bucketType="PRE_VIDEO"
            style="visibility: hidden; position: absolute"
            ref="uploadRef"
            :W2HRate="0"
            :maxFileSize="5"
            :limit="1"
            title="封面图片"
            :fileList="[]"
          /></div
      ></el-col>
      <el-col :span="9">
        <div class="wrapbox">
          <div>节点分类</div>
          <el-row
            v-for="(item, i) in data"
            class="mt10 itemBox"
            :key="i"
            :class="{ active: item.isActive }"
          >
            <div
              @click="
                () => {
                  data.forEach((v) => (v.isActive = false));
                  item.isActive = true;
                }
              "
            >
              <el-col :span="17">
                <div class="listWrap">
                  <span class="title">节点时间：</span> 第
                  {{ Number(item.startTime).toFixed(1) }}秒
                </div>
                <div class="listWrap">
                  <div class="parentDelStyle">
                    <span class="title">节点ICON：</span>
                    <span class="icon" @click="clickIcon(item)">
                      <img
                        v-if="item.iconFileUrl"
                        :src="item.iconFileUrl"
                        width="24"
                        height="24"
                      />
                    </span>
                    <span
                      class="delStyle"
                      v-if="item.iconFileUrl"
                      @click="
                        () => {
                          item.iconFileUrl = '';
                          item.iconFileName = '';
                        }
                      "
                      ><i class="el-icon-error"></i
                    ></span>
                  </div>
                </div>
                <div class="listWrap">
                  <span class="title">节点名称：</span>
                  <el-input
                    maxLength="12"
                    type="text"
                    size="mini"
                    v-model="item.name"
                    @input="input"
                    :style="{ width: '120px' }"
                  />
                </div>
              </el-col>
              <el-col :span="7">
                <img
                  v-if="item.url"
                  class="mr10 mt10"
                  :src="item.url"
                  width="80"
                  height="80"
                />
              </el-col>
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div class="mt20">
      <el-button type="primary" @click="sureBtn">确认</el-button>
      <el-button @click="row.callback()">取消</el-button>
    </div>
    <el-dialog
      title="节点图标"
      :visible.sync="visible"
      width="50%"
      :modal="false"
      :close-on-click-modal="false"
    >
      <progressVideo v-if="visible" :row="params" />
    </el-dialog>
  </div>
</template>
<script>
import videoPlayer from "@/components/video-player/index.vue";
import upload from "@/components/upload/index.vue";
import { chapterOnOff } from "@/api/content/management";
import progressVideo from "./progressVideo.vue";
import { videoToBlob } from "@/util/util";

const minIntevalTime = 0.1;
export default {
  components: {
    videoPlayer,
    upload,
    progressVideo,
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
      data: [],
      isCapturing: true,
      status: "OFFLINE",
      visible: false,
      params: {},
      isPlaying: false,
      isDisabled: false,
      initCapture: {},
    };
  },
  mounted() {
    setTimeout(() => {
      this.loadVideo();
    });
  },

  methods: {
    loadVideo() {
      const video = document.getElementById("videoElement");
      video.addEventListener("loadeddata", () => {
        video.currentTime = video.currentTime;
        if (this.row.partList.length) {
          this.getPartList();
        }
        setTimeout(() => {
          this.handleCapture(true);
        }, 600);
      });
      video.addEventListener("timeupdate", () => {
        const currentTime = video.currentTime;
        const duration = video.duration;

        if (duration < minIntevalTime) {
          this.isDisabled = true;
          return;
        }
        if (duration - currentTime < minIntevalTime) {
          this.isDisabled = true;
          return;
        }
        this.isDisabled = this.data.some((v) => {
          if (v.startTime === currentTime || v.endTime === currentTime) {
            return true;
          }
          if (v.startTime < currentTime && v.endTime > currentTime) {
            if (currentTime - v.startTime < minIntevalTime) {
              return true;
            }
            if (v.endTime - currentTime < minIntevalTime) {
              return true;
            }
          }
          return false;
        });
      });
      video.addEventListener("play", () => {
        this.isPlaying = true;
      });
      video.addEventListener("pause", () => {
        this.isPlaying = false;
      });
    },

    getPartList() {
      this.status = this.row.status;
      this.row.partList.forEach((v, i) => {
        const rate = 1000;
        const item = {
          name: v.chapterTitle,
          startTime: v.chapterStartTime / rate,
          endTime: v.chapterEndTime / rate,
          isActive: i === 0,
          bucketName: v.imgBucketName,
          key: v.imgFileName,
          url: v.imgFileUrl,
          iconFileName: v.iconFileName, // icon
          iconBucketName: v.iconBucketName, // icon
          iconFileUrl: v.iconFileUrl,
        };
        this.data.push(item);
      });
    },

    input(val) {
      this.name = val;
      this.data.forEach((v) => {
        if (v.isActive) {
          v.name = val;
        }
      });
    },
    clickIcon(item) {
      this.visible = true;
      this.params = {
        ...item,
        callback: (data) => {
          this.visible = false;
          item.iconBucketName = data.avatarBucket;
          item.iconFileName = data.avatar;
          item.iconFileUrl = data.avatarFileUrl;
          item.name = data.iconName;
        },
      };
    },
    sureBtn() {
      this.row.callback(this.data);
    },
    createPart() {
      this.isCapturing = true;
      const video = document.getElementById("videoElement");
      const paused = video;
      const currentTime = video.currentTime;
      const duration = video.duration;

      const arr = [...this.data];

      if (paused) {
        if (!this.data.length) {
          if (currentTime < minIntevalTime) {
            arr.push({
              name: "节点",
              startTime: 0,
              endTime: duration,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              iconBucketName: "",
              iconFileName: "",
              iconFileUrl: "",
            });
          } else {
            arr.push({
              name: "节点",
              startTime: 0,
              endTime: currentTime,
              isActive: false,
              bucketName: this.initCapture.bucketName,
              key: this.initCapture.key,
              url: this.initCapture.url,
              iconBucketName: "",
              iconFileName: "",
              iconFileUrl: "",
            });
            arr.push({
              name: "节点",
              startTime: currentTime,
              endTime: duration,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              iconBucketName: "",
              iconFileName: "",
              iconFileUrl: "",
            });
          }
        } else {
          let inTimeIndex = -1;
          this.data.forEach((v, i) => {
            if (v.startTime < currentTime && v.endTime > currentTime) {
              inTimeIndex = i;
            }
          });

          if (inTimeIndex > -1) {
            const item = this.data[inTimeIndex];
            arr.splice(inTimeIndex, 1);
            this.data.forEach((v) => (v.isActive = false));
            arr.push({
              name: item.name || "节点",
              startTime: item.startTime,
              endTime: currentTime,
              isActive: false,
              bucketName: item.bucketName,
              key: item.key,
              url: item.url,
              iconBucketName: item.iconBucketName,
              iconFileName: item.iconFileName,
              iconFileUrl: item.iconFileUrl,
            });
            arr.push({
              name: "节点",
              startTime: currentTime,
              endTime: item.endTime,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              iconBucketName: "",
              iconFileName: "",
              iconFileUrl: "",
            });
          } else {
            const firstItem = this.data[0];
            const lastItem = this.data[this.data.length - 1];
            const isMoreArr = this.data.filter((v) => currentTime > v.endTime);
            if (currentTime < firstItem.startTime) {
              this.data.forEach((v) => (v.isActive = false));
              arr.push({
                name: "节点",
                startTime: 0,
                endTime: firstItem.startTime,
                isActive: true,
                bucketName: "",
                key: "",
                url: "",
                iconBucketName: "",
                iconFileName: "",
                iconFileUrl: "",
              });
            } else if (currentTime > lastItem.endTime) {
              this.data.forEach((v) => (v.isActive = false));
              arr.push({
                name: "节点",
                startTime: lastItem.endTime,
                endTime: duration,
                isActive: true,
                bucketName: "",
                key: "",
                url: "",
                iconBucketName: "",
                iconFileName: "",
                iconFileUrl: "",
              });
            } else {
              if (isMoreArr && isMoreArr.length) {
                let index = isMoreArr.length - 1;
                this.data.forEach((v) => (v.isActive = false));
                arr.push({
                  name: "节点",
                  startTime: this.data[index].endTime,
                  endTime: this.data[index + 1].startTime,
                  isActive: true,
                  bucketName: "",
                  key: "",
                  url: "",
                  iconBucketName: "",
                  iconFileName: "",
                  iconFileUrl: "",
                });
              }
            }
          }
        }
        video.currentTime = currentTime;
        this.data = arr.sort((a, b) => {
          return a.startTime - b.startTime;
        });
        this.handleCapture();
      }
    },
    deletePart() {
      const video = document.getElementById("videoElement");
      this.data = this.data.filter((v) => !v.isActive);
      const isNoneActive = this.data.every((v) => !v.isActive);
      if (this.data.length && isNoneActive) {
        this.data[this.data.length - 1].isActive = true;
      }
      if (this.data.length) {
        const lastItem = this.data[this.data.length - 1];
        video.currentTime = lastItem.endTime;
      } else {
        video.currentTime = 0;
      }
    },
    handleCapture(isLoadeddata) {
      const uploadRef = this.$refs.uploadRef;
      const videoRef = document.getElementById("videoElement");
      videoToBlob(videoRef).then((blob) => {
        const file = new File([blob], "andy.webp", { type: "image/webp" });
        uploadRef.awsUpload(file, (data) => {
          if (isLoadeddata) {
            this.isCapturing = false;
            return (this.initCapture = data);
          }
          this.$message.success("抓拍成功");
          this.data.forEach((v) => {
            if (v.isActive) {
              v.bucketName = data.bucketName;
              v.key = data.key;
              v.url = data.url;
              this.isCapturing = false;
            }
          });
        });
      });
    },
    changeStatus(val) {
      chapterOnOff({ status: val, substanceId: this.row.id }).then(() => {
        this.$message.success("修改成功");
      });
    },
    clear() {
      this.data = [];
      const video = document.getElementById("videoElement");
      video.currentTime = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.active {
  border: 1px solid #02a7f0 !important;
}
.chapter {
  padding: 0 20px;
  .wrap {
    position: relative;
    width: 520px;
    height: 292px;
    video {
      position: absolute;
      height: 100%;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 0;
    }
    .scaleBox {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .showBox {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    .btnList {
      width: 340px !important;
    }
  }
  .wrapbox {
    height: 450px;
    overflow-y: auto;
    padding-right: 10px;
    .itemBox {
      padding: 3px;
      border: 1px solid #dfdfdf;
      border-radius: 3px;
      .listWrap {
        display: flex;
        height: 30px;
        justify-content: flex-start;
        align-items: center;
        .title {
          display: inline-block;
          width: 80px;
          text-align: right;
        }
        .icon {
          display: inline-block;
          width: 80px;
          width: 24px;
          height: 24px;
          outline: 1px solid #d4d4d4;
          background: #ebebeb;
        }
      }
    }
  }
  .parentDelStyle {
    position: relative;
    display: flex;
    align-items: center;
    .delStyle {
      position: absolute;
      top: -7px;
      right: -4px;
      cursor: pointer;
      color: rgb(252, 75, 75);
      // font-size: 12px;
    }
  }
}
</style>
