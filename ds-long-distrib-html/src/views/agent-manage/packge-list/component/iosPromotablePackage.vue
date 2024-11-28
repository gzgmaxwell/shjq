<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { availablePackage } from "@/api/system";
import { optSignStatus, optLong } from "@/enums";
import { getUserId } from "@/utils";
import check from "../check.vue";

const props: any = defineProps({
  tab: {
    type: String,
    required: false,
    default: "",
  },
});

const loading = ref(false);
const visible = ref(false);
let row: any = reactive({});
const tableData = ref([]);

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
    width: "80",
    html: () => {
      const checkBtn = `<span data-tagName="checkBtn" class="activeBule pr2">查看</span>`;
      let str = "";
      return str + checkBtn;
    },
    callback: (col: any, index: any, e: any) => {
      console.log(index);
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
    current: tablePage.current,
    size: tablePage.size,
    distrId: getUserId(),
    appSystemName: props.tab,
  };
  loading.value = true;
  availablePackage(params)
    .then((res) => {
      loading.value = false;
      tableData.value = res.data.data;
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
  <TableSearch
    :loading="loading"
    :tableData="tableData"
    :tableLabel="tableLabel"
    :tablePage="tablePage"
    :isIndex="true"
  >
  </TableSearch>
  <el-dialog v-model="visible" title="查看" width="50%">
    <check v-if="visible" :row="row" />
  </el-dialog>
</template>
