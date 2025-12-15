<template>
  <div class="waterMark">
    <div class="leftBox">
      <!-- <div class="imgBox">
        <div
          class="imgItem"
          v-for="(imgItem, index) in waterMarkImgList"
          :key="index"
        >
          <img
            :class="imgItem.id === waterMarkItem.id ? 'activeImg' : ''"
            @click="choiceImgItem(imgItem)"
            :src="imgItem.watermarkDownloadUrl"
            class="imgLoad"
          />
        </div>
      </div> -->
      <div class="wrap">
        <video ref="video" id="video"></video>
        <div
          class="scaleBox"
          ref="scaleBox"
          id="scaleBox"
          :style="{
            width: videoClient.clientWidth + 'px',
            height: videoClient.clientHeight + 'px',
          }"
        >
          <move
            v-for="(item, i) in data"
            :key="i"
            :videoClient="videoClient"
            @onChange="handleChangePoz"
            :item="item"
            @activeClick="activeClick"
          />
        </div>
      </div>
      <progressVideo :videoClient="videoClient" ref="progressVideo" />
      <div class="btnBox">
        <el-button type="primary" @click="sureBtn" :disabled="!this.data.length"
          >提交</el-button
        >
        <el-button @click="cancelBtn">无需处理水印</el-button>
      </div>
    </div>
    <div class="rightBox">
      <!-- <div class="rightBar">
        <div class="header">
          <div class="title">创建选区</div>
          <div class="headerClear" @click="clear('addWaterMark')">
            <i class="el-icon-delete"></i> 清空列表
          </div>
        </div>
        <div @click="createPart('addWaterMark')" class="createPartBox">
          <i class="el-icon-plus"> </i>添加水印选区
        </div>
        <div class="title">已创建选区</div>
        <div class="partList">
          <div
            v-for="(item, i) in data.filter(
              (v) => v.waterMarkType === 'addWaterMark'
            )"
            :key="i"
            class="itemBox"
            :class="item.isActive ? 'isActiveBorder' : ''"
            @click="activeMove(item, i)"
          >
            <div class="titleBox">
              <div class="itemName">{{ item.name }}{{ i + 1 }}</div>
              <div @click="deletePart(item)" class="itemDel">
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="timeBox">
              <input
                type="text"
                :value="Number(item.startTime).toFixed(2)"
                @change="(e) => changeStartTime(e, item)"
              />
              <span> - </span>
              <input
                type="text"
                :value="Number(item.endTime).toFixed(2)"
                @change="(e) => changeEndTime(e, item)"
              />
            </div>
          </div>
        </div>
      </div> -->
      <div class="rightBar">
        <div class="header">
          <div class="title">创建选区</div>
          <div class="headerClear" @click="clear('delWaterMark')">
            <i class="el-icon-delete"></i> 清空列表
          </div>
        </div>
        <div @click="createPart('delWaterMark')" class="createPartBox">
          <i class="el-icon-plus"> </i>去除水印选区
        </div>
        <div class="title">已创建选区</div>
        <div class="partList">
          <div
            v-for="(item, i) in data.filter(
              (v) => v.waterMarkType === 'delWaterMark'
            )"
            :key="i"
            class="itemBox"
            :class="item.isActive ? 'isActiveBorder' : ''"
            @click="activeMove(item, i)"
          >
            <div class="titleBox">
              <div class="itemName">{{ item.name }}{{ i + 1 }}</div>
              <div @click="deletePart(item)" class="itemDel">
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="timeBox">
              <input
                type="text"
                :value="Number(item.startTime).toFixed(2)"
                @change="(e) => changeStartTime(e, item)"
              />
              <span> - </span>
              <input
                type="text"
                :value="Number(item.endTime).toFixed(2)"
                @change="(e) => changeEndTime(e, item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import move from "./comp/move.vue";
import progressVideo from "./comp/progressVideo.vue";
import sidVideoPlayer from "@/components/video-player";
import { dowlodSensitiv } from "@/api/sensitiv/sensitiv";
import { watermarkCurrent } from "@/api/video-manage/index";
import { ENUM_WMT } from "@/util/util";

