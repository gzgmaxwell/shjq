<template>
  <div class="chapter">
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
    <progressVideo
      :videoClient="videoClient"
      ref="progressVideo"
      id="progressVideo"
      :data="data"
    />
    <div class="showBox">
      <div class="btnList">
        <el-button @click="createPart" :disabled="disabledPart || isCapturing"
          >创建片段</el-button
        >
        <el-button @click="clear" :disabled="!data.length">清空</el-button>
        <el-button @click="deletePart" :disabled="!data.length"
          >删除片段</el-button
        >
        <el-button @click="handleCapture" :disabled="!data.length"
          >截取封面</el-button
        >
        <!-- <div class="mt20" v-if="row.partList.length">
          <span>章节状态</span>
          <el-switch
            class="ml20"
            v-model="status"
            @change="changeStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ONLINE"
            inactive-value="OFFLINE"
          >
          </el-switch>
        </div> -->
      </div>
      <div class="imgBox">
        <img
          v-if="activeItem.url"
          class="mr20"
          :src="activeItem.url"
          width="100"
          height="100"
        />
        <div class="content">
          <div v-if="activeItem.width">
            开始(s) - 结束(s)：{{ Number(activeItem.startTime).toFixed(0) }} -
            {{ Number(activeItem.endTime).toFixed(0) }}
          </div>
          <div v-if="activeItem.width" class="mt10">
            <span>片段名称：</span>
            <el-input
              maxLength="12"
              type="text"
              v-model="name"
              @input="input"
              :style="{ width: '190px' }"
            />
          </div>
        </div>
      </div>
      <upload
        bucketType="PRE_VIDEO"
        style="visibility: hidden; position: absolute"
        ref="uploadRef"
        :W2HRate="0"
        :maxFileSize="20"
        :limit="1"
        title="封面图片"
        :fileList="[]"
      />
      <canvas id="mycanvas" style="display: none"></canvas>
    </div>

    <div class="mt20">
      <el-button type="primary" @click="sureBtn">确认</el-button>
      <el-button @click="row.callback()">取消</el-button>
    </div>
  </div>
</template>
<script>
import progressVideo from "./progressVideo.vue";
import { dowlodSensitiv } from "@/api/sensitiv/sensitiv";
import videoPlayer from "@/components/video-player/index.vue";
import upload from "@/components/upload/index.vue";
import { chapterOnOff } from "@/api/content/management";
import { misSecond } from "@/util/util";

