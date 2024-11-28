<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { clearingSchemeList } from "@/api/system";
import createCpa from "./doc/createCpa.vue";
import { getUserId } from "@/utils/index";

const loading = ref(false);
const visible = ref(false);
let row: any = reactive({});
let tableData = reactive<any>([]);

// const createFun = () => {
//   row = {
//     callback: (data: any) => {
//       if (data) {
//         getList();
//       }
//       visible.value = false;
//     },
//   };
//   visible.value = true;
// };
// const searchHandle = [{ label: "新增", type: "primary", callback: createFun }];

const tableLabel = [
  {
    label: "cpa方案",
    prop: "schemeName",
  },
  {
    label: "规则",
    prop: "subsidyMoney",
  },
  {
    label: "更新人",
    prop: "updateUserName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
  // {
  //   label: "操作",
  //   type: "html",
  //   width: "100",
  //   html: (col: any) => {
  //     const editBtn = `<span data-tagName="editBtn" class="activeBule pr2">编辑</span>`;
  //     let strBtn = "";
  //     if (col.createUserId == getUserId()) {
  //       strBtn = strBtn + editBtn;
  //     }
  //     return strBtn;
  //   },
  //   callback: (col: any, index: any, e: any) => {
  //     console.log(index);
  //     const {
  //       target: {
  //         dataset: { tagname },
  //       },
  //     } = e;

  //     if (tagname === "editBtn") {
  //       row = {
  //         ...col,
  //         callback: (data: any) => {
  //           if (data) {
  //             getList();
  //           }
  //           visible.value = false;
  //         },
  //       };
  //       visible.value = true;
  //     }
  //   },
  // },
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
  const params = {
    current: tablePage.current,
    size: tablePage.size,
    busUserId: getUserId(),
    platformType: 2,
    schemeType: "CPA",
  };
  loading.value = true;
  clearingSchemeList(params)
    .then((res) => {
      const { data } = res;
      loading.value = false;
      tableData = data.data.records;
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
    <SearchList :searchHandle="[]" />
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
    <el-dialog v-model="visible" :title="row.id ? '编辑' : '新增'" width="50%">
      <createCpa v-if="visible" :row="row" />
    </el-dialog>
  </base-card>
</template>
