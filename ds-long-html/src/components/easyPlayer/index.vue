<template>
  <easy-player
    live
    muted
    autoplay
    :stretch="false"
    :video-url="row.videoUrl"
    ref="easyplayer"
  />
</template>
<script>
import EasyPlayer from "@easydarwin/easyplayer";
export default {
  components: { EasyPlayer },
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
    console.log(this.row.videoUrl);
    window.ep = this.$refs.easyplayer;
    ep.stretch = false;
  },
  methods: {},
};
</script>
<style></style>
