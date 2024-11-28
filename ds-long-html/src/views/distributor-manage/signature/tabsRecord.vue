<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="true"
    >
    </tableSearch>
  </div>
</template>

<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import uploadURL from "./uploadURL.vue";
import { package_record_page } from "@/api/common";
import {
  createParams,
  resetSearchData,
  optAccount,
  optAuditStatus,
  optLong,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    uploadURL,
  },
  data() {
    return {
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "distrMobile",
          placeholder: "渠道商账号",
          clearable: true,
        },
        {
          type: "input",
          prop: "distrName",
          placeholder: "渠道商名称",
          clearable: true,
        },
      ],
      searchData: {
        distrMobile: "",
        distrName: "",
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "版本",
          prop: "appVersion",
        },
        {
          label: "渠道商账号",
          prop: "distrMobile",
        },
        {
          label: "渠道商名称",
          prop: "distrName",
        },
        {
          label: "账号状态",
          type: "filter",
          filter: (row) => {
            return optAccount.find((v) => v.id === row.status)?.name;
          },
        },
        {
          label: "申请签名时间",
          prop: "createTime",
        },
        {
          label: "视频平台",
          type: "filter",
          filter: (row) => {
            return optLong.find((v) => v.id === row.registerBusPlatformId)
              ?.name;
          },
        },
        {
          label: "安装包状态",
          type: "filter",
          filter: (col) => {
            const isQiyong =
              !col.abandon && !col.versionDeleted && !col.deleted && col.enable; // 启用
            const isFeiqi =
              col.abandon && !col.versionDeleted && !col.deleted && !col.enable; // 废弃
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
          label: "审核状态",
          prop: "createTime",
          type: "filter",
          filter: (row) => {
            return optAuditStatus.find((v) => v.id === row.auditStatus)?.name;
          },
        },
        {
          label: "审核人",
          prop: "auditUsername",
        },
        {
          label: "审核时间",
          prop: "auditTime",
          width: 160,
        },
      ],
      tablePage: {
        total: 1,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const data = createParams({
        ...this.searchData,
      });
      const params = {
        ...data,
        signStatus: "PASSED",
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      package_record_page(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
