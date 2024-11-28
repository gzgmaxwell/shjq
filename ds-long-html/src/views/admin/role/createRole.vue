<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="ruleForm.roleName"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleCode">
        <el-select
          style="width: 100%"
          v-model="ruleForm.roleCode"
          placeholder="请选择角色类型"
          clearable
          :disabled="row.roleId && !row.showTime ? true : false"
        >
          <el-option
            v-for="item in optionsRoleType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 4.3.9删除 -->
      <!-- <el-form-item label="平台" prop="busPlatformId">
        <el-select
          v-model="ruleForm.busPlatformId"
          placeholder="请选择平台"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in platformOptions"
            :key="item.id"
            :label="item.platformName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="上级角色" v-if="row.roleId && !row.showTime">
        <el-cascader
          style="width: 100%"
          :options="roleTreeList"
          clearable
          @change="handleChange"
          v-model="ruleForm.parentId"
          :props="{
            value: 'roleId',
            label: 'roleName',
            checkStrictly: true,
            emitPath: false,
          }"
        ></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="数据权限">
        <el-radio-group v-model="ruleForm.dataType">
          <el-radio v-for="item in optionDataType" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" v-if="row.showTime" style="width: 70%">
        <el-input v-model="ruleForm.createTime"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="isSubmitting"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addObj, putObj, roleCodeList, roleTree } from "@/api/admin/role";
import { platformListByUser } from "@/api/admin/index";
import {
  optionsRoleType,
  optionDataType,
  EnumDataType,
  findPath,
  debounceCallBack,
} from "@/util/util.js";
import { checkUsernameType } from "@/util/validate.js";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isSubmitting: false,
      optionsRoleType: [],
      roleTreeList: [],
      optionDataType: optionDataType,
      platformOptions: [],
      ruleForm: {
        roleName: "",
        roleCode: "",
        // busPlatformId: "",
        parentId: -1,
        // dataType: EnumDataType.ALL,
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkUsernameType, trigger: "blur" },
        ],
        roleCode: [
          {
            required: true,
            message: "角色标识不能为空",
            trigger: "blur",
          },
        ],
        // 4.3.9删除
        // busPlatformId: [
        //   {
        //     required: true,
        //     message: "请选择平台",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  mounted() {
    this.getTreeList();
    this.getPlatform();
    if (this.row.roleId && !this.row.showTime) {
      this.getRow();
    }
    if (!this.row.roleId || this.row.showTime) {
      roleCodeList().then((res) => {
        this.optionsRoleType = optionsRoleType.filter((v) =>
          res.data.data.includes(v.id)
        );
      });
    } else {
      this.optionsRoleType = optionsRoleType;
    }
  },
  methods: {
    handleChange(val) {
      if (!val) {
        this.ruleForm.parentId = -1;
      }
    },
    getTreeList() {
      const params = {
        current: 1,
        size: 99999,
      };
      roleTree(params).then((res) => {
        const funItem = (item) => {
          item.disabled = true;
          if (item.children && item.children.length) {
            item.children.forEach((v) => {
              funItem(v);
            });
          }
        };
        const funDisable = (myArr) => {
          const arr = [...myArr];
          arr.forEach((item) => {
            if (item.roleId === this.row.roleId) {
              funItem(item);
            } else {
              item.disabled = false;
              if (item.children && item.children.length) {
                funDisable(item.children);
              }
            }
          });
          return arr;
        };
        this.roleTreeList = funDisable(res.data.data || []);
      });
    },
    getRow() {
      this.ruleForm.roleId = this.row.roleId;
      this.ruleForm.roleName = this.row.roleName;
      this.ruleForm.roleCode = this.row.roleCode;
      // 4.3.9删除
      // this.ruleForm.busPlatformId = this.row.busPlatformId;
      this.ruleForm.parentId = this.row.parentId;
    },
    getPlatform() {
      platformListByUser().then((response) => {
        this.platformOptions = response.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = { ...this.ruleForm };
          if (this.row.roleId) {
            if (this.row.showTime) {
              params.parentId = this.row.roleId;
            }
          }

          if (!this.row.roleId) {
            const comSubmit = () => {
              return addObj(params).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("新增成功");
                  this.row.callback(true);
                  Promise.resolve();
                }
              });
            };
            debounceCallBack(comSubmit)();
          } else if (this.row.showTime) {
            const comSubmit = () => {
              return addObj(params).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("创建下级成功");
                  this.row.callback(true);
                  Promise.resolve();
                }
              });
            };
            debounceCallBack(comSubmit)();
          } else {
            putObj(params).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("编辑成功");
                this.row.callback(true);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
