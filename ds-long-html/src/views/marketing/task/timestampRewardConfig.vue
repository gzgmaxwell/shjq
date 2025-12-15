<template>
  <div>
    <el-form
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
      style="width: 50%"
    >
      <div class="titleBox">
        <div class="title">累计时间戳配置奖励</div>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submit('ruleForm')">{{
            $t("save")
          }}</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-divider></el-divider>
    <el-button type="primary" @click="handleAdd()" style="margin-top: -20px"
      >添加奖励</el-button
    >
    <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
      <el-table-column label="奖励道具" align="center">
        <template slot-scope="scope">
          <el-select
            style="width: 80%"
            v-model="scope.row.propName"
            clearable
            placeholder="请选择奖励道具"
          >
            <el-option
              v-for="item in optProps"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span
            class="el-icon-remove-outline fs16 ml5"
            @click="handleDel(scope.$index)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.propQuantity"
            style="width: 80%"
            @blur="blurChange(scope.row, 'propQuantity')"
            @keydown.native="preventDecimalInput"
            :min="1"
          />
          <span class="ml5">{{ compuOptProps(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计时间戳次数" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.num"
            :min="1"
            style="width: 80%"
            @keydown.native="preventDecimalInput"
            @blur="blurChange(scope.row, 'num')"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { timestampList, timestampSave } from "@/api/admin/index";
import { debounceCallBack, optProps } from "@/util/util";
export default {
  data() {
    return {
      isComposing: false,
      tableData: [],
      optProps: optProps,
    };
  },
  computed: {
    compuOptProps() {
      return (row) => {
        return optProps.find((v) => v.id === row.propName)?.unit;
      };
    },
  },

  mounted() {
    this.getInfo();
  },
  methods: {
    blurChange(row, key) {
      if (!row[key]) {
        row[key] = 1;
      }
    },
    preventDecimalInput(e) {
      // 允许数字键、退格、删除、左右方向键
      const allowKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
      const reg = /^[0-9]\d*$/;
      const isAllowed = allowKeys.includes(e.key);
      // 其他非数字键也禁止
      if (!reg.test(e.key) && !isAllowed) {
        e.preventDefault();
        return;
      }
    },
    getInfo() {
      timestampList().then((res) => {
        this.tableData = res.data?.data || [];
      });
    },
    handleDel(index) {
      this.tableData.splice(index, 1);
    },
    handleAdd() {
      const item = {
        propName: "",
        propQuantity: "",
        num: "",
      };
      this.tableData.push(item);
    },
    submit() {
      this.commit();
    },
    commit() {
      const params = this.tableData;

      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (!item.propName) {
          this.$message.warning("请选择奖励道具");
          return;
        }
      }
      const comSubmit = () => {
        return timestampSave(params).then(() => {
          this.$message.success("保存成功");
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-divider--horizontal {
  margin: 0;
  margin-bottom: 20px;
  width: 50%;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
.titleBox {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
}
</style>
