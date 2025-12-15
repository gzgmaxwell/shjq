<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="135px"
      class="demo-ruleForm"
    >
      <el-form-item label="标签名称" prop="classifyName">
        <el-input
          v-model="ruleForm.classifyName"
          placeholder="请输入标签名称"
          maxlength="20"
          show-word-limit
          clearable
          :disabled="!isBusPlatform"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序位置" prop="sortValue">
        <el-input-number
          v-model="ruleForm.sortValue"
          placeholder="请输入排序位置"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="标签描述:" prop="classifyDesc">
        <el-input
          type="textarea"
          v-model="ruleForm.classifyDesc"
          placeholder="请输入标签描述"
          maxlength="50"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 4 }"
          clearable
        ></el-input>
      </el-form-item> -->
      <el-form-item label="启用状态" prop="classifyStatus">
        <el-radio-group v-model="ruleForm.classifyStatus">
          <el-radio
            v-for="item in optionStatus"
            :key="item.id"
            :label="item.id"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="视频标签展示样式"
        prop="type"
        v-if="ruleForm.classifyStatus === EnumStatus.ON"
      >
        <el-radio-group v-model="ruleForm.type" :disabled="!isBusPlatform">
          <el-radio
            v-for="item in optionsShowStyle"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="超级会员限制" prop="viewingPermissions">
        <el-radio-group v-model="ruleForm.viewingPermissions">
          <el-radio
            v-for="item in optSvipRestrictions"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  optionStatus,
  EnumStatus,
  optionsShowStyle,
  EnumShowStyle,
  isBusPlatform,
  optSvipRestrictions,
  enum_svipRestrictions,
} from "@/util/util";
import { document, update } from "@/api/content/classify";
export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      isBusPlatform: isBusPlatform(),
      optSvipRestrictions: optSvipRestrictions,
      optionStatus: optionStatus,
      EnumStatus: EnumStatus,
      optionsShowStyle: optionsShowStyle,
      EnumShowStyle: EnumShowStyle,
      ruleForm: {
        classifyName: "",
        classifyDesc: "",
        classifyStatus: EnumStatus.ON,
        type: EnumShowStyle.DEFAULT,
        viewingPermissions: enum_svipRestrictions.yes,
        sortValue: "",
      },
      rules: {
        classifyName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择展示样式", trigger: "blur" }],
        classifyStatus: [
          { required: true, message: "请选择启用状态", trigger: "blur" },
        ],
        sortValue: [
          { required: true, message: "请选择排序层级", trigger: "blur" },
        ],
        viewingPermissions: [
          { required: true, message: "请选择超级会员限制", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    if (this.row.id) {
      this.getRow();
    }
  },
  methods: {
    getRow() {
      this.ruleForm = {
        classifyName: this.row.classifyName,
        classifyDesc: this.row.classifyDesc,
        type: this.row.type,
        classifyStatus: Number(this.row.classifyStatus),
        sortValue: this.row.sortValue,
        viewingPermissions: this.row.viewingPermissions,
        id: this.row.id,
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.row.id) {
            document(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("新增成功");
                this.row.callback(true);
              }
            });
          } else {
            update(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("编辑成功");
                this.row.callback(true);
              }
            });
          }
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
