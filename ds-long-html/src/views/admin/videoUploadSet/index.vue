<template>
  <basic-container>
    <div style="width: 50%; margin-bottom: 30px">
      <videoUploadSeting
        v-if="permissions.sys_videoUpload_settings"
        class="mb20"
      />
      <watermarkTranscodingSortSeting
        class="mb20"
        v-if="permissions.sys_watermarkTranscodingSort_settings"
      />
      <videoScoringSeting class="mb20" />
      <watchVideoTime class="mb20" />
      <previewVideo class="mb20" />
      <videoCaptureSeting class="mb20" />
      <videoLine />
      <videoWatchInit />
      <videoWatchCard />
      <adDisplayOdds />
      <timeStamp v-if="permissions.sys_timeStamp_settings" />
    </div>
  </basic-container>
</template>
<script>
import watchVideoTime from "@/views/common/videoSetingCofig/watchVideoTime.vue";
import previewVideo from "@/views/common/videoSetingCofig/previewVideo.vue";
import videoUploadSeting from "@/views/common/videoSetingCofig/videoUploadSeting.vue";
import watermarkTranscodingSortSeting from "@/views/common/videoSetingCofig/watermarkTranscodingSortSeting.vue";
import videoScoringSeting from "@/views/common/videoSetingCofig/videoScoringSeting.vue";
import videoCaptureSeting from "@/views/common/videoSetingCofig/videoCaptureSeting.vue";
import videoLine from "@/views/common/videoSetingCofig/videoLine.vue";
import videoWatchInit from "@/views/common/videoSetingCofig/videoWatchInit.vue";
import videoWatchCard from "@/views/common/videoSetingCofig/videoWatchCard.vue";
import adDisplayOdds from "@/views/common/videoSetingCofig/adDisplayOdds.vue";
import timeStamp from "@/views/common/videoSetingCofig/timeStamp.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    watchVideoTime,
    previewVideo,
    videoUploadSeting,
    watermarkTranscodingSortSeting,
    videoScoringSeting,
    videoCaptureSeting,
    videoLine,
    videoWatchInit,
    videoWatchCard,
    adDisplayOdds,
    timeStamp,
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
  },
  mounted() {
    this.$store.dispatch("actionDictionary");
  },
};
</script>
