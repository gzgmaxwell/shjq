<template>
  <div>
    <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px">
      <span>粉丝量: {{ fanCountTotal }}</span>
    </div>
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
      :operation="{}"
      :isSelection="false"
      :isIndex="false"
    >
    </tableSearch>
  </div>
</template>

<script>
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import { operateFollowCount, operateFollowCountLogs } from "@/api/admin/index";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      fanCountTotal: "",
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "fanCount",
          placeholder: "调整粉丝数量",
          clearable: true,
        },
      ],
      searchData: {
        fanCount: "",
      },
      searchHandle: [
        {
          label: "增加",
          type: "primary",
          callback: () => {
            if (this.validateFanCount(this.searchData.fanCount)) {
              const params = {
                fanCount: this.searchData.fanCount,
                upId: this.$route.query.id,
              };
              operateFollowCount(params).then((res) => {
                this.$message.success("增加成功");
                this.searchData.fanCount = "";
                this.getList();
              });
            }
          },
        },
        {
          label: "减少",
          type: "danger",
          callback: () => {
            if (this.validateFanCount(this.searchData.fanCount)) {
              const params = {
                fanCount: `-${this.searchData.fanCount}`,
                upId: this.$route.query.id,
              };
              operateFollowCount(params).then((res) => {
                if (res.data.code == 40018) {
                  return this.$message.error("粉丝虚拟数据达到调整上限!");
                }
                this.$message.success("减少成功");
                this.searchData.fanCount = "";
                this.getList();
              });
            }
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "creator",
          label: "操作用户",
        },
        {
          prop: "operateValue",
          label: "操作",
        },
        {
          prop: "createTime",
          label: "创建时间",
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
    validateFanCount(value) {
      if (!value) {
        this.$message.warning("请输入调整粉丝数量");
        return false;
      }
      const intValue = Number(value);
      if (!Number.isInteger(intValue)) {
        this.$message.warning("请输入整数");
        return false;
      }

      if (intValue <= 0) {
        this.$message.warning("请输入正整数");
        return false;
      }

      if (intValue > 100000000) {
        this.$message.warning("输入数量最大为 100,000,000");
        return false;
      }

      return true;
    },

    getList() {
      const params = {
        current: this.tablePage.current,
        size: this.tablePage.size,
        upId: this.$route.query.id,
      };
      this.loading = true;
      operateFollowCountLogs(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.logPage.records;
          this.fanCountTotal = data.data.fanCount;
          this.tablePage.total = data.data.logPage.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
