<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <div class="choice">
      <span class="el-icon-warning icon-span"></span>
      <p>
        已选择 {{ selectionData.length }} 个列表
        <span type="text" @click="setCommon" size="small">设置为常见问题</span>
        <span @click="Alldeleted">批量删除</span>
      </p>
    </div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :operation="operation"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="true"
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
      <wholeEdit :row="row"></wholeEdit>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryList,
  delObj,
  setList,
  queryTypeList,
} from "@/api/report-and-feedback/help.js";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table";
import wholeEdit from "@/views/report-and-feedback/help/wholeEdit";
import { pageHandle } from "@/util/pageHandle";
export default {
  components: {
    tableSearch,
    search,
    wholeEdit,
  },
  data() {
    return {
      row: {},
      ifyName: [],
      selectionData: [],
      loading: false,
      visible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          labelWidth: "50px",
          label: "问题:",
          type: "input",
          prop: "problemTitle",
          placeholder: "请输入问题",
          clearable: true,
        },

        {
          label: "分类:",
          type: "select",
          prop: "classifyId",
          change: (that, data) => {},
          placeholder: "请选择分类",
          labelValue: {
            label: "classifyName",
            value: "classifyId",
          },
          options: [],
          clearable: true,
        },
        {
          label: "常见问题",
          prop: "problemType",
          type: "select",
          options: [
            { name: "是", id: "NORMAL" },
            { name: "否", id: "OTHER" },
          ],
        },
      ],
      searchData: {
        problemTitle: "",
        classifyId: "",
        problemType: "",
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
              problemType: "OTHER",
              isId: true,
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
          prop: "problemTitle",
          label: "问题",
        },
        {
          prop: "classifyName",
          label: "分类",
          width: "150",
        },
        {
          prop: "problemType",
          label: "常见问题",

          type: "html",
          html: (row) => {
            return row.problemType == "NORMAL" ? "是" : "否";
          },
        },
        {
          prop: "solveCount",
          label: "已解决",
        },
        {
          prop: "unsolveCount",
          label: "未解决",
        },
        {
          prop: "createUserName",
          label: "更新人",
        },
        {
          prop: "createTime",
          label: "更新时间",

          sortable: true,
        },
      ],
      operation: {
        label: "操作",
        width: "220",

        btnList: [
          {
            label: "查看",
            type: "primary",
            callback: (row) => {
              this.title = "查看";
              this.visible = true;
              this.row = {
                ...row,
                isShow: true,
              };
            },
          },
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
                  delObj({ problemIds: [row.problemId] }).then((res) => {
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
    this.categoryList();
  },

  methods: {
    setCommon() {
      const list = this.selectionData.map((item) => item.problemId);
      if (list.length > 0) {
        this.$confirm("此操作将对应数据设置为常见问题, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          setList({ problemIds: list }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.getList();
            }
          });
        });
      } else {
        this.$message.error("未有选中项");
      }
    },
    // 多选删除
    Alldeleted() {
      if (this.selectionData.length == 0) {
        return;
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = this.selectionData.map((item) => item.problemId);
          delObj({ problemIds: params }).then((res) => {
            if (res.data.code == 200) {
              if (this.tableData.length && this.tablePage.current > 1) {
                this.tablePage.current--;
              }
              this.getList();
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {});
    },
    categoryList() {
      let info = {
        current: 1,
        size: 10000,
      };
      queryTypeList(info).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.searchForm.forEach((v) => {
            if (v.type === "select" && v.prop === "classifyId") {
              v.options = data.data.records;
            }
          });
        }
      });
    },

    getList(data) {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,

        problemTitle: data?.problemTitle || undefined,
        problemType: data?.problemType || undefined,
        classifyId: data?.classifyId,
      };
      this.loading = true;
      queryList(params)
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
      this.searchData.problemTitle = "";
      this.searchData.classifyId = "";
      this.searchData.problemType = "";
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
.choice {
  width: 100%;
  height: 40px;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  .icon-span {
    color: #409eff;
  }
  p {
    margin-left: 8px;
    span {
      display: inline-block;
      margin-left: 20px;
      color: #409eff;
      cursor: pointer;
      &:last-child {
        color: red;
      }
    }
  }
}
</style>
