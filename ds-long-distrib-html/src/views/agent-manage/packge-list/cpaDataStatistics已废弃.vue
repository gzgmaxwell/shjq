<script setup lang="ts">
import { ref, onMounted } from "vue";
import { packageStatisticsNewUser } from "@/api/system";
// import { GenPackageStatus, optionGenPackageStatus, optLong } from "@/enums";
// import { getUserId } from "@/utils";

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
    default: () => {},
  },
});

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [];
const searchData = reactive({});
const searchHandle: any = [];

const tableLabel = [
  {
    prop: "payTime",
    label: "数据日期",
  },
  {
    prop: "newUserCount",
    label: "新增用户数",
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
    channelTagId: props.row.channelTagId,
  };
  loading.value = true;
  packageStatisticsNewUser(params)
    .then((res) => {
      loading.value = false;
      tableData.value = res.data.data.records;
      tablePage.total = res.data.data.total;
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
  <SearchList :searchData="searchData" :searchForm="searchForm" :searchHandle="searchHandle" />
  <TableSearch
    :loading="loading"
    :tableData="tableData"
    :searchData="searchData"
    :tableLabel="tableLabel"
    :operation="{}"
    :tablePage="tablePage"
    :isIndex="true"
  >
  </TableSearch>
</template>
