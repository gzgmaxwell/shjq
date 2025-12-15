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
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import { userVipInfo, filterNullSearchData } from "@/util/util";
import pagination from "@/components/bas-pagination/index";
import {
  userVipVipUserPage,
  userVipListVaild,
} from "@/api/business-manage/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table";
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
          type: "input",
          prop: "nickName",
          placeholder: "nick_name",
          clearable: true,
        },
        {
          type: "input",
          prop: "mobile",
          placeholder: "phone",
          clearable: true,
        },
        {
          label: "支付时间",
          type: "datetimerange",
          prop: "dateTime",
          valueFormat: "timestamp",
        },
        {
          label: "到期天数",
          type: "input",
          prop: "vipDayLowerLimit",
          placeholder: "起始剩余天数",
          clearable: true,
        },
        {
          type: "input",
          prop: "vipDayUpperLimit",
          placeholder: "结束剩余天数",
          clearable: true,
        },
      ],
      searchData: {
        nickName: "",
        mobile: "",
        vipDayLowerLimit: "",
        vipDayUpperLimit: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", type: "primary", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "nickName",
          label: "nick_name",
        },
        {
          prop: "mobile",
          label: "phone",
        },
        {
          label: "membership_type",
          type: "filter",
          filter: (row) => {
            const item = userVipInfo.find((v) => v.id === row.type);
            return item?.name;
          },
        },
        {
          prop: "payTime",
          label: "pay_time",
        },
        {
          prop: "downloadCount",
          label: "residual_interest",
          type: "filter",
          filter: (row) => {
            return `${row.downloadCount}`;
          },
        },
        {
          prop: "vipDays",
          label: "会员剩余天数",
        },
        {
          prop: "expireTime",
          label: "expire_time",
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
    this.getOption();
  },

  methods: {
    getOption() {
      userVipListVaild().then((res) => {
        const { data } = res;
        this.searchForm.forEach((v) => {
          if (v.prop === "goodName") {
            v.options = data.data;
          }
        });
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (params.dateTime && params.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
        delete params.dateTime;
      }
      this.loading = true;
      userVipVipUserPage(params)
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
      this.searchData.nickName = "";
      this.searchData.mobile = "";
      this.searchData.vipDayLowerLimit = "";
      this.searchData.vipDayUpperLimit = "";
      this.searchData.dateTime = [];
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
