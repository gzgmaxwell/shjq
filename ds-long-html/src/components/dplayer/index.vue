<template>
  <div
    id="dplayer"
    style="width: 700px; height: 400px; position: relative"
  ></div>
</template>
<script>
import DPlayer from "dplayer";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {
          videoUrl: "https://teststatic.shjqtech.net/hevc/yyyy/live.m3u8",
        };
      },
    },
  },

  data() {
    return {};
  },
  mounted() {
    const dp = new DPlayer({
      container: document.getElementById("dplayer"),
      video: {
        url: this.row.videoUrl,
        type: "hls",
      },
      controls: true,
      autoplay: true,
    });
    window.dp = dp;
  },
  methods: {},
};
</script>
<style></style>
