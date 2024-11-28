<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { clearingSchemeList, updateClearingSchemeStatus } from "@/api/system";
import createCps from "./doc/createCps.vue";
import { getUserId } from "@/utils/index";
import { useCommonStore } from "@/store/modules/common";
const useCommon = useCommonStore();
const dictionary: any = useCommon.dictionary;
const platformRatio = dictionary["platform_ratio"][0].dictionaryValue;

const loading = ref(false);
const visible = ref(false);
let row: any = reactive({});
const tableData = ref([]);

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
const searchHandle = [{ label: "新增", type: "primary", callback: createFun }];

const tableLabel = [
  {
    label: "cps方案",
    prop: "schemeName",
  },
  {
    label: "平台比值",
    prop: "platformRatio",
  },
  {
    label: "渠道比值",
    prop: "distrBrokerageRatio",
  },
  {
    label: "代理比值",
    prop: "agentBrokerageRatio",
  },
  {
    label: "更新人",
    prop: "updateUserName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
  {
    label: "操作",
    type: "html",
    width: "100",
    html: (col: any) => {
      const editBtn = `<span data-tagName="editBtn" class="activeBule pr2">编辑</span>`;
      const forbiddenBtn = `<span data-tagName="forbiddenBtn" class="activeBule pr2">禁用</span>`;
      const startBtn = `<span data-tagName="startBtn" class="activeBule pr2">启用</span>`;
      let strBtn = "";
      if (col.createUserId == getUserId()) {
        strBtn = strBtn + editBtn;
        if (col.status == "DISABLED") {
          strBtn = strBtn + startBtn;
        } else if (col.status == "NORMAL") {
          strBtn = strBtn + forbiddenBtn;
        }
      }

      return strBtn;
    },
    callback: (col: any, index: any, e: any) => {
      console.log(index);
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "editBtn") {
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
      } else if (tagname === "forbiddenBtn") {
        schemeStatus(col.id, "DISABLED");
      } else if (tagname === "startBtn") {
        schemeStatus(col.id, "NORMAL");
      }
    },
  },
];
const schemeStatus = (id: any, type: string) => {
  const params = {
    id: id,
    platformType: 2,
    status: type,
  };
  updateClearingSchemeStatus(params).then(() => {
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
  const params = {
    current: tablePage.current,
    size: tablePage.size,
    busUserId: getUserId(),
    platformType: 2,
    schemeType: "CPS",
  };
  loading.value = true;
  clearingSchemeList(params)
    .then((res) => {
      const { data } = res;
      loading.value = false;
      (data.data.records || []).forEach((v: any) => {
        v.platformRatio = platformRatio;
      });
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
    <SearchList :searchHandle="searchHandle" />
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
    <el-dialog v-model="visible" :title="row.id ? 'CPS方案编辑' : 'CPS方案新增'" width="50%">
      <createCps v-if="visible" :row="row" />
    </el-dialog>
  </base-card>
</template>
