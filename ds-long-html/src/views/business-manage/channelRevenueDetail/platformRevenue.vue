<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      :labelWidth="100"
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
      <template v-slot:footer>
        <div class="coutNum">
          <div>总计</div>
          <div>
            <span style="margin-right: 20px"
              >订单金额: {{ statistics.totalAmount || 0 }}</span
            >
            <span
              >平台收益: {{ statistics.totalDistrBrokerageMoney || 0 }}</span
            >
          </div>
        </div>
      </template>
    </tableSearch>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { incomeDetailPlatform, platformTotal } from "@/api/admin/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { optionConsumeType, createParams } from "@/util/util";

export default {
  components: {
    pagination,
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      statistics: {},
      searchForm: [
        {
          type: "input",
          prop: "orderNum",
          placeholder: "请输入订单号",
          clearable: true,
        },
        {
          type: "select",
          prop: "type",
          clearable: true,
          placeholder: "请选择订单类型",
          options: optionConsumeType,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        orderNum: "",
        type: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "projectName",
          label: "项目",
        },
        {
          prop: "orderNum",
          label: "充值订单",
        },
        {
          label: "订单金额",
          type: "html",
          html: (row) => {
            return `<span>${row.amount} $</span>`;
          },
        },
        {
          label: "订单类型",
          type: "filter",
          filter: (row) => {
            const item = optionConsumeType.find((v) => v.id == row.type);
            return item?.name;
          },
        },
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "userNickname",
          label: "用户昵称",
        },
        {
          prop: "distrBrokerageMoney",
          label: "平台收益",
          type: "html",
          html: (row) => {
            return `<span>${row.distrBrokerageMoney} $</span>`;
          },
        },
        {
          prop: "payTime",
          label: "订单支付时间",
        },
        {
          prop: "createTime",
          label: "收益产生时间",
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
    this.getSum();
  },

  methods: {
    getList() {
      let payTimeStart = "";
      let payTimeEnd = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        payTimeStart = this.searchData.dateTime[0];
        payTimeEnd = this.searchData.dateTime[1];
      }
      const data = createParams({
        ...this.searchData,
        payTimeStart,
        payTimeEnd,
      });
      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      incomeDetailPlatform(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getSum() {
      platformTotal().then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.statistics = data.data || {};
        }
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
      this.getSum();
    },
    reset() {
      this.searchData.orderNum = "";
      this.searchData.type = "";
      this.searchData.dateTime = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
      this.getSum();
    },
  },
};
</script>
<style lang="scss" scoped>
.coutNum {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-weight: bold;
  border: 1px solid #ebeef5;
  border-top: 0px;
}
</style>
