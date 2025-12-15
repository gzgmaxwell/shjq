<template>
  <div>
    <div class="mb10">
      <el-button type="primary" @click="create" :disabled="disCreate(tableData)"
        >添加</el-button
      >
      <el-button @click="submit">保存</el-button>
    </div>
    <el-table :data="tableData" border :span-method="objectSpanMethod">
      <el-table-column label="人数">
        <template slot-scope="scope">
          <div class="userNumBox">
            <el-input-number
              :disabled="scope.row.userNum > 0"
              @change="(val) => changeUserNum(val, scope.row, scope.$index)"
              v-model="scope.row.userNum"
              :step="1"
              :precision="0"
              :min="1"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="福利类型">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.welfareType"
            @change="
              (val) => {
                scope.row.type = undefined;
                changeUserNum(val, scope.row, scope.$index);
              }
            "
            placeholder="请选择福利类型"
          >
            <el-option
              v-for="item in compuOptWelfareType(tableData, scope.row)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option> </el-select
        ></template>
      </el-table-column>
      <el-table-column label="道具">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.type"
            @change="(val) => changeType(val, scope.row)"
            clearable
            placeholder="请选择福利类型"
          >
            <el-option
              v-for="item in compuOptProps(tableData, scope.row)"
              :key="item.id"
              :disabled="item.disabled"
              :label="item.name"
              :value="item.id"
            >
            </el-option> </el-select
        ></template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.num"
            :step="1"
            :precision="0"
            :min="1"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="disabledAdd(scope.row)"
            @click="add(scope.row, scope.$index)"
            >添加</el-button
          >
          <el-button type="waring" @click="del(scope.row, scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  clearingAppSchemeDetailList,
  updateClearingAppSchemeDetail,
} from "@/api/admin/index";
import {
  optProps,
  EnumProps,
  optWelfareType,
  EnumWelfareType,
} from "@/util/util";

