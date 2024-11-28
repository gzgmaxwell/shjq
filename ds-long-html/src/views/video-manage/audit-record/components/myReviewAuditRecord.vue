<template>
  <div>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </tableSearch>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { getMyPlTabData } from "@/api/video-manage/my-audit-record.js";
import { optVideoStyle, resetSearchData } from "@/util/util";

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
      searchForm: [
        {
          type: "input",
          prop: "substanceTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "videoSiftType",
          placeholder: "视频样式",
          options: optVideoStyle,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        substanceTitle: "",
        videoSiftType: "",
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
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],

      tableLabel: [
        {
          prop: "commentContent",
          label: "评论内容",
        },
        {
          prop: "videoTitle",
          label: "视频来源",
        },

        {
          prop: "commentPublishTime",
          label: "发布时间",

          sortable: true,
          callback: (row) => {
            console.log(row);
          },
        },
        {
          prop: "auditTime",
          label: "审核时间",

          sortable: true,
          callback: (row) => {
            console.log(row);
          },
        },
        {
          prop: "auditStatus",
          label: "评论状态",

          type: "html",
          html: (row) => {
            const auditStatus =
              row.auditStatus == false ? "审核拒绝" : "审核通过";
            const className = row.auditStatus == false ? "notstatus" : "status";
            return `<span class="${className}">${auditStatus}</span>`;
          },
        },
      ],
      tablePage: {
        total: 1,
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

  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getMyPlTabData(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
