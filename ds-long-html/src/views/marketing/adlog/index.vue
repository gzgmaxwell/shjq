<template>
  <basic-container>
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
      :operation="operation"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { trackingCountAdDayData } from "@/api/marketing/index";
import { seat } from "@/api/content/advertising";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { optionComStatus } from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      searchForm: [
        {
          label: "广告位名称:",
          type: "select",
          prop: "locationId",
          placeholder: "请选择",
          options: [],
          clearable: true,
        },
        {
          label: "广告标题:",
          type: "input",
          prop: "adTitle",
          placeholder: "请输入视频名称",
          clearable: true,
        },
        {
          label: "时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        locationId: "",
        adTitle: "",
        status: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", type: "primary", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "advertLocationName",
          label: "广告位名称",
        },
        {
          prop: "adTitle",
          label: "广告标题",
          showOverflowTooltip: true,
          filter: (row) => {
            return row.adTitle;
          },
        },
        {
          prop: "clickCount",
          label: "点击次数",
        },
        {
          prop: "expCount",
          label: "曝光次数",
        },
        {
          prop: "accusationCount",
          label: "投诉次数",
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item = optionComStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
      ],
      operation: {
        label: "操作", // 列名
        width: "250", // 根据实际情况给宽度
        btnList: [
          {
            label: "详情",
            type: "text",
            callback: (row) => {
              this.$router.push({
                path: "/marketing/adlog/details",
                query: row,
              });
            },
          },
        ],
      },

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
    this.adLocation();
    this.getList();
  },

  methods: {
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
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      trackingCountAdDayData(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    adLocation() {
      seat().then((res) => {
        const { data } = res;
        data.data.forEach((v) => {
          v.name = v.advertLocationName;
        });
        this.searchForm.forEach((v) => {
          if (v.prop == "locationId") {
            v.options = data.data;
          }
        });
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.dateTime = [];
      this.searchData.locationId = "";
      this.searchData.adTitle = "";
      this.searchData.status = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
