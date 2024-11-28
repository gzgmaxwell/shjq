<template>
  <basic-container>
    <search :searchHandle="searchHandle"> </search>
    <tableSearch :loading="loading" :tableData="tableData" :tableLabel="tableLabel" :operation="operation"
      :tablePage="tablePage" :tableEvents="tableEvents" :isIndex="true">
    </tableSearch>
    <el-dialog :title="row.id ? $t('edit') : $t('add')" :visible.sync="visible" width="50%" :close-on-click-modal="false">
      <create v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog title="日志记录" :visible.sync="goldCoinVisible" width="70%" :close-on-click-modal="false">
      <goldcoinLogs v-if="goldCoinVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import {
  amountExchangeRateSaveOrUpdate,
  amountExchangeRatePage,
} from "@/api/business-manage/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "@/views/business-manage/coinMenu/create.vue";
import goldcoinLogs from "@/views/business-manage/coinMenu/goldcoinLogs.vue";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    create,
    goldcoinLogs,
  },
  data() {
    return {
      visible: false,
      goldCoinVisible: false,
      row: {},
      loading: false,
      searchHandle: [
        {
          label: "add",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
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
            this.goldCoinVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.goldCoinVisible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => { },
      },
      tableLabel: [
        {
          prop: "amountYuan",
          label: "amount",
        },
        {
          label: "number_purchases",
          type: "filter",
          filter: (row) => {
            if (row.buyLimitCount > 0) {
              return row.buyLimitCount;
            }
            return "";
          },
        },
        {
          prop: "goldAmountYuan",
          label: "obtaining_gold_coins",
        },
        {
          prop: "updateUserName",
          label: "updated_by",
        },
        {
          prop: "updateTime",
          label: "update_time",
        },
      ],
      operation: {
        label: "operate",
        width: "250",
        btnList: [
          {
            label: "edit",
            type: "text",
            callback: (row) => {
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
              this.visible = true;
            },
          },
          {
            label: "delete",
            type: "text",
            callback: (row) => {
              this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
                confirmButtonText: this.$t("determine"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
              })
                .then(() => {
                  const params = {
                    ...row,
                    deleted: true,
                  };
                  amountExchangeRateSaveOrUpdate(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      return this.$message.success(
                        this.$t("successfully_deleted")
                      );
                    }
                  });
                })
                .catch(() => { });
            },
          },
          {
            label: "日志",
            type: "text",
            callback: (row) => {
              this.row = {
                id: row.id,
                callback: () => {
                  this.goldCoinVisible = false;
                },
              };
              this.goldCoinVisible = true;
            },
          },
        ],
      },

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
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      amountExchangeRatePage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    reset() {
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
