<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ext_record_page } from "@/api/system";
import { optPackgeStatus, optLong } from "@/enums";
import { filterNullSearchData } from "@/utils/index";

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    type: "select",
    prop: "auditStatus",
    placeholder: "请选择包状态",
    clearable: true,
    options: optPackgeStatus,
    labelWidth: "50",
  },
];
const searchData = reactive({
  auditStatus: "",
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
      searchData.auditStatus = "";
      getList();
    },
  },
];

const tableLabel = [
  {
    label: "版本",
    prop: "appVersion",
  },
  {
    label: "安装包ID",
    prop: "distrId",
  },
  {
    label: "视频平台",
    type: "filter",
    filter: (row: any) => {
      return optLong.find((v: any) => v.id === row.registerBusPlatformId)?.name;
    },
  },
  {
    label: "安装包状态",
    type: "filter",
    filter: (col: any) => {
      if (!col.abandon && !col.versionDeleted && !col.deleted && col.enable) {
        return "启用";
      }
      if (col.abandon && !col.versionDeleted && !col.deleted && !col.enable) {
        return "弃用";
      }
      if (col.versionDeleted || col.deleted) {
        return "删除";
      }
    },
  },
  {
    label: "申请时间",
    prop: "createTime",
  },
  {
    label: "审核状态",
    type: "filter",
    filter: (col: any) => {
      return optPackgeStatus.find((v) => v.id === col.auditStatus)?.name;
    },
  },
  {
    label: "审核时间",
    prop: "createTime",
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
    ...filterNullSearchData(searchData),
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  ext_record_page(params)
    .then((res: any) => {
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
