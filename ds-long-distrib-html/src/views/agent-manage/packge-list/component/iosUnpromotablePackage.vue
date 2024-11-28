<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { unavailablePackage, packageGenerate } from "@/api/system";
import { optSignStatus, signStatus, optLong } from "@/enums";
import { getUserId } from "@/utils";

const props: any = defineProps({
  tab: {
    type: String,
    required: false,
    default: "",
  },
});

const loading = ref(false);
const tableData = ref([]);

const searchForm: any = [
  {
    type: "input",
    prop: "appVersion",
    placeholder: "请输入版本",
    clearable: true,
  },
];
const searchData = reactive({
  appVersion: "",
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
    callback: () => {
      searchData.appVersion = "";
      tablePage.total = 0;
      tablePage.current = 1;
      tablePage.size = 10;
      getList();
    },
  },
];

const tableLabel = [
  {
    label: "版本",
    prop: "versionOfficial",
  },
  {
    label: "安装包ID",
    prop: "channelTagId",
  },
  {
    label: "上传时间",
    prop: "createTime",
  },
  {
    label: "url 最近修改时间",
    type: "filter",
    filter: (row: any) => {
      return row.generateTime ? row.generateTime : "/";
    },
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
      const isQiyong = !col.abandon && !col.versionDeleted && !col.deleted && col.enable; // 启用
      const isFeiqi = col.abandon && !col.versionDeleted && !col.deleted && !col.enable; // 废弃
      const isShanchu = col.versionDeleted || col.deleted; // 删除
      if (isQiyong) {
        return "启用";
      }
      if (isFeiqi) {
        return "废弃";
      }
      if (isShanchu) {
        return "删除";
      }
    },
  },
  {
    label: "签名状态",
    type: "filter",
    filter: (col: any) => {
      return optSignStatus.find((v) => v.id === col.signStatus)?.name;
    },
  },
  {
    label: "操作",
    type: "html",
    html: (col: any) => {
      const sign = `<span data-tagName="sign" class="activeBule">申请签名</span>`;
      let str = "";
      const isQiyong = !col.abandon && !col.versionDeleted && !col.deleted && col.enable; // 启用
      //  col.signStatus == signStatus.PENDING  待签名
      //  col.signStatus == signStatus.FAILED  签名失败
      //  col.signStatus == signStatus.DELETED  删除(签名失败)
      //  col.status == signStatus.FAILED  打包失败
      const status =
        col.signStatus == signStatus.PENDING ||
        col.signStatus == signStatus.FAILED ||
        col.signStatus == signStatus.DELETED ||
        col.status == signStatus.FAILED;
      if (isQiyong && col.online && status) {
        str += sign;
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

      if (tagname === "sign") {
        packageGenerate({
          projectPackageId: col.id,
        }).then(() => {
          getList();
        });
      }
    },
  },
];
const tablePage = {
  total: 0,
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
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
    distrId: getUserId(),
    appSystemName: props.tab,
  };
  loading.value = true;
  unavailablePackage(params)
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
    :tablePage="tablePage"
    :isIndex="true"
  >
  </TableSearch>
</template>
