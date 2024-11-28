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
      <div class="pb10" style="font-weight: bold" v-if="compshopOrder()">
        当前查询结果: 充值金额 {{ statistics.totalIncome || 0 }}
        {{ $t("currency") }}
      </div>
      <!-- <div class="pb10">
        {{ $t("total_income") }}: {{ statistics.totalIncome || 0 }}
        {{ $t("currency") }}， {{ $t("month_income") }}:
        {{ statistics.monthIncome || 0 }} {{ $t("currency") }}，
        {{ $t("day_income") }}: {{ statistics.dayIncome || 0 }}
        {{ $t("currency") }} {{ $t("refund_amount") }}:
        {{ statistics.refundAmount || 0 }} {{ $t("currency") }}
      </div> -->
    </tableSearch>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { orderStatistics, orderPage } from "@/api/business-manage/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  optionConsumeType,
  optionPayStatus,
  resetSearchData,
  optionPayTypeMore,
  filterNullSearchData,
  ENUM_SHOPORDER,
} from "@/util/util";

export default {
  props: {
    shopOrder: {
      type: String,
      default: "",
      required: true,
    },
  },
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
      // 代码测试
      searchForm: [
        {
          type: "input",
          prop: "nickname",
          placeholder: "nick_name",
          clearable: true,
          labelWidth: "50",
        },
        {
          type: "input",
          prop: "mobile",
          placeholder: "phone",
          clearable: true,
        },
        {
          type: "input",
          prop: "orderNum",
          placeholder: "order_num",
          clearable: true,
        },
        // {
        //   type: "select",
        //   prop: "consumeType",
        //   options: optionConsumeType,
        //   placeholder: "consume_type",
        //   clearable: true,
        // },
        {
          type: "select",
          prop: "payType",
          options: optionPayTypeMore,
          placeholder: "pay_way",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
          labelWidth: "50",
        },
      ],
      searchData: {
        nickname: "",
        mobile: "",
        orderNum: "",
        // consumeType: "",
        payType: "",
        dateTime: [],
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
            this.getSum();
          },
        },
        {
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
            this.getSum();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "nickname",
          label: "nick_name",
        },
        {
          prop: "mobile",
          label: "phone",
        },
        {
          prop: "tenantName",
          label: "来源",
        },
        {
          prop: "orderNum",
          label: "order_num",
        },
        {
          prop: "amount",
          label: "amount",
          type: "filter",
          filter: (row) => {
            if (row.amount) {
              return Number(row.amount / 100).toFixed(2);
            } else {
              return;
            }
          },
        },
        {
          prop: "orderName",
          label: "goods_name",
        },
        {
          label: "pay_way",
          type: "filter",
          filter: (row) => {
            const item = optionPayTypeMore.find((v) => v.id == row.payType);
            return item.name ? item.name : "";
          },
        },
        {
          prop: "payTime",
          label: "pay_time",
        },
        {
          label: "status",
          type: "filter",
          filter: (row) => {
            const item = optionPayStatus.find((v) => v.id == row.payStatus);
            return item.name ? item.name : "";
          },
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
  computed: {
    compshopOrder() {
      return () => {
        return this.shopOrder != ENUM_SHOPORDER.CHARGE;
      };
    },
  },

  mounted() {
    this.getList();
    this.getSum();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        consumeType: this.shopOrder,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      orderPage(params)
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
      const params = {
        ...filterNullSearchData(this.searchData),
        consumeType: this.shopOrder,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      orderStatistics(params).then((res) => {
        this.statistics = res.data.data;
      });
    },
  },
};
</script>
