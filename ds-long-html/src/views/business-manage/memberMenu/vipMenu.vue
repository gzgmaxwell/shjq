<template>
  <div>
    <search
      :searchHandle="searchHandle"
      :searchForm="searchForm"
      :searchData="searchData"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :operation="{}"
      :tablePage="tablePage"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? $t('edit') : $t('add')"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="日志记录"
      :visible.sync="vipCoinVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <vipLogs v-if="vipCoinVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import vipLogs from "@/views/business-manage/memberMenu/vipLogs";
import pagination from "@/components/bas-pagination/index";
import { userVipPage, userVipDelete } from "@/api/business-manage/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "@/views/business-manage/memberMenu/create.vue";
import { optionSubscribe, optionStatus, optionsVipActive } from "@/util/util";
export default {
  props: {
    vipLevel: {
      type: String,
      default: "",
      required: true,
    },
  },
  components: {
    pagination,
    tableSearch,
    search,
    create,
    vipLogs,
  },
  data() {
    return {
      visible: false,
      vipCoinVisible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "select",
          prop: "activityStatus",
          options: optionsVipActive,
          placeholder: "status",
          clearable: true,
        },
        {
          type: "select",
          prop: "subscribeStatus",
          options: optionSubscribe,
          placeholder: "subscription_type",
          clearable: true,
        },
      ],
      searchData: {
        activityStatus: "",
        subscribeStatus: "",
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: this.search,
        },
        {
          label: "reset",
          callback: this.reset,
        },
        {
          label: "add",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              vipLevel: this.vipLevel,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
        {
          label: "日志记录",
          type: "primary",
          callback: () => {
            this.vipCoinVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.vipCoinVisible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "sort",
          label: "sort",
        },
        {
          label: "status",
          type: "filter",
          filter: (row) => {
            const item =
              optionsVipActive.find((v) => v.id === row.activityStatus) || {};
            return item.name;
          },
        },
        {
          width: "260",
          label: "购买次数活动日期",
          type: "html",
          html: (row) => {
            return `<span>${
              row.startTimeOfActivity
                ? `${row.startTimeOfActivity} ~ ${row.endTimeOfActivity}`
                : ""
            }</span>`;
          },
        },
        {
          label: "subscription_type",
          type: "filter",
          filter: (row) => {
            const item =
              optionSubscribe.find((v) => v.id === row.goodType) || {};
            return item.name;
          },
        },
        {
          prop: "buyLimitCount",
          label: "number_purchases",
          type: "filter",
          filter: (row) => {
            if (row.buyLimitCount && row.buyLimitCount !== "0") {
              return row.buyLimitCount;
            } else {
              return "/";
            }
          },
        },
        {
          prop: "goodName",
          label: "menu_name",
        },
        {
          prop: "discountPriceYuan",
          label: "fact_price",
        },
        {
          prop: "priceYuan",
          label: "original_price",
        },
        {
          width: "120",
          prop: "lastTime",
          label: "member_validity_period_day",
        },
        {
          prop: "status",
          label: "status",
          type: "filter",
          filter: (row) => {
            const item = optionStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "updateUserName",
          label: "updated_by",
        },
        {
          width: "150",
          prop: "updateTime",
          label: "update_time",
        },
        {
          label: "operate",
          type: "html",
          width: "140",
          html: (col) => {
            let fixeBtn = `<span data-tagName="editBtn" class="link comBtn">${this.$t(
              "edit"
            )}</span>`;
            let logsBtn = `<span data-tagName="logsBtn" class="link comBtn">日志</span>`;
            let strBtn = fixeBtn;
            let forbiddenBtn = `<span data-tagName="forbiddenBtn" class="comBtn danger">${this.$t(
              "disable"
            )}</span>`;
            let startBtn = `<span data-tagName="startBtn" class="comBtn link">${this.$t(
              "enable"
            )}</span>`;
            if (col.status === 0) {
              strBtn += startBtn;
            } else {
              strBtn += forbiddenBtn;
            }
            return strBtn + logsBtn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "editBtn") {
              this.row = {
                ...row,
                vipLevel: this.vipLevel,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
              this.visible = true;
            } else if (tagname === "forbiddenBtn") {
              this.$confirm(this.$t("confirm_forbidden"), this.$t("prompt"), {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.handleStatus(false, row.id, 0);
                })
                .catch(() => {});
            } else if (tagname === "startBtn") {
              this.handleStatus(false, row.id, 1);
            } else if (tagname === "logsBtn") {
              this.row = {
                id: row.id,
                callback: () => {
                  this.vipCoinVisible = false;
                },
              };
              this.vipCoinVisible = true;
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
    this.getList();
  },

  methods: {
    getList() {
      let startTime = "";
      let endTime = "";
      const params = {
        ...this.searchData,
        vipLevel: this.vipLevel,
        startTime,
        endTime,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      userVipPage(params).then((res) => {
        this.loading = false;
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    handleStatus(deleted, id, status) {
      const params = {
        deleted: deleted,
        id: id,
        status: status,
      };
      this.loading = true;
      userVipDelete(params)
        .then(() => {
          this.loading = false;
          this.$message.success(status === 1 ? "启用成功" : "禁用成功");
          this.getList();
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
      this.searchData.activityStatus = "";
      this.searchData.subscribeStatus = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
