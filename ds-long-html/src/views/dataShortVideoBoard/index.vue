<template>
  <basic-container>
    <div style="display: flex; margin-bottom: 20px">
      <h3 style="flex: 1; margin: 0; padding: 0">总数据</h3>
      <div style="position: relative; display: flex; align-items: center">
        <span style="margin-right: 10px">选择时间</span>
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
      </div>
    </div>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '170px' }">
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">总用户</h3>
              <h5 v-if="totalData.totalUserCount >= 0">
                {{ Number(totalData.totalUserCount).toLocaleString() || 0 }}人
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <span v-if="totalData.longUserCount >= 0">
                {{ Number(totalData.longUserCount).toLocaleString() || 0 }}人
              </span>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <span v-if="totalData.shortUserCount >= 0">
                {{ Number(totalData.shortUserCount).toLocaleString() || 0 }}人
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">付费转换率</h3>
              <h5>
                {{ totalData.totalPayUserRetention || 0 }}
              </h5>
              <div style="margin-left: 15px; font-size: 14px">
                <span v-if="totalData.totalPayUserCount >= 0">
                  合计
                  {{
                    Number(totalData.totalPayUserCount).toLocaleString() || 0
                  }}
                  人付费
                </span>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <span>
                {{ totalData.longPayUserRetention || 0 }}
              </span>
              <div style="margin-left: 15px; font-size: 14px">
                <span v-if="totalData.longPayUserCount >= 0">
                  合计
                  {{ Number(totalData.longPayUserCount).toLocaleString() || 0 }}
                  人付费
                </span>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <span>
                {{ totalData.shortPayUserRetention || 0 }}
              </span>
              <div style="margin-left: 15px; font-size: 14px">
                <span v-if="totalData.shortPayUserCount >= 0">
                  合计
                  {{
                    Number(totalData.shortPayUserCount).toLocaleString() || 0
                  }}
                  人付费
                </span>
              </div>
            </div>
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
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">观看平均时长</h3>
              <div>
                {{ totalData.seeAvgMs || "00:00:00" }}
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>
                {{ totalData.longSeeAvgMs || "00:00:00" }}
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">短视频平台</span>
              <div>
                {{ totalData.shortSeeAvgMs || "00:00:00" }}
              </div>
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
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">充值总额</h3>
              <h5>
                {{
                  Number(
                    total(
                      longVideo(topUpData).tradeAmountTotal,
                      shortVideo(topUpData).tradeAmountTotal
                    )
                  ).toLocaleString() || 0
                }}¥
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>{{ longVideo(topUpData).tradeAmountTotal || 0 }}¥</div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div>{{ shortVideo(topUpData).tradeAmountTotal || 0 }}¥</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">金币充值总额</h3>
              <h5>
                {{
                  Number(
                    total(
                      longVideo(topUpData).rechargeAmountTotal,
                      shortVideo(topUpData).rechargeAmountTotal
                    )
                  ).toLocaleString() || 0
                }}¥
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>{{ longVideo(topUpData).rechargeAmountTotal || 0 }}¥</div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div>{{ shortVideo(topUpData).rechargeAmountTotal || 0 }}¥</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">会员充值总额</h3>
              <h5>
                {{
                  Number(
                    total(
                      longVideo(topUpData).openMemberAmountTotal,
                      shortVideo(topUpData).openMemberAmountTotal
                    )
                  ).toLocaleString() || 0
                }}¥
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>{{ longVideo(topUpData).openMemberAmountTotal || 0 }}¥</div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div>{{ shortVideo(topUpData).openMemberAmountTotal || 0 }}¥</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">C端用户提现总额</h3>
              <h5>
                {{
                  Number(withdrawData.withdrawAmountTotal).toLocaleString() ||
                  0
                }}¥
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>
                {{
                  Number(
                    withdrawData.longVideoWithdrawAmountTotal
                  ).toLocaleString() || 0
                }}¥
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div>
                {{
                  Number(
                    withdrawData.shortVideoWithdrawAmountTotal
                  ).toLocaleString() || 0
                }}¥
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">金币消费</h3>
              <h5>
                {{
                  Number(
                    total(
                      longVideo(consumption).totalGold,
                      shortVideo(consumption).totalGold
                    )
                  ).toLocaleString() || 0
                }}¥
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div>{{ longVideo(consumption).totalGold || 0 }}¥</div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div>{{ shortVideo(consumption).totalGold || 0 }}¥</div>
            </div>
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
      <el-col :span="6">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle mb10">
              <h3 style="margin-right: 15px">新增用户</h3>
              <h5 v-if="activityData.totalUserCount >= 0">
                {{ Number(activityData.totalUserCount).toLocaleString() || 0 }}
                人
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div v-if="activityData.longUserCount >= 0">
                {{ Number(activityData.longUserCount).toLocaleString() || 0 }}人
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div v-if="activityData.shortUserCount >= 0">
                {{
                  Number(activityData.shortUserCount).toLocaleString() || 0
                }}人
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle mb10">
              <h3 style="margin-right: 15px">登录用户</h3>
              <h5 v-if="activityData.todayLoginUserCount >= 0">
                合计
                {{
                  Number(activityData.todayLoginUserCount).toLocaleString() ||
                  0
                }}人
              </h5>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div v-if="activityData.todayLoginLongUserCount >= 0">
                {{
                  Number(
                    activityData.todayLoginLongUserCount
                  ).toLocaleString() || 0
                }}人
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div v-if="activityData.todayLoginShortUserCount >= 0">
                {{
                  Number(
                    activityData.todayLoginShortUserCount
                  ).toLocaleString() || 0
                }}人
              </div>
            </div>
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
      <el-col :span="12">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px 0px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">活跃用户</h3>
              <div v-if="activityData.todayActiveUserCount >= 0">
                合计
                {{
                  Number(activityData.todayActiveUserCount).toLocaleString() ||
                  0
                }}
                人
              </div>
              <div class="cardClmStyle ml30 mt10">
                <div class="mb10">
                  <span v-if="activityData.todayActiveVipUserCount >= 0">
                    会员
                    {{
                      Number(
                        activityData.todayActiveVipUserCount
                      ).toLocaleString() || 0
                    }}
                    人</span
                  >&nbsp;
                  <span
                    >占比
                    {{ activityData.todayActiveVipUserRetention || 0 }}</span
                  >
                </div>
                <div class="mb10">
                  <span v-if="activityData.todayActiveNotVipUserCount >= 0"
                    >非会员
                    {{
                      Number(
                        activityData.todayActiveNotVipUserCount
                      ).toLocaleString() || 0
                    }}
                    人</span
                  >&nbsp;
                  <span
                    >占比
                    {{ activityData.todayActiveNotVipRetention || 0 }}</span
                  >
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 5px">长视频平台</span>
              <div v-if="activityData.todayActiveLongUserCount >= 0">
                {{
                  Number(
                    activityData.todayActiveLongUserCount
                  ).toLocaleString() || 0
                }}人,
              </div>
              <div>
                <span v-if="activityData.todayActiveLongVipUserCount >= 0">
                  会员
                  {{
                    Number(
                      activityData.todayActiveLongVipUserCount
                    ).toLocaleString() || 0
                  }}人,</span
                >
                <span
                  >占比
                  {{ activityData.todayActiveLongVipUserRetention || 0 }},</span
                >
              </div>
              <div>
                <span v-if="activityData.todayActiveLongNotVipUserCount >= 0"
                  >非会员
                  {{
                    Number(
                      activityData.todayActiveLongNotVipUserCount
                    ).toLocaleString() || 0
                  }}人,</span
                >
                <span
                  >占比
                  {{
                    activityData.todayActiveLongNotVipUserRetention || 0
                  }}</span
                >
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 5px">短视频平台</span>
              <div v-if="activityData.todayActiveShortUserCount >= 0">
                {{
                  Number(
                    activityData.todayActiveShortUserCount
                  ).toLocaleString() || 0
                }}人,
              </div>
              <div>
                <span v-if="activityData.todayActiveShortVipUserCount >= 0">
                  会员
                  {{
                    Number(
                      activityData.todayActiveShortVipUserCount
                    ).toLocaleString() || 0
                  }}人,</span
                >
                <span
                  >占比
                  {{
                    activityData.todayActiveShortVipUserRetention || 0
                  }},</span
                >
              </div>
              <div>
                <span v-if="activityData.todayActiveShortNotVipUserCount >= 0"
                  >非会员
                  {{
                    Number(
                      activityData.todayActiveShortNotVipUserCount
                    ).toLocaleString() || 0
                  }}人,</span
                >
                <span
                  >占比
                  {{
                    activityData.todayActiveShortNotVipUserRetention || 0
                  }}</span
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
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">次日活跃率</h3>
              <h3 style="margin-top: 22px">
                {{ activityData.twoDaysUserActiveRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.twoDaysUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.twoDaysUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.twoDaysUserActiveLongUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.twoDaysUserLoginLongCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.twoDaysUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.twoDaysUserActiveShortUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.twoDaysUserLoginShortCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.twoDaysUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  activityData.userAvgYesterdayLoginDTOList,
                  '次日活跃率'
                )
              "
            >
              详情
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">7日内活跃率</h3>
              <h3 style="margin-top: 22px">
                {{ activityData.sevenDaysUserActiveRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.sevenDaysUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.sevenDaysUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.sevenDaysUserActiveLongUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.sevenDaysUserLoginLongCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.sevenDaysUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.sevenDaysUserActiveShortUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.sevenDaysUserLoginShortCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.sevenDaysUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  activityData.userAvgSevenDaysLoginDTOList,
                  '7日内活跃率'
                )
              "
            >
              详情
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">30日内活跃率</h3>
              <h3 style="margin-top: 22px">
                {{ activityData.oneMonthUserActiveRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.oneMonthUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.oneMonthUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.oneMonthUserActiveLongUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.oneMonthUserLoginLongCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.oneMonthUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ activityData.oneMonthUserActiveShortUserRetention || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  活跃 {{ activityData.oneMonthUserLoginShortCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ activityData.oneMonthUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  activityData.userAvgOneMonthLoginDTOList,
                  '30日内活跃率'
                )
              "
            >
              详情
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
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">登录率</h3>
              <h3 style="margin-top: 22px">
                {{ loginData.todayLoginUserRetention || 0 }}
              </h3>
              <div
                style="margin-left: 30px"
                v-if="loginData.todayLoginUserCount >= 0"
              >
                合计登录
                {{
                  Number(loginData.todayLoginUserCount).toLocaleString() || 0
                }}人
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ loginData.todayLoginLongUserRetention || 0 }}
              </div>
              <div style="margin-left: 30px">
                合计登录
                {{
                  Number(loginData.todayLoginLongUserCount).toLocaleString() ||
                  0
                }}人
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ loginData.todayLoginShortUserRetention || 0 }}
              </div>
              <div style="margin-left: 30px">
                合计登录
                {{
                  Number(loginData.todayLoginShortUserCount).toLocaleString() ||
                  0
                }}人
              </div>
            </div>
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
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
            position: 'relative',
          }"
        >
          <div style="padding: 14px">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">活跃率</h3>
              <h3 style="margin-top: 22px">
                {{ loginData.todayActiveUserRetention || 0 }}
              </h3>
              <div
                style="margin-left: 30px"
                v-if="loginData.todayActiveUserCount >= 0"
              >
                合计活跃
                {{
                  Number(loginData.todayActiveUserCount).toLocaleString() || 0
                }}人
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ loginData.todayActiveLongUserRetention || 0 }}
              </div>
              <div style="margin-left: 30px">
                合计活跃
                {{
                  Number(loginData.todayActiveLongUserCount).toLocaleString() ||
                  0
                }}人
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ loginData.todayActiveShortUserRetention || 0 }}
              </div>
              <div style="margin-left: 30px">
                合计活跃
                {{
                  Number(
                    loginData.todayActiveShortUserCount
                  ).toLocaleString() || 0
                }}人
              </div>
            </div>
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
      <!-- 新增 留存率 -->
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">次日留存率</h3>
              <h3 style="margin-top: 22px">
                {{ retentionData.yesterdayAvgRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.yesterdayUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.yesterdayUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.yesterdayAvgRetentionLong || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.yesterdayUserLoginCountLong || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.yesterdayUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.yesterdayAvgRetentionShort || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.yesterdayUserLoginCountShort || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.yesterdayUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  retentionData.userAvgYesterdayLoginDTOList,
                  '次日留存率'
                )
              "
            >
              详情
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">7日内留存率</h3>
              <h3 style="margin-top: 22px">
                {{ retentionData.sevenDaysAvgRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.sevenDaysUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.sevenDaysUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.sevenDaysAvgRetentionLong || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.sevenDaysUserLoginCountLong || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.sevenDaysUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.sevenDaysAvgRetentionShort || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.sevenDaysUserLoginCountShort || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.sevenDaysUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  retentionData.userAvgSevenDaysLoginDTOList,
                  '7日内留存率'
                )
              "
            >
              详情
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          :body-style="{
            padding: '0px',
            height: '170px',
          }"
        >
          <div style="padding: 14px; position: relative">
            <div class="cardStyle">
              <h3 style="margin-right: 15px">30日内留存率</h3>
              <h3 style="margin-top: 22px">
                {{ retentionData.oneMonthAvgRetention || 0 }}
              </h3>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.oneMonthUserLoginCount || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.oneMonthUserAddCount || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle mb10">
              <span style="margin-right: 15px">长视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.oneMonthAvgRetentionLong || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.oneMonthUserLoginCountLong || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.oneMonthUserAddCountLong || 0 }}人
                </div>
              </div>
            </div>
            <div class="cardStyle">
              <span style="margin-right: 15px">短视频平台</span>
              <div style="margin-top: 5px">
                {{ retentionData.oneMonthAvgRetentionShort || 0 }}
              </div>
              <div style="display: flex">
                <div style="margin: 0px 10px 0px 30px; padding: 5px 0">
                  登录 {{ retentionData.oneMonthUserLoginCountShort || 0 }}人
                </div>
                <div style="padding: 5px 0">
                  合计 {{ retentionData.oneMonthUserAddCountShort || 0 }}人
                </div>
              </div>
            </div>
            <div
              class="detailsStyle"
              @click="
                dataDtails(
                  retentionData.userAvgOneMonthLoginDTOList,
                  '30日内留存率'
                )
              "
            >
              详情
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
  userActiveLoginCountV2,
  longOrShortUserLoginCount,
  multiTradeAmountTotal,
  platformWithdrawStatistics,
  platformGoldExpenditureMulti,
  longOrShortUserLoginAndActiveCount,
  userAvgLoginCountV3,
} from "@/api/admin/index";
import { EnumVideoTime, optLong } from "@/util/util";
import durantionLineChart from "./components/durantionLineChart.vue";
import detailsPage from "./components/detailsPage.vue";
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime = endMomentDate.format("YYYY-MM-DD HH:mm:ss");

