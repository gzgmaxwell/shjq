<template>
  <div class="progressWrap">
    <div class="videoPlayBox">
      <div class="videoPlay" @click="play">
        <i
          class="playBtn"
          :class="isPlaying ? 'el-icon-video-pause ' : 'el-icon-video-play'"
        ></i>
      </div>
      <div class="timeProgress" ref="timeProgress" id="timeProgress">
        <div
          class="dragBox"
          @mousedown="startMove($event)"
          ref="move"
          :style="{
            left: state.left + 'px',
          }"
        >
          {{ compCurentTime(currentTime) }}
          <div></div>
        </div>
        <el-slider
          v-model="rangetTime"
          @input="input"
          range
          :format-tooltip="formatRangetTime"
        >
        </el-slider>
      </div>
      <div class="timeStamp">
        {{ compTime(rangetTime[0]) }} / {{ compTime(rangetTime[1]) }}
      </div>
    </div>
    <!-- <div class="opacityBox">
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
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
let upFunc = () => null;
const baseValue = 100;
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
  },
  data() {
    return {
      // opacity: 100,
      isPlaying: false,
      rangetTime: [0, baseValue],
      startTime: 0,
      endTime: 0,
      currentTime: 0,
      state: {
        left: 0,
        downClientX: 0,
        offsetLeft: 0,
      },
    };
  },
  computed: {
    compTime() {
      return (time) => {
        const result = (this.videoClient.duration * time) / baseValue;
        let currentTime = moment.duration(result, "seconds");
        return moment({
          h: currentTime.hours(),
          m: currentTime.minutes(),
          s: currentTime.seconds(),
        }).format("HH:mm:ss");
      };
    },
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
    formatRangetTime(val) {
      const time = (this.videoClient.duration * val) / baseValue;
      return time.toFixed(2);
    },
    formatTooltip(val) {
      return parseInt(val);
    },
    play() {
      this.isPlaying = !this.isPlaying;
      this.input();
    },
    input() {
      const startTime =
        (this.videoClient.duration * this.rangetTime[0]) / baseValue;
      const endTime =
        (this.videoClient.duration * this.rangetTime[1]) / baseValue;
      const params = {
        isPlaying: this.isPlaying,
        // opacity: this.opacity,
        currentTime: this.currentTime,
        startTime,
        endTime,
      };
      this.videoClient.callback(params);
    },
    changeTime(item) {
      this.startTime = item.startTime;
      this.endTime = item.endTime;
      const startTime =
        (this.startTime / this.videoClient.duration) * baseValue;
      const endTime = (this.endTime / this.videoClient.duration) * baseValue;
      this.rangetTime = [startTime, endTime];
      // this.opacity = item.opacity;
    },
    drag(e) {
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
      this.input();
    },

    startMove(e) {
      e.stopPropagation();
      e.preventDefault();
      this.state.downClientX = e.clientX;
      this.state.offsetLeft = this.$refs.move.offsetLeft;
      this.commonBind(this.drag);
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
.progressWrap {
  position: relative;
  width: 592px;
  .videoPlayBox {
    margin-top: 20px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8f8f8;
    border-radius: 3px;
    padding: 0 10px;
    .videoPlay {
      width: 40px;
      .playBtn {
        font-size: 24px;
        cursor: pointer;
      }
    }
    .timeProgress {
      width: 400px;
      height: 100%;
      padding-top: 6px;
      position: relative;
      .dragBox {
        position: absolute;
        height: 20px;
        line-height: 20px;
        text-align: center;
        width: 60px;
        top: -20px;
        background: #dbdbdb;
        font-size: 12px;
        color: #999;
        cursor: move;
        div {
          position: absolute;
          z-index: 99;
          height: 22px;
          width: 1px;
          background: #40ff;
        }
      }
    }
    .timeStamp {
      margin-left: 15px;
      width: 120px;
      font-size: 12px;
      color: #666;
    }
  }
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
</style>
