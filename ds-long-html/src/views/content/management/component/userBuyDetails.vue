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
    >
    </tableSearch>
  </div>
</template>
<script>
import { getBuyRecord } from "@/api/content/management";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";

export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      loading: false,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "userId",
          label: "用户ID",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "nickName",
          label: "昵称",
        },
        {
          prop: "type",
          label: "会员状态",
        },
        {
          prop: "payTime",
          label: "付款时间",
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
        onlineId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getBuyRecord(params)
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
    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
  },
};
</script>
