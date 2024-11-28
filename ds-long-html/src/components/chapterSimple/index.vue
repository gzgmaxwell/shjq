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
          <div class="pointBox">
            <div class="lineBox">
              <div class="line"></div>
              <div
                class="gap"
                :class="{ active: item.isActive }"
                @click="clickActive(item)"
                v-for="(item, i) in data"
                :key="i"
                :style="{
                  left: (item.startTime * 489) / duration + 'px',
                  zIndex: item.isActive ? 1 : 0,
                }"
              >
                <img
                  v-if="item.iconFileUrl"
                  :src="item.iconFileUrl"
                  :class="{ active: item.isActive }"
                  width="40"
                  height="40"
                  class="gapImg"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="showBox">
          <div class="btnList">
            <el-button
              @click="createPartPoint"
              :disabled="isPlaying || isCapturing || isDisabled"
              >创建节点</el-button
            >
            <el-button @click="deletePart" :disabled="!data.length"
              >删除节点</el-button
            >
            <!-- <el-button @click="handleCapture(false)" :disabled="!data.length"
              >截取封面</el-button
            > -->
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
        <div class="headBox">
          <div>已添加节点</div>
          <div class="clear" @click="clear" v-if="data.length">清空节点</div>
        </div>
        <div class="clearBox mt10">
          <div class="width60">时间</div>
          <div class="width180">名称</div>
          <div class="">ICON</div>
        </div>
        <div class="wrapbox">
          <div
            class="itemBox"
            v-for="(item, i) in data"
            :class="{ active: item.isActive }"
            :key="i"
            @click="clickActive(item)"
          >
            <div class="itemTitle width60">
              {{ compuTime(item.startTime) }}
            </div>
            <div class="itemTitle width180">{{ item.name }}</div>
            <div class="itemTitle">
              <div class="icon" @click="clickIcon(item)">
                <img
                  v-if="item.iconFileUrl"
                  :src="item.iconFileUrl"
                  width="40"
                  height="40"
                />
                <i class="el-icon-edit delStyle" v-if="item.iconFileUrl"></i>
              </div>
            </div>
          </div>
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
      width="960px"
      :modal="false"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <timeIcon
        style="height: 600px; margin-top: -20px"
        :height="500"
        v-if="visible"
        :paramsRow="params"
        isPageFrom=""
      />
    </el-dialog>
  </div>
</template>
<script>
import videoPlayer from "@/components/video-player/index.vue";
import upload from "@/components/upload/index.vue";
import { chapterOnOff } from "@/api/content/management";
import timeIcon from "@/views/content/timelineIcon/timeIcon";
import { videoToBlob, deepCloneNormal } from "@/util/util";
import moment from "moment";

