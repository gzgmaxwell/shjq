<template>
  <div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="false"
      :isSelection="false"
    ></tableSearch>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import { buyVideoDetail } from "@/api/admin/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    tableSearch,
  },
  data() {
    return {
      loading: false,
      tableEvents: {},
      tableData: [],
      tableLabel: [
        {
          label: "单价",
          type: "html",
          html: (row) => {
            const price = row?.price === 0 ? "" : row.price;
            return `<span >${price}</span>`;
          },
        },
        {
          label: "实际付款价格",
          prop: "payPrice",
        },
        {
          label: "用户",
          prop: "userName",
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
        current: this.tablePage.current,
        size: this.tablePage.size,
        onlineId: this.row.onlineId,
      };
      this.loading = true;
      buyVideoDetail(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records || [];
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
