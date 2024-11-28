<template>
  <div>
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
      :tableEvents="tableEvents"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { getByUserIds } from "@/api/admin/index";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      ids: "",
      visible: false,
      row: {},
      loading: false,
      selectionData: [],
      that: this,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "createTime",
          label: "add_time",
        },
        {
          prop: "totalMoney",
          label: "total_commission",
        },
        {
          prop: "withdrawedMoney",
          label: "withdrawn_commission",
        },
        {
          prop: "balance",
          label: "withdrawable_commission",
        },
      ],

      tablePage: {},
      tableEvents: {
        selectionChange: (val) => {},
      },
    };
  },

  mounted() {
    this.ids = this.$route.query.distrId;
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      getByUserIds([this.ids])
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data.data;
            this.tablePage.total = data.data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    search() {},
    reset() {},
  },
};
</script>
