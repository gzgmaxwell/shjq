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
      :title="title"
      :visible.sync="auditVisible"
      width="40%"
      center
      :close-on-click-modal="false"
    >
      <auditEdit :auditRow="auditRow" v-if="auditVisible"></auditEdit>
    </el-dialog>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import {
  platformCUserList,
  platformCUserListExport,
  audit,
  handle,
} from "@/api/admin/index";
import auditEdit from "@/views/withdraw/fission-withdraw/auditEdit.vue";
import {
  createParams,
  downloadExcel,
  optionWithdrawStatus,
  optionPayTypeWay,
  EnumWithdrawStatus,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    auditEdit,
  },
  data() {
    return {
      title: "",
      auditVisible: false,
      row: {},
      auditRow: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "userName",
          placeholder: "user_account",
          clearable: true,
        },
        {
          type: "input",
          prop: "realName",
          placeholder: "user_nickname",
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
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        userName: "",
        realName: "",
        status: "",
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
              extensionUserType: "C_END_USER",
            };
            platformCUserListExport(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, this.$t("fission_withdrawal_list"));
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "realName",
          label: "user_nickname",
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
          prop: "userName",
          label: "user_account",
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
          prop: "createTime",
          label: "application_time",
        },
        {
          prop: "updateTime",
          label: "audit_time",
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
              this.title = this.$t("examine");
              this.auditVisible = true;
              this.auditRow = {
                successStatus: this.$t("pass"),
                errorStatus: this.$t("reject"),
                callback: (data) => {
                  const { content, reason } = data || {};
                  if (data) {
                    let params = { id: row.id };
                    let message = "";
                    if (reason == true) {
                      message = this.$t("by_success");
                      params.isPass = true;
                    } else {
                      message = this.$t("reject_success");
                      params = {
                        ...params,
                        isPass: false,
                        description: content,
                      };
                    }
                    audit(params).then((res) => {
                      if (res.data.code === 200) {
                        this.$message.success(message);
                        this.getList();
                        this.auditVisible = false;
                      }
                    });
                  } else {
                    this.auditVisible = false;
                  }
                },
              };
            } else if (tagname === "handle") {
              this.title = this.$t("handle");
              this.auditVisible = true;
              this.auditRow = {
                successStatus: this.$t("withdrawal_success"),
                errorStatus: this.$t("withdrawal_failed"),
                callback: (data) => {
                  const { content, reason } = data || {};
                  if (data) {
                    const params = {
                      id: row.id,
                      isSuccess: reason,
                      failReason: content,
                    };
                    handle(params).then((res) => {
                      const { data } = res;
                      if (data.code === 200) {
                        this.getList();
                        this.$message.success(this.$t("successfully_edited"));
                        this.auditVisible = false;
                      }
                    });
                  } else {
                    this.auditVisible = false;
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
        extensionUserType: "C_END_USER",
      };
      this.loading = true;
      platformCUserList(params)
        .then((res) => {
          const { data } = res;
          if (data.code === 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
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
