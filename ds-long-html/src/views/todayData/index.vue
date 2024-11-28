<template>
  <basic-container>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">活跃率</h3>
      <div style="position: relative; display: flex; align-items: center">
        <span style="margin-right: 10px">选择日期</span>
        <el-date-picker
          v-model="activityDateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          id="dateTime"
          :clearable="false"
        />
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="activityRateSearch"
          >查询</el-button
        >
        <el-button @click="activityRateReset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px">
            <h3>次日活跃率</h3>
            <h5>{{ activityData.twoDaysUserActiveCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px">
            <h3>7日内活跃率</h3>
            <h5>{{ activityData.sevenDaysUserActiveCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px">
            <h3>30日内活跃率</h3>
            <h5>{{ activityData.thirtyDaysUserActiveCount }}</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider class="divider"></el-divider>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">留存率</h3>
      <div style="position: relative; display: flex; align-items: center">
        <span style="margin-right: 10px">选择日期</span>
        <el-date-picker
          v-model="retentionDateTime"
          type="date"
          value-format="yyyy-MM-dd"
          :default-value="new Date()"
          placeholder="选择日期"
          id="dateTime"
          :clearable="false"
        />
        <el-button type="primary" style="margin-left: 10px" @click="search"
          >查询</el-button
        >
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>次日留存率</h3>
            <h5>{{ retentionData.twoDaysUserRetentionCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>7日内留存率</h3>
            <h5>{{ retentionData.sevenDaysUserRetentionCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>30日内留存率</h3>
            <h5>{{ retentionData.thirtyDaysUserRetentionCount }}</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider class="divider"></el-divider>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">登录率</h3>
      <div style="position: relative; display: flex; align-items: center">
        <span style="margin-right: 10px">选择日期</span>
        <el-date-picker
          v-model="loginDateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          id="dateTime"
          :clearable="false"
        />
        <el-button type="primary" style="margin-left: 10px" @click="loginSearch"
          >查询</el-button
        >
        <el-button @click="loginReset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>2日登录率</h3>
            <h5>{{ loginData.twoDaysUserLoginCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>7日登录率</h3>
            <h5>{{ loginData.sevenDaysUserLoginCount }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>30日登录率</h3>
            <h5>{{ loginData.thirtyDaysUserLoginCount }}</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import moment from "moment";
import {
  userRetentionCountV2,
  todayUserLoginCount,
  userActiveCountV2,
} from "@/api/admin/index";

const today = new Date();
const dateTime = moment(today).format("YYYY-MM-DD");

export default {
  data() {
    return {
      retentionDateTime: dateTime,
      loginDateTime: dateTime,
      activityDateTime: dateTime,
      retentionData: {},
      loginData: {},
      activityData: {},
    };
  },

  mounted() {
    this.getRetentionData();
    this.getLoginData(); // 登录率
    this.getActivityData();
  },
  methods: {
    getRetentionData() {
      const params = {
        currentDateTimeStart: `${this.retentionDateTime} 00:00:00`,
        currentDateTimeEnd: `${this.retentionDateTime} 23:59:59`,
      };
      userRetentionCountV2(params).then((res) => {
        this.retentionData = res.data.data;
      });
    },
    getLoginData() {
      todayUserLoginCount({
        currentDateTimeStart: `${this.loginDateTime} 00:00:00`,
        currentDateTimeEnd: `${this.loginDateTime} 23:59:59`,
      }).then((res) => {
        this.loginData = res.data.data;
      });
    },
    getActivityData() {
      userActiveCountV2({
        currentDateTimeStart: `${this.activityDateTime} 00:00:00`,
        currentDateTimeEnd: `${this.activityDateTime} 23:59:59`,
      }).then((res) => {
        this.activityData = res.data.data;
      });
    },
    activityRateSearch() {
      this.getActivityData();
    },
    activityRateReset() {
      this.activityDateTime = dateTime;
      this.getActivityData();
    },
    search() {
      this.getRetentionData();
    },
    reset() {
      this.retentionDateTime = dateTime;
      this.getRetentionData();
    },
    loginSearch() {
      this.getLoginData();
    },
    loginReset() {
      this.loginDateTime = dateTime;
      this.getLoginData();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .el-col {
    text-align: center;
    margin-bottom: 15px;
  }
  .bottom {
    cursor: pointer;
    background-color: #e8e8e8;
    .el-button {
      font-size: 16px;
    }
  }
}
.el-card {
  border-radius: 4px;
  border: 1px solid #ebeef5 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.divider {
  margin: 15px 0;
}
</style>
