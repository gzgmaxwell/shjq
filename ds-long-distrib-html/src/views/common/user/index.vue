<script setup lang="ts">
import router from "@/router";
import { ref, onMounted } from "vue";
import { yieldYieldTotal, yieldUserListExport, yieldUserList, agentUserRelationshipUpdateStatus } from "@/api/system";
import { EnumProxyStatus } from "@/enums";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(false);
const sum = ref(0);
const tableData = ref([]);

const searchForm: any = [
  {
    label: "昵称:",
    type: "input",
    prop: "name",
    placeholder: "请输入昵称",
    clearable: true,
    labelWidth: "50",
  },
  {
    label: "账号:",
    type: "input",
    prop: "mobile",
    placeholder: "请输入账号",
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
  mobile: "",
  name: "",
  dateTime: [],
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.mobile = "";
  searchData.name = "";
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
    agentProjectId: route.query.id,
  };
  yieldUserListExport(params).then((res) => {
    let b = new Blob([res.data]); //拿到文件流下载对象
    let url = window.URL.createObjectURL(b); //生成文件流下载链接
    let a = document.createElement("a"); //创建一个a标签用来跳转
    a.href = url; // a标签 href  赋值 链接
    a.download = "用户列表.xlsx"; //设置下载文件的文件名和文件格式
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
    label: "昵称",
    prop: "name",
  },
  {
    label: "账号",
    prop: "mobile",
  },
  {
    label: "注册时间",
    prop: "createTime",
  },
  {
    label: "获得奖励",
    prop: "money",
  },
  {
    label: "操作",
    type: "html",
    width: "280",
    html: (col: any) => {
      let fixeBtn = `<span data-tagName="checkBtn" class="activeBule pr2">查看</span> <span data-tagName="bindBtn" class="activeBule pr2 red">解绑</span>`;
      let str = "";
      if (EnumProxyStatus.NORMAL === col.status) {
        str = fixeBtn;
      }
      return str;
    },
    callback: (col: any, index: any, e: any) => {
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "checkBtn") {
        console.log(index);
        router.push({
          path: "/common/user/details",
          query: {
            id: col.userId,
            detailId: col.detailId,
          },
        });
      } else if (tagname === "bindBtn") {
        ElMessageBox.confirm("确定解绑吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          handleStatus(col.userId);
        });
      }
    },
  },
];
const handleStatus = (userId: string) => {
  const params = {
    status: EnumProxyStatus.DISABLED,
    userId: userId,
  };
  agentUserRelationshipUpdateStatus(params).then(() => {
    getList();
  });
};
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
    agentProjectId: route.query.id,
  };
  loading.value = true;
  yieldUserList(params)
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
  yieldYieldTotal({
    agentProjectId: route.query.id,
  })
    .then((res) => {
      const { data } = res;
      sum.value = data.data;
    })
    .catch(() => {
      loading.value = false;
    });
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
      <template #statistics>
        <p class="imcome">共计获得收益：{{ sum }}</p>
      </template>
    </TableSearch>
  </base-card>
</template>
<style scoped lang="scss">
.imcome {
  padding-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
}
</style>
