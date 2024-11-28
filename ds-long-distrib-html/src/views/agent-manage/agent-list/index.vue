<script setup lang="ts">
import router from "@/router";
import { ref, reactive, onMounted } from "vue";
import { distributor_distrPage, webAgentOperate, extInfo } from "@/api/system";
import create from "./doc/create.vue";
import recycleBinPage from "./doc/recycleBinPage.vue";
import { EnumProxyStatus, optionProxyStatus, optWebmasterType, optionsAuthenticator } from "@/enums";
import { i18nTL } from "@/utils/i18n";
import resetPassword from "@/views/common/resetPassword/index.vue";
import { pageHandle } from "@/utils";

const loading = ref(false);
const visible = ref(false);
const visiblePassword = ref(false);
const recycleBinVisible = ref(false);
let row: any = reactive({});
let recycleBinRow: any = reactive({});
let extInfoData: any = reactive({});
let tableData = reactive([]);

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
  {
    label: "新增",
    type: "primary",
    callback: () => {
      row = {
        extInfoData,
        callback: () => {
          getList();
          visible.value = false;
        },
      };
      visible.value = true;
    },
  },
]);

const tableLabel = [
  {
    label: "渠道商账号",
    type: "html",
    html: (col: any) => {
      let fixeBtn = `<span class="activeBule">${col.distrMobile}</span>`;
      return fixeBtn;
    },
    callback: (col: any) => {
      router.push({
        path: "/common/agentDetails/tabDis",
        query: col,
      });
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
    label: "新增用户数",
    prop: "userCount",
  },
  {
    label: "充值总金额",
    prop: "chargeAmount",
  },
  {
    label: "充值金币金额",
    prop: "chargeGoldAmount",
  },
  {
    label: "充值vip金额",
    prop: "chargeSVipAmount",
  },
  {
    label: "添加时间",
    prop: "createTime",
  },
  {
    label: "账号状态",
    type: "filter",
    filter: (row: any) => {
      const item = optionProxyStatus.find((v) => v.id === row.status);
      return item?.name;
    },
  },
  {
    label: "认证状态",
    type: "filter",
    filter: (row: any) => {
      const item = optionsAuthenticator.find((v) => v.id === row.authenticatorStatus);
      return item?.name;
    },
  },
  {
    label: "操作",
    type: "html",
    width: "180",
    html: () => {
      let fixeBtn = `<span data-tagName="editBtn" class="activeBule pr2">${i18nTL("edit")}</span>
  		<span data-tagName="passwordBtn" class="activeBule pr2">重置密码</span>
  		`;
      let forbiddenBtn = `<span data-tagName="forbiddenBtn" class="activeBule pr2 red">${i18nTL("disable")}</span>`;
      // let startBtn = `<span data-tagName="startBtn" class="activeBule pr2">${i18nTL("enable")}</span>`;

      let strBtn = fixeBtn;
      // if (col.status == EnumProxyStatus.DISABLED) {
      //   strBtn += startBtn;
      // } else if (col.status == EnumProxyStatus.NORMAL) {
      //   strBtn += forbiddenBtn;
      // }
      return strBtn + forbiddenBtn;
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
          extInfoData,
          callback: (data: any) => {
            if (data) {
              getList();
            }
            visible.value = false;
          },
        };

        visible.value = true;
      } else if (tagname === "forbiddenBtn") {
        ElMessageBox.confirm(
          `确认禁用当前账号? 禁用之后,该账号所创建的下级账号均无法登录,但可通过回收站重新启用账号!`,
          "提 示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            handleStatus(col.id);
          })
          .catch(() => {});
      }
      // else if (tagname === "startBtn") {
      //   handleStatus(col.id);
      // }
      else if (tagname === "passwordBtn") {
        row = {
          ...col,
          userId: col.id,
          callback: (data: any) => {
            if (data) {
              getList();
            }
            visiblePassword.value = false;
          },
        };
        visiblePassword.value = true;
      }
    },
  },
];
const handleStatus = (id: any) => {
  webAgentOperate(id).then(() => {
    const newCurrent = pageHandle(tablePage.current, tablePage.size, tablePage.total);
    tablePage.current = newCurrent;
    ElMessage.success("禁用成功");
    getList();
  });
};
const recycleBin = () => {
  recycleBinVisible.value = true;
  recycleBinRow = {
    callback: (data: any) => {
      if (data) {
        getList();
      }
      recycleBinVisible.value = false;
    },
  };
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
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
    status: EnumProxyStatus.NORMAL,
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
const getExtInfo = () => {
  extInfo().then((res) => {
    extInfoData = res.data.data;
    if (!extInfoData?.allowCreateChild) {
      searchHandle.map((item: any) => {
        if (item.label == "add") {
          item.showBtn = () => {
            return false;
          };
        }
        return item;
      });
    }
  });
};
onMounted(() => {
  getList();
  getExtInfo();
});
</script>

<template>
  <base-card>
    <SearchList
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      style="position: relative"
    >
      <div style="position: absolute; top: 0; right: 0">
        <el-button type="primary" @click="recycleBin">回收站</el-button>
      </div>
    </SearchList>
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </TableSearch>
    <el-dialog v-model="visible" :title="row.id ? '编辑' : '新增'" width="50%" :close-on-click-modal="false">
      <create v-if="visible" :row="row" />
    </el-dialog>
    <el-dialog v-model="visiblePassword" title="重置密码" width="50%" :close-on-click-modal="false">
      <resetPassword v-if="visiblePassword" :row="row" />
    </el-dialog>
    <el-dialog
      v-model="recycleBinVisible"
      title="回收站"
      width="70%"
      :close-on-click-modal="false"
      class="recycleBinTitle"
    >
      <recycleBinPage v-if="recycleBinVisible" :row="recycleBinRow" />
    </el-dialog>
  </base-card>
</template>
<style lang="scss" scoped>
:deep(.recycleBinTitle .el-dialog__header) {
  text-align: center;
}
</style>
