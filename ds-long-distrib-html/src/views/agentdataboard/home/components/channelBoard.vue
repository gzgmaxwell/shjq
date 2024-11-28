<template>
  <div class="containerContent">
    <p class="name" style="display: flex; align-items: center">
      <el-select v-model="registerPlatformId" placeholder="全部平台">
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
      /></span>
      <el-button style="margin-left: 10px" type="primary" @click="getDataList">查询</el-button>
      <el-button style="margin-left: 10px" @click="reset">重置</el-button>
    </p>
    <p class="name mt5">我的数据</p>
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
                {{ Number(totalData?.currentChannelData?.newUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.newUserCountAndroid || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.newUserCountIOS || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.newUserCountUnknow || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">总金额</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.totalAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.totalAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.totalAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.totalAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值金币金额</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值VIP金额</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeSvipAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeSvipAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeSvipIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.currentChannelData?.rechargeSvipUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <p class="name mt5">我的所有下级总和数据</p>
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
                {{ Number(totalData?.allSubChannelData?.newUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.newUserCountAndroid || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.newUserCountIOS || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.newUserCountUnknow || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">总金额</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.totalAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.totalAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.totalAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.totalAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值金币金额</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值VIP金额</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeSvipAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeSvipAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeSvipIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allSubChannelData?.rechargeSvipUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <p class="name mt5">我和我的所有下级总和数据</p>
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
                {{ Number(totalData?.allChannelDataTotal?.newUserCount || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.newUserCountAndroid || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.newUserCountIOS || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.newUserCountUnknow || 0).toLocaleString() }}
                <span class="union">人</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">总金额</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.totalAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.totalAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.totalAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.totalAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值金币金额</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeAmountAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeAmountIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeAmountUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="isMobile ? 24 : 8">
        <el-card shadow="always" class="mt3" style="height: 140px">
          <div class="cardBox">
            <div>
              <span class="title">充值VIP金额</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeSvipAmount || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">Android</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeSvipAndroid || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">IOS</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeSvipIOS || 0).toLocaleString() }}
                <span class="union">¥</span>
              </span>
            </div>
            <div>
              <span class="title">未知</span>
              <span class="number">
                {{ Number(totalData?.allChannelDataTotal?.rechargeSvipUnknow || 0).toLocaleString() }}
                <span class="union">¥</span>
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
import { useUserStore } from "@/store/modules/user";
import { bgChannelDataForDistr } from "@/api/system";
import { optLong } from "@/enums";
import { filterNullSearchData } from "@/utils/index";
import moment from "moment";

const userStore: any = useUserStore();
const totalData: any = ref({});
const registerPlatformId: any = ref("");
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
    distrId: userStore.userInfo.user_info.id,
    ...filterNullSearchData({ registerPlatformId: registerPlatformId.value }),
  };
  bgChannelDataForDistr(params).then((res) => {
    totalData.value = res.data.data;
  });
};
const reset = () => {
  registerPlatformId.value = "";
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
