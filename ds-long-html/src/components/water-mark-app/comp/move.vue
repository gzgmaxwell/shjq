<template>
  <div
    class="move moveActive"
    @mousedown="startMove($event, 'DRAG')"
    :style="{
      width: item.width + 'px',
      height: item.height + 'px',
      left: item.left + 'px',
      top: item.top + 'px',
    }"
    ref="move"
  >
    <div class="resizable">
      <div
        class="opacityBox"
        :style="{
          opacity: 0,
        }"
      ></div>
      <img
        :src="item.src"
        :style="{
          opacity: item.opacity / 100,
        }"
        class="imgWaterMark"
      />
      <span class="tl" @mousedown="startMove($event, 'TL')"></span>
      <span :style="cutStyle" class="t" @mousedown="startMove($event, 'T')">
        <i></i>
      </span>
      <span class="tr" @mousedown="startMove($event, 'TR')"></span>
      <span :style="cutStyle" class="r" @mousedown="startMove($event, 'R')">
        <i></i>
      </span>
      <span class="br" @mousedown="startMove($event, 'BR')"></span>
      <span :style="cutStyle" class="b" @mousedown="startMove($event, 'B')">
        <i></i>
      </span>
      <span class="bl" @mousedown="startMove($event, 'BL')"></span>
      <span :style="cutStyle" class="l" @mousedown="startMove($event, 'L')">
        <i></i>
      </span>
    </div>
  </div>
</template>
<script>
/*
 *create by andy
 *time 2023/8/14
 */