export default {
  //仪表盘
  name: "dataShortVideoBoard",
  components: { durantionLineChart, detailsPage },
  data() {
    return {
      columnLabel: "",
      detailsData: [],
      visible: false,
      durationVisible: false,
      BasicsDateTime: [startDateTime, endDateTime],
      retentionDateTime: [startDateTime, endDateTime],
      loginDateTime: [startDateTime, endDateTime],
      activityDateTime: [startDateTime, endDateTime],
      dateTime: [startDateTime, endDateTime],
      totalData: {},
      topUpData: [],
      withdrawData: {},
      activityData: {},
      retentionData: {},
      consumption: [],
      row: {},
      loginData: {},
    };
  },
  computed: {
    total() {
      return (long, short) => {
        const longAmount = long || 0;
        const shortAmount = short || 0;
        return longAmount + shortAmount;
      };
    },

    longVideo() {
      return (data) => {
        const result = data.find(
          (v) => v.registerPlatformId === EnumVideoTime.long
        );
        return result || {};
      };
    },
    shortVideo() {
      return (data) => {
        const result = data.find(
          (v) => v.registerPlatformId === EnumVideoTime.short
        );
        return result || {};
      };
    },
  },
  mounted() {
    this.getTopUpData();
    this.getWithdrawData();
    this.getActivityData();
    this.getGoldCoinConsumption();
    this.getTotalData();
    this.getLoginData();
    this.getRetentionData();
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
      longOrShortUserLoginAndActiveCount(params).then((res) => {
        this.loginData = res.data.data;
      });
    },
    getTotalData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        currentDateTimeStart: startTime,
        currentDateTimeEnd: endTime,
      };
      longOrShortUserLoginCount(params).then((res) => {
        const formatTime = (milliseconds) =>
          moment.utc(parseInt(milliseconds)).format("HH:mm:ss");
        this.totalData = {
          ...res.data.data,
          seeAvgMs: formatTime(res.data.data.seeAvgMs),
          longSeeAvgMs: formatTime(res.data.data.longSeeAvgMs),
          shortSeeAvgMs: formatTime(res.data.data.shortSeeAvgMs),
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
      userActiveLoginCountV2(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.activityData = data.data;
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
      userAvgLoginCountV3(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.retentionData = data.data;
        }
      });
    },
    getTopUpData() {
      let { startTime, endTime } = this.getStartAndEndDateTime(this.dateTime);
      const params = {
        startTime: startTime,
        endTime: endTime,
      };
      multiTradeAmountTotal(params).then((res) => {
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
      platformWithdrawStatistics(params).then((res) => {
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
      platformGoldExpenditureMulti(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.consumption = data.data;
        }
      });
    },
    durationDetail(durationList) {
      this.durationVisible = true;
      this.durationData = {
        ...durationList,
      };
    },
    dataDtails(data, label) {
      this.visible = true;
      this.detailsData = data?.map((v) => {
        return {
          ...v,
          retentionDate: v.retentionDate.split(" ")[0],
        };
      });
      this.columnLabel = label;
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
.mb10 {
  margin-bottom: 10px;
}
.ml30 {
  margin-left: 30px;
}
.mt10 {
  margin-top: 10px;
}
.cardStyle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cardClmStyle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.detailsStyle {
  right: 15px;
  top: 15px;
  position: absolute;
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}
</style>
