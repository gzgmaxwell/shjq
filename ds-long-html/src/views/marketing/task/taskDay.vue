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
      title="配置"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <config v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { queryTasksList, taskOperate } from "@/api/marketing/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import config from "./components/config.vue";
import {
  optionStatus,
  resetSearchData,
  filterNullSearchData,
  EnumStatus,
} from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    config,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "任务名称",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          options: optionStatus,
          placeholder: "状态",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
        status: "",
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
      ],
      tableData: [],
      tableLabel: [
        {
          label: "任务名称",
          prop: "name",
        },
        {
          label: "status",
          type: "filter",
          filter: (row) => optionStatus.find((v) => v.id === row.status)?.name,
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
      queryTasksList(params).then((res) => {
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
              this.visible = false;
            },
          };
          this.visible = true;
        },
      });
      if (row.status === EnumStatus.OFF) {
        btnList.push({
          name: "启用",
          class: "comBtn link",
          callback: () => {
            taskOperate(row.id).then(() => {
              this.$message.success("启用成功");
              this.getList();
            });
          },
        });
      }
      if (row.status === EnumStatus.ON) {
        btnList.push({
          name: "停用",
          class: "comBtn danger",
          callback: () => {
            this.$confirm(this.$t("confirm_forbidden"), this.$t("prompt"), {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                taskOperate(row.id).then(() => {
                  this.$message.success("停用成功");
                  this.getList();
                });
              })
              .catch(() => {});
          },
        });
      }
      return btnList;
    },
  },
};
</script>
