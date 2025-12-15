<template>
  <basic-container>
    <sid-audit-count :options="options"></sid-audit-count>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频审核记录" lazy name="first">
        <myVideoAuditRecord v-if="activeName === 'first'"></myVideoAuditRecord>
      </el-tab-pane>
      <el-tab-pane label="视频评论审核记录" lazy name="second">
        <myReviewAuditRecord
          v-if="activeName === 'second'"
        ></myReviewAuditRecord>
      </el-tab-pane>
      <el-tab-pane label="弹幕审核记录" lazy name="third">
        <myBarrageAuditRecord
          v-if="activeName === 'third'"
        ></myBarrageAuditRecord>
      </el-tab-pane>
      <el-tab-pane label="漫画评论审核记录" lazy name="fourth">
        <myComicBookCommentRecord
          v-if="activeName === 'fourth'"
          :inkLoreType="EnumCartoonType.comic"
        ></myComicBookCommentRecord>
      </el-tab-pane>
      <el-tab-pane label="小说评论审核记录" lazy name="five">
        <myComicBookCommentRecord
          v-if="activeName === 'five'"
          :inkLoreType="EnumCartoonType.novel"
        ></myComicBookCommentRecord>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import sidAuditCount from "@/views/common/sid-audit-count/index.vue";
import myVideoAuditRecord from "@/views/video-manage/audit-record/components/myVideoAuditRecord.vue";
import myReviewAuditRecord from "@/views/video-manage/audit-record/components/myReviewAuditRecord.vue";
import myBarrageAuditRecord from "@/views/video-manage/audit-record/components/myBarrageAuditRecord.vue";
import myComicBookCommentRecord from "@/views/video-manage/audit-record/components/myComicBookCommentRecord.vue";

import { getRecordData } from "@/api/video-manage/my-audit-record.js";
import { EnumCartoonType } from "@/util/util";
export default {
  name: "audit-record",
  components: {
    sidAuditCount,
    myVideoAuditRecord,
    myReviewAuditRecord,
    myBarrageAuditRecord,
    myComicBookCommentRecord,
  },
  mounted() {
    this.getRecord();
  },

  data() {
    return {
      activeName: "first",
      options: {},
      EnumCartoonType: EnumCartoonType,
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
