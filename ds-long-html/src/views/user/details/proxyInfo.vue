<template>
  <div class="mt20">
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isIndex="false"
    >
    </tableSearch>
  </div>
</template>

<script>
import { upgradeRecord } from "@/api/admin/index";
import tableSearch from "@/components/tableSearch/table";
export default {
  components: {
    tableSearch,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableLabel: [
        {
          prop: "nickname",
          label: "昵称",
        },
        {
          prop: "agentName",
          label: "代理级别",
        },
        {
          prop: "upgradeTime",
          label: "时间",
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
        userId: this.$route.query.id,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      upgradeRecord(params)
        .then((res) => {
          const { data } = res;
          if (data.code == 200) {
            this.loading = false;
            this.tableData = data?.data?.records;
            this.tablePage.total = data?.data?.total || 0;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss"></style>