export default {
  components: {
    move,
    progressVideo,
    sidVideoPlayer,
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
      cutStyle: { display: "block" },
      data: [],
      origin: "",
      waterMarkItem: {},
      waterMarkImgList: [],
      item: {},
      videoClient: {
        clientWidth: 0,
        clientHeight: 0,
        duration: 0,
        currentTime: 0,
        videoWidth: 0, // 视频原始大小
        videoHeight: 0, // 视频原始大小
        callback: (data) => {
          this.data.forEach((v) => {
            if (v.isActive) {
              v.opacity = data.opacity;
              v.startTime = data.startTime;
              v.endTime = data.endTime;
            }
          });
          const { isPlaying } = data;
          const video = this.$refs.video;
          video.currentTime = data.currentTime;
          if (isPlaying) {
            video.play();
          } else {
            video.pause();
          }
        },
      },
    };
  },
  mounted() {
    dowlodSensitiv().then((res) => {
      const { data } = res;
      this.origin = data.data;
      this.loadVideo();
      // watermarkCurrent().then((response) => {
      //   this.waterMarkImgList = response.data.data;
      // });
    });
  },

  methods: {
    loadVideo() {
      const video = this.$refs.video;
      video.src = `${this.origin}/${this.row.uploadVideoUrl}`;
      video.addEventListener("loadeddata", () => {
        this.videoClient.clientWidth = video.clientWidth;
        this.videoClient.clientHeight = video.clientHeight;
        this.videoClient.videoWidth = video.videoWidth;
        this.videoClient.videoHeight = video.videoHeight;
        this.videoClient.duration = video.duration;
        this.videoClient.currentTime = video.currentTime;
        this.showBack();
      });
      video.addEventListener("timeupdate", () => {
        this.videoClient.currentTime = video.currentTime;
      });
    },
    showBack() {
      if (this.row.waterMarkType === ENUM_WMT.addWaterMark) {
        this.data = [...this.row.on];
        this.data.forEach((v) => {
          if (v.isActive) {
            this.$refs.progressVideo.changeTime(v);
          }
        });
      } else {
        this.data = [...this.row.off];
        this.data.forEach((v) => {
          if (v.isActive) {
            this.$refs.progressVideo.changeTime(v);
          }
        });
      }
    },
    handleChangePoz(data) {
      const { left, top, width, height } = data;
      const {
        videoClient: { clientWidth, videoWidth, clientHeight, videoHeight },
      } = this;
      const hozRate = videoWidth / clientWidth;
      const verRate = videoHeight / clientHeight;
      const realityLeft = hozRate * left;
      const realityTop = verRate * top;
      const realityWidth = hozRate * width;
      const realityHeight = verRate * height;
      this.data.forEach((v) => {
        if (v.isActive) {
          v.realityLeft = realityLeft;
          v.realityTop = realityTop;
          v.realityWidth = realityWidth;
          v.realityHeight = realityHeight;
          v.left = left;
          v.top = top;
          v.width = width;
          v.height = height;
        }
      });
    },
    handleChange(data) {
      this.data = data;
    },
    activeClick(item) {
      this.data.forEach((v) => {
        if (item === v) {
          this.$refs.progressVideo.changeTime(v);
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
    },
    sureBtn() {
      if (!this.data.length) {
        return this.$message.warning("请添加水印");
      }
      this.row.callback(this.data, "sureBtn");
    },
    cancelBtn() {
      this.$confirm("确认水印无误是否提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.row.callback(this.data);
      });
    },
    changeStartTime(e, item) {
      item.startTime = e.target.value;
      this.$refs.progressVideo.changeTime(item);
    },
    changeEndTime(e, item) {
      item.endTime = e.target.value;
      this.$refs.progressVideo.changeTime(item);
    },
    choiceImgItem(item) {
      const addArr =
        this.data.filter((v) => v.waterMarkType === ENUM_WMT.addWaterMark) ||
        [];
      if (this.data.length && addArr.length) {
        this.$confirm("切换水印图将清空添加水印的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.waterMarkItem = item;
          this.data = this.data.filter(
            (v) => v.waterMarkType === ENUM_WMT.delWaterMark
          );
        });
      } else {
        this.waterMarkItem = item;
      }
    },
    createPart(type) {
      if (!this.waterMarkItem.id && type === ENUM_WMT.addWaterMark) {
        return this.$message.warning("请先选择水印图标");
      }
      const arr = this.data.filter((v) => v.waterMarkType === type);
      if (arr.length > 2) {
        return this.$message.warning("最多创建3个选区");
      }
      const len = this.data.length;
      const imgLoad = document.getElementsByClassName("imgLoad");
      const activeDom =
        Array.from(imgLoad).find((v) => v.className.includes("activeImg")) ||
        imgLoad[0];
      const { naturalWidth, naturalHeight } = activeDom || {
        naturalWidth: 80,
        naturalHeight: 40,
      };
      console.log(naturalWidth);
      const initWidth = 80;
      const rate = naturalWidth / naturalHeight;
      const width = initWidth;
      const height = initWidth / rate;
      this.data.forEach((v) => (v.isActive = false));
      const scaleBox = document.getElementById("scaleBox");
      const { height: h, width: w } = scaleBox.getBoundingClientRect();
      const sumVer = Math.floor(h / height);

      const perHoz = Math.floor(w / width);

      const indexHoz = len % perHoz;
      const indexVer = Math.floor(len / perHoz);

      const left = width * indexHoz;
      const top = height * indexVer;

      if (indexVer > sumVer - 1) {
        return this.$message.warning(`最多只能创建${len}个选区!`);
      }

      const item = {
        name: "选区",
        startTime: 0,
        endTime: this.videoClient.duration,
        id: this.data.length,
        isActive: true,
        width,
        height,
        left,
        top,
        opacity: 100,
        rate: rate,
        origin: this.origin,
        src: this.waterMarkItem.watermarkDownloadUrl,
        waterMarkType: type,
        videoWidth: this.videoClient.videoWidth,
        videoHeight: this.videoClient.videoHeight,
        clientWidth: this.videoClient.clientWidth,
        clientHeight: this.videoClient.clientHeight,
      };
      this.data.push(item);
    },
    deletePart(item) {
      this.data = this.data.filter((v) => v !== item);
    },
    activeMove(item, i) {
      this.data.forEach((v) => (v.isActive = false));
      item.isActive = true;
      this.$refs.progressVideo.changeTime(item);
    },
    clear(type) {
      this.data = this.data.filter((v) => v.waterMarkType !== type);
    },
  },
};
</script>
<style lang="scss" scoped>
.waterMark {
  display: flex;
  height: 600px;
  margin-top: -30px;

  .leftBox {
    position: relative;
    width: calc(100% - 300px);
    margin-left: 15px;
    .imgBox {
      cursor: pointer;
      display: flex;
      justify-content: center;
      .imgItem {
        margin-bottom: 10px;
        margin-right: 30px;
        width: 60px;
        height: 60px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        .activeImg {
          border: 1px solid #409eff;
        }
        .imgLoad {
          max-width: 60px;
          max-height: 60px;
        }
      }
    }

    .wrap {
      position: relative;
      width: 592px;
      height: 333px;
      video {
        position: absolute;
        max-width: 592px;
        max-height: 333px;
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
    .btnBox {
      margin-top: 20px;
    }
  }

  .rightBox {
    position: relative;
    width: 300px;
    border-left: 1px solid #e7e7e7;
    .rightBar {
      height: 290px;
      position: relative;
      padding: 0 20px;
      overflow: hidden;

      title {
        color: #333;
        font-weight: bold;
      }

      .header {
        display: flex;
        justify-content: space-between;

        .headerClear {
          color: #409eff;
          cursor: pointer;
        }
      }

      .createPartBox {
        height: 40px;
        border: 1px solid #409eff;
        border-radius: 2px;
        text-align: center;
        line-height: 40px;
        color: #409eff;
        margin: 10px 0;
        cursor: pointer;
      }

      .partList {
        position: relative;
        overflow-y: scroll;
        height: 340px;
        margin-top: 10px;

        .isActiveBorder {
          border: 1px solid #409eff !important;
        }

        .isActiveColor {
          color: #409eff !important;
        }

        .itemBox {
          border: 1px solid #e0dede;
          padding: 5px 10px;
          border-radius: 4px;
          margin-right: 5px;
          margin-bottom: 10px;

          .itemName {
            font-size: 12px;
          }

          .itemDel {
            font-size: 14px;
            padding-right: 3px;
            cursor: pointer !important;
          }

          .titleBox {
            display: flex;
            justify-content: space-between;
          }

          .timeBox {
            margin-top: 3px;

            input {
              width: 104px;
              border: 1px solid #e0dede;
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
