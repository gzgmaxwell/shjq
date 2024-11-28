<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      v-if="!row.id"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </tableSearch>
  </div>
</template>
<script>
import { modifyPage } from "@/api/admin/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  createParams,
  resetSearchData,
  optionVipLogs,
  EnumVipLogs,
} from "@/util/util";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      visible: false,
      searchForm: [
        {
          styleWidth: "180",
          type: "select",
          prop: "operate",
          options: optionVipLogs.filter((v) => v.id !== EnumVipLogs.DELETE),
          placeholder: "请选择变更行为",
          clearable: true,
        },
      ],
      searchData: {
        operate: "",
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
          label: "变更行为",
          type: "filter",
          show: () => !this.row.id,
          filter: (row) => {
            const item = optionVipLogs.find((v) => v.id === row.operate);
            return item?.name;
          },
        },
        {
          label: "变更前",
          headerAlign: "center",
          align: "left",
          type: "html",
          html: (row) => {
            return row.detailList
              .map((v) => {
                if (v.beforeModify) {
                  return `<div>【${v.columnDesc}】: ${v.beforeModify}</div>`;
                } else {
                  return "";
                }
              })
              .join("");
          },
        },
        {
          label: "变更后",
          headerAlign: "center",
          align: "left",
          type: "html",
          html: (row) => {
            return row.detailList
              .map((v) => {
                if (v.afterModify) {
                  return `<div>【${v.columnDesc}】: ${v.afterModify}</div>`;
                } else {
                  return "";
                }
              })
              .join("");
          },
        },
        {
          prop: "userName",
          label: "变更人",
        },
        {
          prop: "operateTime",
          label: "变更时间",
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
      const params = {
        ...createParams({
          ...this.searchData,
        }),
        id: this.row.id,
        size: this.tablePage.size,
        current: this.tablePage.current,
      };
      this.loading = true;
      modifyPage(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data.records;
            this.tablePage.total = data.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
