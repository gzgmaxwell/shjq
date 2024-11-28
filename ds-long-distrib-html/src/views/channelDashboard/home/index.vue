<template>
  <base-card>
    <div class="containerContent">
      <div style="display: flex; justify-content: space-between">
        <p class="name">总数据</p>
        <div style="position: relative; display: flex; align-items: center">
          <span style="margin-right: 10px; font-size: 16px">选择时间</span>
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
          >
          </el-date-picker>
          <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      <el-row :gutter="12">
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">付费转换率</span>
                <span class="number" style="margin-left: 10px">
                  {{ totalData?.totalPayUserRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计
                    {{ Number(totalData.totalPayUserCount || 0).toLocaleString() }}
                    人付费
                  </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ totalData.longPayUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计
                    {{ Number(totalData.longPayUserCount || 0).toLocaleString() }}
                    人付费
                  </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ totalData.shortPayUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计
                    {{ Number(totalData.shortPayUserCount || 0).toLocaleString() }}
                    人付费
                  </span>
                </div>
              </div>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                :width="500"
                placement="top"
                trigger="hover"
                content="选择时间范围内的新注册用户为X,X在截至当前查询时间已成为付费用户的为Y,计算公式:Y/X"
              >
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">观看平均时长</span>
                <span class="number" style="margin-left: 10px">
                  {{ totalData.seeAvgMs || "00:00:00" }}
                </span>
              </div>
              <div class="mb2 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ totalData.longSeeAvgMs || "00:00:00" }}</span>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ totalData.shortSeeAvgMs || "00:00:00" }} </span>
              </div>
              <span style="font-size: 16px; color: #409eff; cursor: pointer" @click="durationDetail(totalData)"
                >详情</span
              >
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                :width="500"
                placement="top"
                trigger="hover"
                content="选择时间范围内的用户总观看时长除以总观看人数"
              >
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
      </el-row>
      <el-divider />
      <!-- 活跃率 -->
      <div style="display: flex; justify-content: space-between">
        <p class="name">活跃率</p>
        <div style="position: relative; display: flex; align-items: center">
          <span style="margin-right: 10px; font-size: 16px">选择时间</span>
          <el-date-picker
            v-model="BasicsDateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
            :clearable="false"
          >
          </el-date-picker>
          <el-button type="primary" style="margin-left: 10px" @click="basicsSearch">查询</el-button>
          <el-button @click="basicsReset">重置</el-button>
        </div>
      </div>
      <el-row :gutter="12">
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">新增用户</span>
                <span class="number" style="margin-left: 10px">
                  {{ Number(activityData?.totalUserCount || 0).toLocaleString() }} 人
                </span>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ Number(activityData.longUserCount || 0).toLocaleString() }} 人 </span>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ Number(activityData.shortUserCount || 0).toLocaleString() }} 人 </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">登录用户</span>
                <span class="number" style="margin-left: 10px">
                  合计 {{ Number(activityData?.todayLoginUserCount || 0).toLocaleString() }} 人
                </span>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number">
                  {{ Number(activityData.todayLoginLongUserCount || 0).toLocaleString() }} 人
                </span>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number">
                  {{ Number(activityData.todayLoginShortUserCount || 0).toLocaleString() }} 人
                </span>
              </div>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                :width="500"
                placement="top"
                trigger="hover"
                content="选择范围内的用户,若登录一次即计算一人,多次登录不重复计算"
              >
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="filxStyle">
                <span style="margin-right: 10px" class="title">活跃用户</span>
                <span class="number">
                  合计
                  {{ Number(activityData.todayActiveUserCount || 0).toLocaleString() }}
                  人
                </span>
                <div>
                  <div class="mb1">
                    <span class="number">
                      会员
                      {{ Number(activityData.todayActiveVipUserCount || 0).toLocaleString() }}
                      人</span
                    >&nbsp;
                    <span class="number">占比 {{ activityData.todayActiveVipUserRetention || 0 }}</span>
                  </div>
                  <div class="mb1">
                    <span class="number"
                      >非会员
                      {{ Number(activityData.todayActiveNotVipUserCount || 0).toLocaleString() }}
                      人</span
                    >&nbsp;
                    <span class="number">占比 {{ activityData.todayActiveNotVipRetention || 0 }}</span>
                  </div>
                </div>
              </div>
              <div style="display: flex; font-size: 15px" class="mt2">
                <span style="margin-right: 10px">长视频平台</span>
                <span>{{ Number(activityData.todayActiveLongUserCount || 0).toLocaleString() }} 人,</span>
                <div>
                  <span>
                    会员
                    {{ Number(activityData.todayActiveLongVipUserCount || 0).toLocaleString() }} 人,</span
                  >
                  <span>占比 {{ activityData.todayActiveLongVipUserRetention || 0 }},</span>
                </div>
                <div>
                  <span
                    >非会员 {{ Number(activityData.todayActiveLongNotVipUserCount || 0).toLocaleString() }} 人,</span
                  >
                  <span>占比 {{ activityData.todayActiveLongNotVipUserRetention || 0 }}</span>
                </div>
              </div>
              <div style="display: flex; font-size: 15px" class="mt2">
                <span style="margin-right: 10px">短视频平台</span>
                <span>{{ Number(activityData.todayActiveShortUserCount || 0).toLocaleString() }} 人,</span>
                <div>
                  <span>
                    会员
                    {{ Number(activityData.todayActiveShortVipUserCount || 0).toLocaleString() }} 人,</span
                  >
                  <span>占比 {{ activityData.todayActiveShortVipUserRetention || 0 }},</span>
                </div>
                <div>
                  <span
                    >非会员 {{ Number(activityData.todayActiveShortNotVipUserCount || 0).toLocaleString() }} 人,</span
                  >
                  <span>占比 {{ activityData.todayActiveShortNotVipUserRetention || 0 }}</span>
                </div>
              </div>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover :width="300" placement="top" trigger="hover" content="选择范围内的用户,用户观看时长满3分钟">
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">次日活跃率</span>
                <span class="number" style="margin-left: 10px">
                  {{ activityData?.twoDaysUserActiveRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.twoDaysUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.twoDaysUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ activityData.twoDaysUserActiveLongUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.twoDaysUserLoginLongCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.twoDaysUserAddCountLong || 0 }} 人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ activityData.twoDaysUserActiveShortUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.twoDaysUserLoginShortCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.twoDaysUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(activityData.userAvgYesterdayLoginDTOList, '次日活跃率')">
              详情
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">7日内活跃率</span>
                <span class="number" style="margin-left: 10px">
                  {{ activityData?.sevenDaysUserActiveRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.sevenDaysUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.sevenDaysUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ activityData.sevenDaysUserActiveLongUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.sevenDaysUserLoginLongCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.sevenDaysUserAddCountLong || 0 }} 人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ totalData.sevenDaysUserActiveShortUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ totalData.sevenDaysUserLoginShortCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ totalData.sevenDaysUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(activityData.userAvgSevenDaysLoginDTOList, '7日内活跃率')">
              详情
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">30日内活跃率</span>
                <span class="number" style="margin-left: 10px">
                  {{ activityData?.oneMonthUserActiveRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.oneMonthUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.oneMonthUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ activityData.oneMonthUserActiveLongUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ activityData.oneMonthUserLoginLongCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ activityData.oneMonthUserAddCountLong || 0 }} 人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ totalData.oneMonthUserActiveShortUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 活跃 {{ totalData.oneMonthUserLoginShortCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ totalData.oneMonthUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(activityData.userAvgOneMonthLoginDTOList, '30日内活跃率')">
              详情
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="display: flex; margin-top: 20px">
        <h3 style="flex: 1; padding: 0; margin: 0"></h3>
        <div>
          <span style="margin-right: 10px; font-size: 16px">注册用户</span>
          <el-date-picker
            v-model="activityDateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
            :clearable="false"
          >
          </el-date-picker>
          <span style="margin: 0 10px; font-size: 16px">时间</span>
          <el-date-picker
            v-model="loginDateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
            :clearable="false"
          >
          </el-date-picker>
          <el-button type="primary" style="margin-left: 10px" @click="loginSearch">查询</el-button>
          <el-button @click="loginReset">重置</el-button>
        </div>
      </div>

      <el-row :gutter="12">
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">登录率</span>
                <span class="number" style="margin-left: 10px">
                  {{ loginData.todayLoginUserRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计登录
                    {{ Number(loginData.todayLoginUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ loginData.todayLoginLongUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计登录
                    {{ Number(loginData.todayLoginLongUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ loginData.todayLoginShortUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计登录
                    {{ Number(loginData.todayLoginShortUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                :width="500"
                placement="top"
                trigger="hover"
                content="统计范围内的注册用户为X,X在第二个时间范围内登录的人为Y.计算公式:Y/X"
              >
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">活跃率</span>
                <span class="number" style="margin-left: 10px">
                  {{ loginData.todayActiveUserRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计活跃
                    {{ Number(loginData.todayActiveUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ loginData.todayActiveLongUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计活跃
                    {{ Number(loginData.todayActiveLongUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ loginData.todayActiveShortUserRetention || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number">
                    合计活跃
                    {{ Number(loginData.todayActiveShortUserCount || 0).toLocaleString() }}
                    人
                  </span>
                </div>
              </div>
            </div>
            <span style="position: absolute; top: 10px; right: 25px">
              <el-popover
                :width="500"
                placement="top"
                trigger="hover"
                content="统计范围内的注册用户为X,X在第二个时间范围内观看时间满3分钟的人为Y.计算公式:Y/X"
              >
                <template #reference>
                  <el-icon :size="15"> <QuestionFilled /></el-icon>
                </template>
              </el-popover>
            </span>
          </el-card>
        </el-col>
      </el-row>
      <el-divider />
      <!-- 留存率 -->
      <div style="display: flex; justify-content: space-between">
        <p class="name">留存率</p>
        <div style="position: relative; display: flex; align-items: center">
          <span style="margin-right: 10px; font-size: 16px">选择时间</span>
          <el-date-picker
            v-model="retentionDateTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
            :clearable="false"
          >
          </el-date-picker>
          <el-button type="primary" style="margin-left: 10px" @click="retentionSearch">查询</el-button>
          <el-button @click="retentionReset">重置</el-button>
        </div>
      </div>
      <el-row :gutter="12">
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">次日留存率</span>
                <span class="number" style="margin-left: 10px">
                  {{ retentionData.yesterdayAvgRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.yesterdayUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.yesterdayUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ retentionData.yesterdayAvgRetentionLong || 0 }}</span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.yesterdayUserLoginCountLong || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.yesterdayUserAddCountLong || 0 }} 人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ retentionData.yesterdayAvgRetentionShort || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.yesterdayUserLoginCountShort || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.yesterdayUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(retentionData.userAvgYesterdayLoginDTOList, '次日留存率')">
              详情
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">7日内留存率</span>
                <span class="number" style="margin-left: 10px">
                  {{ retentionData.sevenDaysAvgRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.sevenDaysUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.sevenDaysUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ retentionData.sevenDaysAvgRetentionLong || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.sevenDaysUserLoginCountLong || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.sevenDaysUserAddCountLong || 0 }}人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ retentionData.sevenDaysAvgRetentionShort || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.sevenDaysUserLoginCountShort || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.sevenDaysUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(retentionData.userAvgSevenDaysLoginDTOList, '7日内留存率')">
              详情
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-card shadow="always" class="mt3" style="position: relative; height: 170px">
            <div class="cardBox">
              <div class="mb3 mt3 filxStyle">
                <span class="title">30日内留存率</span>
                <span class="number" style="margin-left: 10px">
                  {{ retentionData.oneMonthAvgRetention || 0 }}
                </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.oneMonthUserLoginCount || 0 }} 人 </span>
                  <span class="number"> 合计 {{ retentionData.oneMonthUserAddCount || 0 }} 人 </span>
                </div>
              </div>
              <div class="mb3 mt3 filxStyle">
                <span class="number">长视频平台</span>
                <span class="number"> {{ retentionData.oneMonthAvgRetentionLong || 0 }}</span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.oneMonthUserLoginCountLong || 0 }} 人 </span>
                  <span class="number"> 合计{{ retentionData.oneMonthUserAddCountLong || 0 }} 人 </span>
                </div>
              </div>
              <div class="filxStyle">
                <span class="number">短视频平台</span>
                <span class="number"> {{ retentionData.oneMonthAvgRetentionShort || 0 }} </span>
                <div style="margin-left: 15px">
                  <span class="number"> 登录 {{ retentionData.oneMonthUserLoginCountShort || 0 }}人 </span>
                  <span class="number"> 合计 {{ retentionData.oneMonthUserAddCountShort || 0 }} 人 </span>
                </div>
              </div>
            </div>
            <div class="detailsStyle" @click="dataDtails(retentionData.userAvgOneMonthLoginDTOList, '30日内留存率')">
              详情
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog v-model="visible" v-if="visible" width="70%" :close-on-click-modal="false">
        <detailsPage :detailsData="detailsData" :columnLabel="columnLabel"></detailsPage>
      </el-dialog>
      <el-dialog v-model="durationVisible" v-if="durationVisible" width="70%" :close-on-click-modal="false">
        <durantionLineChart :durationData="durationData"></durantionLineChart>
      </el-dialog>
    </div>
  </base-card>
</template>

<script setup lang="ts">
import {
  channelUerLoginCount,
  channelUserActiveLoginCountV2,
  channelUserLoginAndActiveCount,
  channelUserAvgLoginCountV3,
} from "@/api/system";

import durantionLineChart from "./components/durantionLineChart.vue";
import detailsPage from "./components/detailsPage.vue";

import moment from "moment";

const totalData: any = ref({});
const activityData: any = ref({});
const durationData: any = ref({});
const columnLabel: any = ref("");
const loginData: any = ref({});
const retentionData: any = ref({});
const detailsData = ref([]);
const visible = ref(false);
const durationVisible = ref(false);
const isMobile: any = ref(false);

//今日日期时间
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime: any = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime: any = endMomentDate.format("YYYY-MM-DD HH:mm:ss");

// 定义各个 ref 变量，并初始化为初始时间范围
const dateTime: any = ref<[Date, Date]>([startDateTime, endDateTime]);
const BasicsDateTime = ref<[Date, Date]>([startDateTime, endDateTime]);
const activityDateTime = ref<[Date, Date]>([startDateTime, endDateTime]);
const loginDateTime = ref<[Date, Date]>([startDateTime, endDateTime]);
const retentionDateTime = ref<[Date, Date]>([startDateTime, endDateTime]);

const durationDetail = (durationList: any) => {
  durationVisible.value = true;
  durationData.value = {
    ...durationList,
  };
};

const dataDtails = (data: any, label: any) => {
  visible.value = true;
  detailsData.value = data?.map((v: any) => {
    return {
      ...v,
      retentionDate: v.retentionDate.split(" ")[0],
    };
  });
  columnLabel.value = label;
};

//总数据
const getDataList = () => {
  const params = {
    currentDateTimeStart: dateTime.value[0],
    currentDateTimeEnd: dateTime.value[1],
  };
  channelUerLoginCount(params).then((res) => {
    const formatTime = (milliseconds: any) => moment.utc(parseInt(milliseconds)).format("HH:mm:ss");
    totalData.value = {
      ...res.data.data,
      seeAvgMs: formatTime(res.data.data.seeAvgMs),
      longSeeAvgMs: formatTime(res.data.data.longSeeAvgMs),
      shortSeeAvgMs: formatTime(res.data.data.shortSeeAvgMs),
    };
  });
};
//活跃率
const activityDataList = () => {
  const params = {
    currentDateTimeStart: BasicsDateTime.value[0],
    currentDateTimeEnd: BasicsDateTime.value[1],
  };
  channelUserActiveLoginCountV2(params).then((res) => {
    activityData.value = res.data.data;
  });
};
//登录
const getLoginData = () => {
  const params = {
    loginDateTimeStart: loginDateTime.value[0],
    loginDateTimeEnd: loginDateTime.value[1],
    addDateTimeStart: activityDateTime.value[0],
    addDateTimeEnd: activityDateTime.value[1],
  };
  channelUserLoginAndActiveCount(params).then((res) => {
    loginData.value = res.data.data;
  });
};
//留存率
const retentionDataList = () => {
  const params = {
    currentDateTimeStart: retentionDateTime.value[0],
    currentDateTimeEnd: retentionDateTime.value[1],
  };
  channelUserAvgLoginCountV3(params).then((res) => {
    retentionData.value = res.data.data;
  });
};
//总数据查询
const search = () => {
  getDataList();
};
const reset = () => {
  dateTime.value = [startDateTime, endDateTime];
  getDataList();
};
//活跃率查询
const basicsSearch = () => {
  activityDataList();
};
const basicsReset = () => {
  BasicsDateTime.value = [startDateTime, endDateTime];
  activityDataList();
};
//注册用户查询
const loginSearch = () => {
  getLoginData();
};
const loginReset = () => {
  activityDateTime.value = [startDateTime, endDateTime];
  loginDateTime.value = [startDateTime, endDateTime];
  getLoginData();
};
//留存率查询
const retentionSearch = () => {
  retentionDataList();
};
const retentionReset = () => {
  retentionDateTime.value = [startDateTime, endDateTime];
  retentionDataList();
};

onMounted(() => {
  getDataList();
  activityDataList();
  getLoginData();
  retentionDataList();
  const clientWidth = document.body.clientWidth;
  isMobile.value = clientWidth < 500;
  window.onresize = () => {
    const clientWidth = document.body.clientWidth;
    isMobile.value = clientWidth < 500;
  };
});
</script>

<style lang="scss" scoped>
.containerContent {
  .name {
    font-size: 16px;
    font-weight: 600;

    .time {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .cardBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 20px;
      font-weight: 600;
    }

    @media (width <= 500px) {
      .title {
        font-size: 16px;
        font-weight: 400;
      }
    }

    .number {
      // margin-top: 10px;
      margin-left: 10px;
      font-size: 16px;
    }

    .union {
      font-size: 10px;
    }
  }

  .time {
    font-size: 16px;
  }

  .filxStyle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detailsStyle {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
