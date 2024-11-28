<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="升级条件" :rules="[{ required: true }]">
        <div style="display: flex">
          <span>直推付费人数</span>
          <el-input
            v-model="ruleForm.promotionNum"
            placeholder="请输入"
            clearable
            style="width: 180px; margin-left: 10px"
          >
            <template slot="append">人</template>
          </el-input>
        </div>
        <div style="display: flex; margin-top: 10px">
          <span>直属下级</span>
          <el-select
            v-model="ruleForm.upgradeSchemeId"
            placeholder="请选择"
            style="width: 180px; margin-left: 10px"
            clearable
            @change="changeList"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.agentName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="ruleForm.count"
            placeholder="请输入"
            clearable
            style="width: 180px; margin-left: 10px"
            v-if="ruleForm.upgradeSchemeId"
          >
            <template slot="append">人</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button
          style="margin-right: 5px"
          @click="row.callback && row.callback()"
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { pageList, updateSchemeDetail, getDetailById } from "@/api/admin/index";
import { debounceCallBack } from "@/util/util";
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
      options: [],
      ruleForm: {
        promotionNum: "",
        schemeId: this.row.id,
        upgradeSchemeId: "",
        count: "",
      },
    };
  },
  mounted() {
    this.getOptions();
    this.getRow();
  },
  methods: {
    changeList(val) {
      if (!val) {
        this.ruleForm.count = "";
      }
    },
    getOptions() {
      const params = {
        current: 1,
        size: 99999,
      };
      pageList(params)
        .then((res) => {
          this.options = res.data?.data?.records;
        })
        .catch(() => {});
    },
    getRow() {
      getDetailById(this.row.id).then((res) => {
        const { data } = res;
        if (data.data) {
          this.ruleForm = {
            promotionNum: data.data.promotionNum,
            schemeId: data.data.schemeId,
            upgradeSchemeId: data.data.upgradeSchemeId,
            count: data.data.count,
            id: data.data.id,
          };
        }
      });
    },
    submitForm() {
      const reg = /^\+?[1-9]\d*$/;
      if (!reg.test(this.ruleForm.promotionNum)) {
        return this.$message.error("请输入大于0的整数");
      }
      // if (!this.ruleForm.upgradeSchemeId) {
      //   return this.$message.error("请选择直属下级");
      // }
      // if (!reg.test(this.ruleForm.count)) {
      //   return this.$message.error("请输入大于0的整数");
      // }
      if (this.ruleForm.upgradeSchemeId) {
        if (!reg.test(this.ruleForm.count)) {
          return this.$message.error("请输入大于0的整数");
        }
      }
      const comSubmit = () => {
        return updateSchemeDetail(this.ruleForm).then((res) => {
          if (res.data.code == 200) {
            this.$message.success(this.ruleForm.id ? "修改成功" : "新增成功");
            this.row.callback(true);
            Promise.resolve();
          }
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>

<style lang="scss" scoped></style>
