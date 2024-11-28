<template>
  <base-card>
    <div class="container">
      <p class="name" style="position: relative">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          style="width: 400px"
          value-format="YYYY-MM-DD HH:mm:ss"
          end-placeholder="结束日期"
          :clearable="false"
        />
        <el-button style="margin-top: -6px; margin-left: 10px" @click="getInfo" type="primary">查询</el-button>
      </p>
      <p class="name mt3">
        {{ route.query.pageFrom ? "该渠道" : "该安装包" }}的数据： <span class="time ml10"> </span>
      </p>
      <el-row :gutter="12">
        <el-col :span="isMobile ? 6 : 6">
          <el-card shadow="always" class="mt3">
            <div class="cardBox">
              <p class="title">新增人数</p>
              <p class="number">
                {{ Number(topUpData?.currentChannelData?.newUserCount || 0).toLocaleString() }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 6 : 6">
          <el-card shadow="always" class="mt3">
            <div class="cardBox">
              <p class="title">总金额</p>
              <p class="number">
                {{ Number(topUpData?.currentChannelData?.totalAmount || 0).toLocaleString() }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 6 : 6">
          <el-card shadow="always" class="mt3">
            <div class="cardBox">
              <p class="title">充值金币金额</p>
              <p class="number">
                {{ Number(topUpData?.currentChannelData?.rechargeAmount || 0).toLocaleString() }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="isMobile ? 6 : 6">
          <el-card shadow="always" class="mt3">
            <div class="cardBox">
              <p class="title">充值VIP金额</p>
              <p class="number">
                {{ Number(topUpData?.currentChannelData?.rechargeSvipAmount || 0).toLocaleString() }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-if="route.query.pageFrom">
        <p class="name mt3">该渠道的所有下级数据：<span class="time ml10"> </span></p>
        <el-row :gutter="12">
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">新增人数</p>
                <p class="number">
                  {{ Number(topUpData?.allSubChannelData?.newUserCount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">总金额</p>
                <p class="number">
                  {{ Number(topUpData?.allSubChannelData?.totalAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">充值金币金额</p>
                <p class="number">
                  {{ Number(topUpData?.allSubChannelData?.rechargeAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">充值VIP金额</p>
                <p class="number">
                  {{ Number(topUpData?.allSubChannelData?.rechargeSvipAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <p class="name mt3">该渠道与他所有下级渠道总数据：<span class="time ml10"> </span></p>
        <el-row :gutter="12">
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">新增人数</p>
                <p class="number">
                  {{ Number(topUpData?.allChannelDataTotal?.newUserCount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">总金额</p>
                <p class="number">
                  {{ Number(topUpData?.allChannelDataTotal?.totalAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">充值金币金额</p>
                <p class="number">
                  {{ Number(topUpData?.allChannelDataTotal?.rechargeAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isMobile ? 6 : 6">
            <el-card shadow="always" class="mt3">
              <div class="cardBox">
                <p class="title">充值VIP金额</p>
                <p class="number">
                  {{ Number(topUpData?.allChannelDataTotal?.rechargeSvipAmount || 0).toLocaleString() }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </base-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { bgChannelDataForChannelTagId, bgChannelDataForDistr } from "@/api/system";
import moment from "moment";
import { useRoute } from "vue-router";

const route = useRoute();

const topUpData: any = ref({
  allChannelDataTotal: {},
  allSubChannelData: {},
  currentChannelData: {},
});
const dateTime = ref<[string, string]>([
  `${moment(new Date()).format("YYYY-MM-DD")} 00:00:00`,
  `${moment(new Date()).format("YYYY-MM-DD")} 23:59:59`,
]);
const isMobile: any = ref(false);

const getInfo = () => {
  const params: any = {
    startTime: dateTime.value[0],
    endTime: dateTime.value[1],
  };
  if (route.query.pageFrom) {
    params.distrId = route.query.distrId;
    bgChannelDataForDistr(params).then((res) => {
      topUpData.value = res.data.data;
    });
  } else {
    params.chanelTagId = route.query.channelTagId;
    bgChannelDataForChannelTagId(params).then((res) => {
      topUpData.value = res.data.data;
    });
  }
};

onMounted(() => {
  if (route.query.id) {
    getInfo();
  }
  const clientWidth = document.body.clientWidth;
  isMobile.value = clientWidth < 500;
  window.onresize = () => {
    const clientWidth = document.body.clientWidth;
    isMobile.value = clientWidth < 500;
  };
});
</script>
<style lang="scss" scoped>
.container {
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
      font-size: 18px;
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
