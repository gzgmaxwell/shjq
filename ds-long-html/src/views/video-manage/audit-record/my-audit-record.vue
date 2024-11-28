<template>
  <basic-container>
    <sid-audit-count :options="options"></sid-audit-count>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频审核记录" lazy name="first">
        <myVideoAuditRecord></myVideoAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="评论审核记录" lazy name="second">
        <myReviewAuditRecord></myReviewAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="弹幕审核记录" lazy name="third">
        <myBarrageAuditRecord></myBarrageAuditRecord>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import sidAuditCount from "@/views/common/sid-audit-count/index.vue";
import myVideoAuditRecord from "@/views/video-manage/audit-record/components/myVideoAuditRecord.vue";
import myReviewAuditRecord from "@/views/video-manage/audit-record/components/myReviewAuditRecord.vue";
import myBarrageAuditRecord from "@/views/video-manage/audit-record/components/myBarrageAuditRecord.vue";

import { getRecordData } from "@/api/video-manage/my-audit-record.js";
export default {
  name: "audit-record",
  components: {
    sidAuditCount,
    myVideoAuditRecord,
    myReviewAuditRecord,
    myBarrageAuditRecord,
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

<style lang="scss" scoped></style>
