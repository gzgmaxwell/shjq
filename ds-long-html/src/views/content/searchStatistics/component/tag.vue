<template>
  <div>
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
      :isIndex="false"
    >
    </tableSearch>
  </div>
</template>

<script>
import { filterNullSearchData, resetSearchData } from "@/util/util";
import { getClassifyCountList } from "@/api/admin/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";

export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "classifyName",
          placeholder: "请输入文本内容",
          clearable: true,
        },
        {
          label: "搜索量",
          labelWidth: "80",
          type: "input",
          prop: "startSearchCount",
          placeholder: "起始搜索量",
          clearable: true,
        },
        {
          type: "input",
          prop: "endSearchCount",
          placeholder: "截止搜索量",
          clearable: true,
        },
        {
          label: "点击量",
          labelWidth: "80",
          type: "input",
          prop: "startClickCount",
          placeholder: "起始搜索量",
          clearable: true,
        },
        {
          type: "input",
          prop: "endClickCount",
          placeholder: "截止搜索量",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        classifyName: "",
        startSearchCount: "",
        endSearchCount: "",
        startClickCount: "",
        endClickCount: "",
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
          label: "标签名称",
          prop: "classifyName",
        },
        {
          prop: "searchCount",
          label: "搜索量",
        },
        {
          prop: "clickCount",
          label: "点击量",
        },
        {
          prop: "lastSearchTime",
          label: "最近一次搜索时间",
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
        ...filterNullSearchData({
          ...this.searchData,
        }),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startLastSearchTime = this.searchData.dateTime[0];
        params.endLastSearchTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      getClassifyCountList(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data?.data?.records;
            this.tablePage.total = data?.data?.total - 0;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
