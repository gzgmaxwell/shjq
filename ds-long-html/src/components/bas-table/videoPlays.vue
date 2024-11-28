<template>
  <div style="display: flex">
    <div>
      <el-popover
        placement="right"
        width="740"
        trigger="manual"
        :ref="`popover${id}`"
        :popper-class="`popoverClass${id}`"
      >
        <span class="del"
          ><i
            class="el-icon-close"
            style="
              cursor: pointer;
              width: 30px;
              height: 20px;
              text-align: center;
            "
            @click="close(id)"
          ></i
        ></span>
        <div class="video-content">
          <sid-video-player
            :ref="'videoPlays' + id"
            :visible="isShowVideoPlayerModal"
            title="视频预览"
            :single="{
              videoOriginalFileUrl: videoUrl,
            }"
          ></sid-video-player>

          <div
            v-if="loadFlag"
            v-loading="loadFlag"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="loading"
          ></div>
          <div class="loading-failed" v-if="failFlag">加载失败 !</div>
        </div>
        <img
          slot="reference"
          style="margin: aotu; width: 78px; height: 48px"
          :src="pic"
          @click="previewHandle(row, `popoverClass${id}`)"
        />
      </el-popover>
    </div>
    <div style="width: 76%">
      <div
        style="
          font-weight: bold;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgb(73, 72, 72);
        "
      >
        &nbsp; {{ row.videoTitle }}
      </div>
      <span style="color: #aaa"
        >&emsp;
        {{
          row.videoIntroduce == "" || row.videoIntroduce == null
            ? "暂无"
            : row.videoIntroduce
        }}</span
      >
    </div>
  </div>
</template>

<script>
import sidVideoPlayer from "@/components/video-player";
import { popoverHandle } from "@/util/popover";
export default {
  components: {
    sidVideoPlayer,
  },
  data() {
    return {
      isShowVideoPlayerModal: false,
      loadFlag: false,
      failFlag: false,
    };
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
    id: {
      type: String,
      default: "",
    },
    pic: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    previewHandle(row, popoverClass) {
      if (this.$refs["popover" + this.id] == this.$refs["popover" + this.id]) {
        this.$refs["popover" + this.id].doShow();
      }
      popoverHandle(popoverClass);
      if (this.videoUrl) {
        this.isShowVideoPlayerModal = true;
        this.loadFlag = false;
        this.failFlag = false;
      } else if (
        row.substanceInfo &&
        row.substanceInfo.videoOriginalFileUrl.length !== 0
      ) {
        this.isShowVideoPlayerModal = true;
        this.loadFlag = false;
        this.failFlag = false;
      } else {
        this.isShowVideoPlayerModal = false;
        this.loadFlag = false;
        this.failFlag = true;
      }
    },
    close(id) {
      if (id) {
        this.$refs["popover" + id].doClose();
        this.$refs["videoPlays" + id].$refs["videoPlayer"].player.pause();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 窗口中的头部样式
.del {
  display: block;
  text-align: right;
  margin-top: -10px;
}
</style>
