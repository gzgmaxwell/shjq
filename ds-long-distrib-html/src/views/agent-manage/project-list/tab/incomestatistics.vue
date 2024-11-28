<script setup lang="ts">
import { ref, onMounted } from "vue";
import { incomeExport, queryAgentIncomePage } from "@/api/system";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    label: "账号:",
    type: "input",
    prop: "agentMobile",
    placeholder: "请输入账号",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "姓名:",
    type: "input",
    prop: "agentName",
    placeholder: "请输入姓名",
    clearable: true,
  },
];
const searchData = reactive({
  agentMobile: "",
  agentName: "",
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.agentMobile = "";
  searchData.agentName = "";
  getList();
};
const exportFun = () => {
  const params = {
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
  };
  incomeExport(params).then((res) => {
    let b = new Blob([res.data]); //拿到文件流下载对象
    let url = window.URL.createObjectURL(b); //生成文件流下载链接
    let a = document.createElement("a"); //创建一个a标签用来跳转
    a.href = url; // a标签 href  赋值 链接
    a.download = "收益统计.xlsx"; //设置下载文件的文件名和文件格式
    document.body.appendChild(a); //将标签DOM，放置页面
    a.click();
    window.URL.revokeObjectURL(url); //释放 url 对象内存
    document.body.removeChild(a); //移除标签节点
    ElMessage.success(`文件导出成功！`);
  });
};
const searchHandle = [
  { label: "查询", type: "primary", callback: search },
  { label: "重置", type: "primary", callback: reset },
  { label: "导出", type: "primary", callback: exportFun },
];

const tableLabel = [
  {
    label: "添加时间",
    prop: "createTime",
  },
  {
    label: "代理姓名",
    prop: "agentName",
  },
  {
    label: "账号",
    prop: "agentMobile",
  },
  {
    label: "总收入",
    prop: "totalMoney",
  },
  {
    label: "已提现",
    prop: "withdrawedMoney",
  },

  {
    label: "可提现",
    prop: "balance",
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
  console.log(route.query.agentId);

  const params = {
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
    agentId: route.query.agentId,
  };
  loading.value = true;
  queryAgentIncomePage(params)
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
