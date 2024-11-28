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
      :tablePage="tablePage"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import {
  filterNullSearchData,
  resetSearchData,
  optDomainType,
} from "@/util/util";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { failRecord } from "@/api/admin/index";

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
      searchForm: [
        {
          label: "域名:",
          type: "input",
          prop: "domain",
          placeholder: "请输入域名",
          clearable: true,
          labelWidth: "45px",
        },
        {
          label: "域名类型:",
          type: "select",
          prop: "type",
          labelWidth: "80px",
          options: optDomainType,
          placeholder: "请选择域名类型",
          clearable: true,
        },
      ],
      searchData: {
        domain: "",
        type: "",
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
          prop: "clientId",
          label: "设备id",
        },
        {
          label: "地区",
          type: "html",
          html: (row) => {
            return `<span>${row.country}-${row.province}-${row.city}</span>`;
          },
        },
        {
          prop: "domain",
          label: "域名",
        },
        {
          label: "域名类型",
          type: "filter",
          filter: (row) => {
            const item = optDomainType.find((item) => item.id === row.type);
            return item?.name;
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
          sortable: true,
        },
      ],
      tablePage: {
        total: 0,
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
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      failRecord(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
  },
};
</script>
