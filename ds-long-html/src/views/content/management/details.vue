<template>
  <div class="mt10">
    <basic-container>
      <div class="backBtn">
        <div class="backClass">
          <el-button type="primary" @click="goback">返 回</el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="视频信息"
            name="first"
            v-if="createTabVisible('first')"
          >
            <commContentVideoCheck
              :key="'first'"
              :webPageMenu="$route.query.webPageMenu"
              :row="$route.query"
            />
          </el-tab-pane>
          <el-tab-pane
            label="互动管理"
            name="third"
            v-if="createTabVisible('third')"
          >
            <interact :key="'third'" />
          </el-tab-pane>
          <el-tab-pane
            label="数据管理"
            name="fourth"
            v-if="createTabVisible('fourth')"
          >
            <analysis :key="'fourth'" />
          </el-tab-pane>
          <el-tab-pane
            label="用户购买详情"
            name="five"
            v-if="$route.query.watchLevel == 'charge'"
          >
            <userBuyDetails :key="'five'" />
          </el-tab-pane>
          <el-tab-pane
            label="操作日志"
            name="six"
            v-if="createTabVisible('six') && isNotRentVideoCenter()"
          >
            <operationLog :key="'six'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { ENUM_USER_STATUS, menuEnum } from "@/util/util";
import interact from "./component/interact.vue";
import analysis from "./component/analysis.vue";
import userBuyDetails from "./component/userBuyDetails.vue";
import operationLog from "./component/operationLog.vue";
import commContentVideoCheck from "@/views/common/commVideo/commContentVideoCheck.vue";
export default {
  components: {
    interact,
    analysis,
    userBuyDetails,
    operationLog,
    commContentVideoCheck,
  },
  data() {
    return {
      ENUM_USER_STATUS: ENUM_USER_STATUS,
      activeName: "",
    };
  },
  mounted() {
    this.setActiveTab();
  },
  methods: {
    isNotRentVideoCenter() {
      return this.$route.query.webPageMenu !== menuEnum.rentVideoCenter;
    },
    goback() {
      this.$router.go(-1);
    },
    createTabVisible(tabName) {
      const visibleTabs = ["first", "third", "fourth", "six"];
      const isTabVisible = visibleTabs.includes(tabName);
      const isLastVisibleTab =
        tabName === "five" &&
        (this.$route.query.createUserStatus !== ENUM_USER_STATUS.delete ||
          visibleTabs.length === 1);
      return (
        isTabVisible &&
        (this.$route.query.createUserStatus !== ENUM_USER_STATUS.delete ||
          isLastVisibleTab)
      );
    },
    setActiveTab() {
      const visibleTabNames = ["first", "third", "fourth", "five", "six"];
      if (this.$route.query.tab === "fourth") {
        this.activeName = this.createTabVisible("fourth") ? "fourth" : "third";
      } else {
        this.activeName =
          visibleTabNames.find((tabName) => this.createTabVisible(tabName)) ||
          "five";
      }
    },
  },
};
</script>