const minVideoTime = 5;
export default {
  components: {
    progressVideo,
    videoPlayer,
    upload,
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
      origin: "",
      disabledPart: false,
      isCapturing: false,
      name: "",
      status: "OFFLINE",
      activeItem: {},
      videoClient: {
        duration: 0,
        currentTime: 0,
        callbackMove: ({ changeX, moveType }) => {
          const video = document.getElementById("videoElement");
          const timeProgress = document.getElementById("timeProgress");
          const sumLen = timeProgress.clientWidth;
          const duration = video.duration;
          const len = this.data.length;
          this.data.forEach((v, i) => {
            if (v.isActive) {
              const { startTime, endTime, left, width } = v;

              if (moveType === "moveLeft") {
                let newLeft = left + changeX;
                let newWidth = width - changeX;

                if (newLeft < 0) return;
                if (newLeft + newWidth > sumLen) {
                  newLeft = sumLen - newWidth;
                }

                let newStartTime = (newLeft * duration) / sumLen;
                if (endTime - newStartTime < minVideoTime) {
                  return;
                }

                if (i > 0) {
                  const preItem = this.data[i - 1];
                  if (newLeft < preItem.left + preItem.width) return;
                }

                v.left = newLeft;
                v.width = newWidth;
                v.startTime = newStartTime;
              }
              if (moveType === "moveRight") {
                let newWidth = width + changeX;
                if (newWidth + left > sumLen + 0.5) return;
                const newEndTime = ((left + newWidth) * duration) / sumLen;

                if (newEndTime - startTime < minVideoTime) {
                  return;
                }

                if (i < len - 1) {
                  const nextItem = this.data[i + 1];
                  if (newWidth + left > nextItem.left) return;
                }
                v.width = newWidth;
                v.endTime = newEndTime;
              }
            }
          });
        },
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.loadVideo();
    });
    dowlodSensitiv().then((res) => {
      const { data } = res;
      this.origin = data.data;
    });
  },

  methods: {
    loadVideo() {
      this.disabledPart = true;
      const video = document.getElementById("videoElement");
      video.addEventListener("loadeddata", () => {
        this.videoClient.duration = video.duration;
        this.videoClient.currentTime = video.currentTime;
        this.disabledPart = false;
        if (this.row.partList.length) {
          this.disabledPart = true;
          this.getPartList();
        }
      });
      video.addEventListener("timeupdate", () => {
        this.videoClient.currentTime = video.currentTime;
        const duration = video.duration;
        const currentTime = video.currentTime;
        if (duration - currentTime < minVideoTime) {
          this.disabledPart = true;
          video.currentTime + 0.8;
          return;
        }
        const isInPart = this.data.some((v) => {
          if (v.startTime < currentTime && v.endTime > currentTime) {
            if (v.endTime - 0.4 > currentTime) {
              return true;
            }
            return false;
          }
          return false;
        });
        if (isInPart) {
          this.disabledPart = true;
          return;
        } else {
          const sortDataArr = this.data.sort((a, b) => {
            return a.startTime - b.startTime;
          });
          if (sortDataArr.length) {
            if (
              currentTime < minVideoTime &&
              sortDataArr[0].startTime < minVideoTime
            ) {
              this.disabledPart = true;
              return;
            }
          }

          const overCurTimeArr = this.data.filter(
            (v) => v.startTime >= currentTime
          );

          const sortArr = overCurTimeArr.sort((a, b) => {
            return a.startTime - b.startTime;
          });
          if (sortArr.length) {
            const disTime = sortArr[0].startTime - currentTime;
            if (minVideoTime - disTime > 0.2) {
              this.disabledPart = true;
              return;
            } else {
              this.disabledPart = false;
              return;
            }
          }
          this.disabledPart = false;
          return;
        }
      });
    },

    getPartList() {
      this.status = this.row.status;
      const video = document.getElementById("videoElement");
      const timeProgress = document.getElementById("timeProgress");
      const sumLen = timeProgress.clientWidth;
      const duration = video.duration;
      this.row.partList.forEach((v, i) => {
        const rate = 1000;
        const left = ((v.chapterStartTime / rate) * sumLen) / duration;
        const width =
          ((v.chapterEndTime / rate - v.chapterStartTime / rate) * sumLen) /
          duration;
        const item = {
          name: v.chapterTitle,
          startTime: v.chapterStartTime / rate,
          endTime: v.chapterEndTime / rate,
          left: left,
          width: width,
          isActive: i === 0,
          bucketName: v.imgBucketName,
          key: v.imgFileName,
          url: v.imgFileUrl,
          callback: (item) => {
            this.data.forEach((v) => (v.isActive = false));
            item.isActive = true;
            video.currentTime = item.startTime;
            this.activeItem = item;
            this.name = item.name;
          },
        };
        this.data.push(item);
        this.activeItem = this.data.find((v) => v.isActive) || {};
        this.name = this.activeItem.name;
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

    sureBtn() {
      if (!this.data.length) {
        return this.row.callback(this.data);
      }
      let isContinuous = true;
      const len = this.data.length;
      const video = document.getElementById("videoElement");
      if (this.data.length) {
        if (this.data[0].startTime > misSecond(video.duration)) {
          return this.$message.warning("第一个片段未补开始时间");
        }
      }
      const noFinish =
        video.duration - this.data[len - 1].endTime > misSecond(video.duration);
      for (let i = 0; i < this.data.length; i++) {
        if (i > 0 && i < this.data.length) {
          const isGap =
            this.data[i].startTime - this.data[i - 1].endTime >
            misSecond(video.duration);
          if (isGap) {
            this.$message.warning(`片段${i}和${i + 1}时间不连续`);
            isContinuous = false;
            break;
          }
        }
      }
      if (!isContinuous) return;
      if (noFinish) {
        return this.$message.warning("最后一个片段未补全总时间");
      }
      this.row.callback(this.data);
    },
    createPart() {
      this.isCapturing = true;
      const len = this.data.length;
      const video = document.getElementById("videoElement");
      const timeProgress = document.getElementById("timeProgress");
      const sumLen = timeProgress.clientWidth;
      const duration = video.duration;
      const currentTime = video.currentTime;
      const perPartTime = Math.floor(duration / 10);
      let intervalTime = perPartTime;
      if (perPartTime < minVideoTime) {
        intervalTime = minVideoTime;
      }
      let endTime = 0;
      endTime = currentTime + intervalTime;
      if (len === 9) {
        const overCurTimeArr = this.data.filter(
          (v) => v.startTime > currentTime
        );
        if (overCurTimeArr.length) {
          endTime = overCurTimeArr[0].startTime;
        } else {
          endTime = duration;
        }
      }
      if (endTime > duration) {
        return this.$message.warning("片段超出总时间，不能在创建");
      }
      if (duration - endTime < minVideoTime) {
        endTime += duration - endTime;
      }
      const left = (currentTime * sumLen) / duration;
      const width = ((endTime - currentTime) * sumLen) / duration;
      video.currentTime = endTime;
      this.videoClient.currentTime = endTime;
      this.data.forEach((v) => (v.isActive = false));

      const item = {
        name: "片段",
        startTime: currentTime,
        endTime: endTime,
        left: left,
        width: width,
        isActive: true,
        bucketName: "",
        key: "",
        url: "",
        callback: (item) => {
          this.data.forEach((v) => (v.isActive = false));
          item.isActive = true;
          video.currentTime = item.startTime;
          this.activeItem = item;
          this.name = item.name;
        },
      };
      const arr = [...this.data, item];
      this.data = arr.sort((a, b) => {
        return a.startTime - b.startTime;
      });
      video.currentTime = endTime;
      this.handleCapture();
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
        this.videoClient.currentTime = lastItem.endTime;
        video.currentTime = lastItem.endTime;
      } else {
        this.videoClient.currentTime = 0;
        video.currentTime = 0;
        this.disabledPart = false;
      }
    },
    handleCapture() {
      const uploadRef = this.$refs.uploadRef;
      const videoRef = document.getElementById("videoElement");
      const canvas = document.getElementById("mycanvas");
      const ctx = canvas.getContext("2d");

      videoRef.crossOrigin = "anonymous";
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;

      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "andy.png", { type: "image/jpeg" });
        uploadRef.awsUpload(file, (data) => {
          this.$message.success("抓拍成功");
          this.data.forEach((v) => {
            if (v.isActive) {
              v.bucketName = data.bucketName;
              v.key = data.key;
              v.url = data.url;
              this.isCapturing = false;
              this.handleActiveItem();
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
    handleActiveItem() {
      this.data.forEach((v) => {
        if (v.isActive) {
          this.activeItem = v;
        }
      });
    },
    clear() {
      this.data = [];
      this.disabledPart = false;
      this.activeItem = {};
      this.videoClient.currentTime = 0;
      const video = document.getElementById("videoElement");
      video.currentTime = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.chapter {
  padding: 0 40px;
  .wrap {
    position: relative;
    width: 840px;
    height: 472px;
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

    .imgBox {
      margin-left: 10px;
      display: flex;
      justify-content: flex-start;
      width: calc(100% - 330px);
    }
  }
}
</style>
