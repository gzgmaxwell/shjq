<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="true"
    >
    </tableSearch>
    <el-dialog
      title="埋点事件"
      :visible.sync="visible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import create from "./create.vue";
import { propertyPage, deleteProperty } from "@/api/burialevent";
export default {
  components: {
    tableSearch,
    search,
    create,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      row: {},
      visible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "propertyName",
          placeholder: "属性名称",
          clearable: true,
        },
        {
          type: "input",
          prop: "propertyDesc",
          placeholder: "属性中文名称",
          clearable: true,
        },
      ],
      searchData: {
        propertyName: "",
        propertyDesc: "",
      },
      searchHandle: [
        { label: "查询", type: "primary", callback: this.search },
        { label: "重置", callback: this.reset },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              publicProperty: true,
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
          label: "批量删除",
          type: "danger",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            this.$confirm(`确定要删除吗？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const data = this.selectionData.map((item) => item.id);
                deleteProperty({ ids: data }).then((res) => {
                  if (res.data.code == 200) {
                    if (this.tableData.length && this.tablePage.current > 1) {
                      this.tablePage.current--;
                    }
                    this.$message.success("删除成功");
                    this.getList();
                  }
                });
              })
              .catch(() => {});
          },
          auth: () => true,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "属性名称",
          prop: "propertyName",
        },
        {
          label: "属性中文名称",
          prop: "propertyDesc",
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
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
        publicProperty: true,
      };
      this.loading = true;
      propertyPage(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data.records;
        this.tablePage.total = res.data.data.total;
      });
    },
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.propertyName = "";
      this.searchData.propertyDesc = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
