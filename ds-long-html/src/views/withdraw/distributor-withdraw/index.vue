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
      :title="$t('processing_results')"
      :visible.sync="visible"
      width="40%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <handleDialog :handleRow="handleRow"></handleDialog>
    </el-dialog>
    <el-dialog
      :title="$t('examine')"
      :visible.sync="auditVisible"
      width="40%"
      v-if="auditVisible"
      center
      :close-on-click-modal="false"
    >
      <failToPass
        :auditRow="auditRow"
        :withdrawData="withdrawData"
      ></failToPass>
    </el-dialog>
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
  EnumWithdrawStatus,
  optionSettlementMethod,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import {
  platformList,
  platformExportExcel,
  audit,
  handle,
} from "@/api/admin/index";
import handleDialog from "@/views/withdraw/handleDialog.vue";
import failToPass from "@/views/withdraw/failToPass.vue";
import proofPicture from "@/views/withdraw/proofPicture.vue";
export default {
  components: {
    tableSearch,
    search,
    handleDialog,
    failToPass,
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
          placeholder: "order_number",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
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
              extensionUserType: "DISTRIBUTOR",
            };
            platformExportExcel(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(
                  res.data,
                  `${this.$t("channel_withdrawal_list")}`
                );
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "userName",
          label: "channel_merchant_account",
        },
        {
          prop: "collectionAccountName",
          label: "channel_merchant_name",
        },
        {
          prop: "level",
          label: "渠道等级",
        },
        {
          prop: "withdrawType",
          label: "withdrawal_method",
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
          label: "order_number",
        },
        {
          prop: "createTime",
          label: "application_time",
        },
        {
          prop: "clearingPeriodType",
          label: "settlement_method",
          type: "html",
          html: (row) => {
            const item =
              optionSettlementMethod.find(
                (v) => v.id === row.clearingPeriodType
              ) || {};
            return item.name;
          },
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
          prop: "description",
          label: "reason",
          type: "html",
          html: (row) => {
            return `<span class='must'>${
              row.description ? row.description : ""
            }</span>`;
          },
        },
        {
          label: "voucher",
          type: "html",
          html: (row) => {
            if (row.fullUrl) {
              return `<span class='arrangetwo btnClick' data-tagName="search">查看</span>`;
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
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            const audit = `<span class='link comBtn' data-tagName="audit">${this.$t(
              "examine"
            )}</span>`;
            const handle = `<span class='link comBtn' data-tagName="handle">${this.$t(
              "handle"
            )}</span>`;
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
                ...row,
                callback: (data) => {
                  const { isPass, description } = data || {};
                  if (data) {
                    let params = { id: row.id };
                    let message = "";
                    if (isPass == true) {
                      message = this.$t("by_success");
                      params.isPass = true;
                    } else {
                      message = this.$t("fail_to_succeed");
                      params = {
                        ...params,
                        isPass: false,
                        description: description,
                      };
                    }
                    audit(params).then((res) => {
                      if (res.data.code == 200) {
                        this.$message.success(message);
                        this.auditVisible = false;
                        this.getList();
                      }
                    });
                  } else {
                    this.auditVisible = false;
                  }
                },
              };
            } else if (tagname === "handle") {
              this.visible = true;
              this.handleRow = {
                ...row,
                callback: (data) => {
                  const {
                    isSuccess,
                    failReason,
                    certificateUrl,
                    certificateBucket,
                  } = data || {};
                  if (data) {
                    const params = {
                      id: row.id,
                      isSuccess,
                      failReason,
                      certificateUrl,
                      certificateBucket,
                    };
                    handle(params).then((res) => {
                      if (res.data.code == 200) {
                        this.$message.success(this.$t("successfully_edited"));
                        this.visible = false;
                        this.getList();
                      }
                    });
                  } else {
                    this.visible = false;
                  }
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
  computed: {
    withdrawData() {
      return {
        settlement: this.$t("Channel_settlement"),
        account: this.$t("channel_merchant_account"),
        name: this.$t("channel_merchant_name"),
      };
    },
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
        extensionUserType: "DISTRIBUTOR",
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
<style lang="scss">
.btnClick {
  cursor: pointer;
}
</style>
