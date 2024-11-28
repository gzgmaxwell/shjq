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
      <div style="margin-bottom: 10px; font-weight: bold">
        积分余额 {{ pointsTotal.integralNum || 0 }} 积分; 累计使用
        {{ pointsTotal.integralUseNum || 0 }} 积分; 累计收入
        {{ pointsTotal.integralGetNum || 0 }} 积分
      </div>
    </tableSearch>
  </div>
</template>

<script>
import {
  filterNullSearchData,
  optionpoints,
  resetSearchData,
  optionPointsType,
} from "@/util/util";
import { recordPage, recordSta } from "@/api/userList";
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
      pointsTotal: {},
      searchForm: [
        {
          type: "select",
          prop: "businessType",
          placeholder: "查询来源",
          options: optionpoints,
        },
        {
          type: "select",
          prop: "modifyType",
          placeholder: "查询类型",
          options: optionPointsType,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        businessType: "",
        modifyType: "",
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
          label: "来源",
          type: "filter",
          filter: (row) => {
            const item = optionpoints.find(
              (item) => item.id === row.businessType
            );
            return item ? item.name : "";
          },
        },
        {
          label: "类型",
          type: "filter",
          filter: (row) => {
            const item = optionPointsType.find(
              (item) => item.id === row.modifyType
            );
            return item ? item.name : "";
          },
        },
        {
          prop: "modifyNum",
          label: "明细",
        },
        {
          prop: "remainNum",
          label: "余额",
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
    this.getPointsTotal();
  },

  methods: {
    getList() {
      let params = {
        ...filterNullSearchData(this.searchData),
        userId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      recordPage(params)
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
    getPointsTotal() {
      recordSta({ userId: this.$route.query.id }).then((res) => {
        const { data } = res;
        if (data.code == 200 && data.data) {
          this.pointsTotal = data.data;
        }
      });
    },
  },
};
</script>
