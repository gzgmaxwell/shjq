<template>
  <div class="mt20">
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
      <template #classifyName="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(classifyOptions, row.classifyId).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(classifyOptions, row.classifyId)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      title="查看"
      :visible.sync="visible"
      width="70%"
      :close-on-click-modal="false"
    >
      <commContentVideoCheck v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import commContentVideoCheck from "@/views/common/commVideo/commContentVideoCheck.vue";
import { getSubstanceDataInfo } from "@/api/userList";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters } from "vuex";
import {
  showTag,
  videoUnmountStatus,
  ENUM_VIDEO_STATUS,
  resetSearchData,
  filterNullSearchData,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    commContentVideoCheck,
  },
  data() {
    return {
      loading: false,
      that: this,
      visible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "搜索标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "classifyId",
          placeholder: "全部标签",
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          options: [],
          clearable: true,
        },
        {
          type: "select",
          prop: "failure",
          placeholder: "全部状态",
          options: videoUnmountStatus.filter((item) => item.id !== ""),
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: [],
        failure: "",
        dateTime: [],
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],

      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          width: "100",
          type: "videoPlay",
          callback: (row) => {
            row.visible = true;
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          label: "视频标题",
          type: "slot",
          slotName: "videoTitle",
        },
        {
          prop: "createTime",
          label: "发布时间",
          width: "150",
          sortable: true,
          callback: (row) => {},
        },
        {
          label: "视频标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "状态",
          type: "html",
          html: (row) => {
            const className =
              ENUM_VIDEO_STATUS.normal === row.failure
                ? "arrangetwo"
                : "danger";
            const item = videoUnmountStatus.find((v) => v.id === row.failure);
            return `<span class="${className}">${item.name}</span>`;
          },
        },
        {
          prop: "playCount",
          label: "播放",
        },
        {
          prop: "likeCount",
          label: "点赞",
        },
        {
          prop: "commentCount",
          label: "评论",
        },
        {
          prop: "collectCount",
          label: "收藏",
        },
        {
          prop: "retweetCount",
          label: "分享",
        },
        {
          prop: "downloadCount",
          label: "下载",
        },
        {
          prop: "accusationCount",
          label: "举报",
        },
        {
          label: "操作",
          type: "html",
          width: "80",
          html: (row) => {
            const look = `<span class="comBtn link" data-tagName="look">查看</span>`;
            return look;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "look") {
              this.visible = true;
              this.row = {
                ...row,
                callback: () => {
                  this.visible = false;
                },
              };
            }
          },
        },
      ],
      tablePage: {
        total: 0,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    compOpt() {
      return (arr, str) => {
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },

  mounted() {
    this.getList();
    this.categoryList();
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        createUserId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      getSubstanceDataInfo(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverBucketUrl;
            return v;
          });
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
