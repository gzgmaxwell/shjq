<template>
  <div class="mt20">
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
      :isIndex="true"
    >
      <div style="margin-bottom: 10px">
        钱包余额 {{ goldTotal.wallet || 0 }} 金币 累计使用
        {{ goldTotal.usingAmount || 0 }} 金币 累计收入
        {{ goldTotal.receivingAmount || 0 }} 金币 退款
        {{ goldTotal.refundAmount || 0 }} 金币
      </div>
    </tableSearch>
  </div>
</template>

<script>
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
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", type: "primary", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "consumeTypeStr",
          label: "商品",

          callback: (row) => {
            console.log(row);
          },
        },
        {
          prop: "amount",
          label: "交易金额",
        },
        {
          prop: "wallet",
          label: "交易后余额",
        },

        {
          prop: "payTime",
          label: "交易时间",
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
    getList(time) {
      let params = {
        userId: this.$route.query.userId,
        current: this.tablePage.current,
        size: this.tablePage.size,
        startTime: time?.startTime,
        endTime: time?.endTime,
      };
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
    search() {
      this.tablePage.current = 1;
      let startTime = "";
      let endTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        startTime = new Date(this.searchData.dateTime[0]).getTime();
        endTime = new Date(this.searchData.dateTime[1]).getTime();
      }
      let time = {};
      if (startTime && endTime) {
        time = { startTime, endTime };
      }
      this.getList(time);
    },
    reset() {
      this.searchData.dateTime = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
