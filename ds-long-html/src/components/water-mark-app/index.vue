<template>
  <div class="waterMark">
    <div class="leftBox">
      <div class="mt10">横向视频</div>
      <div class="wrap">
        <div
          class="scaleBox"
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
            domName="scaleBox"
            :item="item"
          />
        </div>
      </div>
      <div class="progressWrap">
        <div class="opacityBox">
          <div class="opacity">水印深度</div>
          <div class="progress">
            <el-slider
              @input="input"
              v-model="opacity"
              show-input
              :min="0"
              :max="100"
              :format-tooltip="formatTooltip"
            >
            </el-slider>
          </div>
        </div>
      </div>
    </div>
    <div class="rightBox">
      <div class="mt10">竖向视频</div>
      <div class="wrap">
        <div class="vermark"></div>
        <div
          class="scaleBox"
          id="scaleBoxVer"
          :style="{
            width: videoClientVer.clientWidth + 'px',
            height: videoClientVer.clientHeight + 'px',
          }"
        >
          <move
            v-for="(item, i) in dataVer"
            :key="i"
            :videoClient="videoClientVer"
            domName="scaleBoxVer"
            :item="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import move from "./comp/move.vue";
import sidVideoPlayer from "@/components/video-player";

const clientWidth = 592;
const clientHeight = 333;
export default {
  components: {
    move,
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
      scaleBoxPos: { x: 0, y: 0 },
      scaleBoxPosVer: { x: 0, y: 0 },
      opacity: 100,
      data: [],
      dataVer: [],
      videoClient: {
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        callbackPos: (data) => {
          const { left, top, width, height } = data;
          const {
            videoClient: { clientWidth, clientHeight },
          } = this;
          this.data.forEach((v) => {
            if (v.isActive) {
              v.left = left;
              v.top = top;
              v.width = width;
              v.height = height;
              clientWidth, clientHeight;
            }
          });
          this.row.callback({
            transverseInfo: this.data[0],
            directionInfo: this.dataVer[0],
          });
        },
      },
      videoClientVer: {
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        callback: (data) => {
          this.data.forEach((v) => {
            if (v.isActive) {
              v.opacity = data.opacity;
            }
          });
        },
        callbackPos: (data) => {
          const { left, top, width, height } = data;
          const {
            videoClient: { clientWidth, clientHeight },
          } = this;
          this.dataVer.forEach((v) => {
            if (v.isActive) {
              v.left = left;
              v.top = top;
              v.width = width;
              v.height = height;
              clientWidth, clientHeight;
            }
          });
          this.row.callback({
            transverseInfo: this.data[0],
            directionInfo: this.dataVer[0],
          });
        },
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.opacity = Number(this.row.transparency || 100);
      setTimeout(() => {
        const imgLoad = document.getElementsByClassName(
          "el-upload-list__item-thumbnail"
        );
        const { naturalWidth, naturalHeight } = imgLoad[0];
        const rate = naturalWidth / naturalHeight;

        this.data.push({
          isActive: true,
          width: Number(this.row.transverseInfo.width || 0),
          height: Number(this.row.transverseInfo.height || 0),
          left: Number(this.row.transverseInfo.left || 0),
          top: Number(this.row.transverseInfo.top || 0),
          opacity: Number(this.row.transparency || 100),
          rate: rate,
          src: this.row.imagePath,
          clientWidth: clientWidth,
          clientHeight: clientHeight,
        });
        console.log(this.row);
        this.dataVer.push({
          isActive: true,
          width: Number(this.row.directionInfo.width || 0),
          height: Number(this.row.directionInfo.height || 0),
          left: Number(this.row.directionInfo.left || 0),
          top: Number(this.row.directionInfo.top || 0),
          opacity: Number(this.row.transparency || 100),
          rate: rate,
          src: this.row.imagePath,
          clientWidth: clientWidth,
          clientHeight: clientHeight,
        });
      }, 500);
    } else {
      setTimeout(() => {
        this.createPart();
      }, 500);
    }
  },

  methods: {
    formatTooltip(val) {
      return parseInt(val);
    },
    input() {
      this.data.forEach((v) => {
        if (v.isActive) {
          v.opacity = this.opacity;
        }
      });
      this.dataVer.forEach((v) => {
        if (v.isActive) {
          v.opacity = this.opacity;
        }
      });
      this.row.callback({
        transverseInfo: this.data[0],
        directionInfo: this.dataVer[0],
      });
    },
    createPart() {
      const imgLoad = document.getElementsByClassName(
        "el-upload-list__item-thumbnail"
      );
      const { naturalWidth, naturalHeight } = imgLoad[0];
      const initWidth = 80;
      const rate = naturalWidth / naturalHeight;
      const width = initWidth;
      const height = initWidth / rate;

      const item = {
        isActive: true,
        width,
        height,
        left: 0,
        top: 0,
        opacity: 100,
        rate: rate,
        src: this.row.imagePath,
        clientWidth: clientWidth,
        clientHeight: clientHeight,
      };
      this.data.push({ ...item });
      this.dataVer.push({ ...item });
    },
  },
};
</script>
<style lang="scss" scoped>
.waterMark {
  display: flex;
  height: 440px;
  margin-top: -30px;
  justify-content: flex-start;

  .leftBox {
    position: relative;
    margin-right: 15px;

    .wrap {
      position: relative;
      width: 592px;
      height: 333px;
      .scaleBox {
        position: absolute;
        left: 50%;
        top: 50%;
        background: #333;
        transform: translateX(-50%) translateY(-50%);
      }
    }
    .progressWrap {
      position: relative;
      width: 592px;
      .opacityBox {
        margin-top: 20px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f8f8f8;
        border-radius: 3px;
        padding: 0 10px;
        .opacity {
          width: 150px;
        }
        .progress {
          width: 500px;
          height: 100%;
          padding-top: 6px;
        }
      }
    }
    .btnBox {
      margin-top: 20px;
    }
  }

  .rightBox {
    position: relative;
    width: 600px;
    border-left: 1px solid #e7e7e7;
    padding-left: 20px;
    .wrap {
      position: relative;
      width: 592px;
      height: 333px;
      background: #333;
      .vermark {
        width: 188px;
        height: 333px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 0;
        background: #e7e7e7;
      }
      .scaleBox {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
  }
}
</style>
