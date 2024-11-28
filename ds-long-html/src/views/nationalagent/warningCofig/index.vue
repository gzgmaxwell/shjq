<template>
  <basic-container>
    <search
      :searchHandle="searchHandle"
      :searchForm="searchForm"
      :searchData="searchData"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableLabel="tableLabel"
    >
    </tableSearch>
    <el-dialog
      title="预警时间"
      :visible.sync="visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <config v-if="visible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { extSettingGet } from "@/api/admin/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import config from "./components/config.vue";
export default {
  components: {
    tableSearch,
    search,
    config,
  },
  data() {
    return {
      visible: false,
      row: {},
      loading: false,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          label: "预警时间",
          prop: "warningTime",
          type: "html",
          html: (row) => {
            return `<span>${row.warningTime / 60}分钟</span>`;
          },
        },
        {
          label: "预警周期",
          prop: "warningCycleTime",
          type: "html",
          html: (row) => {
            return `<span>${row.warningCycleTime / 3600}小时</span>`;
          },
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: () => {
            let config = `<span class='comBtn link' data-tagName="config">配置</span>`;
            return config;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "config") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            }
          },
        },
      ],
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      extSettingGet().then((res) => {
        this.loading = false;
        this.tableData = [res.data.data];
      });
    },
  },
};
</script>
