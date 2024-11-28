<script setup lang="ts">
import { ref, onMounted } from "vue";
import { subExport, projectOperate, packageListByAgentId } from "@/api/system";
import { EnumProxyStatus, optionProxyStatus, enums_schType } from "@/enums";
import { useRoute } from "vue-router";
import createProject from "./createProject.vue";

const route = useRoute();

const loading = ref(false);
const tableData = ref([]);
let row: any = reactive({});
const visible = ref(false);

const searchForm: any = [
  {
    type: "input",
    prop: "projectName",
    placeholder: "请输入项目",
    clearable: true,
    labelWidth: "40",
  },
  {
    type: "select",
    prop: "status",
    options: optionProxyStatus,
    placeholder: "请选择状态",
    clearable: true,
    labelWidth: "50",
  },
];
const searchData = reactive({
  projectName: "",
  status: "",
});
const search = () => {
  tablePage.current = 1;
  getList();
};
const reset = () => {
  searchData.projectName = "";
  searchData.status = "";
  getList();
};
const createFun = () => {
  row = {
    callback: (data: any) => {
      if (data) {
        getList();
      }
      visible.value = false;
    },
  };
  visible.value = true;
};

const exportFun = () => {
  const params: any = {
    current: tablePage.current,
    distrId: route.query.distrId,
    // distrMobile: "string",
    // distrName: "string",
    projectName: searchData.projectName,
    size: tablePage.size,
    status: searchData.status,
  };
  if (params.status === "") {
    delete params.status;
  }
  subExport(params).then((res) => {
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
  { label: "add", type: "primary", callback: createFun },
];

const tableLabel = [
  {
    label: "项目名称",
    prop: "projectName",
  },
  {
    label: "系统",
    prop: "appSystemName",
  },
  {
    label: "版本号",
    prop: "appVersion",
  },
  {
    label: "结算方式",
    prop: "schemeType",
  },
  {
    label: "视频项目结算金额",
    type: "filter",
    filter: (col: any) => {
      const schemeList = col.schemeList || [];

      if (col.schemeType === enums_schType.CPA) {
        const item = schemeList.find((v: any) => v.schemeType === enums_schType.CPA);
        return item?.subsidyMoney;
      }
      if (col.schemeType === enums_schType.CPS) {
        const item = schemeList.find((v: any) => v.schemeType === enums_schType.CPS);
        const str = item?.ratio ? `${item?.ratio}%` : "";
        return str;
      }
    },
  },
  // {
  //   label: "游戏项目结算金额",
  //   type: "filter",
  //   filter: (col: any) => {
  //     const schemeList = col.schemeList || [];
  //     if (col.schemeType === enums_schType.CPS) {
  //       const item = schemeList.find((v: any) => v.schemeType === enums_schType.GAME_CPS);
  //       const str = item?.ratio ? `${item?.ratio}%` : "";
  //       return str;
  //     }
  //   },
  // },
  {
    label: "收益",
    prop: "income",
  },
  {
    label: "状态",
    type: "filter",
    filter: (col: any) => {
      const item = optionProxyStatus.find((v) => v.id === col.status);
      return item?.name;
    },
  },
  {
    label: "添加时间",
    prop: "createTime",
  },
  {
    label: "操作",
    type: "html",
    width: "280",
    html: (col: any) => {
      // let str = `<span data-tagName="stop" class="activeBule pr2 red">删除</span>`;
      let str = ``;
      let start = `<span data-tagName="start" class="activeBule pr2">启用</span>`;
      let stop = `<span data-tagName="stop" class="activeBule pr2 red">停用</span>`;
      if (col.status === EnumProxyStatus.NORMAL) {
        str += stop;
      } else if (col.status === EnumProxyStatus.DISABLED) {
        str += start;
      }
      return str;
    },
    callback: (col: any, index: any, e: any) => {
      console.log(index);
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "start") {
        handleStatus(col.id);
      } else if (tagname === "stop") {
        ElMessageBox.confirm("确定停用吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          handleStatus(col.id);
        });
      }
    },
  },
];
const handleStatus = (id: string) => {
  projectOperate(id).then(() => {
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
  const params: any = {
    current: tablePage.current,
    size: tablePage.size,
    distrId: route.query.distrId,
    projectName: searchData.projectName,
    status: searchData.status,
  };
  if (params.status === "") {
    delete params.status;
  }
  loading.value = true;
  packageListByAgentId(params)
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
    <el-dialog v-model="visible" title="项目管理" width="60%">
      <createProject v-if="visible" :row="row" />
    </el-dialog>
  </base-card>
</template>
