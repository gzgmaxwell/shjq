<script setup lang="ts">
import { ref, onMounted } from "vue";
import { incomeDetailMyCreation } from "@/api/system";
import { optConsumeType } from "@/enums";
import { resetSearchData, filterNullSearchData } from "@/utils/index";

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    type: "input",
    prop: "orderNum",
    placeholder: "订单号",
    clearable: true,
    labelWidth: "40",
  },
  {
    type: "select",
    prop: "type",
    options: optConsumeType,
    placeholder: "请选择订单类型",
    clearable: true,
  },
  {
    label: "收益日期",
    type: "datetimerange",
    prop: "dateTime",
    labelWidth: "80",
  },
];
const searchData: any = reactive({
  orderNum: "",
  type: "",
  dateTime: [],
});
const searchHandle = [
  {
    label: "查询",
    type: "primary",
    callback: () => {
      tablePage.current = 1;
      getList();
    },
  },
  {
    label: "重置",
    type: "primary",
    callback: () => {
      resetSearchData(searchData);
      getList();
    },
  },
];

const tableLabel = [
  {
    label: "项目",
    prop: "projectName",
  },
  {
    label: "订单号",
    prop: "orderNum",
  },
  {
    label: "订单金额($)",
    prop: "amount",
  },
  {
    label: "订单类型",
    type: "filter",
    filter: (col: any) => {
      const item = optConsumeType.find((v: any) => v.id === col.type);
      return item?.name;
    },
  },
  {
    label: "用户ID",
    prop: "userId",
  },
  {
    label: "用户昵称",
    prop: "userNickname",
  },
  {
    label: "我的佣金($)",
    prop: "distrBrokerageMoney",
  },
  {
    label: "订单支付时间",
    prop: "payTime",
  },
  {
    label: "收益产生时间",
    prop: "createTime",
  },
];
let tablePage = reactive({
  total: 1,
  current: 1,
  size: 10,
  pagination: ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
    tablePage.current = currentPage;
    tablePage.size = pageSize;
    getList();
  },
});

const getList = () => {
  const params: any = {
    ...filterNullSearchData(searchData),
    current: tablePage.current,
    size: tablePage.size,
  };
  if (searchData.dateTime && searchData.dateTime.length) {
    params.payTimeStart = searchData.dateTime[0];
    params.payTimeEnd = searchData.dateTime[1];
  }
  loading.value = true;
  incomeDetailMyCreation(params)
    .then((res) => {
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
