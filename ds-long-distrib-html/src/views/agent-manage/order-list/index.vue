<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { myAgentList, distributorExport } from "@/api/system";
import { optionWithdraw, optionPayTypeWay, optionWithdrawStatus, EnumWithdrawStatus } from "@/enums";
import examine from "./doc/examine.vue";
import handleResult from "./doc/handleResult.vue";
import commImageShow from "@/views/common/commImageShow/index.vue";

const loading = ref(false);
const visible = ref(false);
const visibleCheck = ref(false);
const visibleHandleResult = ref(false);
const row: any = ref({});
const tableData = ref([]);

const searchForm: any = [
  {
    label: "提现进度:",
    type: "select",
    prop: "status",
    options: optionWithdrawStatus,
    placeholder: "请选择状态",
    labelWidth: "75",
    clearable: true,
  },
  {
    label: "账号:",
    type: "input",
    prop: "userName",
    placeholder: "请输入账号",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "姓名:",
    type: "input",
    prop: "realName",
    placeholder: "请输入姓名",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "订单:",
    type: "input",
    prop: "withdrawOrderId",
    placeholder: "请输入订单号",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "时间:",
    type: "datetimerange",
    prop: "dateTime",
    labelWidth: "50",
  },
];
const searchData = reactive({
  status: "",
  realName: "",
  userName: "",
  withdrawOrderId: "",
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.status = "";
  searchData.realName = "";
  searchData.userName = "";
  searchData.withdrawOrderId = "";
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
    a.download = "代理提现订单列表.xlsx"; //设置下载文件的文件名和文件格式
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
    label: "结算周期",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionWithdraw.find((v) => v.id === col.clearingPeriodType) || {};
      return item.name;
    },
  },
  {
    label: "账号",
    prop: "userName",
  },
  {
    label: "代理姓名",
    prop: "realName",
  },
  {
    label: "提现路径",
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
        return `<span/>`;
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
  {
    label: "操作",
    type: "html",
    width: "150",
    html: (col: any) => {
      const examineBtn = `<span data-tagName="examineBtn" class="activeBule pr2">审核</span>`;
      const handleBtn = `<span data-tagName="handleBtn" class="activeBule pr2">处理</span>`;
      let strBtn = "";
      if (EnumWithdrawStatus.pending === col.status) {
        strBtn = strBtn + examineBtn;
      } else if (EnumWithdrawStatus.withdrawing === col.status) {
        strBtn = strBtn + handleBtn;
      }
      return strBtn;
    },
    callback: (col: any, index: any, e: any) => {
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "examineBtn") {
        console.log(index);
        row.value = {
          ...col,
          callback: (data: any) => {
            if (data) {
              getList();
            }
            visible.value = false;
          },
        };
        visible.value = true;
        getList();
      } else if (tagname === "handleBtn") {
        row.value = {
          ...col,
          callback: (data: any) => {
            if (data) {
              getList();
            }
            visibleHandleResult.value = false;
          },
        };
        visibleHandleResult.value = true;
      }
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
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  myAgentList(params)
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
    <el-dialog v-model="visible" title="审核" width="500px">
      <examine v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog v-model="visibleHandleResult" title="处理" width="600">
      <handleResult v-if="visibleHandleResult" :row="row" />
    </el-dialog>
    <el-dialog v-model="visibleCheck" title="查看" width="600px">
      <commImageShow v-if="visibleCheck" :row="row" />
    </el-dialog>
  </base-card>
</template>
