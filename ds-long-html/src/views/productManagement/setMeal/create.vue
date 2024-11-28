<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <div class="dialog-main-tree">
        <el-form-item label="套餐名称:" prop="name" style="width: 50%">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入套餐名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="套餐权限:" class="required"> </el-form-item>

        <el-tree
          style="margin-top: -15px"
          ref="menuTree"
          :data="treeData"
          :default-checked-keys="checkedKeys"
          :check-strictly="true"
          :props="defaultProps"
          :filter-node-method="filterNode"
          node-key="id"
          highlight-current
          show-checkbox
          default-expand-all
        />
      </div>
      <el-form-item class="dialog-footer">
        <el-button type="primary" @click="submit('ruleForm')">保存 </el-button>
        <el-button type="default" @click="row.callback && row.callback()"
          >取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchMenuTree } from "@/api/admin/menu";
import { servicePackageSave, servicePackageEdit } from "@/api/admin/role";
import { debounceCallBack } from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        name: "",
      },
      treeData: [],
      checkedKeys: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.handlePermission();
  },
  methods: {
    getInfo() {
      this.checkedKeys = this.row.menuIds;
      this.ruleForm.name = this.row.name;
    },
    handlePermission() {
      fetchMenuTree({ roleId: this.row.parentId }).then((response) => {
        this.treeData = response.data.data;
        if (this.row.id) {
          this.getInfo();
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const menuIds = this.$refs.menuTree
            .getCheckedKeys()
            .concat(this.$refs.menuTree.getHalfCheckedKeys());
          const params = {
            name: this.ruleForm.name,
            menuIds: menuIds,
          };
          if (!this.row.id) {
            const comSubmit = () => {
              return servicePackageSave(params).then(() => {
                this.$message.success("新增成功");
                this.row.callback(true);
                Promise.resolve();
              });
            };
            debounceCallBack(comSubmit)();
          } else {
            params.id = this.row.id;
            const comSubmit = () => {
              return servicePackageEdit(params).then(() => {
                this.$message.success("编辑成功");
                this.row.callback(true);
                Promise.resolve();
              });
            };
            debounceCallBack(comSubmit)();
          }
        } else {
          return this.$message.warning("请填写必填项");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item.required .el-form-item__label::before {
  content: "*";
  color: red;
  margin-right: 5px;
}
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
