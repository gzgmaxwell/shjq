<template>
  <el-form label-width="150px" class="demo-ruleForm">
    <el-form-item label="多分辨率进度">
      <span v-if="!compuGen(row)">
        {{ compuVideoConvertSchedule(info.videoConvertSchedule) }}</span
      >
      <span v-if="compuGen(row)" class="danger"> 生成失败 </span>
    </el-form-item>

    <el-form-item>
      <el-button @click="gen" type="primary" v-if="compuGen(row)"
        >重新生成</el-button
      >
      <el-button @click="row.callback && row.callback()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { substanceVideoVideo, scheduleRetry } from "@/api/video-manage/index";
import { enum_resolution } from "@/util/util";

export default {
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
      info: {
        videoConvertSchedule: undefined,
      },
      timer: null,
    };
  },
  computed: {
    compuVideoConvertSchedule() {
      return (data) => {
        return `${data}%`;
      };
    },
    compuGen() {
      return (row) => {
        if (
          row.videoConvertStatus === enum_resolution.VIDEO_CONVERT_FAIL ||
          !row.videoConvertStatus
        ) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.getvideoSchedule();
    this.timer = setInterval(() => {
      this.getvideoSchedule();
    }, 4000);
  },
  methods: {
    getvideoSchedule() {
      substanceVideoVideo(this.row.preId).then((res) => {
        this.info = res.data.data;
      });
    },
    gen() {
      scheduleRetry(this.row.preId).then((res) => {
        this.$message.success("重新生成中");
        this.row.callback();
      });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