const minIntevalTime = 0.1;
export default {
  components: {
    videoPlayer,
    upload,
    timeIcon,
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
      initData: [],
      isCapturing: true,
      status: "OFFLINE",
      visible: false,
      params: {},
      isPlaying: false,
      isDisabled: false,
      initCapture: {},
      duration: 0,
    };
  },
  computed: {
    compuTime() {
      return (time) => {
        let currentTime = moment.duration(time, "seconds");
        // return moment({
        //   h: currentTime.hours(),
        //   m: currentTime.minutes(),
        //   s: currentTime.seconds(),
        // }).format("HH:mm:ss");
        return `${currentTime.hours()}时${currentTime.minutes()}分${currentTime.seconds()}秒`;
      };
    },
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
        this.duration = video.duration;
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
          iconId: v.iconId,
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
          item.iconBucketName = data.iconBucket;
          item.iconFileName = data.iconImg;
          item.iconFileUrl = data.iconUrl;
          item.name = data.iconName;
        },
      };
    },
    clickActive(item) {
      this.data.forEach((v) => (v.isActive = false));
      item.isActive = true;
      const video = document.getElementById("videoElement");
      video.currentTime = item.startTime;
    },
    sureBtn() {
      this.row.callback(this.data);
    },
    createPartPoint() {
      this.visible = true;
      this.params = {
        callback: (data) => {
          this.visible = false;
          this.createPart(data);
        },
      };
    },
    createPart(iconInfo) {
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
              startTime: 0,
              endTime: duration,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              name: iconInfo.iconName,
              iconBucketName: iconInfo.iconBucket,
              iconFileName: iconInfo.iconImg,
              iconFileUrl: iconInfo.iconUrl,
              iconId: iconInfo.id,
            });
          } else {
            arr.push({
              startTime: 0,
              endTime: currentTime,
              isActive: false,
              bucketName: this.initCapture.bucketName,
              key: this.initCapture.key,
              url: this.initCapture.url,
              name: "节点",
              iconBucketName: "",
              iconFileName: "",
              iconFileUrl: "",
              iconId: "",
            });
            arr.push({
              startTime: currentTime,
              endTime: duration,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              name: iconInfo.iconName,
              iconBucketName: iconInfo.iconBucket,
              iconFileName: iconInfo.iconImg,
              iconFileUrl: iconInfo.iconUrl,
              iconId: iconInfo.id,
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
              startTime: item.startTime,
              endTime: currentTime,
              isActive: false,
              bucketName: item.bucketName,
              key: item.key,
              url: item.url,
              name: item.name || "节点",
              iconBucketName: item.iconBucketName,
              iconFileName: item.iconFileName,
              iconFileUrl: item.iconFileUrl,
              iconId: item.iconId,
            });
            arr.push({
              startTime: currentTime,
              endTime: item.endTime,
              isActive: true,
              bucketName: "",
              key: "",
              url: "",
              name: iconInfo.iconName,
              iconBucketName: iconInfo.iconBucket,
              iconFileName: iconInfo.iconImg,
              iconFileUrl: iconInfo.iconUrl,
              iconId: iconInfo.iconId,
            });
          } else {
            const firstItem = this.data[0];
            const lastItem = this.data[this.data.length - 1];
            const isMoreArr = this.data.filter((v) => currentTime > v.endTime);
            if (currentTime < firstItem.startTime) {
              this.data.forEach((v) => (v.isActive = false));
              arr.push({
                startTime: 0,
                endTime: firstItem.startTime,
                isActive: true,
                bucketName: "",
                key: "",
                url: "",
                name: iconInfo.iconName,
                iconBucketName: iconInfo.iconBucket,
                iconFileName: iconInfo.iconImg,
                iconFileUrl: iconInfo.iconUrl,
                iconId: iconInfo.id,
              });
            } else if (currentTime > lastItem.endTime) {
              this.data.forEach((v) => (v.isActive = false));
              arr.push({
                startTime: lastItem.endTime,
                endTime: duration,
                isActive: true,
                bucketName: "",
                key: "",
                url: "",
                name: iconInfo.iconName,
                iconBucketName: iconInfo.iconBucket,
                iconFileName: iconInfo.iconImg,
                iconFileUrl: iconInfo.iconUrl,
                iconId: iconInfo.id,
              });
            } else {
              if (isMoreArr && isMoreArr.length) {
                let index = isMoreArr.length - 1;
                this.data.forEach((v) => (v.isActive = false));
                arr.push({
                  startTime: this.data[index].endTime,
                  endTime: this.data[index + 1].startTime,
                  isActive: true,
                  bucketName: "",
                  key: "",
                  url: "",
                  name: iconInfo.iconName,
                  iconBucketName: iconInfo.iconBucket,
                  iconFileName: iconInfo.iconImg,
                  iconFileUrl: iconInfo.iconUrl,
                  iconId: iconInfo.id,
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
      this.$confirm("确定要删除节点数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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
      });
    },
    handleCapture(isLoadeddata) {
      const uploadRef = this.$refs.uploadRef;
      const videoRef = document.getElementById("videoElement");
      videoToBlob(videoRef).then((blob) => {
        const file = new File([blob], "andy.webp", { type: "image/webp" });
        uploadRef.awsUpload(file, (data) => {
          if (isLoadeddata) {
            this.isCapturing = false;
            this.initData = deepCloneNormal(this.data);
            return (this.initCapture = data);
          }
          // this.$message.success("抓拍成功");
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
      this.$confirm("确定要清空节点数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.data = [];
        const video = document.getElementById("videoElement");
        video.currentTime = 0;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chapter {
  padding: 0 20px;
  .width60 {
    width: 100px;
  }
  .width180 {
    width: 160px;
  }
  .headBox {
    display: flex;
    justify-content: space-between;
    margin-right: 17px;
    .clear {
      color: red;
      cursor: pointer;
    }
  }
  .clearBox {
    display: flex;
    justify-content: flex-start;
    width: 314px;
    margin-left: 3px;
    .clear {
      color: red;
      cursor: pointer;
    }
  }
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
    .pointBox {
      position: absolute;
      width: 100%;
      height: 80px;
      background: #000;
      bottom: -80px;
      .lineBox {
        width: 489px;
        height: 4px;
        position: relative;
        margin: 0 auto;
        margin-top: 60px;
        .line {
          position: absolute;
          height: 4px;
          width: 100%;
          background: #fff;
          border-radius: 2px;
        }
        .gap {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 6px;
          border: 1px solid #d6d6d6;
          top: -3px;
          cursor: pointer;
          .gapImg {
            position: relative;
            top: -50px;
            left: -14px;
          }
        }
      }
    }
  }
  .showBox {
    display: flex;
    justify-content: flex-start;
    margin-top: 120px;
    .btnList {
      width: 340px !important;
    }
  }
  .wrapbox {
    height: 450px;
    overflow-y: auto;
    margin-top: 5px;
    padding-right: 10px;
    .itemBox {
      display: flex;
      justify-content: flex-start;
      height: 80px;
      margin-top: 5px;
      padding: 3px;
      border: 1px solid #dfdfdf;
      border-radius: 3px;
      .itemTitle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon {
          width: 40px;
          height: 40px;
          position: relative;
          border: 1px solid #dddcdc;
          .delStyle {
            position: absolute;
            top: -7px;
            right: -4px;
            cursor: pointer;
            background: #fff;
          }
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
    }
  }
}
</style>
