<template>
  <basic-container>
    <sid-audit-count :options="options"></sid-audit-count>
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频审核记录" lazy name="first">
        <videoAuditRecord v-if="activeName === 'first'"></videoAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="视频评论审核记录" lazy name="second">
        <reviewAuditRecord v-if="activeName === 'second'"></reviewAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="弹幕审核记录" lazy name="third">
        <barrageAuditRecord v-if="activeName === 'third'"></barrageAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="下架视频记录" lazy name="fourth">
        <soldOutAuditRecord v-if="activeName === 'fourth'"></soldOutAuditRecord>
      </el-tab-pane>

      <el-tab-pane label="漫画评论审核记录" lazy name="five">
        <comicBookCommentRecord
          v-if="activeName === 'five'"
          :inkLoreType="EnumCartoonType.comic"
        ></comicBookCommentRecord>
      </el-tab-pane>
      <el-tab-pane label="小说评论审核记录" lazy name="six">
        <comicBookCommentRecord
          v-if="activeName === 'six'"
          :inkLoreType="EnumCartoonType.novel"
        ></comicBookCommentRecord>
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
import comicBookCommentRecord from "@/views/video-manage/audit-record/components/comicBookCommentRecord.vue";
import { getRecordData } from "@/api/video-manage/audit-record.js";
import { EnumCartoonType } from "@/util/util";
export default {
  name: "audit-record",
  components: {
    sidAuditCount,
    videoAuditRecord,
    reviewAuditRecord,
    barrageAuditRecord,
    soldOutAuditRecord,
    comicBookCommentRecord,
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
