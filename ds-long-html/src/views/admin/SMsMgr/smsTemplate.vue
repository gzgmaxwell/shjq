<template>
  <basic-container>
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
      :isIndex="false"
    >
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="35%"
      :close-on-click-modal="false"
    >
      <createTemplate v-if="visible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { smsQueryPage } from "@/api/admin/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import createTemplate from "./createTemplate.vue";
import { optionsSmsType } from "@/util/util";

export default {
  components: {
    tableSearch,
    search,
    createTemplate,
  },
  data() {
    return {
      platformId: this.$route.query.id,
      loading: false,
      visible: false,
      row: {},
      searchForm: [],
      searchData: {},
      searchHandle: [
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              platformId: this.platformId,
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "模板ID",
          prop: "templateCode",
        },
        {
          label: "类型",
          prop: "type",
          type: "filter",
          filter: (row) => {
            const item = optionsSmsType.find((item) => item.id === row.type);
            return item.name;
          },
        },
        {
          label: "内容",
          prop: "templateContent",
        },
        {
          label: "签名",
          prop: "sign",
        },
        {
          label: "操作",
          type: "html",
          width: "200",
          html: (row) => {
            const edit = `<span class='link comBtn' data-tagName="edit">编辑</span>`;
            return `${edit}`;
          },
          callback: (row, index, e) => {
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        platformId: this.platformId,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      smsQueryPage(params).then((res) => {
        const { data } = res;
        this.loading = false;
        this.tableData = data.data.records;
        this.tablePage.total = data.data.total;
      });
    },
  },
};
</script>
