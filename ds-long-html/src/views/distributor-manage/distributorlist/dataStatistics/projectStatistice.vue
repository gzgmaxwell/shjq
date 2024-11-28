<template>
  <basic-container>
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
      :operation="operation"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import moment from "moment";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import editPassword from "@/views/distributor-manage/distributorlist/editPassword.vue";
import { agentQueryPage } from "@/api/admin/index";
import { optionTimeType, filterNullSearchData, Enum_Time } from "@/util/util";
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime = endMomentDate.format("YYYY-MM-DD HH:mm:ss");
export default {
  components: {
    tableSearch,
    search,
    editPassword,
  },
  data() {
    return {
      visible: false,
      passwordVisible: false,
      row: {},
      passwordRow: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "select",
          styleWidth: "120",
          prop: "timeType",
          placeholder: "渠道商类型",
          options: optionTimeType,
          change: (that, value) => {
            if (value) {
              this.getList();
            }
          },
        },
      ],
      searchData: {
        timeType: Enum_Time.LAST_7_DAYS,
      },
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "countDateStr",
          label: "日期",
        },
        {
          prop: "userActivateCount",
          label: "激活",
        },
        {
          prop: "newUserCount",
          label: "新账号",
        },
        {
          prop: "newUserBindMbCount",
          label: "新绑定账号",
        },
        {
          prop: "userActiveCount",
          label: "活跃账号",
        },
        {
          prop: "newPayUserCount",
          label: "新账号付费数",
        },
        {
          prop: "newUserPayOrderCount",
          label: "新账号付费笔数",
        },
        {
          prop: "newUserPayMoneyCount",
          label: "新账号付费总额",
        },
        {
          prop: "newUserPayRate",
          label: "新账号付费率",
        },
        {
          prop: "payUserCount",
          label: "账号付费数",
        },
        {
          prop: "totalPayRate",
          label: "总付费率",
        },
        {
          prop: "totalPayMoney",
          label: "总付费额",
        },
      ],
      operation: {},
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
      const params = {
        ...filterNullSearchData(this.searchData),
        currentDateTimeStart: startDateTime,
        currentDateTimeEnd: endDateTime,
        chanelTagId: this.$route.query.chanelTagId,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      agentQueryPage(params)
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
  },
};
</script>
