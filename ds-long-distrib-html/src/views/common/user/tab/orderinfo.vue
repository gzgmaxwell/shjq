<script setup lang="ts">
import { ref, onMounted } from "vue";
import { userOrderDetails } from "@/api/system";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    label: "订单号:",
    type: "input",
    prop: "orderNum",
    placeholder: "请输入订单号",
    clearable: true,
    labelWidth: "70",
  },
  {
    label: "时间:",
    labelWidth: "50",
    type: "datetimerange",
    prop: "dateTime",
  },
];
const searchData = reactive({
  orderNum: "",
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.orderNum = "";
  searchData.dateTime = [];
  getList();
};

const searchHandle = [
  { label: "查询", type: "primary", callback: search },
  { label: "重置", type: "primary", callback: reset },
];

const tableLabel = [
  {
    label: "订单号",
    prop: "videoTitle",
  },
  {
    label: "商品名称",
    prop: "orderName",
    align: "center",
  },

  {
    label: "发布时间",
    prop: "createTime",
  },
  {
    label: "交易时间",
    prop: "payTime",
  },
  {
    label: "交易结果",
    prop: "payStatus",
    type: "html",
    html: (col: any) => {
      const className = col.payStatus != "COMPLETE" ? "must" : "";
      return `<span class=${className}>${col.payStatus == "COMPLETE" ? "交易成功" : "交易失败"}</span>`;
    },
  },
  {
    prop: "amount",
    label: "交易金额",
    type: "html",
    html: (col: any) => {
      return `<span>${col.amount / 100}</span>`;
    },
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
  userOrderDetails(params)
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
onMounted(() => {
  getList();
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
