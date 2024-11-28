<template>
  <basic-container>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">总数据</h3>

      <div style="position: relative; display: flex; align-items: center">
        <span style="margin-right: 10px">选择时间</span>
        <!-- <el-date-picker
          v-model="dateTime"
          type="date"
          placeholder="选择日期"
          id="dateTime"
        >
        </el-date-picker> -->
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        >
        </el-date-picker>
        <el-button type="primary" style="margin-left: 10px" @click="search"
          >查询</el-button
        >
        <el-button @click="reset">重置</el-button>
        <div class="box">
          <el-button class="btn" type="success">导出</el-button>
          <el-date-picker
            class="datePickerStyle"
            v-model="totalDataDateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDateChange"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>总用户</h3>
            <h5 v-if="totalData.userCount >= 0">
              {{ Number(totalData.userCount).toLocaleString() || 0 }}人
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>绑定电话总用户</h3>
            <h5 v-if="totalData.bindMobileUserCount >= 0">
              {{
                Number(totalData.bindMobileUserCount).toLocaleString() || 0
              }}人
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>超级会员总用户</h3>
            <h5 v-if="totalData.svipUserCount >= 0">
              {{ Number(totalData.svipUserCount).toLocaleString() || 0 }}人
            </h5>
          </div>
        </el-card>
      </el-col>
      <!-- 新增 -->
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div class="ConversionStyle">
            <div style="margin-top: 50px">
              <h5 v-if="totalData.payUserCount >= 0">
                合计
                {{ Number(totalData.payUserCount).toLocaleString() || 0 }}
                人付费
              </h5>
            </div>
            <div style="padding: 14px; margin-left: -80px">
              <h3>付费转换率</h3>
              <h5>
                {{ totalData.payUserRetention || 0 }}
              </h5>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                placement="top"
                trigger="hover"
                content="选择时间范围内的新注册用户为X,X在截至当前查询时间已成为付费用户的为Y,计算公式:Y/X"
              >
                <span slot="reference" class="el-icon-question question"></span>
              </el-popover>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div style="padding: 14px">
            <h3>观看平均时长</h3>
            <div>
              {{ totalData.seeAvgMs || "00:00:00" }}
            </div>
            <span
              style="color: #409eff; cursor: pointer"
              @click="durationDetail(totalData)"
              >详情</span
            >
          </div>
          <span style="position: absolute; top: 10px; right: 25px">
            <el-popover
              placement="top"
              trigger="hover"
              content="选择时间范围内的用户总观看时长除以总观看人数"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
        </el-card>
      </el-col>
    </el-row>

    <el-divider class="divider"></el-divider>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">基础数据</h3>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>充值总额</h3>
            <h5>
              {{ Number(topUpData.tradeAmountTotal).toLocaleString() || 0 }}¥
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>金币充值总额</h3>
            <h5>
              {{ Number(topUpData.rechargeAmountTotal).toLocaleString() || 0 }}¥
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>会员充值总额</h3>
            <h5>
              {{
                Number(topUpData.openMemberAmountTotal).toLocaleString() || 0
              }}¥
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>C端用户提现总额</h3>
            <h5>
              {{
                Number(withdrawData.withdrawAmountTotal).toLocaleString() || 0
              }}¥
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h3>金币消费</h3>
            <h5>{{ Number(consumption.totalGold).toLocaleString() || 0 }}¥</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-divider class="divider"></el-divider>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">活跃率</h3>
      <div>
        <span style="margin-right: 10px">选择时间</span>
        <el-date-picker
          v-model="BasicsDateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        >
        </el-date-picker>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="basicsSearch"
          >查询</el-button
        >
        <el-button @click="basicsReset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px">
            <h3>新增用户</h3>
            <h5 style="line-height: 36px">
              {{
                isNaN(Number(activityData.todayAddUserCount))
                  ? 0
                  : Number(activityData.todayAddUserCount).toLocaleString()
              }}
              人
            </h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div style="padding: 14px; height: 130px">
            <h3>登录用户</h3>
            <h5 style="line-height: 36px">
              合计
              {{
                isNaN(Number(activityData.todayLoginUserCount))
                  ? 0
                  : Number(activityData.todayLoginUserCount).toLocaleString()
              }}人
            </h5>
          </div>
          <span style="position: absolute; top: 10px; right: 25px">
            <el-popover
              placement="top"
              trigger="hover"
              content="选择范围内的用户,若登录一次即计算一人,多次登录不重复计算"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div style="padding: 14px; height: 130px">
            <h3>活跃用户</h3>
            <div class="activeUserStyle">
              <div>
                合计
                {{
                  isNaN(Number(activityData.todayActiveUserCount))
                    ? 0
                    : Number(activityData.todayActiveUserCount).toLocaleString()
                }}
                人
              </div>
              <div>
                <span
                  >会员
                  {{
                    isNaN(Number(activityData.todayActiveVipUserCount))
                      ? 0
                      : Number(
                          activityData.todayActiveVipUserCount
                        ).toLocaleString()
                  }}
                  人</span
                >&nbsp;
                <span
                  >占比
                  {{ activityData.todayActiveVipUserRetention || 0 }}</span
                >
              </div>
              <div>
                <span
                  >非会员
                  {{
                    isNaN(Number(activityData.todayActiveNotVipUserCount))
                      ? 0
                      : Number(
                          activityData.todayActiveNotVipUserCount
                        ).toLocaleString()
                  }}
                  人</span
                >&nbsp;
                <span
                  >占比 {{ activityData.todayActiveNotVipRetention || 0 }}</span
                >
              </div>
            </div>
          </div>
          <span style="position: absolute; top: 10px; right: 25px">
            <el-popover
              placement="top"
              trigger="hover"
              content="选择范围内的用户,用户观看时长满3分钟"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>次日活跃率</h3>
                <h3>{{ activityData.yesterdayAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  活跃 {{ activityData.yesterdayUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ activityData.yesterdayUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    activityData.userAvgYesterdayLoginDTOList,
                    '次日活跃率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>7日内活跃率</h3>
                <h3>{{ activityData.sevenDaysAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  活跃 {{ activityData.sevenDaysUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ activityData.sevenDaysUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    activityData.userAvgSevenDaysLoginDTOList,
                    '7日内活跃率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>30日内活跃率</h3>
                <h3>{{ activityData.oneMonthAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  活跃 {{ activityData.oneMonthUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ activityData.oneMonthUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    activityData.userAvgOneMonthLoginDTOList,
                    '30日内活跃率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0"></h3>
      <div>
        <span style="margin-right: 10px">注册用户</span>
        <el-date-picker
          v-model="activityDateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        >
        </el-date-picker>
        <span style="margin: 0 10px">时间</span>
        <el-date-picker
          v-model="loginDateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        >
        </el-date-picker>
        <el-button type="primary" style="margin-left: 10px" @click="loginSearch"
          >查询</el-button
        >
        <el-button @click="loginReset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div class="loginRateStyle">
            <div>
              <h3>登录率</h3>
              <h5>{{ loginData.todayLoginUserRetention || 0 }}</h5>
            </div>
            <h5 style="margin-left: 35px; margin-top: 65px">
              合计登录
              {{
                isNaN(Number(loginData.todayLoginUserCount))
                  ? 0
                  : Number(loginData.todayLoginUserCount).toLocaleString()
              }}
              人
            </h5>
          </div>
          <span style="position: absolute; top: 10px; right: 25px">
            <el-popover
              placement="top"
              trigger="hover"
              content="统计范围内的注册用户为X,X在第二个时间范围内登录的人为Y.计算公式:Y/X"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <div class="loginRateStyle">
            <div>
              <h3>活跃率</h3>
              <h5>{{ loginData.todayActiveUserRetention || 0 }}</h5>
            </div>
            <h5 style="margin-left: 35px; margin-top: 65px">
              合计活跃
              {{
                isNaN(Number(loginData.todayActiveUserCount))
                  ? 0
                  : Number(loginData.todayActiveUserCount).toLocaleString()
              }}
              人
            </h5>
          </div>
          <span style="position: absolute; top: 10px; right: 25px">
            <el-popover
              placement="top"
              trigger="hover"
              content="统计范围内的注册用户为X,X在第二个时间范围内观看时间满3分钟的人为Y.计算公式:Y/X"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </span>
        </el-card>
      </el-col>
    </el-row>
    <el-divider class="divider"></el-divider>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">留存率</h3>
      <div>
        <span style="margin-right: 10px">选择时间</span>
        <el-date-picker
          v-model="retentionDateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        >
        </el-date-picker>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="retentionSearch"
          >查询</el-button
        >
        <el-button @click="retentionReset">重置</el-button>
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>次日留存率</h3>
                <h3>{{ retentionData.yesterdayAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  登录 {{ retentionData.yesterdayUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ retentionData.yesterdayUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    retentionData.userAvgYesterdayLoginDTOList,
                    '次日留存率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>7日内留存率</h3>
                <h3>{{ retentionData.sevenDaysAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  登录 {{ retentionData.sevenDaysUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ retentionData.sevenDaysUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    retentionData.userAvgSevenDaysLoginDTOList,
                    '7日内留存率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px; height: 130px; position: relative">
            <div class="retentionStyle">
              <div>
                <h3>30日内留存率</h3>
                <h3>{{ retentionData.oneMonthAvgRetention || 0 }}</h3>
              </div>
              <div>
                <div style="margin-left: 50px; padding: 5px 0">
                  登录 {{ retentionData.oneMonthUserLoginCount || 0 }}人
                </div>
                <div style="margin-left: 50px; padding: 5px 0">
                  合计 {{ retentionData.oneMonthUserAddCount || 0 }}人
                </div>
              </div>
              <div
                class="detailsStyle"
                @click="
                  retentionDtails(
                    retentionData.userAvgOneMonthLoginDTOList,
                    '30日内留存率'
                  )
                "
              >
                详情
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      v-if="visible"
      width="70%"
      :close-on-click-modal="false"
    >
      <detailsPage
        :detailsData="detailsData"
        :columnLabel="columnLabel"
      ></detailsPage>
    </el-dialog>
    <el-dialog
      :visible.sync="durationVisible"
      v-if="durationVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <durantionLineChart :durationData="durationData"></durantionLineChart>
    </el-dialog>
  </basic-container>
</template>

<script>
import moment from "moment";
import {
  userLoginCountV2,
  queryTradeAmountTotal,
  withdrawStatistics,
  platformGoldExpenditure,
  userTotalCount,
  summaryExport,
  userAvgLoginCountV2,
  userLoginAndActiveCount,
} from "@/api/admin/index";
import { downloadExcel } from "@/util/util";
import durantionLineChart from "./components/durantionLineChart.vue";
import detailsPage from "./components/detailsPage.vue";
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime = endMomentDate.format("YYYY-MM-DD HH:mm:ss");

export default {
  components: { durantionLineChart, detailsPage },
  data() {
    return {
      columnLabel: "",
      detailsData: [],
      visible: false,
      durationVisible: false,
      pickerOptions: {
        disabledDate: (time) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return time.getTime() >= tomorrow.getTime();
        },
      },
      totalDataDateTime: [],
      BasicsDateTime: [startDateTime, endDateTime],
      retentionDateTime: [startDateTime, endDateTime],
      loginDateTime: [startDateTime, endDateTime],
      activityDateTime: [startDateTime, endDateTime],
      // dateTime: today,
      dateTime: [startDateTime, endDateTime],
      totalData: {},
      topUpData: {},
      withdrawData: {},
      activityData: {},
      retentionData: {},
      consumption: {},
      row: {},
      loginData: {},
    };
  },

  mounted() {
    this.getTopUpData();
    this.getWithdrawData();
    this.getRetentionData();
    this.getActivityData();
    this.getGoldCoinConsumption();
    this.getTotalData();
    this.getLoginData();
  },
  methods: {
    getStartAndEndDateTime(Time) {
      let startTime = "";
      let endTime = "";
      if (Time && Time.length) {
        startTime = Time[0];
        endTime = Time[1];
      }
      return { startTime, endTime };
    },
    getLoginData() {
      let { startTime: loginDateTimeStart, endTime: loginDateTimeEnd } =
        this.getStartAndEndDateTime(this.loginDateTime);
      let { startTime: addDateTimeStart, endTime: addDateTimeEnd } =
        this.getStartAndEndDateTime(this.activityDateTime);
      const params = {
        loginDateTimeStart,
        loginDateTimeEnd,
        addDateTimeStart,
        addDateTimeEnd,
      };
      userLoginAndActiveCount(params).then((res) => {
        this.loginData = res.data.data;
      });
    },
    getTotalData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        currentDateTimeStart: startTime,
        currentDateTimeEnd: endTime,
      };
      userTotalCount(params).then((res) => {
        const milliseconds = parseInt(res.data.data.seeAvgMs);
        const formattedTime = moment
          .utc(parseInt(milliseconds))
          .format("HH:mm:ss");
        this.totalData = {
          ...res.data.data,
          seeAvgMs: formattedTime,
        };
      });
    },
    getActivityData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(
        this.BasicsDateTime
      );
      const params = {
        currentDateTimeStart: startTime,
        currentDateTimeEnd: endTime,
      };
      userLoginCountV2(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.activityData = data.data;
        }
      });
    },
    getTopUpData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        startTime: startTime,
        endTime: endTime,
      };
      queryTradeAmountTotal(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.topUpData = data.data;
        }
      });
    },
    getWithdrawData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        startTime: startTime,
        endTime: endTime,
      };
      withdrawStatistics(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.withdrawData = data.data;
        }
      });
    },
    getGoldCoinConsumption() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        startTime: startTime,
        endTime: endTime,
      };
      platformGoldExpenditure(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.consumption = data.data;
        }
      });
    },
    getRetentionData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(
        this.retentionDateTime
      );
      const params = {
        currentDateTimeStart: startTime,
        currentDateTimeEnd: endTime,
      };
      userAvgLoginCountV2(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.retentionData = data.data;
        }
      });
    },
    retentionDtails(data, label) {
      this.visible = true;
      this.detailsData = data?.map((v) => {
        return {
          ...v,
          retentionDate: v.retentionDate.split(" ")[0],
        };
      });
      this.columnLabel = label;
    },
    durationDetail(durationList) {
      this.durationVisible = true;
      this.durationData = {
        ...durationList,
      };
    },
    basicsSearch() {
      this.getActivityData();
    },
    basicsReset() {
      this.BasicsDateTime = [startDateTime, endDateTime];
      this.getActivityData();
    },
    retentionSearch() {
      this.getRetentionData();
    },
    retentionReset() {
      this.retentionDateTime = [startDateTime, endDateTime];
      this.getRetentionData();
    },
    loginSearch() {
      this.getLoginData();
    },
    loginReset() {
      this.loginDateTime = [startDateTime, endDateTime];
      this.activityDateTime = [startDateTime, endDateTime];
      this.getLoginData();
    },
    search() {
      // this.getRetentionData();
      this.getTotalData();
      this.getTopUpData();
      this.getWithdrawData();
      this.getGoldCoinConsumption();
    },
    reset() {
      this.dateTime = [startDateTime, endDateTime];
      this.getTotalData();
      this.getTopUpData();
      this.getWithdrawData();
      this.getGoldCoinConsumption();
    },
    handleDateChange(value) {
      if (!value) return;
      const params = {
        startTime: value[0],
        endTime: value[1],
        type: 1,
      };
      summaryExport(params).then((res) => {
        if (res.status == 200) {
          downloadExcel(res.data, "看板数据总览");
        }
      });
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
.retentionStyle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  margin-left: 20px;
  .datePickerStyle {
    position: absolute;
    z-index: 9;
    opacity: 0;
    width: 56px;
    right: 0;
    cursor: pointer;
  }
}
.detailsStyle {
  right: 15px;
  top: 15px;
  position: absolute;
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}
.ConversionStyle {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-evenly;
}
.activeUserStyle {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  margin-top: 30px;
}
.loginRateStyle {
  padding: 14px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
