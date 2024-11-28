<script setup lang="ts">
import { ref, onMounted } from "vue";
import { userGoldDetails, userGoldStatistics } from "@/api/system";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(1111, route);

const loading = ref(false);
const goldTotal = ref(0);
const tableData = ref([]);

const searchForm: any = [
  {
    label: "时间:",
    labelWidth: "50",
    type: "datetimerange",
    prop: "dateTime",
  },
];
const searchData = reactive({
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.dateTime = [];
  getList();
};

const searchHandle = [
  { label: "查询", type: "primary", callback: search },
  { label: "重置", type: "primary", callback: reset },
];

const tableLabel = [
  {
    label: "商品",
    prop: "consumeTypeStr",
  },
  {
    label: "交易金额",
    prop: "amount",
  },

  {
    label: "交易后余额",
    prop: "wallet",
  },
  {
    label: "交易时间",
    prop: "payTime",
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
  let startTime = "";
  let endTime = "";
  if (searchData.dateTime && searchData.dateTime.length) {
    startTime = searchData.dateTime[0];
    endTime = searchData.dateTime[1];
  }
  const params = {
    ...searchData,
    startTime,
    endTime,
    userId: route.query.id,
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  userGoldDetails(params)
    .then((res: any) => {
      const { data } = res;
      loading.value = false;
      tableData.value = data.data.records;
      tablePage.total = data.data.total;
    })
    .catch(() => {
      loading.value = false;
    });
};
const getGoldStatistics = () => {
  userGoldStatistics({ userId: route.query.id }).then((res) => {
    const { data } = res;
    if (data.code == 200 && data.data) {
      goldTotal.value = data.data;
    }
  });
};
onMounted(() => {
  getList();
  getGoldStatistics();
});
</script>

<template>
  <base-card>
    <SearchList :searchData="searchData" :searchForm="searchForm" :searchHandle="searchHandle" />
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
  </base-card>
</template>
