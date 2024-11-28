<template>
  <video
    v-if="isOriVideoPlay"
    :src="single.videoOriginalFileUrl"
    crossorigin="anonymous"
    ref="videoElement"
    id="videoElement"
    controls
    muted
  ></video>
  <video
    v-else
    ref="videoElement"
    crossorigin="anonymous"
    :poster="this.single.coverFileUrl"
    id="videoElement"
    controls
    muted
  ></video>
</template>
<script>
import hlsjs from "hls.js";
export default {
  props: {
    single: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      video: null,
      isOriVideoPlay: false,
    };
  },
  mounted() {
    this.show();
  },
  methods: {
    show() {
      this.video = this.$refs.videoElement; //定义挂载点
      let url = this.single.videoOriginalFileUrl;
      let types = "";
      if (url != null) {
        types = url.slice(url.lastIndexOf(".") + 1);
      }
      if (types === "m3u8") {
        this.video.src = this.single.videoOriginalFileUrl;
        if (hlsjs.isSupported()) {
          this.hlsjs = new hlsjs();
          this.hlsjs.loadSource(this.single.videoOriginalFileUrl); //设置播放路径
          this.hlsjs.attachMedia(this.video); //解析到video标签上
        } else {
          this.$message.error("不支持的格式");
        }
      } else {
        this.isOriVideoPlay = true;
      }
    },
    closeVideo() {
      if (this.hlsjs) {
        this.$refs.videoElement.pause();
        this.video.pause();
        this.hlsjs.destroy();
        this.hlsjs = null;
        this.$emit("closeVideo");
      }
    },
  },
};
</script>
<style>
#videoElement {
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>
