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
        钱包余额 {{ goldTotal.wallet || 0 }} 金币 累计充值
        {{ goldTotal.rechargeAmount || 0 }} 金币 累计获取
        {{ goldTotal.receivingAmount || 0 }} 金币 累计使用
        {{ goldTotal.usingAmount || 0 }} 金币
      </div>
    </tableSearch>
  </div>
</template>

<script>
import {
  filterNullSearchData,
  optionGoldCoinType,
  resetSearchData,
  optionGoldCoin,
} from "@/util/util";
import { userGoldDetails, userGoldStatistics } from "@/api/userList";
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
      goldTotal: {},
      searchForm: [
        {
          type: "select",
          prop: "consumeType",
          placeholder: "查询来源",
          options: optionGoldCoin,
        },
        {
          type: "select",
          prop: "flowType",
          placeholder: "查询类型",
          options: optionGoldCoinType,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        consumeType: "",
        consume: "",
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
            const item = optionGoldCoin.find(
              (item) => item.id === row.consumeType
            );
            return item ? item.name : "";
          },
        },
        {
          prop: "consumeTypeStr",
          label: "类型",
          type: "filter",
          filter: (row) => {
            const item = optionGoldCoinType.find(
              (item) => item.id === row.flowType
            );
            return item ? item.name : "";
          },
        },
        {
          prop: "amount",
          label: "明细",
        },
        {
          prop: "wallet",
          label: "余额",
        },
        {
          prop: "payTime",
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
    this.getGoldStatistics();
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
        params.startTime = new Date(this.searchData.dateTime[0]).getTime();
        params.endTime = new Date(this.searchData.dateTime[1]).getTime();
      }
      this.loading = true;
      userGoldDetails(params)
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
    getGoldStatistics() {
      userGoldStatistics({ userId: this.$route.query.id }).then((res) => {
        const { data } = res;
        if (data.code == 200 && data.data) {
          this.goldTotal = data.data;
        }
      });
    },
  },
};
</script>
