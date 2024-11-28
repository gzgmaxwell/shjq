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
      title="处理"
      :visible.sync="visible"
      width="30%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <chargingHandl :handleRow="handleRow"></chargingHandl>
    </el-dialog>
    <el-dialog
      :title="$t('examine')"
      :visible.sync="auditVisible"
      width="30%"
      v-if="auditVisible"
      center
      :close-on-click-modal="false"
    >
      <chargingAudit :auditRow="auditRow"></chargingAudit>
    </el-dialog>
    <el-dialog
      :title="$t('view_credentials')"
      :visible.sync="pictureVisible"
      width="40%"
      v-if="pictureVisible"
      center
      :close-on-click-modal="false"
    >
      <div>
        <img width="100%" :src="pictureUrl" alt="" />
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  downloadExcel,
  optionWithdrawStatus,
  EnumWithdrawStatus,
  resetSearchData,
  filterNullSearchData,
  optionchargingPayTypeWay,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { withdrawExport, withdrawQueryPage } from "@/api/admin/index";
import chargingAudit from "@/views/withdraw/bloggerCharging/components/chargingAudit.vue";
import chargingHandl from "@/views/withdraw/bloggerCharging/components/chargingHandl.vue";
import proofPicture from "@/views/withdraw/proofPicture.vue";
export default {
  components: {
    tableSearch,
    search,
    chargingHandl,
    chargingAudit,
    proofPicture,
  },
  data() {
    return {
      visible: false,
      auditVisible: false,
      pictureVisible: false,
      auditRow: {},
      handleRow: {},
      pictureUrl: "",
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        // {
        //   type: "input",
        //   prop: "username",
        //   placeholder: "用户账号",
        //   clearable: true,
        // },
        {
          type: "input",
          prop: "nickname",
          placeholder: "用户昵称",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "schedule",
          // placeholder: "进度",
          clearable: true,
          options: optionWithdrawStatus,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        // username: "",
        nickname: "",
        status: "",
        dateTime: [],
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
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
          },
        },
        {
          label: "export",
          // label: "导出",
          type: "success",
          callback: () => {
            const params = {
              current: this.tablePage.current,
              size: this.tablePage.size,
            };
            withdrawExport(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, `全民代理提现表`);
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "nickname",
          label: "用户昵称",
        },
        {
          prop: "withdrawType",
          // label: "withdrawal_method",
          label: "提现方式",
          type: "filter",
          filter: (row) => {
            const item =
              optionchargingPayTypeWay.find((v) => v.id === row.withdrawType) ||
              {};
            return item.name;
          },
        },
        // {
        //   prop: "username",
        //   label: "用户账号",
        // },
        {
          prop: "collectionAccount",
          label: "collection_account",
          // label: "收款账号",
        },
        {
          prop: "withdrawMoney",
          label: "withdrawal_amount",
          // label: "提现金额",
        },
        {
          prop: "createTime",
          label: "application_time",
          // label: "申请时间",
        },
        {
          prop: "auditTime",
          label: "审核时间",
        },
        {
          prop: "status",
          label: "schedule",
          // label: "进度",
          type: "filter",
          filter: (row) => {
            const item =
              optionWithdrawStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          label: "reason",
          // label: "原因",
          type: "html",
          html: (row) => {
            return `<span class='must'>${row.reason ? row.reason : ""}</span>`;
          },
        },
        {
          label: "voucher",
          type: "html",
          html: (row) => {
            if (row.certificateUrl) {
              return `<span class='arrangetwo btnClick' data-tagName="search">查看</span>`;
            } else {
              return "";
            }
          },
          callback: (row, index, e) => {
            this.pictureVisible = true;
            this.pictureUrl = row.certificateUrl;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            // const audit = `<span class='link comBtn' data-tagName="audit">审核</span>`;
            const audit = `<span class='link comBtn' data-tagName="audit">${this.$t(
              "examine"
            )}</span>`;
            const handle = `<span class='link comBtn' data-tagName="handle">${this.$t(
              "handle"
            )}</span>`;
            // const handle = `<span class='link comBtn' data-tagName="handle">处理</span>`;
            if (row.status === EnumWithdrawStatus.pending) {
              return audit;
            } else if (row.status === EnumWithdrawStatus.withdrawing) {
              return handle;
            } else {
              return "";
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "audit") {
              this.auditVisible = true;
              this.auditRow = {
                id: row.id,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.auditVisible = false;
                },
              };
            } else if (tagname === "handle") {
              this.visible = true;
              this.handleRow = {
                id: row.id,
                certificateUrl: row.certificateUrl,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            }
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
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
        accountType: "DGP",
      };
      if (this.searchData.status && this.searchData.status.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      withdrawQueryPage(params)
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
  },
};
</script>
<style lang="scss">
.btnClick {
  cursor: pointer;
}
</style>
