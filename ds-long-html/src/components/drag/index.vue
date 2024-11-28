<template>
  <div
    class="move"
    :style="{
      left: state.left + 'px',
      top: state.top + 'px',
    }"
    ref="move"
  >
    <div class="dragBox" @mousedown="startMove($event, 'DRAG')">
      <i class="el-icon-close closeSelf" @click="onClose"></i>
    </div>
    <div style="position: relative; height: 400px">
      <slot></slot>
    </div>
  </div>
</template>
<script>
let upFunc = () => null;
export default {
  props: {
    index: {
      type: Number,
      required: false,
      default: () => {
        return "";
      },
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      move: null,
      state: {
        width: 0, // 裁剪框的宽度
        height: 0, // 裁剪框的高度
        left: 540,
        top: 100,
        downClientX: 0,
        downClientY: 0,
        offsetLeft: 0,
        offsetTop: 0,
      },
    };
  },
  mounted() {
    this.state.left = this.state.left + (this.index % 10) * 30;
  },
  methods: {
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
      } = this;
      const changeX = e.clientX - downClientX + (offsetLeft - left); // 往右为正
      const changeY = e.clientY - downClientY + (offsetTop - top); // 往下为正
      let newLeft = left + changeX;
      let newTop = top + changeY;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      this.state.left = newLeft;
      this.state.top = newTop;
    },
    startMove(e, type) {
      e.stopPropagation();
      e.preventDefault();
      if (type === "DRAG") {
        this.state.downClientX = e.clientX;
        this.state.downClientY = e.clientY;
        this.state.offsetLeft = this.$refs.move.offsetLeft;
        this.state.offsetTop = this.$refs.move.offsetTop;
        this.commonBind(this.drag);
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
};
</script>
<style lang="scss" scoped>
.move {
  background: #fff;
  position: fixed !important;
  z-index: 999;
  width: 700px;
  height: 450px;
  box-shadow: 1px 3px 8px #999;
  .dragBox {
    height: 40px;
    width: 100%;
    cursor: move;
    .closeSelf {
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 24px;
      cursor: pointer;
      width: 30px;
      height: 20px;
      text-align: center;
    }
  }
}
</style>
