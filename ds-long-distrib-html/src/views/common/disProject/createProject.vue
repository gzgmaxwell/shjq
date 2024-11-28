<script setup lang="ts">
import { ref, onMounted } from "vue";
import { waitAddList, webAgentProjectSave } from "@/api/system";
import { useRoute } from "vue-router";
import { enums_schType } from "@/enums";

const route = useRoute();

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
let tableData = reactive([]);
let selectionData: any = [];

const tableLabel = [
  {
    label: "项目",
    prop: "projectName",
  },
  {
    label: "系统",
    prop: "appSystemName",
  },
  {
    label: "版本",
    prop: "appVersion",
  },
  {
    label: "视频持有份额",
    type: "filter",
    filter: (row: any) => {
      if (row.schemeType === enums_schType.CPA) {
        return row?.subsidyMoney;
      }
      return row?.videoRatio;
    },
  },
  // {
  //   label: "游戏持有份额",
  //   prop: "gameRatio",
  // },

  {
    label: "视频分配份额",
    propKey: "selfVideoRate",
    type: "input",
    disabledInput: (row: any) => {
      if (row.schemeType === enums_schType.CPA) {
        return true;
      }
      return false;
    },
    callback: (data: any) => {
      if (data.row.schemeType === enums_schType.CPA) {
        if (data.val < data.row?.subsidyMoney) {
          return (data.row.selfVideoRate = data.val);
        }
        data.row.selfVideoRate = "";
        return ElMessage.warning("视频分配份额必须小于视频持有份额");
      }
      if (data.val < data.row?.videoRatio) {
        return (data.row.selfVideoRate = data.val);
      }
      data.row.selfVideoRate = "";
      return ElMessage.warning("视频分配份额必须小于视频持有份额");
    },
  },
  // {
  //   label: "游戏分配分额",
  //   propKey: "selfGameRate",
  //   type: "input",
  //   callback: (data: any) => {
  //     if (data.val < data.row?.gameRatio) {
  //       return (data.row.selfGameRate = data.val);
  //     }
  //     data.row.selfGameRate = "";
  //     return ElMessage.warning("游戏分配分额必须小于游戏持有份额");
  //   },
  //   showInput: (row: any) => {
  //     if (row.schemeType === enums_schType.CPA) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  {
    label: "结算方式",
    prop: "schemeType",
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
const tableEvents = {
  selectionChange: (val: any) => {
    selectionData = val;
  },
};

const getList = () => {
  loading.value = true;
  waitAddList(route.query.distrId)
    .then((res) => {
      const { data } = res;
      loading.value = false;
      data.data.forEach((v: any) => {
        v.clearingSchemeType = "";
        v.brokerageSchemeId = "";
        v.optionEvery = [];
        v.selfVideoRate = "";
        v.selfGameRate = "";
        if (v.schemeType === enums_schType.CPA) {
          v.selfVideoRate = v.subsidyMoney;
        }
      });
      tableData = data.data;
      tablePage.total = data.data.total;
    })
    .catch(() => {
      loading.value = false;
    });
};
const handleSureBtn = () => {
  const newSelectionData = JSON.parse(JSON.stringify(selectionData)) || [];
  const selfVideoRate = newSelectionData.some((v: any) => !v.selfVideoRate);
  if (!newSelectionData.length) {
    return ElMessage.warning("请选择项目");
  }
  if (selfVideoRate) {
    return ElMessage.warning("请输入视频分配份额");
  }
  const packageSaveList: any = [];
  selectionData.forEach((v: any) => {
    const schemeList: any = [];
    if (v.schemeType === enums_schType.CPA) {
      const schemeItem = {
        ratio: 0,
        schemeType: enums_schType.CPA,
        subsidyMoney: v.subsidyMoney,
      };
      schemeList.push(schemeItem);
    }
    if (v.schemeType === enums_schType.CPS) {
      if (v.selfVideoRate != "") {
        const videoScheme = {
          ratio: v.selfVideoRate,
          schemeType: enums_schType.CPS,
          subsidyMoney: 0,
        };
        schemeList.push(videoScheme);
      }
      if (v.selfGameRate != "") {
        const gameScheme = {
          ratio: v.selfGameRate,
          schemeType: enums_schType.GAME_CPS,
          subsidyMoney: 0,
        };
        schemeList.push(gameScheme);
      }
    }

    const item = {
      prePackageId: v.id,
      schemeList: schemeList,
    };
    packageSaveList.push(item);
  });
  const params = {
    distrId: route.query.distrId,
    packageSaveList: packageSaveList,
  };

  webAgentProjectSave(params).then(() => {
    ElMessage.success("添加成功");
    props.row.callback(true);
  });
};
onMounted(() => {
  if (route.query.distrId) {
    getList();
  }
});
</script>

<template>
  <TableSearch
    :loading="loading"
    :tableData="tableData"
    :tableLabel="tableLabel"
    :tablePage="tablePage"
    :tableEvents="tableEvents"
    :isSelection="true"
    :isIndex="true"
  >
  </TableSearch>
  <div class="mt5">
    <el-button type="primary" @click="handleSureBtn"> 确定 </el-button>
    <el-button
      @click="
        () => {
          props.row.callback();
        }
      "
      >取消</el-button
    >
  </div>
</template>
