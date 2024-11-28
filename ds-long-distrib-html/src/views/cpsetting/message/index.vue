<script setup lang="ts">
import { ref, onMounted } from "vue";
import { messageQueryPage } from "@/api/system";
import { useApiCom } from "@/store/modules/apiCom";
import { optOrder, EnumOrder } from "@/enums/index";

const apiCom = useApiCom();

const loading = ref(false);
const tableData = ref([]);

const searchData = reactive({
  agentName: "",
});

const tableLabel = [
  {
    label: "消息内容",
    type: "html",
    html: (col: any) => {
      let init = `您发起的提现，订单“${col?.busMsgInfo?.orderNo}”`;
      const item: any = optOrder.find((v: any) => v.id === col.msgType);
      if (item.id === EnumOrder.WITHDRAW_AUDIT_PASS) {
        return `${init} <span class='activeBule'>审核通过</span>，汇款处理中`;
      } else if (item.id === EnumOrder.WITHDRAW_AUDIT_REJECT) {
        return `${init} <span class='must'>审核未通过，失败原因：${col?.busMsgInfo?.reason}</span> `;
      } else if (item.id === EnumOrder.WITHDRAW_MONEY_TRANSFER_SUCCESS) {
        return `${init} <span class='activeBule'>汇款成功</span>`;
      } else if (item.id === EnumOrder.WITHDRAW_MONEY_TRANSFER_FAIL) {
        return `${init} <span class='must'>汇款失败，失败原因：${col?.busMsgInfo?.reason}</span> `;
      }
    },
  },

  {
    label: "时间",
    prop: "createTime",
    width: "200",
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
  const params = {
    ...searchData,
    current: tablePage.current,
    size: tablePage.size,
  };
  loading.value = true;
  messageQueryPage(params)
    .then((res) => {
      const { data } = res;
      loading.value = false;
      tableData.value = data.data.records;
      tablePage.total = data.data.total;
      apiCom.actionGetList();
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
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </TableSearch>
  </base-card>
</template>
