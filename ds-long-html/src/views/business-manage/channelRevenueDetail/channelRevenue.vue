<template>
  <div>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      :labelWidth="100"
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
    </tableSearch>
  </div>
</template>

<script>
import { incomeDetailChannel } from "@/api/admin/index";
import pagination from "@/components/bas-pagination/index";
import { orderStatistics, orderPage } from "@/api/business-manage/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  optionPayType,
  optionConsumeType,
  optionPayStatus,
  createParams,
} from "@/util/util";

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
      that: this,
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
          placeholder: "请选择订单类型",
          options: optionConsumeType,
          clearable: true,
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
          prop: "distrName",
          label: "渠道商",
        },
        {
          prop: "level",
          label: "渠道等级",
        },
        {
          label: "渠道佣金",
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
      incomeDetailChannel(params)
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
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.orderNum = "";
      this.searchData.type = "";
      this.searchData.dateTime = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
