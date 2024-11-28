<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <div class="flex-container">
      <span>渠道商账号: {{ $route.query.distrMobile }}</span>
      <span>渠道商昵称: {{ $route.query.distrName }}</span>
      <span>渠道商等级: {{ $route.query.level }}</span>
      <span>渠道商身份: {{ standingType }}</span>
      <span>账号状态: {{ accountStatus }}</span>
    </div>
    <div style="color: red; margin-bottom: 10px">数据每小时更新一次</div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
      :lazy="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import { distrStatisticsDay } from "@/api/admin/index";
import {
  optionChannelStatus,
  optWebmasterType,
  resetSearchData,
} from "@/util/util";
import moment from "moment";
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime = endMomentDate.format("YYYY-MM-DD HH:mm:ss");

export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      passwordRow: {},
      loading: false,
      searchForm: [
        {
          label: "选择时间",
          type: "daterange",
          prop: "dateTime",
          labelWidth: "70px",
          clearable: false,
        },
      ],
      searchData: {
        dateTime: [startDateTime, endDateTime],
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
            this.searchData.dateTime = [startDateTime, endDateTime];
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
          label: "数据日期",
          type: "html",
          html: (row) => {
            const date = row.date.split(" ")[0];
            return `<span>${date}</span>`;
          },
        },
        {
          prop: "newUserCount",
          label: "新增用户数",
        },
        {
          prop: "totalAmount",
          label: "充值总金额",
        },
        {
          prop: "amountForRecharge",
          label: "充值金币金额",
        },
        {
          prop: "amountForSvip",
          label: "充值vip金额",
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
  computed: {
    standingType() {
      return optWebmasterType.find(
        (item) => item.id === this.$route.query.channelType
      )?.name;
    },
    accountStatus() {
      return optionChannelStatus.find(
        (item) => item.id === this.$route.query.status
      )?.label;
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
        distrId: this.$route.query.distrId,
        channelType: this.$route.query.channelType,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length > 0) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      distrStatisticsDay(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  gap: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
