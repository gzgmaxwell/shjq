<template>
  <basic-container>
    <el-form ref="ruleForm" class="demo-ruleForm" style="position: relative">
      <el-button
        type="primary"
        @click="handleAdd()"
        style="margin-top: -20px"
        :disabled="compuAdd(tableData)"
        >添加</el-button
      >
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
        :disabled="!tableData.length"
        >保存</el-button
      >
      <div style="position: absolute; right: 0px; top: 0px">
        <span class="mr5">修改说明</span>
        <el-tooltip placement="top">
          <div slot="content">
            <div>
              1、默认预制一条数据,名称为“分类1”,权重分值为0-20000,观看权限为超级会员、观影卡可看。(可修改)
            </div>
            <div>
              2、权重分值仅支持输入整数,且每一行最终需是连续的数值,即下一行的起始值为上一行的终末值的下一位,例如:0-200,201-20000、且在范围取值中,末端数值需大于等于起始端数值
            </div>
            <div>3、当输入到分值20000时,不允许继续添加下一行</div>
            <div>4、观看权限勾选说明:</div>
            <div style="padding-left: 10px">
              <div>
                4.1 勾选普通用户可看时,<span style="color: red"
                  >超级会员可看互斥(单选),观影卡可看不可选择</span
                >,代表所有用户可观看。
              </div>
              <div>
                4.2 当勾选超级会员可看时,<span style="color: red"
                  >普通用户可看互斥(单选)</span
                >
                ,此时可继续勾选观影卡可看,即代表该视频仅超级会员可看,再勾选观影卡及代表该视频可供普通用户使用观影卡观看。
              </div>
              <div>
                4.3
                当直接勾选观影卡可看时,此时默认一并勾选上超级会员可看。代表超级会员可看,同时普通用户可使用观影卡可看。(新添加时)。
              </div>
              <div>4.4 每条数据 普通用户可看、超级会员可看，必须选择其一</div>
            </div>
            <div>5、该列表最后一条数据必须为20000才可保存</div>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column label="权重分类" align="center" width="400">
          <template slot-scope="scope">
            <el-input
              v-model.trim="scope.row.weightCategory"
              clearable
              style="width: 70%"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="权重分值" align="center" width="300">
          <template slot-scope="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <el-input
                v-model="scope.row.weightScoreLowerLimit"
                style="width: 30%"
              ></el-input>
              <span class="ml5 mr5">-</span>
              <el-input
                v-model="scope.row.weightScoreUpperLimit"
                style="width: 30%"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="观看权限" align="center" width="400">
          <template slot-scope="scope">
            <el-radio-group
              v-model="scope.row.watchLevel"
              class="mr20"
              @change="watchLevelChange(scope.row.watchLevel, scope.$index)"
            >
              <el-radio
                v-for="item in optionWatchPermission"
                :key="item.id"
                :label="item.id"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <el-checkbox
              v-model="scope.row.videoCardVisibility"
              :disabled="compDisable(scope.row.watchLevel)"
              @change="
                videoCardVisibilityChange(
                  scope.row.videoCardVisibility,
                  scope.$index
                )
              "
              >观影卡可看</el-checkbox
            >
          </template>
        </el-table-column>
        <el-table-column label="新用户推荐权重" align="center" width="200">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.NewUserWeightScore"
              clearable
              style="width: 70%"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="danger ml5" @click="del(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </basic-container>
</template>
<script>
import { allList, saveList } from "@/api/admin/index";
import {
  debounceCallBack,
  optionWatchPermission,
  ENUM_WATCH_PERMISSION,
} from "@/util/util";

