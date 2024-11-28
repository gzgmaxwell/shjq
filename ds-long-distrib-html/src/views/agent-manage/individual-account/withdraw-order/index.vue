<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { distributorList, distributorExport } from "@/api/system";
import { optionWithdrawStatus, optionWithdraw, optionPayTypeWay } from "@/enums";
import commImageShow from "@/views/common/commImageShow/index.vue";

const loading = ref(false);
const visibleCheck = ref(false);
const row: any = ref({});
const tableData = ref([]);

const searchForm: any = [
  {
    label: "订单号:",
    type: "input",
    prop: "withdrawOrderId",
    placeholder: "请输入订单号",
    labelWidth: "60",
    clearable: true,
  },
  {
    label: "提现进度:",
    type: "select",
    prop: "status",
    options: optionWithdrawStatus,
    placeholder: "请选择进度",
    clearable: true,
  },

  {
    label: "时间:",
    type: "datetimerange",
    prop: "dateTime",
    labelWidth: "50",
  },
];
const searchData = reactive({
  withdrawOrderId: "",
  status: "",
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.withdrawOrderId = "";
  searchData.status = "";
  searchData.dateTime = [];
  getList();
};
const exportFun = () => {
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
    current: tablePage.current,
    size: tablePage.size,
  };
  distributorExport(params).then((res) => {
    let b = new Blob([res.data]); //拿到文件流下载对象
    let url = window.URL.createObjectURL(b); //生成文件流下载链接
    let a = document.createElement("a"); //创建一个a标签用来跳转
    a.href = url; // a标签 href  赋值 链接
    a.download = "我的提现订单.xlsx"; //设置下载文件的文件名和文件格式
    document.body.appendChild(a); //将标签DOM，放置页面
    a.click();
    window.URL.revokeObjectURL(url); //释放 url 对象内存
    document.body.removeChild(a); //移除标签节点
    ElMessage.success(`文件导出成功！！`);
  });
};
const searchHandle = [
  { label: "查询", type: "primary", callback: search },
  { label: "重置", type: "primary", callback: reset },
  { label: "导出", type: "primary", callback: exportFun },
];

const tableLabel = [
  {
    label: "账号",
    prop: "userName",
  },
  {
    label: "提现路径",
    prop: "withdrawType",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionPayTypeWay.find((v) => v.id === col.withdrawType) || {};
      return item.name;
    },
  },
  {
    label: "收款账户",
    prop: "collectionAccount",
  },
  {
    label: "提现金额",
    prop: "withdrawMoney",
  },
  {
    label: "订单号",
    prop: "withdrawOrderId",
  },
  {
    label: "申请时间",
    prop: "createTime",
  },
  {
    label: "结算周期",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionWithdraw.find((v) => v.id === col.clearingPeriodType) || {};
      return item.name;
    },
  },
  {
    label: "提现进度",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionWithdrawStatus.find((v) => v.id === col.status) || {};
      return item.name;
    },
  },
  {
    label: "凭证",
    type: "html",
    html: (col: any) => {
      if (col.fullUrl) {
        return `<img data-tagName="examineBtn" src=${col.fullUrl} width="80" height="40" />`;
      } else {
        return;
      }
    },
    callback: (col: any) => {
      row.value = col;
      visibleCheck.value = true;
    },
  },
  {
    label: "原因",
    prop: "description",
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
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  distributorList(params)
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
    <el-dialog v-model="visibleCheck" title="查看" width="600px">
      <commImageShow v-if="visibleCheck" :row="row" />
    </el-dialog>
  </base-card>
</template>
