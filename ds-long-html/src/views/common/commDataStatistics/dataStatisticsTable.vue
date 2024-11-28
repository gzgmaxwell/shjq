<template>
  <div>
    <div style="display: flex; margin-bottom: 20px">
      <div style="position: relative; display: flex; align-items: center">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
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
    <h3>该渠道的数据:</h3>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>网站开启数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>点击下载数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>新增人数</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.currentChannelData &&
                dataObj.currentChannelData.newUserCount >= 0
              "
            >
              {{ dataObj.currentChannelData.newUserCount }}人
            </h5>
            <h5 v-else>0人</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>总金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.currentChannelData &&
                dataObj.currentChannelData.totalAmount >= 0
              "
            >
              {{ dataObj.currentChannelData.totalAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值金币金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.currentChannelData &&
                dataObj.currentChannelData.rechargeAmount >= 0
              "
            >
              {{ dataObj.currentChannelData.rechargeAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值VIP金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.currentChannelData &&
                dataObj.currentChannelData.rechargeSvipAmount >= 0
              "
            >
              {{ dataObj.currentChannelData.rechargeSvipAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>该渠道的所有下级数据:</h3>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>网站开启数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>点击下载数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>新增人数</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allSubChannelData &&
                dataObj.allSubChannelData.newUserCount >= 0
              "
            >
              {{ dataObj.allSubChannelData.newUserCount || 0 }}人
            </h5>
            <h5 v-else>0人</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>总金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allSubChannelData &&
                dataObj.allSubChannelData.totalAmount >= 0
              "
            >
              {{ dataObj.allSubChannelData.totalAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值金币金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allSubChannelData &&
                dataObj.allSubChannelData.rechargeAmount >= 0
              "
            >
              {{ dataObj.allSubChannelData.rechargeAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值VIP金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allSubChannelData &&
                dataObj.allSubChannelData.rechargeSvipAmount >= 0
              "
            >
              {{ dataObj.allSubChannelData.rechargeSvipAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>该渠道与他所有下级渠道总数据:</h3>
    <el-row class="content" :gutter="20">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>网站开启数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>点击下载数</h3>
            <h5></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>新增人数</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allChannelDataTotal &&
                dataObj.allChannelDataTotal.newUserCount >= 0
              "
            >
              {{ dataObj.allChannelDataTotal.newUserCount || 0 }}人
            </h5>
            <h5 v-else>0人</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>总金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allChannelDataTotal &&
                dataObj.allChannelDataTotal.totalAmount >= 0
              "
            >
              {{ dataObj.allChannelDataTotal.totalAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值金币金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allChannelDataTotal &&
                dataObj.allChannelDataTotal.rechargeAmount >= 0
              "
            >
              {{ dataObj.allChannelDataTotal.rechargeAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px', height: '120px' }">
          <div style="padding: 14px">
            <h3>充值VIP金额</h3>
            <h5
              v-if="
                dataObj &&
                dataObj.allChannelDataTotal &&
                dataObj.allChannelDataTotal.rechargeSvipAmount >= 0
              "
            >
              {{ dataObj.allChannelDataTotal.rechargeSvipAmount || 0 }}¥
            </h5>
            <h5 v-else>0¥</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { bgChannelDataForDistr } from "@/api/admin/index";
const today = new Date();
const startMomentDate = moment(today).startOf("day");
const endMomentDate = moment(today).endOf("day");
const startDateTime = startMomentDate.format("YYYY-MM-DD HH:mm:ss");
const endDateTime = endMomentDate.format("YYYY-MM-DD HH:mm:ss");

export default {
  name: "dataStatisticsTable",
  props: {
    row: Object,
    default: () => {},
  },
  data() {
    return {
      dateTime: [startDateTime, endDateTime],
      dataObj: {},
    };
  },

  mounted() {
    this.getTotalData();
  },
  methods: {
    getTotalData() {
      const params = {
        startTime: this.dateTime[0],
        endTime: this.dateTime[1],
        distrId: this.row.distrId,
      };
      bgChannelDataForDistr(params).then((res) => {
        this.dataObj = res.data.data;
      });
    },

    search() {
      this.getTotalData();
    },
    reset() {
      this.dateTime = [startDateTime, endDateTime];
      this.getTotalData();
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
</style>