let upFunc = () => null;
export default {
  props: {
    item: {
      type: Object,
      required: false,
      default: {},
    },
    videoClient: {
      type: Object,
      required: false,
      default: () => {
        return {
          clientWidth: 0,
          clientHeight: 0,
        };
      },
    },
    domName: {
      type: String,
      required: false,
      default: () => {
        return "scaleBox";
      },
    },
  },
  data() {
    return {
      cutStyle: { display: "block" },
      move: null,
      scaleBoxPos: null,
      angle: false,
      state: {
        width: 0, // 裁剪框的宽度
        height: 0, // 裁剪框的高度
        left: 0,
        top: 0,
        downClientX: 0,
        downClientY: 0,
        offsetLeft: 0,
        offsetTop: 0,
      },
    };
  },
  mounted() {
    const scaleBox = document.getElementById(this.domName);
    this.scaleBoxPos = scaleBox.getBoundingClientRect();
    this.initProps();
  },
  methods: {
    initProps() {
      this.state.width = this.item.width;
      this.state.height = this.item.height;
      this.state.left = this.item.left;
      this.state.top = this.item.top;
    },
    drag(e) {
      const {
        state: {
          left,
          top,
          width,
          height,
          downClientX,
          downClientY,
          offsetLeft,
          offsetTop,
        },
        videoClient: { clientWidth, clientHeight },
      } = this;
      const changeX = e.clientX - downClientX + (offsetLeft - left); // 往右为正
      const changeY = e.clientY - downClientY + (offsetTop - top); // 往下为正
      let newLeft = left + changeX;
      let newTop = top + changeY;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + width > clientWidth) {
        newLeft = clientWidth - width;
      }
      if (newTop + height > clientHeight) {
        newTop = clientHeight - height;
      }
      this.state.left = newLeft;
      this.state.top = newTop;
    },

    moveTL(e) {
      // 按照top 计算
      this.moveT(e);
    },
    moveT(e) {
      const {
        state: { top, height, left, width },
      } = this;
      const change = e.clientY - this.scaleBoxPos.y - top;
      let newTop = top + change;
      let newHeight = height - change;
      if (newTop < 0) {
        newTop = 0;
        newHeight = height + top;
      }
      if (newHeight < 0) return;
      if (this.angle) {
        const newWidth = newHeight * this.item.rate;
        let newLeft = left - (newWidth - width);
        if (newLeft < 0) return;
        this.state.left = newLeft;
        this.state.width = newWidth;
      }
      this.state.top = newTop;
      this.state.height = newHeight;
    },

    moveR(e) {
      const {
        state: { left, width, top, height },
        videoClient: { clientWidth },
      } = this;
      const change = e.clientX - this.scaleBoxPos.x - width - left;
      let newWidth = width + change;
      if (newWidth + left > clientWidth) {
        newWidth = clientWidth - left;
      }
      if (newWidth < 0) return;
      if (this.angle) {
        const newHeight = newWidth / this.item.rate;
        let newTop = top - (newHeight - height);
        if (newTop < 0) return;
        this.state.height = newHeight;
        this.state.top = newTop;
      }
      this.state.width = newWidth;
    },
    moveB(e) {
      const {
        state: { left, height, top },
        videoClient: { clientWidth, clientHeight },
      } = this;
      const change = e.clientY - this.scaleBoxPos.y - height - top;
      let newHeight = height + change;
      if (newHeight + top > clientHeight) {
        newHeight = clientHeight - top;
      }
      if (newHeight < 0) return;
      if (this.angle) {
        let newWidth = newHeight * this.item.rate;
        if (newWidth + left > clientWidth) {
          newWidth = clientWidth - left;
          this.state.width = newWidth;
          return;
        }
        this.state.width = newWidth;
      }
      this.state.height = newHeight;
    },
    moveL(e) {
      const {
        state: { left, top, width },
        videoClient: { clientHeight },
      } = this;
      const change = e.clientX - this.scaleBoxPos.x - left;
      let newWidth = width - change;
      let newLeft = left + change;
      if (newLeft < 0) {
        newLeft = 0;
        newWidth = width + left;
      }
      if (newWidth < 0) return;
      if (this.angle) {
        let newHeight = newWidth / this.item.rate;
        if (newHeight + top > clientHeight) {
          newHeight = clientHeight - top;
          this.state.height = newHeight;
          return;
        }
        this.state.height = newHeight;
      }
      this.state.width = newWidth;
      this.state.left = newLeft;
    },
    startMove(e, type) {
      if (!this.item.isActive) return;
      e.stopPropagation();
      e.preventDefault();
      this.angle = false;
      if (type === "DRAG") {
        this.state.downClientX = e.clientX;
        this.state.downClientY = e.clientY;
        this.state.offsetLeft = this.$refs.move.offsetLeft;
        this.state.offsetTop = this.$refs.move.offsetTop;
        this.commonBind(this.drag);
      } else if (type === "TL") {
        this.angle = true;
        this.commonBind(this.moveT);
      } else if (type === "T") {
        this.commonBind(this.moveT);
      } else if (type === "TR") {
        this.angle = true;
        this.commonBind(this.moveR);
      } else if (type === "R") {
        this.commonBind(this.moveR);
      } else if (type === "BR") {
        this.angle = true;
        this.commonBind(this.moveB);
      } else if (type === "B") {
        this.commonBind(this.moveB);
      } else if (type === "BL") {
        this.angle = true;
        this.commonBind(this.moveL);
      } else if (type === "L") {
        this.commonBind(this.moveL);
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
    state: {
      handler(val) {
        this.videoClient.callbackPos(val);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.moveActive {
  outline: 1px solid #409eff !important;
  z-index: 1000 !important;
}
.noMoveActive {
  z-index: 1 !important;
}
.imgWaterMark {
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
}
.move {
  position: absolute;
  outline: 1px dashed #999;
  .resizable {
    position: absolute;
    width: 100%;
    height: 100%;
    .opacityBox {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 999;
    }
    span {
      cursor: pointer;
      position: absolute;
      // display: none;
      display: block;
    }

    .tl {
      top: -3px;
      left: -3px;
      cursor: nwse-resize;
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(151, 151, 151, 1);
    }

    .t {
      width: 100%;
      height: 3px;

      i {
        position: absolute;
        top: -3px;
        left: 50%;
        margin-left: -3px;
        cursor: ns-resize;
        // 共同
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(151, 151, 151, 1);
      }
    }

    .tr {
      top: -3px;
      right: -3px;
      cursor: nesw-resize;
      // com
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(151, 151, 151, 1);
    }

    .r {
      height: 100%;
      width: 3px;
      right: 0px;
      cursor: ew-resize;

      i {
        position: absolute;
        top: 50%;
        margin-top: -3px;
        right: -3px;
        // 共同
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(151, 151, 151, 1);
      }
    }

    .br {
      bottom: -3px;
      right: -3px;
      cursor: nwse-resize;
      // com
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(151, 151, 151, 1);
    }

    .b {
      width: 100%;
      height: 3px;
      bottom: 0;
      cursor: ns-resize;

      i {
        position: absolute;
        bottom: -3px;
        left: 50%;
        margin-left: -3px;
        // 共同
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(151, 151, 151, 1);
      }
    }

    .bl {
      bottom: -3px;
      left: -3px;
      cursor: nesw-resize;
      // 共同
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(151, 151, 151, 1);
    }

    .l {
      height: 100%;
      width: 3px;
      cursor: ew-resize;

      i {
        position: absolute;
        left: -3px;
        top: 50%;
        margin-top: -3px;
        // 共同
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(151, 151, 151, 1);
      }
    }
  }
}
</style>
