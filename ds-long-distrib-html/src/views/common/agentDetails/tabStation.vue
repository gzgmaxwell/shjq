<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { distributorDetail } from "@/api/system";
import { optionProxyStatus, optWebmasterType, EnumWebmasterType } from "@/enums";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(false);
let tableData = reactive([]);

const tableLabel = [
  {
    label: "数据日期",
    prop: "date",
  },
  {
    label: "1",
    prop: "",
  },
  {
    label: "2",
    prop: "",
  },
  {
    label: "3",
    prop: "",
  },
  {
    label: "4",
    prop: "",
  },
  {
    label: "5",
    prop: "",
  },
  {
    label: "6",
    prop: "",
  },
  {
    label: "7",
    prop: "",
  },
  {
    label: "8",
    prop: "",
  },
  {
    label: "新增用户数",
    prop: "userCount",
    show: () => route.query.stationmasterType === EnumWebmasterType.CPA_STATIONMASTER,
  },
  {
    label: "充值总金额",
    prop: "chargeAmount",
    show: () => route.query.stationmasterType === EnumWebmasterType.CPS_STATIONMASTER,
  },
  {
    label: "充值金币金额",
    prop: "chargeGoldAmount",
    width: 120,
    show: () => route.query.stationmasterType === EnumWebmasterType.CPS_STATIONMASTER,
  },
  {
    label: "充值vip金额",
    prop: "chargeSVipAmount",
    show: () => route.query.stationmasterType === EnumWebmasterType.CPS_STATIONMASTER,
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
    id: route.query.stationmasterId,
    type: "STATION_MASTER",
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

const computedStationmasterType = computed(() => {
  return optWebmasterType.find((v: any) => v.id === route.query.stationmasterType)?.name;
});
</script>

<template>
  <base-card>
    <div class="title">
      <span>站长账号:{{ route.query.stationmasterMobile }}</span>
      <span>站长名称:{{ route.query.stationmasterName }}</span>
      <span>站长身份:{{ computedStationmasterType }}</span>
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