export default {
  //权重管理
  name: "weightManagement",
  data() {
    return {
      optionWatchPermission: optionWatchPermission,
      // optionWatchPermission: optionWatchPermission.filter(
      //   (item) => item.id !== ENUM_WATCH_PERMISSION.charge
      // ),
      tableData: [],
    };
  },
  computed: {
    compuAdd() {
      return (tableData) => {
        // 检查是否是空数组，如果是空数组则返回 false（不禁用）
        if (tableData.length === 0) {
          return false;
        }

        // 检查最后一项的 weightScoreUpperLimit 是否为数字并且是否超过 20000
        const isUpperLimitValid =
          !Number(tableData.at(-1)?.weightScoreUpperLimit) ||
          Number(tableData.at(-1)?.weightScoreUpperLimit) >= 20000;

        // 检查是否存在 weightScoreLowerLimit 大于 weightScoreUpperLimit 的情况
        const hasLowerExceeds = tableData.some(
          (item) =>
            Number(item.weightScoreLowerLimit) >
            Number(item.weightScoreUpperLimit)
        );

        // 如果符合任意一个条件，返回 true，否则返回 false
        return isUpperLimitValid || hasLowerExceeds;
      };
    },

    // 用于判断是否禁用
    compDisable() {
      return (val) => {
        // 如果val是普通用户可看，则返回true，表示禁用
        if (val === ENUM_WATCH_PERMISSION.free) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    // 监听权限级别变化
    watchLevelChange(val, index) {
      // 如果权限级别为免费
      if (val === ENUM_WATCH_PERMISSION.free) {
        // 将对应索引的表格数据中的观影卡可看设置为false
        this.tableData[index].videoCardVisibility = false;
      }
    },
    // 监听观影卡可看变化
    videoCardVisibilityChange(val, index) {
      // 如果观影卡可看
      if (val) {
        // 将该观看权限设置为svip
        this.tableData[index].watchLevel = ENUM_WATCH_PERMISSION.svip;
      }
    },
    // 获取信息
    getInfo() {
      // 调用allList函数，获取数据
      allList().then((res) => {
        // 将获取到的数据映射成新的数组
        this.tableData = res.data?.data.map((item) => {
          // 返回新的对象，将videoCardVisibility属性转换为布尔值，NewUserWeightScore属性赋值为500
          return {
            ...item,
            videoCardVisibility: item.videoCardVisibility === 1 ? true : false,
            NewUserWeightScore: 500,
          };
        });
      });
    },
    del(index) {
      if (this.tableData && this.tableData.length <= 1) {
        return this.$message.error("至少保留一条数据");
      }
      this.tableData.splice(index, 1);
    },
    // 处理添加按钮点击事件
    handleAdd() {
      if (this.tableData.length === 0) {
        // 如果表格数据为空，则直接添加一行
        this.tableData.push({
          weightCategory: "", // 权重类别
          weightScoreLowerLimit: 0, // 权重下限
          weightScoreUpperLimit: 20000, // 权重上限
          watchLevel: "", // 观看权限
          videoCardVisibility: false, // 观影卡是否可见
          NewUserWeightScore: 500, // 新用户权重
        });
      } else {
        // 获取表格最后一行的权重上限值，并加1
        const lastCloumn =
          Number(this.tableData.at(-1).weightScoreUpperLimit) + 1;
        // 创建一个新行数据
        const item = {
          weightCategory: "", // 权重类别
          weightScoreLowerLimit: lastCloumn, // 权重下限
          weightScoreUpperLimit: 20000, // 权重上限
          watchLevel: "", // 观看权限
          videoCardVisibility: false, // 观影卡是否可见
          NewUserWeightScore: 500, // 新用户权重
        };
        // 将新行数据添加到表格数据中
        this.tableData.push(item);
      }
    },
    submitForm() {
      this.commit();
    },
    commit() {
      const params = this.tableData.map((item) => {
        return {
          ...item,
          videoCardVisibility: item.videoCardVisibility === true ? 1 : 0,
          weightScoreLowerLimit: Number(item.weightScoreLowerLimit),
          weightScoreUpperLimit: Number(item.weightScoreUpperLimit),
        };
      });

      for (let i = 0; i < this.tableData.length; i++) {
        const newUserReg = /^[1-9]\d*$/;
        const reg = /^[0-9]\d*$/;
        const item = this.tableData[i];
        const previousItem = this.tableData[i - 1];

        if (i > 0) {
          if (
            Number(item.weightScoreLowerLimit) !==
            Number(previousItem.weightScoreUpperLimit) + 1
          ) {
            return this.$message.warning(
              `第 ${i + 1} 条开始值必须是第 ${i} 条结束值后一位连贯数字`
            );
          }
        }
        if (item.weightCategory === "") {
          return this.$message.warning("请填写权重分类");
        }
        if (
          item.weightScoreLowerLimit === "" ||
          item.weightScoreUpperLimit === ""
        ) {
          return this.$message.warning("请填写权重分值");
        }
        if (
          !reg.test(item.weightScoreLowerLimit || item.weightScoreUpperLimit)
        ) {
          return this.$message.warning("权重分值必须是整数");
        }
        if (
          Number(item.weightScoreLowerLimit) >
          Number(item.weightScoreUpperLimit)
        ) {
          return this.$message.warning("权重分值结束值必须大于开始值");
        }
        if (!item.watchLevel) {
          return this.$message.warning("请选择单选观看权限");
        }
        if (item.NewUserWeightScore === "") {
          return this.$message.warning("请填写新用户推荐权重");
        }
        if (!newUserReg.test(item.NewUserWeightScore)) {
          return this.$message.warning("新用户推荐权重必须是正整数");
        }
        if (Number(this.tableData.at(-1).weightScoreUpperLimit) !== 20000) {
          return this.$message.warning("数据结束值必须是20000");
        }
        if (this.tableData && this.tableData.length === 1) {
          if (Number(item.weightScoreLowerLimit) !== 0) {
            return this.$message.warning("数据开始值必须是0");
          }
        }
      }
      const comSubmit = () => {
        return saveList(params).then(() => {
          this.$message.success("保存成功");
          this.getInfo();
          return Promise.resolve();
        });
      };
      debounceCallBack(comSubmit)();
    },
  },
};
</script>
