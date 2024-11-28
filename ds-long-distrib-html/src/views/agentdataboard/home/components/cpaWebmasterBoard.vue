<template>
  <div class="containerContent">
    <p class="name" style="position: relative; display: flex; align-items: center">
      <el-select v-model="busPlatformId" placeholder="全部平台">
        <el-option v-for="item in optLong" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <span style="margin-left: 10px">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :clearable="false"
        />
      </span>
      <el-button style="margin-left: 10px" type="primary" @click="getDataList">查询</el-button>
      <el-button style="margin-left: 10px" @click="reset">重置</el-button>
      <a
        href="javascript:void(0);"
        style="position: absolute; right: 0; font-size: 14px; font-weight: normal; color: #2aa4d9"
        >查看详细数据</a
      >
    </p>
    <el-row :gutter="12">
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <p class="title">网站开启数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <p class="title">点击下载数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">新增人数</span>
              <span class="number">
                {{ Number(totalData?.newUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.androidNewUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.iosNewUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.unknownNewUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { webmasterDashboardNewUser } from "@/api/system/index.ts";
import { optLong } from "@/enums";
import { filterNullSearchData } from "@/utils/index";
import moment from "moment";

const totalData: any = ref({});
const busPlatformId: any = ref("");
const startOfDay = moment().startOf("day").toDate(); // 今天的00:00:00
const endOfDay = moment().endOf("day").toDate(); // 今天的23:59:59
const dateTime = ref<[Date, Date]>([startOfDay, endOfDay]);
const startTime: any = computed(() => moment(dateTime.value[0]).format("YYYY-MM-DD HH:mm:ss"));
const endTime: any = computed(() => moment(dateTime.value[1]).format("YYYY-MM-DD HH:mm:ss"));
const defaultTime: [Date, Date] = [startTime.value, endTime.value];
const isMobile: any = ref(false);

const getDataList = () => {
  const params = {
    startTime: startTime.value,
    endTime: endTime.value,
    ...filterNullSearchData({ busPlatformId: busPlatformId.value }),
  };
  webmasterDashboardNewUser(params).then((res) => {
    totalData.value = res.data.data;
  });
};
const reset = () => {
  busPlatformId.value = "";
  dateTime.value = defaultTime;
  getDataList();
};
onMounted(() => {
  getDataList();
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
      font-size: 18px;
      font-weight: 500;
    }

    @media (width <= 500px) {
      .title {
        font-size: 16px;
        font-weight: 400;
      }
    }

    .number {
      margin-top: 10px;
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
}
</style>
