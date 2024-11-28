<template>
  <basic-container>
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
      :tablePage="tablePage"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
    </tableSearch>
    <el-dialog
      title="新增"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create v-if="visible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { deptUserTree, deptDel } from "@/api/admin/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import create from "./components/create.vue";
import { resetSearchData, filterNullSearchData } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  components: {
    pagination,
    tableSearch,
    search,
    create,
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
          placeholder: "部门名称",
          clearable: true,
        },
      ],
      searchData: {
        name: "",
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
              callback: (data) => {
                if (data) {
                  this.getList();
                  this.$store.dispatch("actionDepartment");
                }
                this.visible = false;
              },
            };
          },
          auth: () => this.permissions.sys_dept_add,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "部门名称",
          prop: "name",
          align: "left",
        },
        {
          label: "描述",
          prop: "deptDesc",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: () => {
            let add = `<span class='comBtn link' data-tagName="add">添加下级</span>`;
            let edit = `<span class='comBtn link' data-tagName="edit">编辑</span>`;
            let del = `<span class='comBtn danger' data-tagName="del">删除</span>`;
            let str = "";
            if (this.permissions.sys_dept_child_add) {
              str += add;
            }
            if (this.permissions.sys_dept_edit) {
              str += edit;
            }
            if (this.permissions.sys_dept_del) {
              str += del;
            }
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "add") {
              this.visible = true;
              this.row = {
                isAddChild: true,
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                    this.$store.dispatch("actionDepartment");
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "edit") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                    this.$store.dispatch("actionDepartment");
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "del") {
              this.$confirm(
                "该部门将被删除，你还要继续吗？",
                "这是进行一项操作时必须了解的重要信息",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              ).then(() => {
                deptDel(row).then(() => {
                  this.getList();
                  this.$store.dispatch("actionDepartment");
                });
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
    this.getList();
  },
  computed: {
    ...mapGetters({ permissions: "permissions" }),
  },

  methods: {
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      deptUserTree(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.data;
        this.tableData = res.data.data;
        this.tablePage.total = res.data.data.total;
      });
    },
  },
};
</script>
