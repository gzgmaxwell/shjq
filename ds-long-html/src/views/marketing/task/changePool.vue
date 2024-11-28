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
      title="道具"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <createChange v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import {
  userVipDelete,
  exchangePoolPage,
  rmExchangeProps,
} from "@/api/marketing/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import createChange from "./components/createChange.vue";
import { resetSearchData, filterNullSearchData, optProps } from "@/util/util";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    createChange,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "propsName",
          placeholder: "道具名称",
          clearable: true,
        },
      ],
      searchData: {
        propsName: "",
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
      ],
      tableData: [],
      tableLabel: [
        {
          label: "道具名称",
          type: "filter",
          filter: (row) => {
            return optProps.find((v) => v.id === row.props)?.name;
          },
        },
        {
          label: "数量",
          type: "filter",
          filter: (row) => {
            const item = optProps.find((v) => v.id === row.props);
            return `${row?.count} ${item?.unit}`;
          },
        },
        {
          label: "积分",
          prop: "integral",
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
      exchangePoolPage(params).then((res) => {
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
        name: "修改",
        class: "comBtn link",
        callback: () => {
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
      });
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
              rmExchangeProps(row.id).then(() => {
                this.$message.success("删除成功");
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
