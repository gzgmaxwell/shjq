<script setup lang="ts">
import { ref, onMounted } from "vue";
import { packageListByAgentId, webAgentProjectSave, getClearingScheme } from "@/api/system";
import { optionWithdrawWay } from "@/enums";
import { getUserId } from "@/utils/index";

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
    label: "结算方案",
    type: "option",
    option: optionWithdrawWay,
    selectProp: "clearingSchemeType",
    callback: (data: any) => {
      data.row.clearingSchemeType = data.val;
      data.row.brokerageSchemeId = "";
      const params = {
        busUserId: getUserId(),
        platformType: 0,
        schemeType: data.val,
      };
      getClearingScheme(params).then((res) => {
        data.row.optionEvery = res.data.data;
      });
    },
  },
  {
    label: "方案名",
    type: "optionEvery",
    selectEveryPropName: "optionEvery",
    selectEveryPropValue: "brokerageSchemeId",
    labelValue: {
      label: "schemeName",
      value: "id",
    },
    callback: (data: any) => {
      data.row.brokerageSchemeId = data.val;
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
const tableEvents = {
  selectionChange: (val: any) => {
    selectionData = val;
  },
};

const getList = () => {
  loading.value = true;
  const params = {
    current: 1,
    distrId: props.row.distrId,
    // distrMobile: "string",
    // distrName: "string",
    // projectName: "string",
    size: 10,
  };
  packageListByAgentId(params)
    .then((res) => {
      const { data } = res;
      loading.value = false;
      data.data.forEach((v: any) => {
        v.clearingSchemeType = "";
        v.brokerageSchemeId = "";
        v.optionEvery = [];
      });
      tableData = data.data.records;
      tablePage.total = data.data.total;
    })
    .catch(() => {
      loading.value = false;
    });
};
const handleSureBtn = () => {
  const projectPackageDTOList: any = [];
  const newSelectionData = JSON.parse(JSON.stringify(selectionData)) || [];
  if (!newSelectionData.length) {
    return ElMessage.warning("请选择项目");
  }
  newSelectionData.forEach((v: any) => {
    const optionEvery = v.optionEvery || [];
    const findItem = optionEvery.find((m: any) => m.id === v.brokerageSchemeId) || {};
    const item = {
      appSystemName: v.appSystemName,
      appVersion: v.appVersion,
      brokerageSchemeId: v.brokerageSchemeId,
      brokerageSchemeParentId: findItem.parentId,
      channelPackageId: v.id,
      clearingSchemeType: v.clearingSchemeType,
      projectName: v.projectName,
      projectPackageId: v.projectPackageId,
      packageBucketName: v.packageBucketName,
      packageFile: v.packageFile,
    };
    projectPackageDTOList.push(item);
  });
  for (let i = 0; i < projectPackageDTOList.length; i++) {
    if (!projectPackageDTOList[i].clearingSchemeType) {
      ElMessage.warning("请选择结算方案");
      return false;
    }
    if (!projectPackageDTOList[i].brokerageSchemeId) {
      ElMessage.warning("请选择结方案名");
      return false;
    }
  }

  const params = {
    agentId: props.row.agentId,
    agentMobile: props.row.agentMobile,
    agentName: props.row.agentName,
    projectPackageDTOList,
  };

  webAgentProjectSave(params).then(() => {
    ElMessage.success("添加成功");
    props.row.callback(true);
  });
};
onMounted(() => {
  if (props.row.id) {
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
