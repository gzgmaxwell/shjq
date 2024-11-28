<template>
  <basic-container>
    <div>
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
        :tablePage="tablePage"
        :tree-props="treeProps"
        row-key="id"
      >
      </tableSearch>
      <table-form
        v-if="visible"
        ref="addOrUpdate"
        @refreshDataList="getList"
      ></table-form>
    </div>
  </basic-container>
</template>

<script>
import TableForm from "./menu-form.vue";
import { delObj, fetchMenuTree } from "@/api/admin/menu";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
    TableForm,
  },
  data() {
    return {
      loading: false,
      that: this,
      visible: false,
      row: {},
      treeProps: {
        children: "children",
        hasChildren: "hasChildrens",
      },
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "添加",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.$nextTick(() => {
              this.$refs.addOrUpdate.init(false);
            });
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "菜单名称",
          align: "left",
        },
        {
          prop: "icon",
          label: "图标",
          width: "100",
          type: "html",
          html: (row) => {
            return `<i class=${row.icon}></i>`;
          },
        },
        {
          prop: "sort",
          label: "排序",
          width: "60",
        },
        {
          prop: "path",
          label: "组件路径",
        },
        {
          prop: "type",
          label: "类型",
          type: "html",
          width: "80",
          html: (row) => {
            const type = row.type == 0 ? "菜单" : row.type == 1 ? "按钮" : "";
            const className = row.type == 0 ? "status" : "stop";
            return `<span class="${className} default">${type}</span>`;
          },
        },
        {
          prop: "keepAlive",
          label: "缓冲",
          width: "80",
          type: "html",
          html: (row) => {
            const keepAlive = row.keepAlive == 0 ? "关闭" : "开启";
            const className = row.keepAlive == 1 ? "status" : "stop";
            return `<span class="${className} default">${keepAlive}</span>`;
          },
        },
        {
          prop: "permission",
          label: "权限标识",
        },
        {
          label: "操作",
          type: "html",
          width: "180",
          html: (row) => {
            let add = `<span class='link comBtn' data-tagName="add">添加</span>`;
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            const del = `<span class='danger comBtn' data-tagName="del">删除</span>`;
            let btn = "";
            if (this.permissions.sys_menu_add) {
              btn += add;
            }
            if (this.permissions.sys_menu_edit) {
              btn += edit;
            }
            if (this.permissions.sys_menu_del) {
              btn += del;
            }
            return btn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "add") {
              this.visible = true;
              this.$nextTick(() => {
                this.$refs.addOrUpdate.init(false, row.id);
              });
            } else if (tagname === "edit") {
              this.visible = true;
              this.$nextTick(() => {
                this.$refs.addOrUpdate.init(true, row.id);
              });
            } else if (tagname === "del") {
              this.$confirm(
                '是否确认删除名称为"' + row.name + '"的数据项?',
                "警告",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  delObj(row.id).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success("删除成功!");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            }
          },
        },
      ],
      tablePage: {},
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      fetchMenuTree({ lazy: false })
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data?.data;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
