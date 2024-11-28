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
      :isSelection="false"
      :isIndex="true"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import {
  createParams,
  downloadExcel,
  optionChannelStatus,
  optionSettlementMethod,
  EnumChannelStatus,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import {
  queryProjectPage,
  projectOperate,
  projectExport,
} from "@/api/admin/index";
import distributorDetailsEdit from "@/views/distributor-manage/distributorlist/distributorDetails/distributorDetailsEdit.vue";
export default {
  components: {
    tableSearch,
    search,
    distributorDetailsEdit,
  },
  data() {
    return {
      distrId: "",
      visible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "agentMobile",
          placeholder: "proxy_account",
          clearable: true,
        },
        {
          type: "input",
          prop: "agentName",
          placeholder: "agent_name",
          clearable: true,
        },
        {
          type: "input",
          prop: "projectName",
          placeholder: "project_name",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "status",
          options: optionChannelStatus,
          clearable: true,
        },
      ],
      searchData: {
        projectName: "",
        status: "",
        agentMobile: "",
        agentName: "",
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
              distrId: this.distrId,
            };
            projectExport(params).then((res) => {
              if (res.status == 200) {
                downloadExcel(res.data, `${this.$t("agent_details")}`);
              }
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "agentMobile",
          label: "proxy_account",
        },
        {
          prop: "agentName",
          label: "agent_name",
        },
        {
          prop: "projectName",
          label: "project_name",
        },
        {
          prop: "appSystemName",
          label: "system",
        },
        {
          prop: "clearingSchemeType",
          label: "settlement_plan",
        },
        {
          prop: "appVersion",
          label: "version",
        },
        {
          prop: "statusStr",
          label: "status",

          type: "html",
          html: (row) => {
            const item =
              optionChannelStatus.find((item) => item.id === row.status) || {};
            const className =
              item.id == EnumChannelStatus.disabled ? "must" : "";
            return `<span class="${className}">${item.name}</span>`;
          },
        },
        {
          label: "settlement_method",
          type: "html",
          html: (row) => {
            const item =
              optionSettlementMethod.find(
                (v) => v.id == row.clearingPeriodType
              ) || {};
            return item.name;
          },
        },
        {
          prop: "createTime",
          label: "add_time",
        },
        {
          label: "operate",
          type: "html",
          width: "150",
          html: (row) => {
            const search = `<span class='link comBtn' data-tagName="search">${this.$t(
              "check"
            )}</span>`;
            let enable = `<span class='link comBtn' data-tagName="enable">${this.$t(
              "enable"
            )}</span>`;
            let disabled = `<span class='danger comBtn' data-tagName="disabled">${this.$t(
              "disable"
            )}</span>`;
            if (row.status == EnumChannelStatus.disabled) {
              return search + enable;
            } else if (row.status == EnumChannelStatus.normal) {
              return search + disabled;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            const operations = {
              enable: {
                confirmMessage: `${this.$t("confirm_enable")}`,
                successMessage: `${this.$t("success_enabled")}`,
              },
              disabled: {
                confirmMessage: `${this.$t("confirm_disable")}`,
                successMessage: `${this.$t("success_disable")}`,
              },
            };

            const operation = operations[tagname];
            if (operation) {
              const { confirmMessage, successMessage } = operation;

              this.$confirm(confirmMessage, `${this.$t("prompt")}`, {
                confirmButtonText: `${this.$t("determine")}`,
                cancelButtonText: `${this.$t("cancel")}`,
                type: "warning",
              })
                .then(() => {
                  projectOperate(row.id).then((res) => {
                    const { data } = res;
                    if (data.code === 200) {
                      this.$message.success(successMessage);
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            }

            if (tagname === "search") {
              this.$router.push({
                path: "/distributor-manage/distributorlist/distributorUserList/index",
                query: { row },
              });
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
    };
  },
  mounted() {
    this.distrId = this.$route.query.distrId;
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams(this.searchData);
      const params = {
        ...data,
        distrId: this.distrId,
        current: this.tablePage.current,
        size: this.tablePage.size,
        channelPackageId: this.$route.query.row.id,
      };
      this.loading = true;
      queryProjectPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
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