export default {
  data() {
    return {
      tableData: [],
      spanArr: [],
      optWelfareType: optWelfareType,
      optProps: optProps,
      isFirst: false,
    };
  },
  computed: {
    compuOptProps() {
      return (tableData, row) => {
        // 福利类型：基础福利、额外福利。基础福利的道具类型仅无线观看、超级会员，额外福利的道具类型仅金币、观影卡。
        let arr = [];
        const is_UNLIMITED_WATCH = tableData.some(
          (v) =>
            v.userNum === row.userNum &&
            v.welfareType === row.welfareType &&
            v.type === EnumProps.UNLIMITED_WATCH
        );
        const is_SVIP = tableData.some(
          (v) =>
            v.userNum === row.userNum &&
            v.welfareType === row.welfareType &&
            v.type === EnumProps.SVIP
        );
        const is_GOLD = tableData.some(
          (v) =>
            v.userNum === row.userNum &&
            v.welfareType === row.welfareType &&
            v.type === EnumProps.GOLD
        );
        const is_VIDEO_CARD = tableData.some(
          (v) =>
            v.userNum === row.userNum &&
            v.welfareType === row.welfareType &&
            v.type === EnumProps.VIDEO_CARD
        );
        const is_INTEGRAL = tableData.some(
          (v) =>
            v.userNum === row.userNum &&
            v.welfareType === row.welfareType &&
            v.type === EnumProps.INTEGRAL
        );
        if (row.welfareType == EnumWelfareType.FOUNDATIONWELFARE) {
          arr = optProps.filter(
            (v) =>
              v.id == EnumProps.UNLIMITED_WATCH ||
              v.id == EnumProps.SVIP ||
              v.id == EnumProps.INTEGRAL
          );
        }
        if (row.welfareType == EnumWelfareType.EXTRAWELFARE) {
          arr = optProps.filter(
            (v) =>
              v.id == EnumProps.GOLD ||
              v.id == EnumProps.VIDEO_CARD ||
              v.id == EnumProps.INTEGRAL
          );
        }

        arr.forEach((v) => (v.disabled = false));
        arr.forEach((v) => {
          if (v.id === EnumProps.UNLIMITED_WATCH && is_UNLIMITED_WATCH) {
            v.disabled = true;
          }
          if (v.id === EnumProps.SVIP && is_SVIP) {
            v.disabled = true;
          }
          if (v.id === EnumProps.GOLD && is_GOLD) {
            v.disabled = true;
          }
          if (v.id === EnumProps.VIDEO_CARD && is_VIDEO_CARD) {
            v.disabled = true;
          }
          if (v.id === EnumProps.INTEGRAL && is_INTEGRAL) {
            v.disabled = true;
          }
        });
        row.optType = arr;
        return arr;
      };
    },
    compuOptWelfareType() {
      // 基础福利仅能存在一条，
      return (tableData) => {
        const isFOUNDATIONWELFARE = tableData.some(
          (v) => v.welfareType === EnumWelfareType.FOUNDATIONWELFARE
        );
        optWelfareType.forEach((v) => (v.disabled = false));
        if (isFOUNDATIONWELFARE) {
          optWelfareType.forEach((v) => {
            if (v.id === EnumWelfareType.FOUNDATIONWELFARE) {
              v.disabled = true;
            } else {
              v.disabled = false;
            }
          });
        }
        return optWelfareType;
      };
    },
    disCreate() {
      // 5、用户添加一行数据（全局添加按钮），若当前存在未填写的数据时，添加按钮置灰
      return (tableData) => {
        return tableData.some((v) => !v.userNum || !v.welfareType);
      };
    },

    disabledAdd() {
      // 4、同一人数的额外福利可添加最多两种道具（即添加金币和观影卡），例如1人数，2金币，2观影卡
      return (row) => {
        if (!row.userNum || !row.welfareType) {
          return true;
        }
        const tableData = this.tableData.filter(
          (v) => row.userNum === v.userNum && v.welfareType === row.welfareType
        );
        return tableData.length === row.optType.length;
      };
    },
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      clearingAppSchemeDetailList(0).then((res) => {
        this.tableData = res.data.data;
        this.getSpanArr(this.tableData, "userNum");
      });
    },
    create() {
      const item = {
        userNum: undefined,
        type: undefined,
        num: undefined,
        inviteType: undefined,
        welfareType: undefined,
      };
      this.tableData.push(item);
      this.getSpanArr(this.tableData, "userNum");
    },
    changeUserNum(val, row, index) {
      const isfilter = [];
      const isfilterFOUNDATIONWELFARE = [];

      this.tableData.map((v) => {
        if (
          row.welfareType &&
          row.welfareType === EnumWelfareType.EXTRAWELFARE &&
          v.welfareType === EnumWelfareType.EXTRAWELFARE &&
          v.userNum === row.userNum
        ) {
          isfilter.push(v);
        }

        if (
          row.welfareType &&
          row.welfareType === EnumWelfareType.FOUNDATIONWELFARE &&
          v.welfareType === EnumWelfareType.FOUNDATIONWELFARE &&
          v.userNum === row.userNum
        ) {
          isfilterFOUNDATIONWELFARE.push(v);
        }
      });

      if (isfilter.length > 1) {
        this.$message.warning("额外福利类型的人数不能相同");
        this.tableData[index].userNum = "";
        setTimeout(() => {
          this.tableData[index].userNum = undefined;
        });
      }
      if (isfilterFOUNDATIONWELFARE.length > 1) {
        this.$message.warning("基础福利类型的人数不能相同");
        this.tableData[index].userNum = "";
        setTimeout(() => {
          this.tableData[index].userNum = undefined;
        });
      }
      this.getSpanArr(this.tableData, "userNum");
    },
    changeType(val, row) {
      row.type = val;
    },
    submit() {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (!item.userNum || !item.welfareType || !item.type || !item.num) {
          this.$message.warning("请填写完整数据");
          return;
        }
      }
      updateClearingAppSchemeDetail(this.tableData).then(() => {
        this.$message.success("保存成功");
      });
    },
    add(row, index) {
      const item = {
        userNum: row.userNum,
        type: undefined,
        num: undefined,
        inviteType: row.inviteType,
        welfareType: row.welfareType,
      };
      this.tableData.splice(index, 0, item);
      this.getSpanArr(this.tableData, "userNum");
    },
    del(row, index) {
      this.tableData.splice(index, 1);
      this.getSpanArr(this.tableData, "userNum");
    },
    getSpanArr(data, attr) {
      this.spanArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (
            data[i][attr] === data[i - 1][attr] &&
            data[i][attr] &&
            data[i - 1]["welfareType"] &&
            data[i - 1]["welfareType"] == EnumWelfareType.FOUNDATIONWELFARE &&
            data[i]["welfareType"] &&
            data[i]["welfareType"] == EnumWelfareType.FOUNDATIONWELFARE
          ) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else if (
            data[i][attr] === data[i - 1][attr] &&
            data[i][attr] &&
            data[i - 1]["welfareType"] &&
            data[i - 1]["welfareType"] == EnumWelfareType.EXTRAWELFARE &&
            data[i]["welfareType"] &&
            data[i]["welfareType"] == EnumWelfareType.EXTRAWELFARE
          ) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const _row = this.spanArr[rowIndex];
      const _col = _row > 0 ? 1 : 0;

      if (columnIndex === 0) {
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.userNumBox {
  ::v-deep .el-input-number__decrease {
    display: none;
  }
  ::v-deep .el-input-number__increase {
    display: none;
  }
}
</style>
