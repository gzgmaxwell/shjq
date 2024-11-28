<template>
  <basic-container>
    <sid-audit-count :options="options"></sid-audit-count>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频审核记录" lazy name="first">
        <videoAuditRecord></videoAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="评论审核记录" lazy name="second">
        <reviewAuditRecord></reviewAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="弹幕审核记录" lazy name="third">
        <barrageAuditRecord></barrageAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="下架视频记录" lazy name="fourth">
        <soldOutAuditRecord></soldOutAuditRecord>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import sidAuditCount from "@/views/common/sid-audit-count/index";
import videoAuditRecord from "@/views/video-manage/audit-record/components/videoAuditRecord.vue";
import reviewAuditRecord from "@/views/video-manage/audit-record/components/reviewAuditRecord.vue";
import barrageAuditRecord from "@/views/video-manage/audit-record/components/barrageAuditRecord.vue";
import soldOutAuditRecord from "@/views/video-manage/audit-record/components/soldOutAuditRecord.vue";
import { getRecordData } from "@/api/video-manage/audit-record.js";
export default {
  name: "audit-record",
  components: {
    sidAuditCount,
    videoAuditRecord,
    reviewAuditRecord,
    barrageAuditRecord,
    soldOutAuditRecord,
  },
  mounted() {
    this.getRecord();
  },

  data() {
    return {
      activeName: "first",
      options: {},
    };
  },
  methods: {
    getRecord() {
      getRecordData().then((res) => {
        this.options = res.data.data;
      });
    },
  },
};
</script>
