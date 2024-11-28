<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :stripe="stripe"
    :border="border"
    :size="size"
    v-loading="loading"
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="isSelection" width="55" type="selection" />
    <el-table-column
      :prop="item.param"
      :label="item.label"
      v-for="(item, index) in tableColumns"
      :key="index"
      :align="item.align"
      :sortable="item.sortable"
      :width="item.width"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="scope">
        <span v-if="item.render">{{ item.render(scope.row) }}</span>

        <div style="display: flex" v-else-if="item.param === 'videoTitle'">
          <div
            v-if="
              scope.row.videoOriginalUrl && item.imgShow ? item.imgShow : false
            "
          >            <videoPlays
              :row="scope.row"
              :id="scope.row.id"
              :pic="scope.row.coverUrl"
              :videoUrl="scope.row.videoOriginalUrl"
            ></videoPlays>
          </div>
        </div>
        <div
          style="display: flex"
          v-else-if="
            item.param === 'accusationAttachmentList' ||
            item.param === 'handleAttachmentList'
          "
        >
          <template
            v-for="(item, itemIndex) in item.param === 'handleAttachmentList'
              ? scope.row.handleAttachmentList
              : scope.row.accusationAttachmentList"
          >
            <img
              :key="item.attachmentFile"
              style="margin: aotu; width: 78px; height: 48px"
              :src="scope.row.coverUrl"
              @click="openPreview(item.attachmentUrl, itemIndex)"
            />&emsp;
          </template>
        </div>
        <span
          v-else-if="item.param === 'type'"
          :style="
            scope.row[item.param] == '通过'
              ? 'color:rgb(17, 146, 197)'
              : 'color:red'
          "
          >{{ scope.row[item.param] }}</span
        >
        <span
          v-else-if="item.param === 'videoType'"
          :style="
            scope.row[item.param] == '未通过'
              ? 'color:red'
              : scope.row[item.param] == '审核中'
              ? 'color:rgb(17, 146, 197)'
              : 'color:rgb(53, 204, 103)'
          "
          >{{ scope.row[item.param] }}</span
        >
        <span v-else>{{ scope.row[item.param] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="tableOperation.label"
      :label="tableOperation.label"
      :width="tableOperation.labelWidth"
      :align="tableOperation.align"
    >
      <template slot-scope="scope">
        <template v-for="(item, index) in tableOperation.btnList">
          <el-button
            v-if="
              (scope.row.strategyName === '默认审核' && item.type === 'delete'
                ? false
                : item.showFlag === false || item.showFlag === true
                ? item.showFlag
                : true) && !item.btnType
            "
            size="small"
            type="text"
            :style="`color:${item.color}`"
            :key="index"
            @click="handleClick(scope.row, item.type)"
            >{{ item.label }}</el-button
          >
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import videoPlays from "@/components/bas-table/videoPlays";

export default {
  props: {
    tableColumns: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    tableData: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    tableOperation: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "small",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isSelection: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    videoPlays,
  },
  data() {
    return {
      single: {},
      isShowVideoPlayerModal: false,
      loadFlag: true,
      failFlag: false,
    };
  },
  methods: {
    handleClick(row, type) {
      this.$emit("handleClick", row, type);
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    filterTag(value, row) {
      return row.spzt === value;
    },
    openPreview(val, index) {
      let arr = [{ url: val }];
      this.$ImagePreview(arr, index);
    },

    close(row) {
      if (row) {
        this.$refs["videoPlay" + row][0].$refs["videoPlayer"].player.pause();
        this.$refs["popover" + row][0].doClose();
      }
    },
  },
};
</script>
<style>
.el-popper[x-placement^="right"] .popper__arrow {
  display: none;
}
</style>
<style lang="scss" scoped>
.video-content {
  .loading {
    width: 700px;
    height: 393.5px;
    background: #000;
  }
  .loading-failed {
    width: 700px;
    height: 393.5px;
    background: #000;
    text-align: center;
    line-height: 393px;
    color: #409eff;
  }
}
.del {
  display: block;
  text-align: right;
  margin-top: -10px;
}
</style>
