<template>
  <el-form ref="ruleForm" class="demo-ruleForm" label-width="100px">
    <el-table
      :data="tableData.propsConfigList"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: -20px"
    >
      <el-table-column prop="taskName" label="任务名称" width="180">
      </el-table-column>
      <el-table-column label="奖励道具">
        <template slot-scope="scope">
          <el-select
            style="width: 80%"
            :value="scope.row.propName"
            clearable
            placeholder="请选择奖励道具"
            @change="(val) => handleSelectChange(val, scope.row)"
          >
            <el-option
              v-for="item in optProps"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span v-if="row.nameEnum !== EnumTaskType.RECHARGE_ACTIVITY">
            <span
              class="el-icon-circle-plus-outline ml5 fs16"
              @click="handleAdd(scope.row, scope.$index)"
            ></span>
            <span
              v-if="compuClass(tableData, scope.row.taskId)"
              class="el-icon-remove-outline fs16 ml5"
              @click="handleDel(scope.$index)"
            ></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="道具数量"
        v-if="row.nameEnum !== EnumTaskType.RECHARGE_ACTIVITY"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.propQuantity"
            :step="compuShow(scope.row.propName).step"
            :precision="compuShow(scope.row.propName).precision"
            :min="compuShow(scope.row.propName).min"
            style="width: 80%"
          />
          <span class="ml5">{{ compuOptProps(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置条件" v-else>
        <template slot-scope="scope">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span>赠送天数</span>
            <div style="text-align: right">
              <el-input-number
                v-model="scope.row.propQuantity"
                :step="1"
                :precision="0"
                :max="3600"
                :min="1"
                style="width: 70%"
              />
              <span style="margin-left: 5px">天</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="福利人群"
        v-if="row.nameEnum == EnumTaskType.DAILY_COMPLIMENTARY"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.scope"
            multiple
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in optWelfare"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item
      class="mt10"
      label="观看时长"
      v-if="row.nameEnum == EnumTaskType.CUMULATIVE_VIEWING"
    >
      <el-input
        v-model="tableData.property"
        placeholder="请输入观看时长"
        clearable
        style="width: 33%; margin-left: 90px"
      >
        <template slot="append">秒</template>
      </el-input>
    </el-form-item>
    <el-form-item
      class="mt10"
      label="单次充值金币"
      v-if="row.nameEnum == EnumTaskType.RECHARGE_ACTIVITY"
    >
      <el-input-number
        v-model="tableData.property"
        :step="1"
        :precision="0"
        :max="99999999"
        :min="1"
        style="width: 33%; margin-left: 90px"
      />
    </el-form-item>
    <el-form-item class="mt20">
      <el-button type="primary" @click="submitForm('ruleForm')">{{
        $t("determine")
      }}</el-button>
      <el-button @click="row.callback && row.callback()">{{
        $t("cancel")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { taskDetailsSave, taskDetails } from "@/api/marketing/index";
import { optProps, EnumProps, EnumTaskType, optWelfare } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      tableData: {},
      spanArr: [],
      optProps: [],
      EnumTaskType: EnumTaskType,
      optWelfare: optWelfare,
    };
  },
  computed: {
    compuClass() {
      return (tableData, type) => {
        return (
          tableData.propsConfigList.filter((v) => v.taskId === type).length > 1
        );
      };
    },
    compuOptProps() {
      return (row) => {
        return optProps.find((v) => v.id === row.propName)?.unit;
      };
    },
    compuShow() {
      return (props) => {
        const arr = [EnumProps.SVIP, EnumProps.VIDEO_CARD, EnumProps.INTEGRAL];
        if (arr.includes(props)) {
          return {
            step: 1,
            precision: 0,
            min: 1,
          };
        }
        return {
          step: 1,
          precision: 2,
          min: 1,
        };
      };
    },
  },
  mounted() {
    const arr = [EnumProps.GOLD, EnumProps.UNLIMITED_WATCH];
    if (this.row.nameEnum == EnumTaskType.RECHARGE_ACTIVITY) {
      this.optProps = optProps.filter((v) => v.id == EnumProps.SVIP);
    } else {
      this.optProps = optProps.filter((v) => !arr.includes(v.id));
    }
    if (this.row.id) {
      this.getInfo();
    }
  },

  methods: {
    handleSelectChange(val, item) {
      let isRepeat = this.tableData.propsConfigList.some((v) => {
        return v.propName == val && v.taskId == item.taskId;
      });
      if (isRepeat) {
        item.propName = undefined;
        item.propQuantity = 1;
        this.$message.warning(
          "系统提示：检测到重复输入，请确认信息无误后再次提交"
        );
        return;
      }
      item.propName = val;
      item.propQuantity = 1;
    },
    getInfo() {
      taskDetails(this.row.id).then((res) => {
        if (this.row.nameEnum === EnumTaskType.DAILY_COMPLIMENTARY) {
          const data = res.data.data;
          data.propsConfigList = data.propsConfigList.map((item) => {
            return {
              ...item,
              scope: item?.scope ? item.scope.split(",") : [],
            };
          });
          this.tableData = data;
        }
        if (
          this.row.nameEnum == EnumTaskType.RECHARGE_ACTIVITY &&
          res.data.data.propsConfigList &&
          res.data.data.propsConfigList.length < 1
        ) {
          this.tableData = {
            propsConfigList: [
              {
                taskName: "充值活动",
                taskId: "20",
                propName: "",
                propQuantity: "1",
              },
            ],
            property: null,
            taskId: "20",
          };
          this.getSpanArr(this.tableData.propsConfigList, "taskId");
        } else {
          this.tableData = res.data.data;
          this.getSpanArr(this.tableData.propsConfigList, "taskId");
        }
      });
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
          if (data[i][attr] === data[i - 1][attr] && data[i][attr]) {
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
    handleDel(index) {
      this.tableData.propsConfigList.splice(index, 1);
      this.getSpanArr(this.tableData.propsConfigList, "taskId");
    },
    handleAdd(row, index) {
      const item = {
        propName: "",
        propQuantity: "",
        taskId: row.taskId,
        taskName: row.taskName,
        scope: [],
      };
      this.tableData.propsConfigList.splice(index + 1, 0, item);
      this.getSpanArr(this.tableData.propsConfigList, "taskId");
    },
    submitForm() {
      this.commit();
    },
    commit() {
      const isDailyComplimentary =
        this.row.nameEnum === EnumTaskType.DAILY_COMPLIMENTARY;
      this.tableData.propsConfigList = this.tableData.propsConfigList.map(
        (v) => {
          return {
            ...v,
            scope: isDailyComplimentary ? v.scope.join(",") : null,
          };
        }
      );
      const params = {
        property: this.tableData.property,
        propsConfigList: this.tableData.propsConfigList,
        taskId: this.row.id,
      };
      let reg = /^[1-9]\d*$/;
      if (this.row.nameEnum == EnumTaskType.CUMULATIVE_VIEWING) {
        if (!this.tableData.property) {
          return this.$message.warning("观看时长必填");
        }
        if (!reg.test(this.tableData.property)) {
          return this.$message.warning("观看时长必须为大于0的正整数");
        }
      }
      for (let i = 0; i < this.tableData.propsConfigList.length; i++) {
        const item = this.tableData.propsConfigList[i];
        if (!item.propName) {
          this.$message.warning("奖励道具必填");
          return;
        }
        if (!item.propQuantity && item.propQuantity !== 0) {
          this.$message.warning("道具数量必填");
          return;
        }
      }
      taskDetailsSave(params).then(() => {
        this.row.callback(true);
        this.$message.success("配置成功");
      });
    },
  },
};
</script>
