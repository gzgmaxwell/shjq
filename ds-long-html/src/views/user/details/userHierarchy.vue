<template>
  <div class="content">
    <div>
      <div v-for="(item, index) in list" :key="index" class="treeStyle">
        <div style="position: relative">
          <el-button :type="getButtonType(item).type" round>{{
            item.nickname
          }}</el-button>
          <el-popover
            style="position: absolute; top: -10px"
            placement="right"
            trigger="hover"
            :content="getButtonType(item).content"
          >
            <span
              slot="reference"
              :class="['el-icon-question', getButtonType(item).color]"
            ></span>
          </el-popover>
        </div>
        <div class="arrow-container" v-if="list.length - 1 !== index">
          <div class="line"></div>
          <div class="arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userDeepInfo } from "@/api/admin/index";
import { ENUM_USER_STATUS } from "@/util/util";
export default {
  data() {
    return {
      list: [],
    };
  },
  computed: {
    getButtonType() {
      return (item) => {
        let colors = "";
        let popoverColors = "";
        let disabledText = "";
        if (item.userDeepType === "CURRENT") {
          colors = "success";
          popoverColors = "greenColor";
          disabledText = "当前用户";
        } else if (item.userDeepType === "INVITER") {
          colors = "primary";
          popoverColors = "blueColor";
          disabledText = "当前用户的直接邀请人";
        } else if (item.userDeepType === "INIT") {
          colors = "warning";
          popoverColors = "orangeColor";
          disabledText = "该链路初始用户";
        }
        if (item.status !== ENUM_USER_STATUS.enable) {
          return {
            type: "info",
            content: `${disabledText} 已注销/删除/禁用`,
            color: "grayColor",
          };
        } else {
          return {
            type: colors,
            content: disabledText,
            color: popoverColors,
          };
        }
      };
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let userId = this.$route.query.id;
      userDeepInfo(userId).then((res) => {
        this.list = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  .treeStyle {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.el-button {
  margin: 0;
  width: 120px;
}
.custom-icon {
  font-size: 24px; /* 设置图标大小 */
  width: 30px; /* 设置图标宽度 */
  height: 10px; /* 设置图标高度 */
}
.arrow-container {
  position: relative;
  width: 20px;
  height: 45px;
  margin-bottom: 6px;
  margin-top: 1px;
}

.line {
  width: 2px; /* 竖线的宽度 */
  height: 100%; /* 竖线的高度 */
  background-color: #f00; /* 竖线的颜色 */
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%); /* 将竖线水平居中 */
}

.arrow {
  width: 0;
  height: 0;
  border-left: 3px solid transparent; /* 箭头左侧边框 */
  border-right: 3px solid transparent; /* 箭头右侧边框 */
  border-top: 12px solid #f00; /* 箭头上边框 */
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translateX(-50%);
}
.blueColor {
  color: #66b1ff;
}
.grayColor {
  color: gray;
}
.greenColor {
  color: #85ce61;
}
.orangeColor {
  color: #e6a23c;
}
</style>
