<template>
  <div class="mt20">
    <basic-container>
      <search
        :that="that"
        :searchData="searchData"
        :searchForm="searchForm"
        :searchHandle="searchHandle"
      >
      </search>
      <div class="choice">
        <span class="el-icon-warning icon-span"></span>
        <p>
          已选择 {{ selectionData.length }} 个列表
          <el-button
            type="danger"
            size="mini"
            @click="Alldeleted"
            :disabled="!selectionData.length"
            >批量删除</el-button
          >
        </p>
      </div>
      <tableSearch
        :loading="loading"
        :that="that"
        :tableData="tableData"
        :searchData="searchData"
        :tableLabel="tableLabel"
        :operation="operation"
        :tablePage="tablePage"
        :tableEvents="tableEvents"
        :isSelection="true"
        :isIndex="false"
        ref="tableComponent"
        row-key="id"
        :tree-props="treeProps"
      >
      </tableSearch>
      <el-dialog
        :title="comptTitle()"
        :visible.sync="visible"
        width="500px"
        center
        :close-on-click-modal="false"
      >
        <createRole :row="row" v-if="visible"></createRole>
      </el-dialog>
      <el-dialog
        title="分配权限"
        :visible.sync="roleVisible"
        width="40%"
        :close-on-click-modal="false"
      >
        <PermissionsTree :row="row" v-if="roleVisible"></PermissionsTree>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { delObj, roleTree, removeRole } from "@/api/admin/role";
import { platformListByUser } from "@/api/admin/index";
import { optionsRoleType } from "@/util/util";
import createRole from "@/views/admin/role/createRole.vue";
import PermissionsTree from "@/views/admin/role/PermissionsTree.vue";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    createRole,
    PermissionsTree,
  },
  data() {
    return {
      treeProps: {
        children: "children",
        hasChildren: "hasChildrens",
      },
      title: "",
      ifyName: [],
      platformOptions: [],
      selectionData: [],
      loading: false,
      that: this,
      row: {},
      visible: false,
      roleVisible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      row: {},
      searchForm: [
        // {
        //   labelWidth: "70px",
        //   label: "角色名称",
        //   type: "input",
        //   prop: "roleName",
        //   placeholder: "请输入列表名称",
        //   clearable: true,
        // },
      ],
      searchData: {
        roleName: "",
      },
      searchHandle: [
        // { label: "查询", type: "primary", callback: this.search },
        // { label: "重置", callback: this.reset },
        {
          label: "新增",
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
          auth: () => this.permissions.sys_role_add,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "roleName",
          label: "角色名称",
          align: "left",
        },
        {
          prop: "roleCode",
          label: "角色类型",
          width: "150",
          type: "filter",
          filter: (row) => {
            const item = optionsRoleType.find((item) => {
              return item.id === row.roleCode;
            });
            return item.name;
          },
        },
        // 4.3.9删除
        // {
        //   prop: "busPlatformId",
        //   label: "平台",
        //   type: "filter",
        //   filter: (row) => {
        //     const item = this.platformOptions.find((item) => {
        //       return item.id === row.busPlatformId;
        //     });
        //     return item?.platformName;
        //   },
        // },
        {
          prop: "createTime",
          label: "创建时间",
          sortable: true,
        },
        {
          label: "操作",
          type: "html",
          width: "180",
          html: (col) => {
            let str = "";
            let addBtn = `<span data-tagName="searchBtn" class="comBtn  link">创建下级</span>`;
            let editBtn = `<span data-tagName="editBtn" class="comBtn link">编辑</span>`;
            let delBtn = `<span data-tagName="delBtn" class="comBtn danger">删除</span>`;
            let permisBtn = `<span data-tagName="permisBtn" class="comBtn link">权限</span>`;
            if (this.permissions.sys_role_child) {
              str += addBtn;
            }
            if (this.permissions.sys_role_edit) {
              str += editBtn;
            }
            if (this.permissions.sys_role_perm) {
              str += delBtn;
            }
            if (this.permissions.sys_role_perm) {
              str += permisBtn;
            }
            return str;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;

            if (tagname === "editBtn") {
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
            } else if (tagname === "delBtn") {
              this.$confirm(
                '是否确认删除名称为"' + row.roleName + '"' + '"的数据项?',
                "警告",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  delObj(row.roleId).then((res) => {
                    if (res.data.code == 200) {
                      const newCurrent = pageHandle(
                        this.tablePage.current,
                        this.tablePage.size,
                        this.tablePage.total
                      );
                      this.tablePage.current = newCurrent;
                      this.$message.success("删除成功");
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            } else if (tagname === "searchBtn") {
              this.visible = true;
              this.row = {
                ...row,
                showTime: true,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "permisBtn") {
              this.roleVisible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.$store
                      .dispatch("GetMenu", { type: true, id: -1 })
                      .then((data) => {
                        if (data.length === 0) return;
                        this.$router.$avueRouter.formatRoutes(data, true);
                        window.location.reload();
                        this.getList();
                      });
                  }
                  this.roleVisible = false;
                },
              };
            }
          },
        },
      ],
      operation: {},

      tablePage: {
        total: 0,
        current: 1,
        size: 99999,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
    comptTitle() {
      return () => {
        if (this.row.roleId && this.row.showTime) {
          return "创建下级";
        } else if (this.row.roleId) {
          return "编辑";
        } else {
          return "新增";
        }
      };
    },
  },
  mounted() {
    this.getList();
    this.getPlatform();
  },

  methods: {
    getPlatform() {
      platformListByUser().then((response) => {
        this.platformOptions = response.data.data;
      });
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
          const params = this.selectionData.map((item) => {
            return item.roleId;
          });
          removeRole(params).then((res) => {
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

    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      roleTree(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data;
            // this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // search() {
    //   this.tablePage.current = 1;
    //   this.getList();
    // },
    // reset() {
    //   this.searchData = {};
    //   this.tablePage.total = 0;
    //   this.tablePage.current = 1;
    //   this.tablePage.size = 10;
    //   this.getList();
    // },
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
      color: rgb(132, 215, 243);
      cursor: pointer;
      &:last-child {
        color: red;
      }
    }
  }
}
</style>
