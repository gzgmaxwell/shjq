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
      :operation="operation"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
    <el-dialog
      title="编辑"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row"></create>
    </el-dialog>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./create.vue";
import { platformPage } from "@/api/admin/index";
export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      that: this,
      searchForm: [
        {
          type: "input",
          prop: "name",
          placeholder: "平台名称",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", type: "primary", callback: this.reset },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "platformName",
          label: "平台名称",
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
      ],
      operation: {
        label: "操作", // 列名
        width: "250", // 根据实际情况给宽度
        btnList: [
          {
            label: "编辑",
            type: "text",
            callback: (row) => {
              this.visible = true;
              this.row = {
                ...row,
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
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      platformPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        data.data.records.forEach((v) => (v.visible = false));
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.name = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
