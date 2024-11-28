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
      :operation="operation"
      :tablePage="tablePage"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="40%"
      v-if="visible"
      center
      :close-on-click-modal="false"
    >
      <problemTypeEdit :row="row"></problemTypeEdit>
    </el-dialog>
  </div>
</template>
<script>
import { queryTypeList, delTypeObj } from "@/api/report-and-feedback/help.js";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table";
import problemTypeEdit from "@/views/report-and-feedback/help/problemTypeEdit";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    problemTypeEdit,
  },
  data() {
    return {
      row: {},
      ifyName: [],
      selectionData: [],
      loading: false,
      visible: false,
      searchForm: [
        {
          labelWidth: "75px",
          label: "分类名称:",
          type: "input",
          prop: "classifyName",
          placeholder: "请输入分类名称",
          clearable: true,
        },
      ],
      searchData: {
        classifyName: "",
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
              isId: true,
              classifyStatus: "1",
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
          prop: "classifyName",
          label: "分类",
        },
        {
          prop: "sort",
          label: "排序位置",
        },
        {
          prop: "classifyStatus",
          label: "启用状态",

          type: "html",
          html: (row) => {
            const className =
              row.classifyStatus == 1
                ? "start"
                : row.classifyStatus == 2
                ? "must"
                : "";
            return `<span class="${className}">${
              row.classifyStatus
                ? row.classifyStatus == 1
                  ? "启用"
                  : "禁用"
                : ""
            }</span>`;
          },
        },
      ],
      operation: {
        label: "操作",
        width: "220",

        btnList: [
          {
            label: "编辑",
            type: "primary",
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
          {
            label: "删除",
            type: "danger",
            callback: (row) => {
              this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  delTypeObj(row).then((res) => {
                    if (res.data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.getList();
                      this.$message.success("删除成功");
                    }
                  });
                })
                .catch(() => {});
            },
          },
        ],
      },

      tablePage: {
        total: 0,
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
    getList(data) {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
        classifyName: data?.classifyName || undefined,
      };
      this.loading = true;
      queryTypeList(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    search() {
      this.tablePage.current = 1;
      let data;
      if (this.searchData) {
        data = {
          ...this.searchData,
        };
      }

      this.getList(data);
    },
    reset() {
      this.searchData.classifyName = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #0285bd;
  padding: 5px 10px;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
