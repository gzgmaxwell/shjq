<template>
  <div class="videoPlayBox">
    <div class="timeProgress" ref="timeProgress" id="timeProgress">
      <div
        class="dragBox"
        @mousedown="startMove($event, 'time')"
        ref="move"
        :style="{
          left: state.left + 'px',
        }"
      >
        {{ compCurentTime(currentTime) }}
        <div></div>
      </div>

      <div class="partBox" @click="handleProgress">
        <div
          class="part"
          :class="item.isActive ? 'active' : ''"
          v-for="(item, i) in data"
          @click="(e) => handleClick(e, item)"
          :key="i"
          :style="{
            left: item.left + 'px',
            width: item.width + 'px',
          }"
        >
          <div class="partNumShow clamp1">{{ i + 1 }}</div>
          <div
            class="comMove leftMove"
            v-if="item.isActive"
            @mousedown="startMove($event, 'left')"
          >
            <div class="iconLeft">
              <span class="el-icon-arrow-left"></span>
            </div>
          </div>
          <div
            class="comMove rightMove"
            v-if="item.isActive"
            @mousedown="startMove($event, 'right')"
          >
            <div class="iconRight">
              <span class="el-icon-arrow-right"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
let upFunc = () => null;
export default {
  props: {
    videoClient: {
      type: Object,
      required: true,
      default: () => {
        return {
          duration: 0,
        };
      },
    },
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      currentTime: 0,
      state: {
        left: 0,
        width: 0,
        downClientX: 0,
        offsetLeft: 0,
      },
    };
  },

  computed: {
    compCurentTime() {
      return (time) => {
        let currentTime = moment.duration(time, "seconds");
        return moment({
          h: currentTime.hours(),
          m: currentTime.minutes(),
          s: currentTime.seconds(),
        }).format("HH:mm:ss");
      };
    },
  },
  methods: {
    handleClick(e, item) {
      e.stopPropagation()
      item.callback(item);
    },
    moveTime(e) {
      const timeProgress = this.$refs.timeProgress;
      const { clientWidth } = timeProgress;
      const {
        state: { left, downClientX, offsetLeft },
      } = this;
      const changeX = e.clientX - downClientX + (offsetLeft - left); // 往右为正
      let newLeft = left + changeX;
      if (newLeft < 0) newLeft = 0;

      if (newLeft > clientWidth) {
        newLeft = clientWidth;
      }

      this.currentTime = (newLeft / clientWidth) * this.videoClient.duration;
      this.state.left = newLeft;
      const video = document.getElementById("videoElement");
      video.currentTime = this.currentTime;
    },

    moveLeft(e) {
      const progressVideo = document.getElementById("progressVideo");
      const rect = progressVideo.getBoundingClientRect();
      const { left } = this.data.find((v) => v.isActive) || {};
      const changeX = e.clientX - rect.x - left; // 往右为正
      this.videoClient.callbackMove({ changeX, moveType: "moveLeft" });
    },
    moveRight(e) {
      const progressVideo = document.getElementById("progressVideo");
      const rect = progressVideo.getBoundingClientRect();
      const { left, width } = this.data.find((v) => v.isActive) || {};
      const changeX = e.clientX - rect.x - width - left; // 往右为正
      this.videoClient.callbackMove({ changeX, moveType: "moveRight" });
    },

    handleProgress(e) {
      const timeProgress = this.$refs.timeProgress;
      const { clientWidth } = timeProgress;
      let newLeft = e.offsetX;
      this.currentTime = (newLeft / clientWidth) * this.videoClient.duration;
      this.state.left = newLeft;
      const video = document.getElementById("videoElement");
      video.currentTime = this.currentTime;
    },

    startMove(e, type) {
      e.stopPropagation();
      e.preventDefault();
      this.state.downClientX = e.clientX;
      this.state.offsetLeft = this.$refs.move.offsetLeft;
      if (type === "time") {
        this.commonBind(this.moveTime);
      } else if (type === "left") {
        this.commonBind(this.moveLeft);
      } else if (type === "right") {
        this.commonBind(this.moveRight);
      }
    },
    commonBind(func) {
      upFunc = (event) => {
        this.cancelMove(event, func);
      };
      document.addEventListener("mousemove", func, { passive: true });
      document.addEventListener("mouseup", upFunc, { passive: true });
    },
    cancelMove(event, func) {
      document.removeEventListener("mousemove", func);
      document.removeEventListener("mousemove", upFunc);
    },
  },
  watch: {
    videoClient: {
      handler(val) {
        const timeProgress = this.$refs.timeProgress;
        const { clientWidth } = timeProgress;
        const newLeft = (val.currentTime / val.duration) * clientWidth;
        this.currentTime = val.currentTime;
        this.state.left = newLeft;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.videoPlayBox {
  height: 60px;
  width: 840px;
  background: #f8f8f8;
  position: relative;
  .videoPlay {
    width: 40px;
    position: absolute;
    left: -40px;
    .playBtn {
      font-size: 24px;
      cursor: pointer;
    }
  }
  .timeProgress {
    width: 100%;
    height: 100%;
    position: relative;
    .dragBox {
      position: absolute;
      height: 20px;
      line-height: 20px;
      text-align: center;
      width: 59px;
      top: -20px;
      background: #dbdbdb;
      font-size: 12px;
      color: #999;
      cursor: move;
      z-index: 998;
      div {
        position: absolute;
        z-index: 99;
        height: 60px;
        width: 1px;
        background: #40ff;
      }
    }
    .partBox {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      .active {
        background: #02618a;
        z-index: 997;
        border-radius: 0px !important;
      }
      .part {
        top: 0;
        position: absolute;
        height: 100%;
        background: #cccbcb;
        cursor: pointer;
        text-align: center;
        border-radius: 10px;
        .partNumShow {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
        .comMove {
          position: absolute;
          top: 0;
          height: 100%;
          line-height: 100%;
          cursor: ew-resize !important;
          z-index: 998;

          .iconLeft {
            position: absolute;
            width: 14px;
            left: 0px;
            height: 100%;
            line-height: 100%;
            background: #0285bd;
            display: flex;
            align-items: center;
            border-radius: 3px 0 0 3px;
            color: #fff;
          }
          .iconRight {
            position: absolute;
            width: 14px;
            right: 0px;
            height: 100%;
            line-height: 100%;
            background: #0285bd;
            display: flex;
            align-items: center;
            border-radius: 0 3px 3px 0;
            color: #fff;
          }
        }
        .leftMove {
          left: 0px;
          border-left: 1px;
        }
        .rightMove {
          right: 0px;
          border-right: 1px;
        }
      }
    }
  }
}
</style>
