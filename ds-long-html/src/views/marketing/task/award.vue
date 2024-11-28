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
      :tableData="tableData"
      :tableLabel="tableLabel"
      :operation="{}"
      :tablePage="tablePage"
    >
      <template #slotBtn="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
      </template>
    </tableSearch>
    <el-dialog
      title="新建道具奖励方案"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <createAward v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog
      title="配置"
      :visible.sync="configVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <configAward v-if="configVisible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import {
  schemePage,
  schemeOperateById,
  schemeRemoveById,
  saveLotteryConf,
  getLotteryConf,
} from "@/api/marketing/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import createAward from "./components/createAward.vue";
import configAward from "./components/configAward.vue";
import {
  optTaskStatus,
  resetSearchData,
  filterNullSearchData,
  EnumTaskStatus,
} from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    createAward,
    configAward,
  },
  data() {
    return {
      visible: false,
      configVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "schemeName",
          placeholder: "方案名称",
          clearable: true,
        },
      ],
      searchData: {
        schemeName: "",
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
          label: "add",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              vipLevel: "svip",
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
          label: "积分设置",
          type: "primary",
          callback: () => {
            getLotteryConf().then((res) => {
              this.$prompt("设置抽奖所需积分", "提示", {
                confirmButtonText: "确定",
                inputValue: res.data?.data?.number,
                cancelButtonText: "取消",
                inputPattern: /^\+?[1-9]\d*$/,
                inputErrorMessage: "请设置抽奖所需积分，只能取整数且大于0",
                closeOnClickModal: false,
              })
                .then(({ value }) => {
                  saveLotteryConf({
                    number: value,
                    props: "INTEGRAL",
                  }).then(() => {
                    this.$message.success("设置成功");
                  });
                })
                .catch(() => {});
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "方案名称",
          prop: "schemeName",
        },
        {
          label: "status",
          type: "filter",
          filter: (row) => optTaskStatus.find((v) => v.id === row.status)?.name,
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "260",
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
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      schemePage(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data.records.map((v) => {
          v.btnList = this.getBtnList(v);
          return v;
        });
        this.tableData = res.data.data.records;
        this.tablePage.total = res.data.data.total;
      });
    },
    getBtnList(row) {
      const btnList = [];
      btnList.push({
        name: "配置",
        class: "comBtn link",
        callback: () => {
          this.row = {
            ...row,
            callback: () => {
              this.configVisible = false;
            },
          };
          this.configVisible = true;
        },
      });
      if (row.status === EnumTaskStatus.DISABLED) {
        btnList.push({
          name: "启用",
          class: "comBtn link",
          callback: () => {
            schemeOperateById(row.id).then(() => {
              this.$message.success("启用成功");
              this.getList();
            });
          },
        });
      }
      if (row.status === EnumTaskStatus.ENABLE) {
        btnList.push({
          name: "禁用",
          class: "comBtn danger",
          callback: () => {
            this.$confirm(this.$t("confirm_forbidden"), this.$t("prompt"), {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                schemeOperateById(row.id).then(() => {
                  this.$message.success("禁用成功");
                  this.getList();
                });
              })
              .catch(() => {});
          },
        });
      }

      btnList.push({
        name: "删除",
        class: "comBtn danger",
        callback: () => {
          this.$confirm("此操作将被删除, 是否继续?", this.$t("prompt"), {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              schemeRemoveById(row.id).then(() => {
                this.$message.success("禁用成功");
                this.getList();
              });
            })
            .catch(() => {});
        },
      });
      return btnList;
    },
  },
};
</script>
