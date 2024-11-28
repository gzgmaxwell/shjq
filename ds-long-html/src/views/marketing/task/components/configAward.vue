<template>
  <el-form ref="ruleForm" class="demo-ruleForm">
    <el-button type="primary" @click="handleAdd()" style="margin-top: -20px"
      >添加奖励</el-button
    >
    <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
      <el-table-column label="奖励道具">
        <template slot-scope="scope">
          <el-select
            style="width: 80%"
            v-model="scope.row.props"
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
      <el-table-column label="数量">
        <template slot-scope="scope">
          <el-input-number
            v-if="compuShow(scope.row.props)"
            v-model="scope.row.propsNum"
            style="width: 80%"
            :step="compuShow(scope.row.props).step"
            :precision="compuShow(scope.row.props).precision"
            :min="compuShow(scope.row.props).min"
            clearable
          />
          <el-input
            v-else
            v-model="scope.row.propsNum"
            style="width: 80%"
          ></el-input>
          <span class="ml5">{{ compuOptProps(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖几率">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.probability"
            style="width: 80%"
            :precision="1"
          />
          <span class="ml5">%</span>
        </template>
      </el-table-column>
    </el-table>

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
import { propsSave, propsList } from "@/api/marketing/index";
import { optProps, EnumProps } from "@/util/util";

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
      tableData: [],
      optProps: [],
    };
  },
  computed: {
    compuClass() {
      return (tableData, type) => {
        return tableData.filter((v) => v.id === type).length > 1;
      };
    },
    compuOptProps() {
      return (row) => {
        return optProps.find((v) => v.id === row.props)?.unit;
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
    if (this.row.id) {
      this.getInfo();
    }
    const arr = [EnumProps.GOLD, EnumProps.UNLIMITED_WATCH];
    this.optProps = optProps.filter((v) => !arr.includes(v.id));
  },

  methods: {
    getInfo() {
      propsList({
        schemeId: this.row.id,
      }).then((res) => {
        this.tableData = res.data?.data || [];
      });
    },

    handleDel(index) {
      this.tableData.splice(index, 1);
    },
    handleAdd() {
      const item = {
        props: "",
        propsNum: "",
        probability: "",
      };
      this.tableData.push(item);
    },
    submitForm() {
      this.commit();
    },
    commit() {
      const params = {
        propsList: this.tableData,
        schemeId: this.row.id,
      };
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (!item.props) {
          this.$message.warning("请选择奖励道具");
          return;
        }
        if (!item.propsNum) {
          this.$message.warning("请填写道具数量");
          return;
        }
      }
      propsSave(params).then(() => {
        this.row.callback(true);
        this.$message.success("配置成功");
      });
    },
  },
};
</script>
