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
import { userOrderDetails } from "@/api/userList";
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
          type: "input",
          prop: "orderNum",
          placeholder: "请输入订单号",
          clearable: true,
        },

        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        orderNum: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "orderNum",
          label: "订单号",
        },
        {
          prop: "orderName",
          label: "商品名称",
        },
        {
          prop: "payTime",
          label: "交易时间",
        },
        {
          prop: "payStatus",
          label: "交易结果",

          type: "html",
          html: (row) => {
            const className = row.payStatus != "COMPLETE" ? "must" : "";
            return `<span class=${className}>${
              row.payStatus == "COMPLETE" ? "交易成功" : "交易失败"
            }</span>`;
          },
        },
        {
          prop: "amount",
          label: "交易金额",

          type: "html",
          html: (row) => {
            return `<span>${row.amount / 100}</span>`;
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
    getList(time) {
      const params = {
        userId: this.$route.query.id,
        orderNum: this.searchData.orderNum,
        startTime: time?.startTime,
        endTime: time?.endTime,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      userOrderDetails(params)
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
      this.searchData.orderNum = "";
      this.searchData.dateTime = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss">
.refund {
  cursor: pointer;
  color: #409eff;
  font-weight: bold;
}
</style>
