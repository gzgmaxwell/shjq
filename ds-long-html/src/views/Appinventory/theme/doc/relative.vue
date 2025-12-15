<template>
  <basic-container>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { getTenantByStyleId } from "@/api/admin/index";
import { optionsAuthenticator } from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "产品名称",
        },
        {
          prop: "busPlatformId",
          label: "appid",
        },
        {
          prop: "username",
          label: "开通用户名",
        },
        {
          prop: "servicePackageName",
          label: "套餐",
        },
        {
          label: "认证状态",
          type: "filter",
          filter: (row) => {
            return optionsAuthenticator.find(
              (v) => v.id === row.authenticatorStatus
            )?.name;
          },
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
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      permissions: "permissions",
    }),
  },

  mounted() {
    if (this.row.id) {
      this.getList();
    }
  },

  methods: {
    getList() {
      this.loading = true;
      getTenantByStyleId(this.row.id)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data;
          this.tablePage.total = res.data.data.length;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
