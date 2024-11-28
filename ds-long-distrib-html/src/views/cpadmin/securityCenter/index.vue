<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getAuthenticatorStatus, securityupdate_status } from "@/api/system";
import { optSecurityCenterStatus, EnumSecurityCenterStatus } from "@/enums";

const loading = ref(false);
let tableData = reactive([]);
const tableLabel = [
  {
    label: "安全认证",
    prop: "name",
  },
  {
    label: "版本",
    prop: "version",
  },
  {
    label: "状态",
    type: "filter",
    filter: (row: any) => {
      const item = optSecurityCenterStatus.find((v) => v.id === row.status);
      return item?.name;
    },
  },
  {
    prop: "createTime",
    label: "创建时间",
  },

  {
    label: "操作",
    type: "html",
    width: "280",
    html: (col: any) => {
      let start = `<span data-tagName="start" class="activeBule pr2">启用</span>`;
      let stop = `<span data-tagName="stop" class="activeBule pr2 red">禁用</span>`;
      if (col.status === EnumSecurityCenterStatus.OFF) {
        return start;
      } else {
        return stop;
      }
    },
    callback: (col: any, index: any, e: any) => {
      console.log(index);
      const {
        target: {
          dataset: { tagname },
        },
      } = e;

      if (tagname === "start") {
        securityupdate_status({
          id: col.id,
          status: EnumSecurityCenterStatus.ON,
        }).then(() => {
          ElMessage.success("操作成功");
          getList();
        });
      } else if (tagname === "stop") {
        ElMessageBox.confirm(`此操作将 关闭 安全验证, 是否继续?`, "提 示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          securityupdate_status({
            id: col.id,
            status: EnumSecurityCenterStatus.OFF,
          }).then(() => {
            ElMessage.success("操作成功");
            getList();
          });
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
  loading.value = true;
  getAuthenticatorStatus("DISTR_USER")
    .then((res) => {
      loading.value = false;
      tableData = res.data.data;
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
    <TableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="{}"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </TableSearch>
  </base-card>
</template>
