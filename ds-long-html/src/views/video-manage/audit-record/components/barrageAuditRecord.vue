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
import {
  ENUM_COMMENTS_STATUS,
  commentsStatus,
  filterNullSearchData,
} from "@/util/util";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { getDmTabData } from "@/api/video-manage/audit-record.js";
import { resetSearchData } from "@/util/util";

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
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "input",
          prop: "auditName",
          placeholder: "请输入审核用户名",
          clearable: true,
          labelWidth: "120",
        },
      ],
      searchData: {
        videoTitle: "",
        auditName: "",
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
          prop: "content",
          label: "弹幕内容",
        },
        {
          prop: "auditName",
          label: "审核用户名",
        },
        {
          prop: "videoTitle",
          label: "视频标题",
        },

        {
          prop: "createTime",
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
          prop: "status",
          label: "弹幕状态",

          type: "html",
          html: (row) => {
            const status = commentsStatus.find(
              (item) => item.id === row.status
            );
            const className =
              row.status == ENUM_COMMENTS_STATUS.pass
                ? "status"
                : row.status == ENUM_COMMENTS_STATUS.reject
                ? "notstatus"
                : "";
            return `<span class="${className}">${status.name}</span>`;
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
        orderType: 2,
      };
      this.loading = true;
      getDmTabData(params).then((res) => {
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
