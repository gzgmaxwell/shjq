<template>
  <basic-container>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :isSelection="false"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import {
  getAuthenticatorStatus,
  SecurityupdateStatus,
} from "@/api/admin/index";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import {
  optionSecurityCenterStatus,
  EnumSecurityCenterStatus,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      row: {},
      loading: false,
      that: this,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "安全认证",
        },
        {
          prop: "version",
          label: "版本",
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item =
              optionSecurityCenterStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          label: "操作",
          type: "html",
          width: "70",
          html: (row) => {
            if (row.status === EnumSecurityCenterStatus.OFF) {
              return `<span class='link comBtn' data-tagName="enable">启用</span></span>`;
            } else {
              return `<span class='danger comBtn' data-tagName="disabled">禁用</span>`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            const operations = {
              enable: {
                confirmMessage: "此操作将 启用 安全验证, 是否继续?",
                successMessage: "启用成功!",
                status: EnumSecurityCenterStatus.ON,
              },
              disabled: {
                confirmMessage: "此操作将 关闭 安全验证, 是否继续?",
                successMessage: "禁用成功!",
                status: EnumSecurityCenterStatus.OFF,
              },
            };

            const operation = operations[tagname];
            if (operation) {
              const { confirmMessage, successMessage, status } = operation;

              this.$confirm(confirmMessage, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  const params = {
                    id: row.id,
                    status,
                  };
                  SecurityupdateStatus(params).then((res) => {
                    const { data } = res;
                    if (data.code == 200) {
                      this.$message.success(successMessage);
                      this.getList();
                    }
                  });
                })
                .catch(() => {});
            }
          },
        },
      ],
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      getAuthenticatorStatus("SYS_USER")
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
