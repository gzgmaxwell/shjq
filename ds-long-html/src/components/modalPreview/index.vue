<template>
  <el-dialog
    title="预览"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :before-close="beforeClose"
    top="10px"
    :lock-scroll="true"
    width="1060px"
  >
    <div class="container">
      <div class="curpos">
        当前章节：第{{ curPos(chapterList, chapterId) }}章
      </div>
      <div class="main">
        <div class="boxChapter">
          <div
            class="wrap"
            v-for="(item, index) in chapterList"
            :class="{ link: item.id === chapterId }"
            :key="index"
            @click="getImage(item.id)"
          >
            第 {{ item.sort }} 章
          </div>
        </div>
        <div @click="drawer = true" class="el-icon-s-fold moreBtn"></div>
      </div>

      <div class="boxImage" v-loading="loading" :key="chapterId">
        <readTxt v-if="url" :url="url" />
        <template v-else>
          <div class="wrap" v-for="(item, index) in imageList" :key="index">
            <img :src="item.contentUrl" alt="" />
          </div>
        </template>
      </div>
      <el-drawer
        title="章节目录"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
        :modal-append-to-body="false"
        :modal="false"
      >
        <div class="drawerChapter">
          <div
            class="wrap"
            v-for="(item, index) in chapterList"
            :key="index"
            :class="{ activeBoder: item.id === chapterId }"
            @click="getImage(item.id)"
          >
            第 {{ item.sort }} 章
          </div>
        </div>
      </el-drawer>
    </div>
  </el-dialog>
</template>
<script>
import { chapterPage, chapter_preview } from "@/api/graphicManagement/index";
import { EnumCartoonType } from "@/util/util";
import upload from "@/components/upload/index.vue";

import readTxt from "./readTxt.vue";

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
  components: {
    upload,
    readTxt,
  },
  data() {
    return {
      visible: false,
      drawer: false,
      chapterList: [],
      imageList: [],
      id: "",
      chapterId: undefined,
      callback: () => {},
      loading: false,
      url: "",
      type: EnumCartoonType.comic,
      API_chapterPage: chapterPage,
      API_chapterPre: chapter_preview,
    };
  },
  mounted() {},
  computed: {
    curPos() {
      return (chapterList, chapterId) => {
        return chapterList.find((v) => v.id === chapterId)?.sort;
      };
    },
  },

  methods: {
    handleClose() {
      this.drawer = false;
    },
    beforeClose() {
      this.imageList = [];
      this.url = "";
      this.visible = false;
      this.API_chapterPage = chapterPage;
      this.API_chapterPre = chapter_preview;
    },
    show(item) {
      this.$modalImage({
        imageURL: item.contentUrl,
      });
    },
    init(id, chapterId) {
      this.API_chapterPage({
        current: 1,
        size: 1000,
        code: id,
      }).then((res) => {
        this.chapterList = res.data.data.records;
        if (this.chapterList.length) {
          this.getImage(chapterId || this.chapterList[0].id);
        }
      });
    },

    getImage(chapterId) {
      this.chapterId = chapterId;
      this.url = "";
      this.handleClose();
      this.loading = true;
      this.API_chapterPre({
        chapterId: chapterId,
      }).then((res) => {
        this.loading = false;
        this.imageList = res.data.data;
        if (this.imageList.length && this.type === EnumCartoonType.novel) {
          this.url = this.imageList[0].contentUrl;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  .curpos {
    position: absolute;
    left: 49px;
    top: -42px;
    font-size: 12px;
  }
  .activeBoder {
    border: 2px solid #02a7f0 !important;
  }
  .main {
    display: flex;
    position: relative;
    .boxChapter {
      position: relative;
      margin-bottom: 20px;
      width: calc(100% - 40px);
      overflow: hidden;
      height: 20px;
      display: flex;
      flex-wrap: wrap;
      .wrap {
        width: 80px;
        padding-right: 20px;
        cursor: pointer;
      }
    }
    .moreBtn {
      position: absolute;
      right: 0px;
      font-size: 24px;
      cursor: pointer;
      width: 40px;
      text-align: right;
    }
  }

  .boxImage {
    display: flex;
    flex-wrap: wrap;
    height: 800px;
    overflow: auto;
    .wrap {
      width: 1020px;
      height: 800px;
      margin-right: 10px;
      margin-bottom: 10px;
      background: #00000045;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .drawerChapter {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
    .wrap {
      width: 80px;
      height: 60px;
      margin-right: 10px;
      margin-bottom: 10px;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
    }
  }
  ::v-deep .el-drawer__wrapper {
    position: absolute !important;
    top: 85px;
    .el-drawer__title {
      border-top: 1px solid #ebebeb;
    }
  }
}

::v-deep .el-dialog__body {
  padding: 15px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
</style>
