<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { distributor_distrPage, webAgentOperate } from "@/api/system";
import { EnumProxyStatus, optWebmasterType } from "@/enums";
import { i18nTL } from "@/utils/i18n";
import { pageHandle } from "@/utils";

const loading = ref(false);
let tableData = reactive([]);

const props: any = defineProps({
  row: {
    type: Object,
    required: false,
  },
});

const searchForm: any = [
  {
    type: "input",
    prop: "distrName",
    placeholder: "渠道商名称",
    clearable: true,
    labelWidth: "80",
  },
  {
    type: "input",
    prop: "distrMobile",
    placeholder: "渠道商账号",
    clearable: true,
  },
];

let searchData = reactive({
  distrName: "",
  distrMobile: "",
});

const searchHandle = reactive([
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
      searchData.distrName = "";
      searchData.distrMobile = "";
      getList();
    },
  },
]);

const tableLabel = [
  {
    label: "渠道商账号",
    type: "html",
    html: (col: any) => {
      let fixeBtn = `<span>${col.distrMobile}</span>`;
      return fixeBtn;
    },
  },
  {
    label: "渠道商名称",
    prop: "distrName",
  },
  {
    label: "渠道商身份",
    type: "filter",
    filter: (col: any) => {
      return optWebmasterType.find((v) => v.id === col.channelType)?.name;
    },
  },
  {
    label: "操作",
    type: "html",
    width: "100",
    html: () => {
      let startBtn = `<span data-tagName="startBtn" class="activeBule pr2">${i18nTL("enable")}</span>`;
      return startBtn;
    },
    callback: (col: any, index: any, e: any) => {
      console.log(index);
      const {
        target: {
          dataset: { tagname },
        },
      } = e;
      if (tagname === "startBtn") {
        handleStatus(col.id);
      }
    },
  },
];
const handleStatus = (id: any) => {
  webAgentOperate(id).then(() => {
    const newCurrent = pageHandle(tablePage.current, tablePage.size, tablePage.total);
    tablePage.current = newCurrent;
    ElMessage.success("启用成功");
    getList();
    props.row.callback(true);
  });
};
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
    status: EnumProxyStatus.DISABLED,
  };
  loading.value = true;
  distributor_distrPage(params)
    .then((res) => {
      loading.value = false;
      tableData = res.data.data.records;
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
  <div>
    <SearchList :searchData="searchData" :searchForm="searchForm" :searchHandle="searchHandle"> </SearchList>
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="false"
    >
    </TableSearch>
  </div>
</template>
