<script setup lang="ts">
import { ref, onMounted } from "vue";
import { packageSelfPage, projectOperate, agentProjectExport, packageGenerate } from "@/api/system";
import { optionProxyStatus, EnumProxyStatus, enums_schType, optionGenPackageStatus, GenPackageStatus } from "@/enums";
import { getUserId } from "@/utils";
import genPackge from "./genPackge.vue";

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
    placeholder: "请选择项目状态",
    clearable: true,
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

const exportFun = () => {
  const params: any = {
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
    distrId: getUserId(),
  };
  if (params.status === "") {
    delete params.status;
  }
  agentProjectExport(params).then((res: any) => {
    let b = new Blob([res.data]); //拿到文件流下载对象
    let url = window.URL.createObjectURL(b); //生成文件流下载链接
    let a = document.createElement("a"); //创建一个a标签用来跳转
    a.href = url; // a标签 href  赋值 链接
    a.download = "项目统计.xlsx"; //设置下载文件的文件名和文件格式
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
    label: "项目",
    prop: "projectName",
  },
  {
    label: "操作系统",
    prop: "appSystemName",
  },
  {
    label: "版本号",
    prop: "appVersion",
  },
  {
    label: "项目状态",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionProxyStatus.find((v) => v.id === col.status);
      return item?.name;
    },
  },
  {
    label: "打包状态",
    type: "filter",
    filter: (col: any) => {
      const item: any = optionGenPackageStatus.find((v) => v.id === col.packageStatus);
      return item?.name;
    },
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
    label: "下级渠道商数量",
    prop: "distrCount",
  },
  {
    label: "下级渠道商收益",
    prop: "nextIncome",
  },
  {
    label: "添加时间",
    prop: "createTime",
  },

  {
    label: "操作",
    type: "html",
    width: "200",
    html: (col: any) => {
      const checkBtn = `<span data-tagName="checkBtn" class="activeBule pr2">查看</span>`;
      const genBtn = `<span data-tagName="genBtn" class="activeBule pr2">生成安装包</span>`;
      // const forbiddenBtn = `<span data-tagName="forbiddenBtn" class="activeBule red pr2">禁用</span>`;
      // const startBtn = `<span data-tagName="startBtn" class="activeBule pr2">启用</span>`;
      let strBtn = "";
      // if (col.status == EnumProxyStatus.DISABLED) {
      //   strBtn += startBtn;
      // }
      if (col.status == EnumProxyStatus.NORMAL) {
        // strBtn += forbiddenBtn;
      }
      if (col.packageStatus === GenPackageStatus.PEDING || col.packageStatus === GenPackageStatus.FAILED) {
        strBtn += genBtn;
      }

      if (col.packageStatus === GenPackageStatus.SUCCEED) {
        strBtn += checkBtn;
      }
      return strBtn;
    },
    callback: (col: any, index: any, e: any) => {
      console.log(col, index);
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "checkBtn") {
        row = {
          ...col,
          callback: (data: any) => {
            if (data) {
              getList();
            }
            visible.value = false;
          },
        };
        visible.value = true;
      }
      if (tagname === "genBtn") {
        packageGenerate({
          extensionAgentProjectPackageId: col.id,
        }).then(() => {
          ElMessage.success("稍后请刷新页面查看;正在打包中...");
          getList();
        });
      } else if (tagname === "forbiddenBtn") {
        ElMessageBox.confirm("确定禁用吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          projectOperate(col.id).then(() => {
            getList();
          });
        });
      } else if (tagname === "startBtn") {
        projectOperate(col.id).then(() => {
          getList();
        });
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
  const params: any = {
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
    distrId: getUserId(),
  };
  if (params.status === "") {
    delete params.status;
  }
  loading.value = true;
  packageSelfPage(params)
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
    <el-dialog v-model="visible" title="生成安装包" width="720px">
      <genPackge v-if="visible" :row="row" />
    </el-dialog>
  </base-card>
</template>
