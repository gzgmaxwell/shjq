<template>
  <div>
    <div class="dialog-main-tree">
      <el-tree
        ref="menuTree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :check-strictly="true"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        highlight-current
        show-checkbox
        default-expand-all
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updatePermession(roleId)"
        >保存
      </el-button>
      <el-button type="default" @click="row.callback && row.callback()"
        >取消
      </el-button>
    </div>
  </div>
</template>

<script>
import { RoleTree } from "@/api/admin/menu";
import { fetchRoleTree, permissionUpd } from "@/api/admin/role";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      roleId: "",
      roleCode: "",
      treeData: [],
      checkedKeys: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
    };
  },
  mounted() {
    this.handlePermission();
  },
  methods: {
    handlePermission() {
      fetchRoleTree(this.row.roleId)
        .then((response) => {
          this.checkedKeys = response.data.data;
          return RoleTree({ roleId: this.row.parentId });
        })
        .then((response) => {
          this.treeData = response.data.data;
          this.roleId = this.row.roleId;
          this.roleCode = this.row.roleCode;
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    updatePermession(roleId) {
      this.menuIds = "";
      this.menuIds = this.$refs.menuTree
        .getCheckedKeys()
        .join(",")
        .concat(",")
        .concat(this.$refs.menuTree.getHalfCheckedKeys().join(","));
      permissionUpd(roleId, this.menuIds).then(() => {
        this.$message.success("编辑成功");
        this.row.callback(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;

    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }

  .el-form-item__content {
    margin-left: 20% !important;
  }
}
</style>
