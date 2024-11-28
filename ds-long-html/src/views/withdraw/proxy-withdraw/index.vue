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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      :title="$t('view_credentials')"
      :visible.sync="pictureVisible"
      width="40%"
      v-if="pictureVisible"
      center
      :close-on-click-modal="false"
    >
      <proofPicture :pictureUrl="pictureUrl"></proofPicture>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  createParams,
  downloadExcel,
  optionWithdrawStatus,
  optionPayTypeWay,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { platformList, platformExportExcel } from "@/api/admin/index";
import proofPicture from "@/views/withdraw/proofPicture.vue";
export default {
  components: {
    tableSearch,
    search,
    proofPicture,
  },
  data() {
    return {
      pictureVisible: false,
      pictureUrl: "",
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "userName",
          placeholder: "proxy_account",
          clearable: true,
        },
        {
          type: "input",
          prop: "realName",
          placeholder: "agent_name",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "schedule",
          clearable: true,
          options: optionWithdrawStatus.filter(
            (v) => v.id !== EnumWithdrawStatus.reject
          ),
        },
        {
          type: "input",
          prop: "withdrawOrderId",
          placeholder: "order_num",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        userName: "",
        realName: "",
        status: "",
        withdrawOrderId: "",
        dateTime: [],
      },
      searchHandle: [
        { label: "search", type: "primary", callback: this.search },
        { label: "reset", callback: this.reset },
        {
          label: "export",
          type: "success",
          callback: () => {
            const data = createParams(this.searchData);
            const params = {
              ...data,
              current: this.tablePage.current,
              size: this.tablePage.size,
              extensionUserType: "AGENT",
            };
            platformExportExcel(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, this.$t("proxy_withdrawal_list"));
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "userName",
          label: "proxy_account",
        },
        {
          prop: "realName",
          label: "agent_name",
        },
        {
          prop: "withdrawType",
          label: "withdrawal_path",
          type: "filter",
          filter: (row) => {
            const item =
              optionPayTypeWay.find((v) => v.id === row.withdrawType) || {};
            return item.name;
          },
        },
        {
          prop: "collectionAccount",
          label: "collection_account",
        },
        {
          prop: "withdrawMoney",
          label: "withdrawal_amount",
        },
        {
          prop: "withdrawOrderId",
          label: "order_num",
        },
        {
          prop: "createTime",
          label: "application_time",
        },
        {
          prop: "status",
          label: "schedule",
          type: "filter",
          filter: (row) => {
            const item =
              optionWithdrawStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "voucher",
          type: "html",
          html: (row) => {
            if (row.fullUrl) {
              return `<span class='comBtn link' data-tagName="search">查看</span>`;
            } else {
              return "";
            }
          },
          callback: (row, index, e) => {
            this.pictureVisible = true;
            this.pictureUrl = row.fullUrl;
          },
        },
        {
          prop: "description",
          label: "reason",
          type: "html",
          html: (row) => {
            return `<span class='must'>${
              row.description ? row.description : ""
            }</span>`;
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
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      let startTime = "";
      let endTime = "";
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        startTime = this.searchData.dateTime[0];
        endTime = this.searchData.dateTime[1];
      }
      const data = createParams({ ...this.searchData, startTime, endTime });
      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
        extensionUserType: "AGENT",
      };
      this.loading = true;
      platformList(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData = {};
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
