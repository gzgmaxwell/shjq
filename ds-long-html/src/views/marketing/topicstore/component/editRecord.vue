<template>
  <div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :operation="{}"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
  </div>
</template>

<script>
import { editLogPage } from "@/api/marketing/topic-store";
import tableSearch from "@/components/tableSearch/table";
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
      searchData: {},
      tableData: [],
      tableLabel: [
        {
          prop: "updateTime",
          label: "修改时间",
        },
        {
          prop: "updateTime",
          label: "修改内容",
          type: "html",
          html: (row) => {
            return `<span>${row.originContent}</span> > <span>${row.newContent}</span>`;
          },
        },
        {
          prop: "updateSysUsername",
          label: "修改人",
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
        topicId: this.row.id,
      };
      this.loading = true;
      editLogPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records;
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
