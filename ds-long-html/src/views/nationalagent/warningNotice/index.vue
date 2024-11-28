<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <div style="margin-bottom: 10px; font-size: 18px; font-weight: bold">
      <span>当前预警时间: {{ currentWarningTime }}分钟</span>
    </div>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
    >
    </tableSearch>
  </basic-container>
</template>

<script>
import tableSearch from "@/components/tableSearch/table.vue";
import search from "@/components/tableSearch/search.vue";
import {
  messageQueryPage,
  extSettingGet,
  messageRemoveById,
  operateById,
} from "@/api/admin/index";
import { optionVipLogs } from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import { mapGetters } from "vuex";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      currentWarningTime: "",
      row: {},
      loading: false,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "nickname",
          label: "昵称",
        },
        {
          label: "平均邀请时长",
          type: "html",
          html: (row) => {
            return `<span>${row.intervalTimeMin}分钟</span>`;
          },
        },
        {
          label: "预警时间",
          type: "html",
          html: (row) => {
            return `<span>${row.warningTime / 60}分钟</span>`;
          },
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            return optionVipLogs.find((v) => v.id === row.status)?.name;
          },
        },
        {
          label: "operate",
          type: "html",
          width: "120",
          html: (row) => {
            const enable = `<span class='link comBtn' data-tagName="enable">启用</span>`;
            const disabled = `<span class='danger comBtn' data-tagName="disabled">禁用</span>`;
            const ignore = `<span class='link comBtn' data-tagName="ignore">忽略</span>`;
            if (row.status === "ENABLE") {
              return `${disabled} ${ignore}`;
            } else {
              return `${enable} ${ignore}`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "enable") {
              operateById(row.userId).then((res) => {
                this.$store.dispatch("actionWarningInfo", {
                  size: this.tablePage.size,
                  current: this.tablePage.current,
                });
                this.$message.success("启用成功");
              });
            } else if (tagname === "disabled") {
              this.$confirm("确定要禁用该账号吗, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  operateById(row.userId).then((res) => {
                    this.$store.dispatch("actionWarningInfo", {
                      size: this.tablePage.size,
                      current: this.tablePage.current,
                    });
                    this.$message.success("禁用成功");
                  });
                })
                .catch(() => {});
            } else if (tagname === "ignore") {
              this.$confirm(
                `确定要忽略掉该条记录吗?<br>
                <spn class="danger">该条记录将被清楚掉</spn>，你还要继续吗?`,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  dangerouslyUseHTMLString: true,
                }
              )
                .then(() => {
                  messageRemoveById(row.id).then((res) => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total,
                      1
                    );
                    this.tablePage.current = newCurrent;
                    this.$store.dispatch("actionWarningInfo", {
                      size: this.tablePage.size,
                      current: this.tablePage.current,
                    });
                    this.$store.dispatch("actionWarningTime");
                    return this.$message.success("忽略成功");
                  });
                })
                .catch(() => {});
            }
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
          this.$store.dispatch("actionWarningInfo", {
            size: this.tablePage.size,
            current: this.tablePage.current,
          });
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      warningInfo: "warningInfo",
      warningTime: "warningTime",
    }),
  },

  mounted() {
    this.tableData = this.warningInfo?.data?.data.records;
    this.tablePage.total = this.warningInfo.data?.data?.total;
    this.currentWarningTime = this.warningTime.data?.data?.warningTime / 60;
  },

  methods: {},
  watch: {
    "$store.state.common.warningInfo": {
      handler(val) {
        this.tableData = val?.data?.data?.records;
        this.tablePage.total = val.data?.data?.total;
      },
      deep: true,
    },
    "$store.state.common.warningTime": {
      handler(val) {
        this.currentWarningTime = val.data.data.warningTime / 60;
      },
      deep: true,
    },
  },
};
</script>
