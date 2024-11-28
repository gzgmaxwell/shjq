<template>
  <div class="mt20">
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <!-- :operation="operation" -->
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
  </div>
</template>
<script>
import { getSubstanceDataInfo } from "@/api/userList";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters, mapActions } from "vuex";
import { ENUM_DIC_TYPE } from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      that: this,
      visible: false,
      row: {},
      Alloption: [],
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "搜索标题",
          clearable: true,
        },
        // {
        //   type: "select",
        //   prop: "pushLevel",
        //   change: (that, data) => {},
        //   placeholder: "全部推荐等级",
        //   options: [],
        //   labelValue: {
        //     label: "dictionaryKey",
        //     value: "dictionaryValue",
        //   },
        //   clearable: true,
        // },
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
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        createUserId: this.$route.query.id,
        videoTitle: "",
        // pushLevel: "",
        classifyId: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
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
          prop: "videoTitle",
          label: "视频标题",
          width: "150",
        },

        {
          prop: "createTime",
          label: "发布时间",
          width: "150",

          sortable: true,
          callback: (row) => {
            console.log(row);
          },
        },
        // {
        //   prop: "pushLevel",
        //   label: "推荐等级",
        //   width: "150",

        //   type: "html",
        //   html: (row) => {
        //     const item = this.Alloption.find(
        //       (v) => v.dictionaryValue === row.pushLevel
        //     );
        //     return item ? `<span>${item.dictionaryKey}</span>` : "";
        //   },
        // },
        {
          prop: "classifyName",
          label: "视频标签",
        },

        {
          prop: "failure",
          label: "状态",
          type: "html",
          html: (row) => {
            return `<span class='must'>${
              row.failure == true ? "下架" : "正常"
            }</span>`;
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
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
    }),
  },

  mounted() {
    this.Alloption = this.dictionary[ENUM_DIC_TYPE.recommend_level];
    this.getList();
    this.categoryList();
    this.recommendList();
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
      });
    },
    recommendList() {
      this.searchForm.forEach((v) => {
        if (v.type === "select") {
          v.options = this.Alloption;
        }
      });
    },
    getList() {
      let startTime = "";
      let endTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        startTime = this.searchData.dateTime[0];
        endTime = this.searchData.dateTime[1];
      }
      const params = {
        ...this.searchData,
        startTime,
        endTime,
        classifyId: this.searchData.classifyId[1],
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getSubstanceDataInfo(params).then((res) => {
        const { data } = res;

        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverBucketUrl;
            return v;
          });
          this.tablePage.total = data.data.total;
          this.$emit("getTotal", data.data.total);
        }
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.videoTitle = "";
      this.searchData.dateTime = [];
      // this.searchData.pushLevel = "";
      this.searchData.classifyId = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-card.is-always-shadow {
  margin: 10px;
}
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
