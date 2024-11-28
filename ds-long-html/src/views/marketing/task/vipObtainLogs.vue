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
    </tableSearch>
  </div>
</template>

<script>
import {
  filterNullSearchData,
  resetSearchData,
  optionMovieCardSource,
  Enum_MovieCard,
} from "@/util/util";
import { svipLogsPage } from "@/api/userList";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      that: this,
      searchForm: [
        {
          type: "select",
          prop: "propsSource",
          placeholder: "查询来源",
          options: optionMovieCardSource,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        propsSource: "",
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
          label: "用户名",
          prop: "nickname",
          type: "html",
          html: (row) => {
            return `<span class="link">${row.nickname}</span>`;
          },
          callback: (row) => {
            this.$router.push({
              path: "/user/details/index",
              query: { id: row.userId },
            });
          },
        },
        {
          label: "手机号",
          prop: "mobile",
        },
        {
          label: "来源",
          type: "html",
          html: (row) => {
            const item = optionMovieCardSource.find(
              (item) => item.id === row.propsSource
            );
            return item ? `<span >${item.name}</span>` : "";
          },
        },
        {
          prop: "count",
          label: "数量",
        },
        {
          prop: "createTime",
          label: "时间",
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
      let params = {
        ...filterNullSearchData(this.searchData),
        // userId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      svipLogsPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data?.data?.records;
            this.tablePage.total = data?.data?.total || 0;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
