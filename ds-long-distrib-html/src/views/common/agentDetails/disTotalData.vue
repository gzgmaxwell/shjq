<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { distributorDetail } from "@/api/system";
import { optionProxyStatus, EnumDisType, EnumWebmasterType, optWebmasterType } from "@/enums";
import { useRoute } from "vue-router";

const route = useRoute();

const props: any = defineProps({
  tab: {
    type: String,
    required: false,
    default: "",
  },
});

const loading = ref(false);
let tableData = reactive([]);

const tableLabel = [
  {
    label: "数据日期",
    prop: "date",
  },
  {
    label: "新增用户数",
    prop: "userCount",
    show: () =>
      props.tab === EnumDisType.NEW_USER ||
      route.query.channelType === EnumWebmasterType.CPA_STATIONMASTER ||
      route.query.channelType === EnumWebmasterType.CPT_STATIONMASTER,
  },
  {
    label: "充值总金额",
    prop: "chargeAmount",
    show: () => props.tab === EnumDisType.CHARGE || route.query.channelType === EnumWebmasterType.CPS_STATIONMASTER,
  },
  {
    label: "充值金币金额",
    prop: "chargeGoldAmount",
    width: 120,
    show: () => props.tab === EnumDisType.CHARGE || route.query.channelType === EnumWebmasterType.CPS_STATIONMASTER,
  },
  {
    label: "充值vip金额",
    prop: "chargeSVipAmount",
    show: () => props.tab === EnumDisType.CHARGE || route.query.channelType === EnumWebmasterType.CPS_STATIONMASTER,
  },
];
const tablePage = {
  total: 1,
  current: 1,
  size: 10,
  pagination: ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
    tablePage.current = currentPage;
    tablePage.size = pageSize;
    getList();
  },
};

const getList = () => {
  const params = {
    current: tablePage.current,
    size: tablePage.size,
    id: route.query.id,
    type: "DISTRIBUTOR",
    dataType: props.tab,
  };
  loading.value = true;
  distributorDetail(params)
    .then((res) => {
      loading.value = false;
      tableData = res.data.data.records;
      tablePage.total = res.data.data.total;
    })
    .catch(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getList();
});
const computedStatus = computed(() => {
  return optionProxyStatus.find((v) => v.id === route.query.status)?.name;
});
const computedChannelType = computed(() => {
  return optWebmasterType.find((v) => v.id === route.query.channelType)?.name;
});
</script>

<template>
  <base-card>
    <div class="title">
      <span>渠道商账号:{{ route.query.distrMobile }}</span>
      <span>渠道商名称:{{ route.query.distrName }}</span>
      <span>渠道商等级:{{ route.query.level }}</span>
      <span>渠道商身份:{{ computedChannelType }}</span>
      <span>账号状态:{{ computedStatus }}</span>
    </div>
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="{}"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
  </base-card>
</template>
<style scoped lang="scss">
.title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;

  span {
    margin-right: 20px;
  }
}
</style>
